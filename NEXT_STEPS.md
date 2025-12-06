# Next Steps - LinerVac+ Mobile App

## ✅ What's Been Completed

1. **UI/UX Redesign**
   - ✅ Dark theme with teal accents
   - ✅ Professional card-based layout
   - ✅ Consistent design across all screens
   - ✅ Single-tap toggle controls

2. **MQTT Integration**
   - ✅ Complete MQTT connection management
   - ✅ All data access via MQTT
   - ✅ All controls via MQTT
   - ✅ Automatic subscriptions and refresh
   - ✅ Real-time status updates

3. **API Integration**
   - ✅ API service layer created
   - ✅ Authentication with web app
   - ✅ Login screen with credentials
   - ✅ Unit synchronization structure

## 🚀 Immediate Next Steps

### 1. Test the App on Device

```bash
# Connect your Android device via USB or wireless ADB
adb devices

# Run the app
npm run android:dev
```

**What to test:**
- [ ] App launches successfully
- [ ] Login screen appears
- [ ] Can login with credentials (admin/LinerVac1)
- [ ] MQTT connection establishes
- [ ] Can bind a unit (QR scan or manual)
- [ ] Controls work (toggle switches)
- [ ] Status updates appear
- [ ] Navigation works smoothly

### 2. Verify MQTT Connection

**Check:**
- Connection status indicator in HomeScreen (should show "Connected")
- Console logs for MQTT messages
- Test topic: `linervac/test`

**If connection fails:**
- Check network connectivity
- Verify MQTT broker URL: `wss://mqtt.linervac.com/mqtt`
- Check firewall/network restrictions
- Review console error messages

### 3. Test API Integration (If Needed)

**If you want to use the web app API:**

1. **Verify API Endpoints**
   - Check `src/constants/api.ts`
   - Update endpoints to match your actual API structure
   - Test login endpoint first

2. **Test Login**
   - Use LoginScreen
   - Credentials: `admin` / `LinerVac1`
   - Check if API responds correctly

3. **Adjust API Structure**
   - If API uses different paths, update `API_CONFIG.apiPath`
   - If endpoints differ, update `API_ENDPOINTS` in `api.ts`
   - Check API response format matches expected structure

### 4. Configure MQTT Topics (If Different)

**If your MQTT topics differ:**

1. Check `src/constants/mqtt.ts`
2. Update topic structure if needed
3. Verify topic format matches your MQTT broker

**Current format:** `linervac/{uuid}/{type}`

### 5. Test All Features

**Core Features:**
- [ ] Login/authentication
- [ ] Unit binding (QR scan and manual)
- [ ] MQTT connection
- [ ] Control toggles (Camera, Reed, Fan, Water Valve)
- [ ] Resume Operation button
- [ ] Shutdown button (5-second hold)
- [ ] Status updates
- [ ] Analytics display
- [ ] Unit switching (if multiple units)
- [ ] Settings screen
- [ ] Logout

## 🔧 Configuration Checklist

### MQTT Configuration
- [ ] Verify broker URL: `wss://mqtt.linervac.com/mqtt`
- [ ] Test connection works
- [ ] Verify topic structure matches your setup
- [ ] Check if authentication is needed

### API Configuration (Optional)
- [ ] Verify base URL: `https://linervac.linervac.com`
- [ ] Update API path if different
- [ ] Test login endpoint
- [ ] Verify response format

### App Configuration
- [ ] Check `app.json` for correct package name
- [ ] Verify permissions are set correctly
- [ ] Check asset files exist (icon, splash)

## 📝 Testing Checklist

### Basic Functionality
- [ ] App installs and launches
- [ ] Welcome screen displays
- [ ] Can navigate to login
- [ ] Can navigate to profile setup
- [ ] Can bind a unit

### MQTT Functionality
- [ ] MQTT connects automatically
- [ ] Connection status shows correctly
- [ ] Can receive status updates
- [ ] Can send control commands
- [ ] Status updates in real-time
- [ ] Reconnection works if connection lost

### Controls
- [ ] Camera toggle works
- [ ] Reed switch toggle works
- [ ] Fan toggle works
- [ ] Water valve toggle works
- [ ] Resume button works
- [ ] Shutdown button works (with 5s hold)

### Data Display
- [ ] Status information displays
- [ ] Analytics data shows
- [ ] Network status shows
- [ ] System status shows
- [ ] Data refreshes automatically

## 🐛 Troubleshooting

### If MQTT Won't Connect
1. Check network connection
2. Verify broker URL is correct
3. Check if firewall blocks WebSocket connections
4. Review console logs for errors
5. Try connecting from web browser to verify broker is accessible

### If Controls Don't Work
1. Check MQTT connection status
2. Verify unit is bound
3. Check console for MQTT send errors
4. Verify topic format matches device expectations
5. Check if device is receiving commands

### If Data Doesn't Update
1. Verify MQTT subscription to topics
2. Check if device is publishing to topics
3. Review console logs for received messages
4. Try manual refresh button
5. Verify topic structure matches

## 📱 Building for Production

### Android APK
```bash
npm run android:build:apk
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Android Bundle (for Play Store)
```bash
npm run android:build:bundle
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS (requires Mac)
```bash
npm run ios:build
```

## 📚 Documentation Files

- `MQTT_DATA_ACCESS.md` - MQTT usage guide
- `MQTT_INTEGRATION_SUMMARY.md` - MQTT overview
- `API_INTEGRATION.md` - API integration guide
- `APP_DESCRIPTION.md` - App description

## 🎯 Priority Actions

1. **Test on device** - Most important!
2. **Verify MQTT connection** - Critical for functionality
3. **Test controls** - Ensure commands work
4. **Check data updates** - Verify real-time updates
5. **Adjust API/endpoints** - If needed for your setup

## 💡 Tips

- Monitor console logs for debugging
- Use the connection status indicator to verify MQTT
- Test with one unit first before adding multiple
- Check network connectivity if MQTT fails
- Use "Refresh Data" button to manually request updates

---

**Ready to test!** Start with `npm run android:dev` and verify everything works. 🚀

