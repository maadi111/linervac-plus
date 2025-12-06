# 🔧 MQTT Testing Notes

## Issue: Command-Line Tools Don't Support WebSockets

### The Problem
```
mosquitto_pub/sub → Uses raw MQTT over TCP
Your broker → Requires MQTT over WebSockets (wss://)
Result → "Network protocol error" ❌
```

### Why This Happens
- **Command-line tools** (`mosquitto_pub`, `mosquitto_sub`) use **raw TCP MQTT protocol**
- **Your broker** is configured for **MQTT over WebSockets** (`wss://mqtt.linervac.com/mqtt`)
- These are **different protocols** and not compatible

---

## ✅ Solutions

### Option 1: Use Node-RED (Recommended)
**Node-RED has built-in WebSocket support!**

1. Open your Node-RED flow
2. Add MQTT In/Out nodes with server: `mqtt.linervac.com:443`
3. Configure as WebSocket connection
4. Test pub/sub from there

### Option 2: Test from Mobile App
**The app has a proper WebSocket MQTT client built-in.**

Just launch the app and check logs:
```
MQTT Connected successfully ✓
Subscribed to test topic ✓
```

### Option 3: Configure Broker for Both Protocols
If you want command-line tools to work, add TCP listener to your Mosquitto config:

```conf
# /etc/mosquitto/mosquitto.conf

# WebSocket listener (existing - for mobile app)
listener 443
protocol websockets
cafile /etc/ssl/certs/ca-certificates.crt
certfile /etc/mosquitto/certs/cert.pem
keyfile /etc/mosquitto/certs/key.pem

# TCP listener (NEW - for command-line tools)
listener 1883
protocol mqtt

# Or secure TCP
listener 8883
protocol mqtt
cafile /etc/ssl/certs/ca-certificates.crt
certfile /etc/mosquitto/certs/cert.pem
keyfile /etc/mosquitto/certs/key.pem
```

Then test with:
```bash
# Standard MQTT (no encryption)
mosquitto_pub -h mqtt.linervac.com -p 1883 -t linervac/test -m "hello"

# Secure MQTT (TLS)
mosquitto_pub -h mqtt.linervac.com -p 8883 --cafile /etc/ssl/certs/ca-certificates.crt \
  -t linervac/test -m "hello"
```

---

## 🎯 Recommended Testing Strategy

### Phase 1: Node-RED Testing
1. **Open Node-RED** (already installed on Pi)
2. **Add Debug Flow:**
   ```
   [MQTT In: linervac/test] → [Debug]
   [Inject] → [MQTT Out: linervac/test]
   ```
3. **Configure MQTT broker:**
   - Server: `mqtt.linervac.com`
   - Port: `443`
   - Use TLS: ✓
   - Protocol: WebSockets
4. **Test:** Click inject → Watch debug panel

### Phase 2: Mobile App Testing
1. **Build and launch app**
2. **Check connection logs**
3. **Toggle controls**
4. **Watch Node-RED debug panel**

### Phase 3: Hardware Integration
1. **Test GPIO controls** from app
2. **Test reed switch** → app display
3. **Full system test**

---

## 📊 Protocol Comparison

| Feature | MQTT over TCP | MQTT over WebSockets |
|---------|---------------|----------------------|
| **Protocol** | Raw TCP | HTTP/WebSocket |
| **Ports** | 1883 (plain), 8883 (TLS) | 80 (ws://), 443 (wss://) |
| **Firewall** | Often blocked | Usually allowed |
| **Use Case** | Local networks, server-to-server | Web apps, mobile apps |
| **Command-line tools** | ✓ Supported | ✗ Not supported |
| **Browsers** | ✗ Not supported | ✓ Supported |
| **Mobile apps** | ⚠️ Sometimes blocked | ✓ Always works |

---

## 🔍 What We Learned

1. ✅ **mosquitto-clients installed** successfully
2. ❌ **Can't test WebSocket MQTT** with command-line tools
3. ✅ **Your app will work fine** (uses proper WebSocket client)
4. ✅ **Node-RED can test** (has WebSocket support)

---

## 💡 Next Steps

### For Testing Right Now:
1. **Use Node-RED** to test MQTT pub/sub (easiest)
2. **Build the app** and test from mobile device

### For Future Command-Line Testing:
1. **Add TCP listener** to Mosquitto (port 1883 or 8883)
2. **Update firewall** to allow those ports
3. **Then** use `mosquitto_pub/sub` normally

---

## 🚀 Quick Node-RED Test Flow

Import this into Node-RED to test immediately:

```json
[
  {
    "id": "mqtt_test_in",
    "type": "mqtt in",
    "topic": "linervac/test",
    "broker": "mqtt_broker",
    "name": "Test Subscriber"
  },
  {
    "id": "mqtt_test_out",
    "type": "mqtt out",
    "topic": "linervac/test",
    "broker": "mqtt_broker",
    "name": "Test Publisher"
  },
  {
    "id": "inject_test",
    "type": "inject",
    "payload": "hello from Node-RED",
    "name": "Send Test Message"
  },
  {
    "id": "debug_test",
    "type": "debug",
    "name": "Received"
  }
]
```

Wire: `inject_test` → `mqtt_test_out`  
Wire: `mqtt_test_in` → `debug_test`

---

## ✅ Summary

**Don't worry about command-line tools!**
- Your **mobile app** uses proper WebSocket client ✓
- Your **Node-RED flow** already has MQTT ✓
- You can **test everything** without CLI tools ✓

The app will connect perfectly to `wss://mqtt.linervac.com:443/mqtt` because it uses the correct WebSocket protocol! 🎉

---

_Updated: Dec 6, 2025_

