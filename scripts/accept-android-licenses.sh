#!/bin/bash

# Accept Android SDK Licenses

echo "📜 Accepting Android SDK Licenses"
echo ""

# Find sdkmanager
if [ -z "$ANDROID_HOME" ]; then
  echo "❌ ANDROID_HOME not set"
  echo ""
  echo "Set it with:"
  echo "  export ANDROID_HOME=/usr/lib/android-sdk"
  echo "  export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin"
  echo "  export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
  exit 1
fi

echo "ANDROID_HOME: $ANDROID_HOME"
echo ""

# Try to find sdkmanager
SDKMANAGER=""

if [ -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
  SDKMANAGER="$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager"
elif [ -f "$ANDROID_HOME/tools/bin/sdkmanager" ]; then
  SDKMANAGER="$ANDROID_HOME/tools/bin/sdkmanager"
else
  echo "❌ sdkmanager not found"
  echo ""
  echo "Install Android SDK command-line tools:"
  echo "  - Open Android Studio"
  echo "  - Tools → SDK Manager → SDK Tools"
  echo "  - Check 'Android SDK Command-line Tools'"
  echo "  - Apply"
  exit 1
fi

echo "Using: $SDKMANAGER"
echo ""

# Accept all licenses
echo "Accepting all licenses..."
yes | $SDKMANAGER --licenses

echo ""
echo "✅ License acceptance complete!"
echo ""
echo "You can now run:"
echo "  npm run android:dev"



