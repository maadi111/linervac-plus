# MQTT Connection Fixes

## Issues Fixed

### 1. "AMQJS0011E Invalid state not connecting or connected" Error

**Problem**: The paho-mqtt client was trying to connect when it was already in a connecting or connected state, or when the client was in an invalid state.

**Solution**:
- Added proper state checking before attempting to connect
- Check if client is already connected using `client.isConnected()`
- Disconnect existing client before creating a new one if needed
- Better error handling and state management
- Prevent multiple simultaneous connection attempts

### 2. Control Buttons Not Working

**Problem**: Control buttons were disabled when MQTT wasn't connected, and commands weren't being sent properly.

**Solution**:
- Improved `sendCommand` function to:
  - Check if client exists and is connected
  - Automatically attempt to reconnect if connection is lost
  - Better error handling with automatic reconnection
  - Validate connection state before sending commands
- Updated HomeScreen to only disable buttons when not connected AND no active unit
- Added connection state monitoring

## Changes Made

### `src/stores/mqttStore.ts`

1. **Enhanced `connect()` function**:
   - Checks if already connected before attempting new connection
   - Disconnects existing client if it exists but isn't connected
   - Better error handling with try-catch blocks
   - Proper state management throughout connection process

2. **Improved `sendCommand()` function**:
   - Validates client exists and is connected before sending
   - Automatically attempts to reconnect if connection is lost
   - Better error messages and logging
   - Handles connection state checking

### `src/screens/HomeScreen.tsx`

1. **Connection management**:
   - Only attempts to connect if not already connected
   - Monitors connection state with useEffect

2. **Button state**:
   - Buttons disabled only when not connected OR no active unit
   - Better user feedback

## Testing

After these fixes:

1. **MQTT Connection**:
   - Should connect without "Invalid state" errors
   - Should handle reconnection automatically
   - Should prevent duplicate connection attempts

2. **Control Buttons**:
   - Should work when MQTT is connected
   - Should show disabled state when not connected
   - Should automatically attempt to reconnect if connection is lost

## If Issues Persist

1. **Clear app data** and restart
2. **Check MQTT broker URL** in `src/constants/mqtt.ts`
3. **Check network connection** - ensure device can reach `wss://mqtt.linervac.com/mqtt`
4. **Check console logs** for detailed error messages

