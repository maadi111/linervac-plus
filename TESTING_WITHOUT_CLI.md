# 🧪 Testing MQTT Without Command-Line Tools

Since `mosquitto-clients` isn't installed, here are alternative ways to test your MQTT connection:

---

## ✅ Option 1: Test from Node-RED (Recommended)

**You already have MQTT set up in Node-RED!** Just use your existing flow:

### Test Subscribe
1. Open Node-RED dashboard
2. Add a **Debug node**
3. Connect it to an **MQTT In node**:
   - Server: `mqtt.linervac.com:1883` (your local broker)
   - Topic: `linervac/test`
4. Deploy and watch debug panel

### Test Publish
1. Add an **Inject node**
2. Connect it to an **MQTT Out node**:
   - Server: Same as above
   - Topic: `linervac/test`
   - Payload: `"hello"`
3. Deploy and click inject button

---

## ✅ Option 2: Test from Mobile App

**The app has a built-in MQTT client!**

1. **Build and launch the app**
2. **Check logs** for:
   ```
   MQTT Connected successfully
   Subscribed to test topic
   ```
3. **Publish from Node-RED** → App will receive it
4. **Toggle controls in app** → Node-RED will receive commands

---

## ✅ Option 3: Online MQTT Client

Use a web-based MQTT client (no installation needed):

### HiveMQ WebSocket Client
1. Go to: **https://www.hivemq.com/demos/websocket-client/**
2. **Connection Settings:**
   ```
   Host: mqtt.linervac.com
   Port: 443
   Path: /mqtt
   TLS: Enabled ✓
   Username: (leave empty)
   Password: (leave empty)
   ```
3. Click **Connect**
4. **Subscribe to:** `linervac/test`
5. **Publish to:** `linervac/test` with message `"hello"`

### MQTT.Cool Live Demo
1. Go to: **https://testclient-cloud.mqtt.cool/**
2. Configure for your broker
3. Test pub/sub

---

## ✅ Option 4: Install CLI Tools (If Needed Later)

If you want the command-line tools later:

```bash
# Install mosquitto-clients
sudo apt install mosquitto-clients

# Test after installation
mosquitto_pub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/test -m "hello"

mosquitto_sub -h mqtt.linervac.com -p 443 --capath /etc/ssl/certs \
  -t linervac/test -v
```

---

## 🎯 Recommended Testing Workflow

### Phase 1: Node-RED to Node-RED
1. **MQTT In** → **Debug** (verify broker works locally)
2. **Inject** → **MQTT Out** (verify publishing works)

### Phase 2: Node-RED to Mobile App
1. **Launch mobile app** → Check connection logs
2. **Publish from Node-RED** → Verify app receives
3. **Toggle controls in app** → Verify Node-RED receives

### Phase 3: Full Integration Test
1. **Tap Camera in app** → LED blinks on Pi (GPIO 24)
2. **Tap Fan in app** → Fan activates (GPIO 27)
3. **Tap Water Valve in app** → Valve activates (GPIO 17)
4. **Trigger Reed Switch** → App shows "closed", fan/valve activate
5. **Tap Shutdown** → Hold 5s → System powers down

---

## 🔍 How to Verify Connection

### In Node-RED
- **Debug panel** shows incoming messages
- **MQTT nodes** show "connected" badge
- **Inject nodes** trigger successfully

### In Mobile App
- **Console logs:**
  ```
  MQTT Connected successfully
  Subscribed to test topic
  Subscribed to all LinerVac topics
  MQTT Message: linervac/test -> hello
  ```
- **Connection badge** shows green "Connected"
- **Controls** respond to toggles

### From Your Pi
You can test locally on the Pi without external tools:

```bash
# Check if mosquitto is running
systemctl status mosquitto

# Check mosquitto logs
sudo tail -f /var/log/mosquitto/mosquitto.log

# You should see:
# New client connected: linervac_app_[timestamp]
```

---

## 🐛 Troubleshooting

### App Won't Connect
1. **Check Node-RED MQTT broker** is running
2. **Verify Cloudflare** DNS and SSL settings
3. **Check firewall** allows port 443
4. **Try from Pi first** (local test)

### Messages Not Received
1. **Verify subscription** in app logs
2. **Check topic names** match exactly
3. **Publish from Debug node** in Node-RED
4. **Watch mosquitto logs** on Pi

### Node-RED Not Receiving
1. **Check MQTT In nodes** are deployed
2. **Verify topics** match app publish topics
3. **Check MQTT broker config** in Node-RED
4. **Watch Debug panel** for errors

---

## 📊 Testing Checklist

- [ ] Node-RED MQTT broker is running
- [ ] Node-RED can publish to `linervac/test`
- [ ] Node-RED can subscribe to `linervac/test`
- [ ] Mobile app connects successfully
- [ ] App receives messages from Node-RED
- [ ] Node-RED receives commands from app
- [ ] Camera toggle works (app → Node-RED → GPIO)
- [ ] Reed switch works (GPIO → Node-RED → app)
- [ ] System status updates (Node-RED → app)
- [ ] Network status displays correctly

---

## 🚀 Quick Start (No CLI Needed)

1. **Open Node-RED** → Already installed on your Pi
2. **Add MQTT Out node:**
   - Topic: `linervac/test`
   - Payload: `"hello from Node-RED"`
3. **Add Debug node** → Connect to MQTT In (`linervac/test`)
4. **Deploy**
5. **Launch mobile app**
6. **Check app logs** → Should see `"hello from Node-RED"`
7. **Toggle camera in app** → Check Debug panel in Node-RED
8. ✅ **Working!**

---

## 💡 Pro Tip

**You don't need command-line MQTT tools!** Your Node-RED dashboard and mobile app are both full-featured MQTT clients. Use them for testing instead! 🎉

---

_Last Updated: Dec 6, 2025_

