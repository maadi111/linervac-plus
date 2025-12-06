# Connection Guide - Getting Your App on Your Phone

## Option 1: Manual Connection (Recommended - No Tunnel Needed)

This is the easiest method and doesn't require any special setup:

1. **Start the server** (if not already running):
   ```bash
   npm start
   ```

2. **Open Expo Go app** on your phone

3. **Manual Connection**:
   - Tap the **"Enter URL manually"** button (usually at the bottom)
   - Or tap **"Connection"** tab
   - Enter: `exp://10.25.24.234:8081`
   - Tap **Connect**

This bypasses QR code scanning entirely!

## Option 2: Fix Network Connection (LAN Mode)

If manual connection doesn't work, ensure both devices are on the same network:

1. **Check your computer's IP** (shown in terminal):
   ```
   IP: 10.25.24.234
   Port: 8081
   ```

2. **On your phone**:
   - Make sure you're on the **same Wi-Fi network** as your computer
   - Open a browser and try: `http://10.25.24.234:8081`
   - If this loads, network is fine
   - If not, check firewall (see below)

3. **Check Firewall** (Linux):
   ```bash
   # Allow port 8081
   sudo ufw allow 8081
   # Or check if firewall is active
   sudo ufw status
   ```

4. **Restart Expo**:
   ```bash
   npm start
   ```
   Then try scanning QR code again

## Option 3: Install ngrok for Tunnel Mode (If Needed)

If you want tunnel mode (works from any network), install ngrok:

```bash
# Option A: Install globally (requires sudo)
sudo npm install -g @expo/ngrok@^4.1.0

# Option B: Use npx (no global install needed)
# Just run: npx expo start --tunnel
# It will use the local installation
```

Then run:
```bash
npx expo start --tunnel
```

## Option 4: Use Expo Dev Client (Advanced)

For production-like testing, you can build a development client, but this is more complex.

## Troubleshooting

### "Connection refused" or "Network error"
- ✅ Check both devices on same Wi-Fi
- ✅ Check firewall allows port 8081
- ✅ Try manual connection (Option 1)

### "Unable to resolve module"
- ✅ Clear cache: `npx expo start --clear`
- ✅ Restart server

### QR code doesn't open app
- ✅ Use manual connection instead
- ✅ Make sure Expo Go is installed and updated
- ✅ Check Expo Go version matches SDK 54

## Quick Test

Test if your server is accessible:
1. On your phone's browser, go to: `http://10.25.24.234:8081`
2. If you see a page (even if it's an error), the network is working
3. If you get "connection refused" or timeout, it's a network/firewall issue

## Recommended: Start with Option 1

**Manual connection is the most reliable method!** Just open Expo Go and enter the URL directly.

