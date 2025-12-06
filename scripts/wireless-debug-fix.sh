#!/bin/bash

# Wireless Debugging Connection Fix Script

echo "🔧 Wireless ADB Connection Troubleshooter"
echo ""

# Restart ADB
echo "Restarting ADB server..."
adb kill-server
sleep 1
adb start-server
sleep 2

echo ""
echo "Current paired devices:"
adb devices

echo ""
echo "📱 On your phone, please:"
echo "1. Go to Settings → Developer Options → Wireless debugging"
echo "2. Toggle OFF 'Wireless debugging'"
echo "3. Wait 2 seconds"
echo "4. Toggle ON 'Wireless debugging'"
echo "5. Note the NEW IP address and DEBUG port shown"
echo ""
read -p "Press Enter when you've done this and have the new debug port..."

echo ""
read -p "Enter the new debug port (e.g., 40131): " DEBUG_PORT

if [ -z "$DEBUG_PORT" ]; then
  echo "No port provided. Exiting."
  exit 1
fi

IP="10.25.116.35"
FULL_ADDRESS="$IP:$DEBUG_PORT"

echo ""
echo "Attempting to connect to $FULL_ADDRESS..."

# Try connecting
adb connect "$FULL_ADDRESS"

sleep 3

echo ""
echo "Checking connection..."
adb devices -l

if adb devices | grep -q "$FULL_ADDRESS.*device"; then
  echo ""
  echo "✅ Successfully connected!"
  echo ""
  echo "You can now run:"
  echo "  npm run android:dev"
  echo "  or"
  echo "  npm start"
else
  echo ""
  echo "❌ Still not connected"
  echo ""
  echo "Try these alternatives:"
  echo ""
  echo "Option 1: Traditional method (requires USB once)"
  echo "  1. Connect phone via USB"
  echo "  2. Run: adb tcpip 5555"
  echo "  3. Disconnect USB"
  echo "  4. Run: adb connect $IP:5555"
  echo ""
  echo "Option 2: Use Expo Go (no ADB needed)"
  echo "  1. npm start"
  echo "  2. Scan QR code with Expo Go app"
  echo "  3. Make sure phone and computer on same Wi-Fi"
fi




