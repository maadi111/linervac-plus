# 📱 iOS Build & Testing Guide - LinerVac+

This guide will help you build and test your LinerVac+ app on iOS devices using GitHub and Expo EAS (Expo Application Services).

---

## 🎯 Overview

**Two Options for iOS:**
1. **EAS Build (Cloud)** - Build on Expo servers (recommended, no Mac needed!)
2. **Local Build** - Build on your Mac (requires macOS, Xcode)

We'll focus on **EAS Build** since it works from Linux/Windows and integrates with GitHub!

---

## 📋 Prerequisites

### Required Accounts
- [x] Apple Developer Account ($99/year) - For production
- [ ] Expo Account (free) - Sign up at https://expo.dev
- [x] GitHub Account (you have this)

### Required Tools
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Check EAS CLI version
eas --version
```

---

## 🚀 Step 1: Setup Expo Account & Project

### 1.1 Login to Expo

```bash
cd /home/maadi/ai_env/liner-vac-login

# Login to Expo (or create account)
eas login
# Enter your email and password

# Verify login
eas whoami
```

### 1.2 Initialize EAS in Your Project

```bash
# Initialize EAS configuration
eas build:configure

# This creates eas.json file
```

### 1.3 Configure `app.json` for iOS

Update your `app.json`:

```json
{
  "expo": {
    "name": "LinerVac+",
    "slug": "linervac-plus",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "linervac",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0F0F0F"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.linervac.plus",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs camera access to view live feed from your LinerVac+ unit.",
        "NSLocationWhenInUseUsageDescription": "Location is used to find nearby devices."
      }
    },
    "android": {
      "package": "com.linervac.plus",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0F0F0F"
      },
      "permissions": [
        "CAMERA",
        "INTERNET"
      ]
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow LinerVac+ to access camera for QR scanning and live feed."
        }
      ]
    ]
  }
}
```

---

## 🔧 Step 2: Configure EAS Build

### 2.1 Review `eas.json`

After running `eas build:configure`, you should have `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "buildType": "app-store"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2.2 Choose Build Profile

- **development**: For testing with Expo Go
- **preview**: For TestFlight/internal testing
- **production**: For App Store submission

---

## 📱 Step 3: Build for iOS

### Option A: Build for Simulator (Testing on Mac)

```bash
# Build for iOS simulator (no Apple Developer account needed!)
eas build --platform ios --profile development

# Wait 10-20 minutes for build to complete
# Download .tar.gz file
# Extract and run in Xcode Simulator
```

### Option B: Build for Physical Device (Internal Testing)

```bash
# Build for TestFlight/Ad-hoc distribution
eas build --platform ios --profile preview

# Follow prompts:
# 1. Enter Apple ID
# 2. Select team
# 3. Generate provisioning profile
# 4. Wait for build (10-20 minutes)
```

### Option C: Build for App Store

```bash
# Build for App Store submission
eas build --platform ios --profile production

# Requires:
# - Apple Developer Program membership
# - App Store Connect setup
# - Certificates and profiles
```

---

## 🔐 Step 4: Apple Developer Setup

### 4.1 Create Apple Developer Account

1. Go to https://developer.apple.com
2. Enroll in Apple Developer Program ($99/year)
3. Complete verification (can take 24-48 hours)

### 4.2 Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in details:
   - **Platform**: iOS
   - **Name**: LinerVac+
   - **Primary Language**: English
   - **Bundle ID**: `com.linervac.plus`
   - **SKU**: `linervac-plus-001`
4. Click **"Create"**

### 4.3 Generate Certificates (EAS handles this!)

```bash
# EAS can automatically manage certificates
eas credentials

# Or manually:
# 1. Distribution Certificate
# 2. Provisioning Profile
# 3. App Store Connect API Key
```

---

## 🔄 Step 5: Setup GitHub Actions (Automated Builds)

### 5.1 Create GitHub Secrets

In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

```
EXPO_TOKEN - Your Expo access token
APPLE_ID - Your Apple ID email
APPLE_APP_SPECIFIC_PASSWORD - App-specific password
```

**Get Expo Token:**
```bash
eas token:create
# Copy the token
```

**Get Apple App-Specific Password:**
1. Go to https://appleid.apple.com
2. Sign in with your Apple ID
3. Go to **Security** → **App-Specific Passwords**
4. Generate new password
5. Copy and save it

### 5.2 Create GitHub Workflow

Create `.github/workflows/ios-build.yml`:

```yaml
name: iOS Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch: # Allow manual trigger

jobs:
  build-ios:
    name: Build iOS App
    runs-on: ubuntu-latest
    
    steps:
      - name: 🏗 Checkout repository
        uses: actions/checkout@v3

      - name: 🏗 Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🚀 Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: 🔨 Build iOS Preview
        run: |
          eas build --platform ios --profile preview --non-interactive --no-wait
          
      - name: 📊 Build Status
        run: echo "Build started! Check Expo dashboard for progress."
```

### 5.3 Push to GitHub

```bash
# Stage all changes
git add .

# Commit changes
git commit -m "Add iOS build configuration and GitHub Actions"

# Push to GitHub
git push origin main

# Check GitHub Actions tab to see build progress
```

---

## 📲 Step 6: Testing on iOS Device

### Method 1: TestFlight (Recommended)

**Setup:**
1. Build completes on EAS
2. EAS provides download link or submits to TestFlight
3. Install TestFlight app on iPhone (App Store)
4. Receive invite via email
5. Open TestFlight → Install LinerVac+

**Commands:**
```bash
# Build and submit to TestFlight
eas build --platform ios --profile preview --auto-submit

# Check submission status
eas submission:list
```

### Method 2: Direct Install (Development)

**Setup:**
1. Register device UDID in Apple Developer
2. Build with ad-hoc profile
3. Install via link

**Get Device UDID:**
```bash
# On Mac with iPhone connected:
eas device:create

# Or via Settings → General → About → tap on Serial Number
```

### Method 3: Expo Go (Quick Testing)

**For development testing only:**

```bash
# Start Expo dev server
npx expo start --ios

# Scan QR code with iPhone camera
# Opens in Expo Go app (install from App Store)
```

---

## 🧪 Step 7: Testing the App

### 7.1 Install on iPhone

**Via TestFlight:**
1. Open TestFlight app
2. Tap LinerVac+ → Install
3. Wait for download
4. Open app from home screen

**Via Direct Link:**
1. Open EAS build link on iPhone
2. Tap Install
3. Go to Settings → General → VPN & Device Management
4. Trust the developer profile
5. Open app from home screen

### 7.2 Test MQTT Connection

1. **Launch app**
2. **Create profile** (name, email, phone)
3. **Bind unit** (UUID: `D4RWC-Y316`)
4. **Check connection** - Should see green "Connected" badge
5. **Test Camera** - Tap toggle, check Node-RED debug
6. **Test Fan** - Should send MQTT message
7. **Test Water Valve** - Should send MQTT message

### 7.3 Verify All Features

- [ ] MQTT connects successfully
- [ ] All toggles work (Camera, Fan, Valve)
- [ ] Status updates display correctly
- [ ] Reed switch shows correct state
- [ ] System status updates
- [ ] Network status displays
- [ ] Shutdown button works (hold 5s)
- [ ] Camera preview displays (if implemented)
- [ ] Profile management works
- [ ] Unit binding works

---

## 📊 Step 8: Monitor Builds

### EAS Dashboard

Visit: https://expo.dev/accounts/[your-account]/projects/linervac-plus

**Features:**
- Build queue status
- Build logs
- Download artifacts
- Submission status
- Analytics

### GitHub Actions

Visit: https://github.com/[your-username]/[repo-name]/actions

**Features:**
- Workflow runs
- Build logs
- Artifacts
- Trigger manual builds

---

## 🔧 Troubleshooting

### Build Fails: "No bundle identifier"

**Fix:**
```json
// In app.json
"ios": {
  "bundleIdentifier": "com.linervac.plus"
}
```

### Build Fails: "Certificate expired"

**Fix:**
```bash
eas credentials
# Select iOS → Distribution Certificate → Remove
# Build again - EAS will generate new certificate
```

### TestFlight Install Fails

**Fix:**
1. Check Apple Developer account is active
2. Verify app is in "Ready to Test" status
3. Check device is registered (for ad-hoc)
4. Ensure iOS version is supported

### App Crashes on Launch

**Check:**
1. Build logs in EAS dashboard
2. iOS console logs (connect to Mac + Xcode)
3. Missing permissions in Info.plist
4. Native module compatibility

### MQTT Won't Connect on iOS

**Check:**
1. iOS allows WebSocket connections
2. App has internet permission
3. No VPN/firewall blocking
4. Certificate issues (use wss:// not ws://)

---

## 🎯 Quick Start Commands

```bash
# 1. Setup EAS
npm install -g eas-cli
eas login
eas build:configure

# 2. Build for TestFlight
eas build --platform ios --profile preview

# 3. Submit to TestFlight
eas submit --platform ios

# 4. Check build status
eas build:list

# 5. Download build
eas build:download [build-id]

# 6. Setup GitHub Actions
# Create .github/workflows/ios-build.yml
# Add secrets to GitHub
git add . && git commit -m "Add iOS build" && git push
```

---

## 💰 Cost Breakdown

| Service | Cost | Required? |
|---------|------|-----------|
| **Expo EAS** | Free tier: 30 builds/month | ✅ Yes |
| **Apple Developer** | $99/year | ⚠️ For TestFlight/App Store |
| **GitHub Actions** | Free for public repos | ✅ Yes |
| **Expo EAS Pro** | $29/month (optional) | ❌ No |

**Minimum Cost:** $0 for testing (use simulator)
**Production Cost:** $99/year (Apple Developer) + $0 (EAS free tier)

---

## 📝 Pre-Submission Checklist

Before submitting to App Store:

### App Metadata
- [ ] App name: LinerVac+
- [ ] Description (pool maintenance app)
- [ ] Keywords
- [ ] Screenshots (5.5", 6.5" devices)
- [ ] App icon (1024x1024)

### Technical
- [ ] Version number set
- [ ] Build number incremented
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Age rating completed

### Testing
- [ ] Tested on multiple iOS versions
- [ ] Tested on iPhone and iPad
- [ ] All features working
- [ ] No crashes
- [ ] Performance acceptable

### Compliance
- [ ] MQTT server stable
- [ ] Data privacy addressed
- [ ] No prohibited content
- [ ] Follows App Store guidelines

---

## 🎉 Success Criteria

Your iOS app is ready when:
- ✅ Builds successfully on EAS
- ✅ Installs on iPhone via TestFlight
- ✅ MQTT connects and works
- ✅ All controls function properly
- ✅ No crashes or errors
- ✅ GitHub Actions automate builds

---

## 📚 Additional Resources

- **Expo EAS Docs**: https://docs.expo.dev/build/introduction/
- **Apple Developer**: https://developer.apple.com
- **TestFlight Guide**: https://developer.apple.com/testflight/
- **App Store Connect**: https://appstoreconnect.apple.com
- **GitHub Actions**: https://docs.github.com/actions

---

_Good luck with your iOS build! 🍎🚀_

