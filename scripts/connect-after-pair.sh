#!/bin/bash

# Connect to device after pairing
# Usage: ./connect-after-pair.sh IP:DEBUG_PORT

if [ -z "$1" ]; then
  echo "Usage: ./connect-after-pair.sh IP:DEBUG_PORT"
  echo ""
  echo "After pairing, you need to connect using the DEBUG port."
  echo "Find the debug port in your phone's Wireless debugging settings."
  echo ""
  echo "Example:"
  echo "  ./connect-after-pair.sh 10.25.116.35:45678"
  exit 1
fi

DEBUG_PORT="$1"

echo "Connecting to device at $DEBUG_PORT..."
adb connect "$DEBUG_PORT"

sleep 2

echo ""
echo "Checking connection..."
adb devices -l

if adb devices | grep -q "$DEBUG_PORT.*device"; then
  echo ""
  echo "✅ Successfully connected!"
  echo ""
  echo "You can now run:"
  echo "  npm run android:dev"
  echo "  or"
  echo "  npm start"
else
  echo ""
  echo "❌ Connection failed"
  echo ""
  echo "Make sure:"
  echo "1. You're using the DEBUG port (not pairing port)"
  echo "2. Phone and computer are on same Wi-Fi"
  echo "3. Wireless debugging is still enabled on phone"
fi




