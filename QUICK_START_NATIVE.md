# Quick Start: Native Module Setup

## ✅ What's Been Configured

All native modules are now fully configured for both Android and iOS:

### Native Modules Ready:
- ✅ Camera (QR scanning, live view)
- ✅ Notifications (push alerts, background)
- ✅ Barcode Scanner
- ✅ AsyncStorage (local data)
- ✅ Gesture Handler
- ✅ Safe Area Context
- ✅ Screens (native navigation)
- ✅ Device Info
- ✅ Status Bar
- ✅ Fonts

### Platform Configurations:
- ✅ iOS: Permissions, Info.plist, Bundle ID
- ✅ Android: Permissions, Package, Version Code
- ✅ EAS Build configuration
- ✅ Prebuild scripts

## 🚀 Quick Start

### 1. Generate Native Code

```bash
# Generate iOS and Android native projects
npx expo prebuild

# Or use the setup script
./scripts/setup-native.sh
```

### 2. Run on Device/Simulator

#### iOS (macOS only):
```bash
npm run ios:dev
# or
npx expo run:ios
```

#### Android:
```bash
npm run android:dev
# or
npx expo run:android
```

### 3. Build for Production

#### Using EAS (Recommended):
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform all
```

#### Local Builds:

**iOS:**
```bash
npx expo prebuild
open ios/linervac-plus.xcworkspace
# Build in Xcode
```

**Android:**
```bash
npx expo prebuild
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease     # AAB
```

## 📱 Testing Native Features

1. **Camera**: Open QR Scanner screen
2. **Notifications**: Test on physical device
3. **Storage**: Data persists after app restart
4. **Network**: MQTT connection works

## 📚 Full Documentation

See `NATIVE_SETUP.md` for complete documentation.

## 🔧 Troubleshooting

### "Module not found" errors:
```bash
rm -rf node_modules
npm install
npx expo prebuild --clean
```

### iOS build fails:
```bash
cd ios
pod install
cd ..
```

### Android build fails:
```bash
cd android
./gradlew clean
cd ..
```

## ✨ You're Ready!

Your app is now configured for native builds on both platforms. Generate the native code and start building!

