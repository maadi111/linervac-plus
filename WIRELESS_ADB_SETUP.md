# Wireless ADB Setup Guide

## Prerequisites
- Android 11+ device (or Android 10 with wireless debugging enabled)
- Phone and computer on the same Wi-Fi network

## Method 1: Wireless Debugging (Android 11+)

### Step 1: Enable Wireless Debugging on Phone

1. **Settings → Developer Options**
2. Find **"Wireless debugging"** (or "Wireless ADB")
3. **Enable it** (toggle ON)
4. Tap **"Wireless debugging"** to open settings
5. Note the **IP address and port** shown (e.g., `192.168.1.100:5555`)

### Step 2: Connect from Computer

```bash
# Connect to your phone
adb connect PHONE_IP:PORT

# Example:
adb connect 192.168.1.100:5555
```

### Step 3: Verify Connection

```bash
adb devices

# Should show:
# List of devices attached
# 192.168.1.100:5555    device
```

### Step 4: Run Your App

```bash
# Now you can run the app wirelessly
npm run android:dev

# Or use Expo
npm start
# Then press 'a' to open on Android device
```

## Method 2: Pairing Code (Android 11+)

Some phones use a pairing code:

1. **Settings → Developer Options → Wireless debugging**
2. Tap **"Pair device with pairing code"**
3. Note the **IP address, port, and pairing code**
4. On computer:
   ```bash
   adb pair PHONE_IP:PAIRING_PORT
   # Enter the pairing code when prompted
   ```
5. Then connect:
   ```bash
   adb connect PHONE_IP:DEBUG_PORT
   ```

## Method 3: Traditional Wireless ADB (Any Android)

If your phone doesn't have "Wireless debugging" option:

### Step 1: Initial USB Connection (One Time)

You'll need USB connection just once to enable wireless:

1. Connect via USB
2. Enable USB debugging
3. Run:
   ```bash
   adb tcpip 5555
   ```
4. Disconnect USB

### Step 2: Find Phone IP Address

On your phone:
- **Settings → About phone → Status → IP address**
- Or: **Settings → Wi-Fi → Tap your network → View IP address**

### Step 3: Connect Wirelessly

```bash
# Connect to phone's IP on port 5555
adb connect PHONE_IP:5555

# Example:
adb connect 192.168.1.100:5555
```

### Step 4: Verify

```bash
adb devices
```

## Troubleshooting

### Connection Refused
- Make sure phone and computer are on **same Wi-Fi network**
- Check firewall isn't blocking port 5555
- Try restarting ADB: `adb kill-server && adb start-server`

### Can't Find Wireless Debugging
- Make sure you're on **Android 11+**
- Check **Developer Options** are enabled
- Some manufacturers hide it - look for "Wireless ADB" or "Network debugging"

### Connection Drops
- Keep phone screen on
- Disable battery optimization for Developer Options
- Reconnect: `adb connect PHONE_IP:PORT`

### Find IP Address
```bash
# On phone, or use ADB if connected:
adb shell ip addr show wlan0 | grep "inet " | awk '{print $2}' | cut -d/ -f1
```

## Quick Commands

```bash
# Connect wirelessly
adb connect 192.168.1.100:5555

# Disconnect
adb disconnect 192.168.1.100:5555

# List devices
adb devices

# Restart ADB
adb kill-server && adb start-server

# Check connection
adb shell
# (If you see shell prompt, connection works!)
```

## Keep Connection Active

To keep wireless connection active:
- Keep phone screen on
- Disable battery optimization
- Some phones: Settings → Developer Options → "Stay awake"

## Security Note

Wireless debugging is less secure than USB. Only use on trusted networks (your home/office Wi-Fi).




