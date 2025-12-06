#!/bin/bash

# Fix "device offline" issue

echo "🔧 Fixing Offline Device Issue"
echo ""

# Get the device address
DEVICE=$(adb devices | grep -E "10\.25\.116\.35" | awk '{print $1}')

if [ -z "$DEVICE" ]; then
  echo "No device found. Please connect first:"
  echo "  adb connect 10.25.116.35:PORT"
  exit 1
fi

echo "Found device: $DEVICE"
echo ""

# Disconnect
echo "Disconnecting..."
adb disconnect "$DEVICE" 2>/dev/null

# Kill and restart ADB
echo "Restarting ADB server..."
adb kill-server
sleep 2
adb start-server
sleep 2

# Reconnect
echo "Reconnecting to $DEVICE..."
adb connect "$DEVICE"

sleep 3

# Check status
echo ""
echo "Checking device status..."
adb devices -l

if adb devices | grep -q "$DEVICE.*device$"; then
  echo ""
  echo "✅ Device is now online!"
  echo ""
  echo "You can now run:"
  echo "  npm run android:dev"
else
  echo ""
  echo "❌ Device still offline"
  echo ""
  echo "Try these steps on your phone:"
  echo "1. Go to Wireless debugging settings"
  echo "2. Toggle OFF and ON 'Wireless debugging'"
  echo "3. Note the NEW debug port"
  echo "4. Run: adb connect 10.25.116.35:NEW_PORT"
  echo ""
  echo "Or use Expo Go (no ADB needed):"
  echo "  npm start"
fi



