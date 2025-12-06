#!/bin/bash

# Wireless ADB Connection Script
# Helps connect to Android device wirelessly

echo "📶 Wireless ADB Connection Helper"
echo ""

# Check if IP and port provided
if [ -z "$1" ]; then
  echo "Usage: ./connect-wireless.sh IP:PORT"
  echo "Example: ./connect-wireless.sh 192.168.1.100:5555"
  echo ""
  echo "To find your phone's IP and port:"
  echo "1. Settings → Developer Options → Wireless debugging"
  echo "2. Note the IP address and port shown"
  exit 1
fi

DEVICE="$1"

echo "Connecting to $DEVICE..."
echo ""

# Kill and restart ADB server
echo "Restarting ADB server..."
adb kill-server
sleep 1
adb start-server
sleep 2

# Connect to device
echo "Connecting to device..."
adb connect "$DEVICE"

# Wait a moment
sleep 2

# Check connection
echo ""
echo "Checking connection..."
adb devices -l

echo ""
if adb devices | grep -q "$DEVICE.*device"; then
  echo "✅ Successfully connected!"
  echo ""
  echo "You can now run:"
  echo "  npm run android:dev"
  echo "  or"
  echo "  npm start"
else
  echo "❌ Connection failed"
  echo ""
  echo "Troubleshooting:"
  echo "1. Make sure phone and computer are on same Wi-Fi"
  echo "2. Check IP address and port are correct"
  echo "3. Verify 'Wireless debugging' is enabled on phone"
  echo "4. Try disconnecting and reconnecting on phone"
fi




