# Native Module Setup Guide

This guide covers the complete setup for building native Android and iOS apps.

## Overview

All native modules have been configured for both Android and iOS platforms. The app uses Expo's managed workflow with prebuild capability to generate native code.

## Native Modules Configured

### Core Modules
- ✅ **expo-camera** - Camera access for QR scanning and live view
- ✅ **expo-barcode-scanner** - QR code scanning
- ✅ **expo-notifications** - Push notifications and alerts
- ✅ **expo-av** - Audio/video playback
- ✅ **expo-device** - Device information
- ✅ **expo-constants** - App constants
- ✅ **expo-status-bar** - Status bar styling
- ✅ **expo-font** - Custom fonts

### React Native Modules
- ✅ **@react-native-async-storage/async-storage** - Local storage
- ✅ **react-native-gesture-handler** - Gesture recognition
- ✅ **react-native-safe-area-context** - Safe area handling
- ✅ **react-native-screens** - Native screen management
- ✅ **react-native-svg** - SVG rendering

### Navigation
- ✅ **@react-navigation/native** - Navigation core
- ✅ **@react-navigation/native-stack** - Stack navigation
- ✅ **@react-navigation/bottom-tabs** - Tab navigation

## Platform-Specific Configurations

### iOS Configuration

**Location**: `app.json` → `ios`

- **Bundle Identifier**: `com.linervac.plus`
- **Deployment Target**: iOS 13.4+
- **Permissions**:
  - Camera (`NSCameraUsageDescription`)
  - Microphone (`NSMicrophoneUsageDescription`)
  - Photo Library (`NSPhotoLibraryUsageDescription`)
  - Location (`NSLocationWhenInUseUsageDescription`)
- **Background Modes**: Remote notifications

### Android Configuration

**Location**: `app.json` → `android`

- **Package Name**: `com.linervac.plus`
- **Version Code**: 1
- **Permissions**:
  - `CAMERA` - Camera access
  - `RECORD_AUDIO` - Audio recording
  - `VIBRATE` - Vibration
  - `INTERNET` - Network access
  - `ACCESS_NETWORK_STATE` - Network state
  - `WAKE_LOCK` - Keep device awake
  - `RECEIVE_BOOT_COMPLETED` - Boot receiver
  - `POST_NOTIFICATIONS` - Notifications (Android 13+)

## Building Native Apps

### Prerequisites

#### For iOS (macOS only):
1. **Xcode** (latest version from App Store)
2. **CocoaPods**: `sudo gem install cocoapods`
3. **Apple Developer Account** (for production builds)

#### For Android:
1. **Android Studio** (latest version)
2. **Java Development Kit (JDK)** 17 or higher
3. **Android SDK** (via Android Studio)
4. **Environment Variables**:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```

### Development Builds

#### Generate Native Code

```bash
# Generate iOS and Android native projects
npx expo prebuild

# Clean and regenerate (removes existing native folders)
npx expo prebuild --clean
```

#### Run on iOS Simulator (macOS only)

```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios:dev
# or
npx expo run:ios
```

#### Run on Android Emulator

```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android:dev
# or
npx expo run:android
```

### Production Builds

#### Using EAS Build (Recommended)

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure Project**:
   ```bash
   eas build:configure
   ```

4. **Build for iOS**:
   ```bash
   eas build --platform ios
   ```

5. **Build for Android**:
   ```bash
   eas build --platform android
   ```

6. **Build for Both**:
   ```bash
   eas build --platform all
   ```

#### Local Builds

##### iOS (macOS only)

```bash
# Generate native code
npx expo prebuild

# Open in Xcode
open ios/linervac-plus.xcworkspace

# Build in Xcode:
# Product → Archive → Distribute App
```

##### Android

```bash
# Generate native code
npx expo prebuild

# Build APK
npm run android:build:apk

# Build App Bundle (for Play Store)
npm run android:build:bundle

# Or use Gradle directly
cd android
./gradlew assembleRelease        # APK
./gradlew bundleRelease          # AAB
```

## Native Module Initialization

All native modules are automatically initialized through Expo's plugin system. The initialization happens in this order:

1. **App.tsx** - Main app entry point
   - Sets up navigation
   - Initializes stores
   - Configures notifications

2. **Native Modules** - Auto-initialized via plugins:
   - Camera permissions requested on first use
   - Notifications configured on app start
   - AsyncStorage ready immediately
   - Gesture handler initialized with root view

## Testing Native Modules

### Camera
- QR Scanner screen should request camera permission
- Camera preview should work on HomeScreen
- Full-screen camera should work

### Notifications
- Test on physical device (not simulator)
- Background notifications should work
- Alert sounds should play

### Storage
- User data persists across app restarts
- Unit data persists
- Settings persist

### Network
- MQTT connection works on both platforms
- WebSocket connections work
- Network state detection works

## Troubleshooting

### iOS Build Issues

1. **Pod Install**:
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **Clean Build**:
   ```bash
   cd ios
   xcodebuild clean
   cd ..
   npx expo prebuild --clean
   ```

3. **Signing Issues**:
   - Open Xcode project
   - Select project → Signing & Capabilities
   - Select your development team

### Android Build Issues

1. **Gradle Sync**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. **SDK Issues**:
   - Open Android Studio
   - SDK Manager → Install required SDKs
   - Build Tools 34.0.0 or higher

3. **Permission Issues**:
   - Check `AndroidManifest.xml` (auto-generated)
   - Verify permissions in `app.json`

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild native code
npx expo prebuild --clean
```

### Metro Bundler Issues

```bash
# Clear cache
npx expo start --clear

# Reset Metro
watchman watch-del-all
rm -rf node_modules/.cache
```

## File Structure After Prebuild

```
liner-vac-login/
├── android/          # Generated Android project
│   ├── app/
│   ├── build.gradle
│   └── ...
├── ios/              # Generated iOS project
│   ├── linervac-plus/
│   ├── Podfile
│   └── ...
├── app.json          # Expo configuration
├── eas.json          # EAS Build configuration
└── ...
```

## Next Steps

1. **Generate Native Code**:
   ```bash
   npx expo prebuild
   ```

2. **Test on Simulator/Emulator**:
   ```bash
   npm run ios:dev      # iOS
   npm run android:dev  # Android
   ```

3. **Build for Production**:
   ```bash
   eas build --platform all
   ```

## Additional Resources

- [Expo Prebuild Documentation](https://docs.expo.dev/workflow/prebuild/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-intro)
- [Expo Plugins](https://docs.expo.dev/config-plugins/introduction/)

