# ✅ Node-RED Integration Complete

## Overview
Your LinerVac+ mobile app is now **fully integrated** with your Node-RED flow! The app uses the same MQTT topics and logic as your Raspberry Pi setup.

---

## 🔄 What Changed

### 1. **MQTT Topics (Flat Structure)**
**Before:** `linervac/{uuid}/camera`  
**After:** `linervac/camera/set`

The app now uses **flat topics** matching your Node-RED exactly:

| Control | Set Topic | State Topic |
|---------|-----------|-------------|
| Camera | `linervac/camera/set` | `linervac/camera/state` |
| Fan | `linervac/fan/set` | `linervac/fan/state` |
| Water Valve | `linervac/valve/set` | `linervac/valve/state` |
| Reed Switch | `linervac/reed/sim` | `linervac/reed/state` |
| LED | `linervac/led/set` | - |
| Shutdown | `linervac/shutdown` | - |
| Resume | `linervac/resume` | - |

### 2. **System Status**
- **NORMAL** - System operating normally
- **LOCKOUT** - Power outage detected (>30s), requires resume
- **SHUTDOWN** - System shutting down
- **CLEARED** - Lockout cleared via Resume button

### 3. **Network Status**
Parses Node-RED format: `WiFi (192.168.1.242)` or `GSM (10.0.0.1)`

### 4. **Reed Switch**
- N/C (Normally Closed) logic from GPIO 23
- States: `"open"` or `"closed"` (string values)
- Controls fan and valve automatically when closed

### 5. **Water Valve**
Added as **separate control** (was missing before)

---

## 📱 UI Updates

### Home Screen
- ✅ **Resume Operation** button - Only shows during `LOCKOUT`
- ✅ **Shutdown (Hold 5s)** button - Matches Node-RED 5-second GPIO hold
- ✅ **Water Valve** control card
- ✅ **System Status** with color coding:
  - 🟢 NORMAL (green)
  - 🔴 LOCKOUT (red)
  - ⚪ Unknown (grey)

### Status Display
- Reed: Shows `"open"` or `"closed"` from Node-RED
- Camera: Shows `ON`/`OFF` (not state field)
- Network: Shows `WiFi (IP)` or `GSM (IP)`

---

## 🔧 Testing

### 1. **Test MQTT Connection**
```bash
# From your Pi or any machine:
mosquitto_pub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/test -m "hello from app"
```

### 2. **Test Camera Control**
```bash
# Turn camera ON
mosquitto_pub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/camera/set -m "true"

# Turn camera OFF
mosquitto_pub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/camera/set -m "false"
```

### 3. **Test Reed Switch**
```bash
# Trigger reed (closed)
mosquitto_pub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/reed/state -m "closed"

# Release reed (open)
mosquitto_pub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/reed/state -m "open"
```

### 4. **Test Power Lockout**
```bash
# Set lockout state
mosquitto_pub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/system/status -m "LOCKOUT"

# Clear lockout
mosquitto_pub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/system/status -m "NORMAL"
```

### 5. **Test Network Status**
```bash
mosquitto_pub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/system/network -m "WiFi (192.168.1.242)"
```

---

## 🚀 How It Works

### App → Node-RED (Control)
1. User taps toggle in app
2. App publishes to `linervac/camera/set` with `"true"` or `"false"`
3. Node-RED receives message, updates GPIO, publishes state
4. App receives state update on `linervac/camera/set` (echo)

### Node-RED → App (Status)
1. Node-RED monitors GPIO (e.g., Reed GPIO 23)
2. Node-RED publishes to `linervac/reed/state` with `"open"` or `"closed"`
3. App receives update, displays in UI

### Power Lockout Flow
1. Node-RED detects power outage (>30s gap in shutdown file)
2. Node-RED publishes `"LOCKOUT"` to `linervac/system/status`
3. App shows **Resume Operation** button
4. User taps Resume
5. App publishes to `linervac/resume`
6. Node-RED clears lockout, publishes `"NORMAL"`

---

## 🔍 Debugging

### Check MQTT Messages
```bash
# Subscribe to all linervac topics
mosquitto_sub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t "linervac/#" -v
```

### App Console Logs
Watch for these messages:
- `MQTT Message: linervac/camera/set -> true`
- `[MQTT] Updating camera: true`
- `Sent command: linervac/camera/set -> true`

### Node-RED Debug Panel
Add Debug nodes to your flow to see:
- Incoming commands from app
- GPIO state changes
- Outgoing status updates

---

## ⚙️ Node-RED GPIO Mappings

| Component | GPIO | Type | Description |
|-----------|------|------|-------------|
| Reed Switch | 23 | Input (PUD_UP) | N/C (0=closed) |
| Fan | 27 | Output (Active HIGH) | Fan control |
| Water Valve | 17 | Output (Active HIGH) | Valve control |
| Camera LED | 24 | Output | Blink when camera on |
| Shutdown | 3 | Output | Hold LOW 5s to shutdown |

---

## 📝 Next Steps

### Optional Enhancements
1. **Firmware Display** - Add firmware version to Unit Info screen
2. **Analytics** - Implement usage tracking (session/lifetime hours)
3. **Data Usage Tracking** - Track actual MB from network
4. **UUID Sync** - Pull device UUID from Node-RED on startup
5. **Multi-Device** - Support multiple units (currently single-device)

### Production Readiness
- [ ] Test all controls with actual hardware
- [ ] Verify power lockout detection works
- [ ] Test reed switch auto-control of fan/valve
- [ ] Confirm 5-second shutdown sequence
- [ ] Test network status updates (WiFi/GSM switching)

---

## 🎉 Summary

Your app is now **fully compatible** with your Node-RED flow:
- ✅ All MQTT topics match
- ✅ Payloads match (`"true"`/`"false"` strings)
- ✅ Reed N/C logic implemented
- ✅ Power lockout/resume flow
- ✅ Network status parsing
- ✅ 5-second shutdown
- ✅ Water valve control added

**The app can now control your LinerVac+ system exactly as Node-RED does!** 🚀

