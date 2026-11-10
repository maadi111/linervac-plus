# LinerVac+ Mobile App

A React Native/Expo mobile application for controlling the LinerVac+ pool vacuum and water-valve automation system.

## Features

- **User Profile & Setup** - Create profile and bind units via QR code or manual UUID entry
- **Home Screen Controls** - Vacuum, Water Valve, Camera, and Safe Home (shutdown) with double-tap protection
- **Live Camera Preview** - 1/3 screen preview with full-screen zoomable view
- **Unit Info & Analytics** - UUID, data usage, power times, session/lifetime hours, firmware version
- **Multiple Units Support** - Up to 5 units with tab switching
- **Notifications** - Reed switch alerts with repeating 15-minute reminders
- **MQTT Integration** - Secure WebSocket connection to an authenticated broker

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for Android Emulator)
- Physical device with Expo Go app (recommended for testing)

## Installation

1. Clone or download this project

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm start
   # or
   npx expo start
   \`\`\`

4. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## Configuration

Copy `.env.example` to `.env` (git-ignored) and adjust. All values are optional.

| Variable | Purpose | Default |
| --- | --- | --- |
| `EXPO_PUBLIC_MQTT_URL` | Broker WebSocket URL | `wss://mqtt.linervac.com/mqtt` |
| `EXPO_PUBLIC_MQTT_USERNAME` / `EXPO_PUBLIC_MQTT_PASSWORD` | Broker credentials | none |
| `EXPO_PUBLIC_ALLOW_LOCAL_AUTH` | Dev builds only: allow a local session if the API login returns 404 | `false` |

`EXPO_PUBLIC_*` values are bundled into the app and are **not secret**. Use a
broker account restricted by ACLs (`mosquitto-acl.example`).

### Broker

`mosquitto-dual-protocol.conf` requires authentication (`allow_anonymous false`)
and binds plain TCP to localhost. Create users with `mosquitto_passwd` and copy
`mosquitto-acl.example` to `/etc/mosquitto/acl`.

### Test Topics

- Subscribe: `linervac/test`
- Publish: `linervac/test` → "hello"

## Project Structure

\`\`\`
├── App.tsx                    # App entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── src/
│   ├── components/            # Reusable components
│   │   ├── ui/                # Base UI components
│   │   ├── ControlButton.tsx  # Double-tap control button
│   │   ├── ShutdownButton.tsx # Safe Home shutdown
│   │   ├── CameraPreview.tsx  # Camera preview widget
│   │   └── UnitSelector.tsx   # Multi-unit tabs
│   ├── constants/             # Theme and config
│   │   ├── theme.ts           # Colors, typography, spacing
│   │   └── mqtt.ts            # MQTT configuration
│   ├── navigation/            # Navigation setup
│   │   ├── RootNavigator.tsx  # Auth/Main flow
│   │   └── MainTabs.tsx       # Bottom tab navigation
│   ├── screens/               # App screens
│   │   ├── auth/              # Welcome, Profile, Bind, QR
│   │   ├── HomeScreen.tsx     # Main control screen
│   │   ├── UnitInfoScreen.tsx # Analytics & info
│   │   ├── SettingsScreen.tsx # User settings
│   │   └── FullCameraScreen.tsx
│   ├── services/              # External services
│   │   └── notifications.ts   # Push notifications
│   ├── stores/                # Zustand state management
│   │   ├── authStore.ts       # User authentication
│   │   ├── unitsStore.ts      # Unit management
│   │   └── mqttStore.ts       # MQTT connection
│   └── types/                 # TypeScript types
│       └── index.ts
└── assets/                    # Images, sounds
\`\`\`

## Building for Production

### iOS

\`\`\`bash
eas build --platform ios
\`\`\`

### Android

\`\`\`bash
eas build --platform android
\`\`\`

## Design Guidelines

- **Colors**: Pool industry aesthetic - blues (#0A4D8C), greys, light tans (#D4B896)
- **Buttons**: Red when off, green when on
- **Warnings**: High-visibility red/yellow pop-ups
- **Controls**: Double-tap to prevent accidental activation; shutdown uses a cancellable 5s countdown

## Support

For help, email: support@linervac.com
