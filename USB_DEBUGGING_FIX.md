# USB Debugging Troubleshooting Guide

## Device Not Showing in `adb devices`

If your phone is connected but not showing up, follow these steps:

## Step 1: Check USB Connection Mode

On your Android phone:
1. When you connect via USB, a notification should appear
2. Tap the notification: **"USB for file transfer"** or **"Charging this device"**
3. Select **"File Transfer"** or **"MTP"** (not "Charging only")
4. Some phones: Settings → Connected devices → USB → Select "File Transfer"

## Step 2: Authorize Computer (Most Common Issue!)

When you first connect:
1. **A popup should appear on your phone**: "Allow USB debugging?"
2. **Check "Always allow from this computer"**
3. **Tap "Allow" or "OK"**
4. If you missed it, disconnect and reconnect the USB cable

## Step 3: Verify USB Debugging is Enabled

On your phone:
1. **Settings → Developer Options**
2. Make sure **"USB Debugging"** is ON (toggle enabled)
3. Also enable **"USB Debugging (Security settings)"** if available
4. Some phones need: **"Stay awake"** (keeps screen on while charging)

## Step 4: Restart ADB Server

```bash
# Kill and restart ADB
adb kill-server
adb start-server
adb devices
```

## Step 5: Check USB Cable

- Use a **data cable** (not charge-only cable)
- Try a **different USB port** on your computer
- Try a **different USB cable** if possible
- Some cables only charge, not transfer data

## Step 6: Check USB Drivers (Linux)

On Linux, you usually don't need drivers, but check:

```bash
# Check if device is detected by system
lsusb

# Should show your phone manufacturer
# If you see "unauthorized" device, authorize on phone
```

### Create udev rules (if needed):

```bash
# Create rules file
sudo nano /etc/udev/rules.d/51-android.rules

# Add this (replace VENDOR_ID with your phone's vendor ID from lsusb):
# SUBSYSTEM=="usb", ATTR{idVendor}=="VENDOR_ID", MODE="0666", GROUP="plugdev"

# Example for common manufacturers:
# Samsung: SUBSYSTEM=="usb", ATTR{idVendor}=="04e8", MODE="0666", GROUP="plugdev"
# Google: SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", MODE="0666", GROUP="plugdev"
# OnePlus: SUBSYSTEM=="usb", ATTR{idVendor}=="2a70", MODE="0666", GROUP="plugdev"
# Xiaomi: SUBSYSTEM=="usb", ATTR{idVendor}=="2717", MODE="0666", GROUP="plugdev"

# Reload rules
sudo udevadm control --reload-rules
sudo udevadm trigger

# Add yourself to plugdev group
sudo usermod -aG plugdev $USER

# Log out and back in, or:
newgrp plugdev
```

## Step 7: Check Phone Model Specific Issues

### Samsung:
- Enable **"USB Debugging"**
- Enable **"Revoke USB debugging authorizations"** then reconnect
- Some models need: Settings → Developer Options → "USB Configuration" → Select "MTP"

### Xiaomi/MIUI:
- Enable **"USB Debugging"**
- Enable **"Install via USB"**
- Enable **"USB Debugging (Security settings)"**
- May need to enable: **"Developer Options" → "USB Debugging" → "Always prompt"**

### OnePlus:
- Enable **"USB Debugging"**
- Enable **"Revoke USB debugging authorizations"**
- Check: Settings → System → Developer Options

### Google Pixel:
- Usually works out of the box
- Just enable USB Debugging

## Step 8: Verify ADB Installation

```bash
# Check ADB version
adb version

# Should show version number
# If not found, install:
# Ubuntu/Debian:
sudo apt-get install android-tools-adb android-tools-fastboot

# Or use Android Studio's ADB:
# Usually at: $ANDROID_HOME/platform-tools/adb
```

## Step 9: Test Connection

```bash
# Check devices with details
adb devices -l

# Should show something like:
# List of devices attached
# ABC123XYZ    device usb:1-2 product:model_name model:DeviceName device:device_name
```

## Step 10: Alternative - Use Wireless ADB

If USB still doesn't work:

1. **Connect via USB first** (one time setup)
2. **Enable Wireless debugging** on phone:
   - Settings → Developer Options → "Wireless debugging"
   - Enable it
   - Note the IP address and port shown

3. **Connect wirelessly**:
   ```bash
   adb connect PHONE_IP:PORT
   # Example: adb connect 192.168.1.100:5555
   ```

4. **Verify**:
   ```bash
   adb devices
   ```

## Quick Checklist

- [ ] USB Debugging enabled in Developer Options
- [ ] Phone shows "Allow USB debugging?" popup - **TAP ALLOW**
- [ ] USB mode set to "File Transfer" or "MTP"
- [ ] Using a data cable (not charge-only)
- [ ] ADB server restarted (`adb kill-server && adb start-server`)
- [ ] Phone unlocked when connecting
- [ ] Tried different USB port
- [ ] Tried different USB cable

## Still Not Working?

1. **Check phone screen** - Look for any popups or notifications
2. **Disconnect and reconnect** USB cable
3. **Restart phone** and try again
4. **Check phone manufacturer's website** for specific USB debugging instructions
5. **Try wireless ADB** as alternative

## Test Once Connected

Once `adb devices` shows your device:

```bash
# Run the app
npm run android:dev

# Or use Expo
npm start
# Then press 'a' to open on Android device
```




