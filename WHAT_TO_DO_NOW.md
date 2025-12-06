# 🎯 What To Do Now - Simple Steps

## Your Current Situation

✅ **You Already Have:**
- Node-RED running at https://linervac.linervac.com
- MQTT broker working (powering your Node-RED flow)
- All flow nodes created and deployed
- Mobile app code complete and configured

❓ **What's Missing:**
- Just need to build the app and test it!

---

## 🚀 Simple 3-Step Process

### Step 1: Build the Mobile App

From your current directory:

```bash
cd /home/maadi/ai_env/liner-vac-login

# Start the build
npm run android
```

**What this does:**
- Compiles your React Native app
- Creates an APK file
- Installs it on your connected Android device (if any)

**Wait time:** 2-5 minutes for first build

---

### Step 2: Install on Your Phone

**Option A: If phone is connected via USB**
- App will auto-install after build
- Look for "LinerVac+" app icon

**Option B: If phone is not connected**
1. After build, find APK at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
2. Copy to your phone (email, Drive, USB)
3. Install the APK

**Option C: Use wireless ADB**
```bash
# Connect phone to same WiFi
# Enable wireless debugging in phone settings
# Note the IP address and port

adb connect YOUR_PHONE_IP:PORT
npm run android
```

---

### Step 3: Test the App

**Launch the app and follow these steps:**

#### 3.1 Initial Setup
1. **Welcome Screen** → Tap "Get Started"
2. **Profile Setup:**
   - Name: Your name
   - Phone: Your phone
   - Email: Your email
   → Tap "Continue"

3. **Bind Unit:**
   - UUID: `D4RWC-Y316` (or your actual device UUID)
   - Unit Name: `LinerVac+ Test`
   → Tap "Bind Unit"

#### 3.2 Home Screen - Check Connection
Look for:
- 🟢 **"Connected"** badge (top left)
- This means MQTT connected to your broker!

#### 3.3 Test Controls
Try each toggle:

**Test Camera:**
1. Tap Camera toggle ON
2. Watch your Node-RED debug panel
3. Should see: `linervac/camera/set → true`
4. GPIO 24 LED should blink (if connected to Pi)

**Test Fan:**
1. Tap Fan toggle ON
2. Node-RED should receive: `linervac/fan/set → true`
3. GPIO 27 should activate (if connected)

**Test Water Valve:**
1. Tap Water Valve toggle ON
2. Node-RED should receive: `linervac/valve/set → true`
3. GPIO 17 should activate (if connected)

#### 3.4 Test Status Display
Look at the Status card:
- System Status: Should show "NORMAL"
- Reed Switch: Shows "open" or "closed"
- Camera State: Shows "ON" or "OFF"
- Network: Shows WiFi/GSM info

---

## 🔍 How to Verify Everything Works

### In Node-RED Dashboard

1. **Open Node-RED:** https://linervac.linervac.com
2. **Open Debug Panel** (bug icon on right side)
3. **Watch for messages** when you tap app controls

**What you should see:**
```
[Camera toggle in app]
  → linervac/camera/set: true

[Fan toggle in app]
  → linervac/fan/set: true

[Water Valve toggle in app]
  → linervac/valve/set: true
```

### In the Mobile App Console

If you need to see detailed logs:

```bash
# Keep this running in a terminal
npx react-native log-android
```

**What you should see:**
```
MQTT Connected successfully
Subscribed to test topic
Subscribed to all LinerVac topics
[Camera toggle]
  → Sent command: linervac/camera/set -> true
[Status update from Node-RED]
  → MQTT Message: linervac/camera/set -> true
```

---

## 🎯 Success Checklist

After testing, verify:

- [ ] App builds successfully
- [ ] App installs on phone
- [ ] Can create profile and bind unit
- [ ] See "Connected" badge (green)
- [ ] Camera toggle works
- [ ] Fan toggle works
- [ ] Water Valve toggle works
- [ ] Status updates display correctly
- [ ] Node-RED receives app commands
- [ ] App receives Node-RED status updates

---

## 🐛 If Something Doesn't Work

### App Won't Build
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android
```

### App Won't Connect to MQTT
**Check these:**
1. Is Node-RED running? Visit: https://linervac.linervac.com
2. Is your phone on internet (WiFi or cellular)?
3. Check app logs: `npx react-native log-android`

**Common error:**
```
MQTT Connection Failed: [error message]
```

**Solutions:**
- Wait 30 seconds and app will auto-retry
- Close and reopen app
- Check if mqtt.linervac.com is accessible

### Controls Don't Work
1. **Check Node-RED debug panel** - Are messages arriving?
2. **Check app logs** - Is MQTT sending?
3. **Try toggling twice** - First tap might be test

### Status Not Updating
1. **In Node-RED**, add Debug node to status topics:
   - `linervac/camera/set`
   - `linervac/fan/set`
   - `linervac/valve/set`
   - `linervac/reed/state`
   - `linervac/system/status`

2. **Manually publish** from Node-RED to test app receiving:
   - Add Inject node → MQTT Out node
   - Topic: `linervac/reed/state`
   - Payload: `"closed"`
   - Click inject → App should update

---

## 📱 Testing Without Hardware

You can test the **app ↔ Node-RED** communication without physical GPIO!

### Test Flow in Node-RED

1. **Subscribe to app commands:**
```
[MQTT In: linervac/camera/set] → [Debug: "App sent"]
[MQTT In: linervac/fan/set] → [Debug: "App sent"]
[MQTT In: linervac/valve/set] → [Debug: "App sent"]
```

2. **Send status to app:**
```
[Inject: "closed"] → [MQTT Out: linervac/reed/state]
[Inject: "LOCKOUT"] → [MQTT Out: linervac/system/status]
[Inject: "WiFi (192.168.1.242)"] → [MQTT Out: linervac/network/status]
```

3. **Test in app:**
   - Tap toggles → Watch Node-RED debug
   - Click inject in Node-RED → Watch app status update

---

## 🎉 When Everything Works

You should see:
- **App → Node-RED:** Commands sent instantly
- **Node-RED → App:** Status updates immediately
- **Two-way communication:** Full control and monitoring

**This proves:**
✅ MQTT connection working
✅ Topics configured correctly
✅ App and Node-RED talking
✅ Ready to connect GPIO hardware!

---

## 🔧 Optional: Dual Protocol Setup

**You DON'T need this right now!** Your app works with WebSocket.

The dual protocol config (from earlier) is **only if** you want to:
- Use `mosquitto_pub/sub` command-line tools
- Test from terminal
- Debug MQTT from command line

**For now:** Just test with the app and Node-RED! ✓

---

## 📞 Next Steps After Testing

Once basic testing works:

### Phase 1: Software Testing (No Hardware) ✓
- [x] App builds
- [x] MQTT connects
- [x] Controls send commands
- [x] Status updates received

### Phase 2: Hardware Integration
1. Connect GPIO pins on Pi
2. Test camera (GPIO 24 LED)
3. Test fan (GPIO 27)
4. Test water valve (GPIO 17)
5. Test reed switch (GPIO 23)

### Phase 3: Full System Test
1. Test power lockout detection
2. Test shutdown sequence
3. Test reed auto-control (fan + valve)
4. Test network status updates
5. Test with multiple users

---

## 🎯 TL;DR - Do This Right Now

```bash
# In your terminal:
cd /home/maadi/ai_env/liner-vac-login
npm run android

# Wait for build...
# App installs on phone
# Open app
# Create profile
# Bind unit: UUID = D4RWC-Y316
# Tap Camera toggle
# Watch Node-RED debug panel
# See message arrive → SUCCESS! 🎉
```

---

_Simple as that! Your MQTT broker is already running. Just build the app and test!_ 🚀

