# Node-RED MQTT Integration

This document describes how the LinerVac+ mobile app integrates with the Node-RED flow.

## MQTT Topics (Matching Node-RED Flow)

### Control Topics

| Topic | Type | Description | Node-RED Usage |
|-------|------|-------------|----------------|
| `linervac/camera/set` | boolean | Camera on/off | Auto-off after 1 minute |
| `linervac/fan/set` | boolean | Fan control | Manual or auto via reed switch |
| `linervac/valve/set` | boolean | Water valve control | Manual or auto via reed switch |
| `linervac/reed/state` | string | Reed state: "open"/"closed" | From GPIO 23 (N/C) |
| `linervac/reed/sim` | boolean | Simulated reed for testing | UI switch for testing |
| `linervac/led/set` | boolean | Camera LED control | GPIO 24, blinks when camera on |
| `linervac/shutdown` | string | Shutdown command | GPIO 3, requires 5-second hold |
| `linervac/resume` | string | Resume after lockout | Clears power lockout state |

### Status Topics

| Topic | Type | Description |
|-------|------|-------------|
| `linervac/system/status` | string | "LOCKOUT" / "NORMAL" / "CLEARED" |
| `linervac/network/status` | string | e.g., "WiFi (192.168.1.242)" |
| `linervac/data/usage` | number | Data usage in MB |
| `device/uuid` | string | Device UUID (format: xxxxxx-xxxx) |

## Key Logic from Node-RED

### 1. Camera Control
- Switch turns camera on/off
- Auto-off after 1 minute delay
- Controls LED blinking on GPIO 24
- Camera feed at: `http://192.168.1.242:8080/stream`

### 2. Reed Switch (N/C - Normally Closed)
- GPIO 23 input with pull-up
- **Reed closed (0)** → Fan & Valve ON
- **Reed open (1)** → Fan & Valve OFF (unless manual override)
- Manual fan/valve switches can override reed logic

### 3. Fan & Valve Control
- **Automatic**: Controlled by reed switch
- **Manual Override**: UI switches can force on/off
- GPIO 27 (Fan - Active HIGH)
- GPIO 17 (Valve - Active HIGH)

### 4. Safe Shutdown
- Requires 5-second button hold
- GPIO 3 (LOW pulse for shutdown)
- Saves timestamp to `/data/last_shutdown.txt`

### 5. Power Outage Detection
- On boot, reads `/data/last_shutdown.txt`
- If >30 seconds since last shutdown → **LOCKOUT**
- **LOCKOUT** prevents automatic operation
- User must tap "Resume Operation" to clear

### 6. System Status States
- **NORMAL**: Normal operation
- **LOCKOUT**: Power outage detected, awaiting resume
- **CLEARED**: Lockout cleared by user
- **SHUTDOWN**: System shutting down

## GPIO Mapping

| GPIO | Type | Function | Active State |
|------|------|----------|--------------|
| 3 | Output | Shutdown signal | LOW |
| 17 | Output | Water valve | HIGH |
| 23 | Input | Reed switch (N/C) | PUD_UP, 0=closed |
| 24 | Output | Camera LED | HIGH (blinks) |
| 27 | Output | Fan | HIGH |

## Network Detection
- Checks `ip -4 -o addr show` every 30 seconds
- Priority: WiFi (wlan0) > GSM (eth1/usb0)
- Displays: "WiFi (IP)" or "GSM (IP)"

## UUID Format
- Generated once on first boot
- Format: `xxxxxx-xxxx` (lowercase alphanumeric)
- Saved to `/data/device_uuid.txt`
- Example: `a2b3c4-d5e6`

## App Implementation

### Subscribe Topics
- `linervac/camera/set` → Update camera state
- `linervac/fan/set` → Update fan state
- `linervac/valve/set` → Update valve state
- `linervac/reed/state` → Update reed display
- `linervac/system/status` → Update system status
- `linervac/network/status` → Update network display

### Publish Topics
- `linervac/camera/set` → true/false
- `linervac/fan/set` → true/false
- `linervac/valve/set` → true/false
- `linervac/shutdown` → "shutdown"
- `linervac/resume` → "resume"

## Important Notes

1. **Topics are NOT UUID-based** - Node-RED uses simple flat topics
2. **Reed switch is N/C (Normally Closed)** - Closed = 0, Open = 1
3. **Auto-off camera** - App should reflect 1-minute timeout
4. **Power lockout** - Must handle LOCKOUT state and show Resume button
5. **Boolean values** - Use true/false (not "1"/"0" strings)
6. **Shutdown requires 5s hold** - Visual progress indicator needed

## Testing

### Camera Test
```
mosquitto_pub -h mqtt.linervac.com -p 1883 -t "linervac/camera/set" -m "true"
```

### Fan Test
```
mosquitto_pub -h mqtt.linervac.com -p 1883 -t "linervac/fan/set" -m "true"
```

### Reed Simulation
```
mosquitto_pub -h mqtt.linervac.com -p 1883 -t "linervac/reed/state" -m "closed"
```

### Check System Status
```
mosquitto_sub -h mqtt.linervac.com -p 1883 -t "linervac/#"
```

