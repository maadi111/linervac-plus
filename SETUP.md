# React Native Development Environment Setup Guide

This guide will help you set up the development environment for the LinerVac+ React Native app.

## Prerequisites

### 1. Node.js
- **Required**: Node.js 18+ (LTS recommended)
- **Current**: Node.js v20.19.5 ✓
- Download from: https://nodejs.org/

### 2. Package Manager
- npm (comes with Node.js) ✓
- Or use pnpm/yarn if preferred

### 3. Expo CLI
Expo CLI is included with the project dependencies. You can use it via:
```bash
npx expo --version
```

Or install globally (optional):
```bash
npm install -g expo-cli
```

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

If you encounter peer dependency issues:
```bash
npm install --legacy-peer-deps
```

### 2. Verify Installation
Check that all dependencies are installed:
```bash
npm list --depth=0
```

### 3. Start Development Server
```bash
npm start
# or
npx expo start
```

## Running the App

### Option 1: Expo Go (Recommended for Development)
1. Install **Expo Go** app on your physical device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### Option 2: iOS Simulator (macOS only)
1. Install Xcode from the App Store
2. Start the simulator:
   ```bash
   npm run ios
   # or press 'i' in the Expo CLI
   ```

### Option 3: Android Emulator
1. Install [Android Studio](https://developer.android.com/studio)
2. Set up an Android Virtual Device (AVD)
3. Start the emulator:
   ```bash
   npm run android
   # or press 'a' in the Expo CLI
   ```

## Development Tools

### Useful Commands
```bash
# Start development server
npm start

# Start with specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser

# Clear cache and restart
npx expo start --clear
```

### Debugging
- **React Native Debugger**: Install from https://github.com/jhen0409/react-native-debugger
- **Flipper**: For advanced debugging (optional)
- **Expo DevTools**: Available in Expo Go app

## Project Structure

```
liner-vac-login/
├── App.tsx                 # Main app entry point
├── app.json                # Expo configuration
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation setup
│   ├── stores/             # State management (Zustand)
│   ├── services/           # External services
│   └── constants/          # Constants and config
└── assets/                 # Images, fonts, etc.
```

## Configuration Files

### babel.config.js
Babel configuration for Expo. Includes React Native Reanimated plugin.

### metro.config.js
Metro bundler configuration for React Native.

### tsconfig.json
TypeScript configuration extending Expo's base config.

### app.json
Expo app configuration including:
- App name, version, orientation
- iOS/Android specific settings
- Permissions (camera, notifications)
- Plugins (expo-camera, expo-notifications)

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Cache Issues
```bash
npx expo start --clear
# or
rm -rf node_modules/.cache
```

#### 2. Dependency Conflicts
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 3. TypeScript Errors
```bash
npx tsc --noEmit
```

#### 4. Expo CLI Not Found
```bash
npm install -g expo-cli
# or use npx expo instead
```

#### 5. Android Build Issues
- Ensure Android SDK is installed
- Set ANDROID_HOME environment variable
- Check Java version (JDK 8+)

#### 6. iOS Build Issues (macOS only)
- Ensure Xcode is installed
- Run `sudo xcode-select --switch /Applications/Xcode.app`
- Install CocoaPods: `sudo gem install cocoapods`

## Environment Variables

Create a `.env` file in the root directory for environment-specific variables:
```
MQTT_URL=wss://mqtt.linervac.com/mqtt
MQTT_PORT=443
```

## Next Steps

1. **Review the Code**: Explore `src/` directory to understand the app structure
2. **Read README.md**: Check the main README for app-specific documentation
3. **Start Developing**: Make changes and see them hot-reload in Expo Go
4. **Test on Devices**: Test on both iOS and Android devices

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## Support

For issues specific to this project, check:
- Project README.md
- GitHub issues (if applicable)
- Contact: support@linervac.com

---

**Setup completed successfully!** 🎉

You can now start developing by running `npm start`.

