#!/bin/bash

# Native Module Setup Script
# This script helps set up native modules for Android and iOS

set -e

echo "🚀 Setting up Native Modules for LinerVac+"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Fix Expo dependencies
echo "🔧 Fixing Expo dependencies..."
npx expo install --fix

# Generate native code
echo "🏗️  Generating native code..."
echo ""
echo "Choose an option:"
echo "1) Clean prebuild (removes existing android/ios folders)"
echo "2) Regular prebuild (keeps existing folders)"
read -p "Enter choice [1-2]: " choice

case $choice in
  1)
    echo "🧹 Cleaning and generating native code..."
    npx expo prebuild --clean
    ;;
  2)
    echo "🏗️  Generating native code..."
    npx expo prebuild
    ;;
  *)
    echo "Invalid choice. Running regular prebuild..."
    npx expo prebuild
    ;;
esac

# iOS setup (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
  if [ -d "ios" ]; then
    echo "🍎 Setting up iOS..."
    cd ios
    if command -v pod &> /dev/null; then
      echo "📦 Installing CocoaPods dependencies..."
      pod install
    else
      echo "⚠️  CocoaPods not found. Install with: sudo gem install cocoapods"
    fi
    cd ..
  fi
else
  echo "ℹ️  Skipping iOS setup (macOS required)"
fi

# Android setup
if [ -d "android" ]; then
  echo "🤖 Android native code generated"
  echo "   To build: cd android && ./gradlew assembleRelease"
fi

echo ""
echo "✅ Native module setup complete!"
echo ""
echo "Next steps:"
echo "  - iOS:   npm run ios:dev"
echo "  - Android: npm run android:dev"
echo "  - Build: eas build --platform all"

