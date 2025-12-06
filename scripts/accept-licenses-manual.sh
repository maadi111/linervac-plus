#!/bin/bash

# Manual License Acceptance Script
# Run this with: sudo ./scripts/accept-licenses-manual.sh

echo "📜 Accepting Android SDK Licenses"
echo ""

ANDROID_HOME=${ANDROID_HOME:-/usr/lib/android-sdk}

if [ ! -d "$ANDROID_HOME/licenses" ]; then
  echo "Creating licenses directory..."
  mkdir -p "$ANDROID_HOME/licenses"
fi

echo "Creating license files..."
echo ""

# Standard Android SDK License
echo "efa68a6b3c661d18699d5c026771d5911cdc2f83" > "$ANDROID_HOME/licenses/android-sdk-license"

# NDK License (the one that's missing)
echo "24333f8a63b6825ea9c5514f83c2829b004d1fee" > "$ANDROID_HOME/licenses/android-sdk-preview-license"

# Additional common licenses
echo "601085b94cd77f0b54ff86406957099ebe79c4d6" > "$ANDROID_HOME/licenses/android-googletv-license"
echo "33b6a2b64607f17b47f9f6d0b3c23e2d1c67084e" > "$ANDROID_HOME/licenses/android-sdk-arm-dbt-license"
echo "d975f751698a77b662f1254ddbeed3901e976f5a" > "$ANDROID_HOME/licenses/intel-android-extra-license"
echo "8403addf88ab4874007e1c1e80a0025de2550a16" > "$ANDROID_HOME/licenses/google-gdk-license"

echo "✅ License files created!"
echo ""
echo "License files in: $ANDROID_HOME/licenses/"
ls -la "$ANDROID_HOME/licenses/"

echo ""
echo "You can now run:"
echo "  npm run android:dev"



