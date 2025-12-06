# Android Emulator Troubleshooting

## Issue: Emulator Quit Before Opening

If you see "The emulator quit before it finished opening", try these solutions:

## Solution 1: Start Emulator Manually

1. **List available emulators**:
   ```bash
   $ANDROID_HOME/emulator/emulator -list-avds
   ```

2. **Start emulator manually**:
   ```bash
   $ANDROID_HOME/emulator/emulator @Medium_Phone_API_36.0
   ```

3. **Wait for emulator to fully boot**, then run:
   ```bash
   npm run android:dev
   ```

## Solution 2: Use Physical Device (Recommended)

### Enable USB Debugging:
1. On your Android device: **Settings → About Phone**
2. Tap **Build Number** 7 times to enable Developer Options
3. Go to **Settings → Developer Options**
4. Enable **USB Debugging**

### Connect Device:
```bash
# Connect device via USB
adb devices

# Should show your device
# Then run:
npm run android:dev
```

## Solution 3: Fix Emulator Issues

### Check System Requirements:
- **RAM**: At least 8GB (16GB recommended)
- **CPU**: Hardware acceleration enabled
- **Disk Space**: At least 10GB free

### Enable Hardware Acceleration (Linux):
```bash
# Check if KVM is available
lsmod | grep kvm

# If not, install:
sudo apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

# Add user to kvm group
sudo adduser $USER kvm
```

### Create New Emulator:
1. Open **Android Studio**
2. **Tools → Device Manager**
3. **Create Device**
4. Choose a device (e.g., Pixel 5)
5. Download a system image (API 33 or 34 recommended)
6. Finish setup

### Use Different Emulator:
```bash
# List all emulators
$ANDROID_HOME/emulator/emulator -list-avds

# Start a different one
$ANDROID_HOME/emulator/emulator @YourEmulatorName

# Then in another terminal:
npm run android:dev
```

## Solution 4: Use Expo Go (Easiest for Testing)

Instead of building native code, use Expo Go:

```bash
# Start Expo server
npm start

# Scan QR code with Expo Go app on your phone
# Or press 'a' to open on connected Android device
```

## Solution 5: Check Emulator Logs

```bash
# Check emulator logs
$ANDROID_HOME/emulator/emulator @Medium_Phone_API_36.0 -verbose

# Look for errors like:
# - "Failed to open /dev/kvm"
# - "emulator: ERROR: x86_64 emulation currently requires hardware acceleration"
```

## Solution 6: Cold Boot Emulator

```bash
# Cold boot (fresh start)
$ANDROID_HOME/emulator/emulator @Medium_Phone_API_36.0 -no-snapshot-load

# Or wipe data
$ANDROID_HOME/emulator/emulator -avd Medium_Phone_API_36.0 -wipe-data
```

## Quick Fixes

### 1. Restart ADB:
```bash
adb kill-server
adb start-server
adb devices
```

### 2. Check Android SDK:
```bash
# Verify ANDROID_HOME is set
echo $ANDROID_HOME

# Should show: /path/to/android/sdk
# If not, set it:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 3. Rebuild Native Code:
```bash
npx expo prebuild --clean
npm run android:dev
```

## Recommended: Use Physical Device

For development, using a physical Android device is often easier:
- Faster than emulator
- Real device testing
- No emulator setup needed
- Just enable USB debugging and connect

## Alternative: Build APK and Install

```bash
# Build APK
cd android
./gradlew assembleDebug

# Install on connected device
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Still Having Issues?

1. **Check Android Studio** - Make sure it's up to date
2. **Update SDK** - Install latest Android SDK and build tools
3. **Check Logs** - Look at emulator output for specific errors
4. **Try Different Emulator** - Create a new AVD with different settings
5. **Use Expo Go** - For quick testing without native build




