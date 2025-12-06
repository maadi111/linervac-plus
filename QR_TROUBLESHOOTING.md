# QR Code Troubleshooting Guide

If scanning the QR code doesn't open the app, try these solutions:

## 1. Check Expo Go Installation

### Android:
- Open Google Play Store
- Search for "Expo Go"
- Install or update to the latest version
- Make sure it's version compatible with SDK 54

### iOS:
- Open App Store
- Search for "Expo Go"
- Install or update to the latest version

## 2. Network Connection

**Important**: Your phone and computer must be on the **same Wi-Fi network**.

### Check:
1. Your computer IP: `10.25.24.234` (shown in QR code)
2. Make sure your phone is connected to the same Wi-Fi network
3. Try disabling VPN on either device if active

### Test Connection:
- On your phone, open a browser and try: `http://10.25.24.234:8081`
- If it loads, the network is fine
- If not, check firewall settings

## 3. Manual Connection Method

Instead of scanning, you can manually enter the URL in Expo Go:

1. Open **Expo Go** app on your phone
2. Tap **"Enter URL manually"** or **"Connection"**
3. Enter: `exp://10.25.24.234:8081`
4. Tap **Connect**

## 4. Alternative: Use Tunnel Mode

If same network doesn't work, use Expo's tunnel:

```bash
npx expo start --tunnel
```

This creates a public URL that works from anywhere (slower but more reliable).

## 5. Check Firewall

Your computer's firewall might be blocking port 8081:

### Linux (UFW):
```bash
sudo ufw allow 8081
```

### Or temporarily disable firewall to test

## 6. Try Different QR Code Scanner

- **Android**: Use Expo Go's built-in scanner (not Camera app)
- **iOS**: Use Camera app or Expo Go's scanner
- Some QR scanners don't recognize Expo URLs properly

## 7. Restart Everything

1. Stop the Expo server (Ctrl+C)
2. Clear cache: `npx expo start --clear`
3. Restart: `npm start`
4. Try scanning again

## 8. Check for Errors

Look at the terminal where `npm start` is running. If you see errors like:
- "Unable to resolve module"
- "Network request failed"
- "Connection refused"

Share those errors for further troubleshooting.

## Quick Test Commands

```bash
# Check if server is accessible
curl http://localhost:8081

# Check network interface
ip addr show

# Restart with tunnel (works from anywhere)
npx expo start --tunnel
```

## Still Not Working?

1. Share what happens when you scan:
   - Nothing happens?
   - Opens browser instead?
   - Shows error message?
   - Expo Go opens but shows error?

2. Check Expo Go version matches SDK 54

3. Try the web version first: Press `w` in the terminal, then open `http://localhost:8081` in browser

