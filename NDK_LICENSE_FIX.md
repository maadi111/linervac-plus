# NDK License Fix - Complete Guide

## Problem
Gradle is failing because NDK (Native Development Kit) license is not accepted, even though license files exist.

## Root Cause
The NDK package itself needs to be installed first. Gradle checks for the NDK installation and its license during the build process.

## Solutions (In Order of Recommendation)

### Solution 1: Install NDK via Android Studio ⭐ RECOMMENDED

This is the most reliable method:

1. **Open Android Studio**
2. **Tools → SDK Manager** (or File → Settings → Appearance & Behavior → System Settings → Android SDK)
3. **SDK Tools tab**
4. **Check "NDK (Side by side)"**
5. **Select version 27.1.12297006** (or latest available)
6. **Click "Apply"**
7. **Accept all licenses** when prompted
8. **Wait for installation** to complete
9. **Close Android Studio**
10. **Try building again:**
   ```bash
   npm run android:dev
   ```

### Solution 2: Use Expo Go (No Build Needed) ⭐ FASTEST

For development and testing, use Expo Go - no native build required:

```bash
# Start Expo server
npm start

# On your phone:
# 1. Open Expo Go app
# 2. Scan the QR code
# 3. App loads instantly - no build needed!
```

**Advantages:**
- No license issues
- No build time
- Instant updates
- Works on any device

### Solution 3: Install NDK via Command Line

If you have `sdkmanager` available:

```bash
# Find sdkmanager
export ANDROID_HOME=/usr/lib/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Accept licenses first
yes | sdkmanager --licenses

# Install NDK
sdkmanager "ndk;27.1.12297006"

# Or install latest
sdkmanager "ndk;latest"
```

### Solution 4: Manual License File Creation

If you can't install NDK, try creating all possible license files:

```bash
sudo bash -c 'cat > /usr/lib/android-sdk/licenses/android-sdk-preview-license << EOF
24333f8a63b6825ea9c5514f83c2829b004d1fee
8933bad161af4178b1185d1a37fbf41ea5269c55
EOF
'

# Also create NDK-specific license
sudo bash -c 'echo "8933bad161af4178b1185d1a37fbf41ea5269c55" > /usr/lib/android-sdk/licenses/android-ndk-license'
```

Then verify:
```bash
ls -la /usr/lib/android-sdk/licenses/
cat /usr/lib/android-sdk/licenses/android-sdk-preview-license
```

## Why This Happens

Gradle's license check happens in two stages:
1. **License file check** - Checks if license files exist
2. **NDK installation check** - Verifies NDK is actually installed

Even if license files exist, if NDK isn't installed, Gradle will try to install it and fail on license acceptance.

## Verification

After installing NDK, verify it's installed:

```bash
ls -la /usr/lib/android-sdk/ndk/
```

You should see a directory like `27.1.12297006` or similar.

## Recommended Workflow

**For Development:**
- Use **Expo Go** - fastest, no build issues
- Test features quickly
- No license/build complications

**For Production:**
- Install NDK via Android Studio
- Build native APK/AAB
- Test on physical devices

## Still Having Issues?

1. **Check NDK is installed:**
   ```bash
   ls /usr/lib/android-sdk/ndk/
   ```

2. **Check license files:**
   ```bash
   ls -la /usr/lib/android-sdk/licenses/
   ```

3. **Try clean build:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android:dev
   ```

4. **Use Expo Go** - it's the easiest solution for development!



