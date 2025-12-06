#!/bin/bash

# ADB Device Connection Helper Script

echo "📱 ADB Device Connection Helper"
echo ""

# Check if device IP is provided
if [ -z "$1" ]; then
    echo "Usage: ./scripts/connect-device.sh <DEVICE_IP> [PORT]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/connect-device.sh 10.25.116.35 35189"
    echo "  ./scripts/connect-device.sh 10.25.116.35"
    echo ""
    exit 1
fi

DEVICE_IP=$1
PORT=${2:-5555}

# Get local network info
LOCAL_IP=$(hostname -I | awk '{print $1}')
LOCAL_SUBNET=$(echo "$LOCAL_IP" | cut -d. -f1-3)
DEVICE_SUBNET=$(echo "$DEVICE_IP" | cut -d. -f1-3)

echo "🔍 Network Information:"
echo "   Your computer: $LOCAL_IP (subnet: $LOCAL_SUBNET.x)"
echo "   Device:        $DEVICE_IP (subnet: $DEVICE_SUBNET.x)"
echo ""

# Check if on same subnet
if [ "$LOCAL_SUBNET" != "$DEVICE_SUBNET" ]; then
    echo "⚠️  NETWORK MISMATCH DETECTED!"
    echo "   Your computer and device are on different networks."
    echo "   This will prevent wireless ADB connection."
    echo ""
    echo "📋 Solutions:"
    echo ""
    echo "   OPTION 1: Connect both to the same Wi-Fi network"
    echo "     1. Make sure your computer and Android device are connected"
    echo "        to the same Wi-Fi network"
    echo "     2. On your device, check the IP address in:"
    echo "        Settings > Developer Options > Wireless debugging"
    echo "     3. Use that IP address with this script"
    echo ""
    echo "   OPTION 2: Use USB connection (Recommended - Most Reliable)"
    echo "     1. Connect your device via USB cable"
    echo "     2. Enable USB debugging on your device"
    echo "     3. Run: adb devices (to verify connection)"
    echo "     4. Run: adb tcpip 5555"
    echo "     5. Disconnect USB"
    echo "     6. Run: adb connect <DEVICE_IP>:5555"
    echo ""
    echo "   OPTION 3: Continue anyway (may not work)"
    read -p "   Continue with connection attempt? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🔍 Checking network connectivity..."
if ping -c 1 -W 2 "$DEVICE_IP" > /dev/null 2>&1; then
    echo "✅ Device is reachable at $DEVICE_IP"
else
    echo "❌ Cannot reach device at $DEVICE_IP"
    if [ "$LOCAL_SUBNET" != "$DEVICE_SUBNET" ]; then
        echo "   ⚠️  Devices are on different networks (see above)"
    else
        echo "   Make sure both devices are on the same Wi-Fi network"
        echo "   Check firewall settings if on same network"
    fi
    echo ""
    echo "💡 Try USB connection instead (see OPTION 2 above)"
    exit 1
fi

echo ""
echo "🔄 Restarting ADB server..."
adb kill-server
sleep 1
adb start-server

echo ""
echo "📡 Attempting to connect to $DEVICE_IP:$PORT..."

# Try direct connect (if already paired)
if adb connect "$DEVICE_IP:$PORT"; then
    sleep 2
    if adb devices | grep -q "$DEVICE_IP"; then
        echo "✅ Successfully connected!"
        echo ""
        echo "Connected devices:"
        adb devices -l
        exit 0
    fi
fi

echo ""
echo "❌ Direct connection failed. Try one of these methods:"
echo ""
echo "METHOD 1: USB Connection (Recommended)"
echo "  1. Connect device via USB"
echo "  2. Run: adb devices (verify it's connected)"
echo "  3. Run: adb tcpip 5555"
echo "  4. Disconnect USB"
echo "  5. Run: adb connect $DEVICE_IP:5555"
echo ""
echo "METHOD 2: Wireless Pairing"
echo "  1. On your device, go to: Settings > Developer Options > Wireless debugging"
echo "  2. Tap 'Pair device with pairing code'"
echo "  3. Get the pairing code and port number"
echo "  4. Run: adb pair $DEVICE_IP:<PAIRING_PORT>"
echo "  5. Enter the pairing code when prompted"
echo "  6. After pairing, run: adb connect $DEVICE_IP:<CONNECTION_PORT>"
echo ""
echo "METHOD 3: Check if already connected"
echo "  Run: adb devices"
echo ""

