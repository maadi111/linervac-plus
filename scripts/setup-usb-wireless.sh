#!/bin/bash

# USB to Wireless ADB Connection Setup
# This script helps you connect via USB first, then switch to wireless

echo "📱 USB to Wireless ADB Setup"
echo ""

# Step 1: Check for USB connection
echo "Step 1: Checking for USB-connected device..."
adb devices -l

USB_DEVICE=$(adb devices | grep -v "List" | grep "device" | head -1 | awk '{print $1}')

if [ -z "$USB_DEVICE" ]; then
    echo ""
    echo "❌ No USB device detected!"
    echo ""
    echo "Please:"
    echo "  1. Connect your Android device via USB cable"
    echo "  2. Enable USB debugging on your device"
    echo "  3. Accept the 'Allow USB debugging?' prompt on your device"
    echo "  4. Run this script again"
    echo ""
    exit 1
fi

echo "✅ USB device detected: $USB_DEVICE"
echo ""

# Step 2: Enable TCP/IP mode
echo "Step 2: Enabling TCP/IP mode on device..."
if adb tcpip 5555; then
    echo "✅ TCP/IP mode enabled on port 5555"
else
    echo "❌ Failed to enable TCP/IP mode"
    exit 1
fi

echo ""
echo "Step 3: Getting device IP address..."
DEVICE_IP=$(adb shell "ip addr show wlan0 | grep 'inet ' | awk '{print \$2}' | cut -d/ -f1" 2>/dev/null)

if [ -z "$DEVICE_IP" ]; then
    DEVICE_IP=$(adb shell "getprop dhcp.wlan0.ipaddress" 2>/dev/null | tr -d '\r')
fi

if [ -z "$DEVICE_IP" ]; then
    echo "⚠️  Could not automatically detect device IP"
    echo ""
    read -p "Enter your device IP address (or press Enter to skip): " DEVICE_IP
fi

if [ -n "$DEVICE_IP" ]; then
    echo "✅ Device IP: $DEVICE_IP"
    echo ""
    echo "Step 4: You can now disconnect USB and connect wirelessly:"
    echo ""
    echo "   adb connect $DEVICE_IP:5555"
    echo ""
    echo "Or use the helper script:"
    echo "   ./scripts/connect-device.sh $DEVICE_IP 5555"
else
    echo ""
    echo "📋 Manual steps:"
    echo "  1. Disconnect USB cable"
    echo "  2. On your device, go to: Settings > About phone > Status"
    echo "     (or Settings > Developer Options > Wireless debugging)"
    echo "  3. Note the IP address"
    echo "  4. Run: adb connect <IP_ADDRESS>:5555"
fi

echo ""
echo "✅ Setup complete! You can now disconnect USB."

