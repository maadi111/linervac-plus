# MQTT Integration Summary

## Overview

The LinerVac+ mobile app uses **MQTT (Message Queuing Telemetry Transport)** as the primary communication protocol for all data access and device control. All interactions with units happen through the MQTT broker at `wss://mqtt.linervac.com/mqtt`.

## ✅ What's Implemented

### 1. **Complete MQTT Connection Management**
- ✅ Automatic connection on app launch
- ✅ Auto-reconnection on connection loss
- ✅ Connection status monitoring
- ✅ Error handling and recovery

### 2. **Data Access via MQTT**
- ✅ **Real-time Status Updates**: Automatically receives status changes
- ✅ **Analytics Data**: Session hours, lifetime hours, data usage
- ✅ **System Status**: LOCKOUT, NORMAL, SHUTDOWN states
- ✅ **Network Information**: WiFi status, IP addresses
- ✅ **Firmware Version**: Device firmware information
- ✅ **Periodic Refresh**: Auto-refreshes data every 30 seconds

### 3. **Control Commands via MQTT**
- ✅ **Vacuum Control**: Turn on/off via MQTT
- ✅ **Water Valve Control**: Turn on/off via MQTT
- ✅ **Camera Control**: Turn on/off via MQTT
- ✅ **Fan Control**: Turn on/off via MQTT
- ✅ **Reed Switch Control**: Control via MQTT
- ✅ **Shutdown Command**: Emergency shutdown via MQTT
- ✅ **Resume Operation**: Resume system via MQTT

### 4. **Automatic Subscription**
- ✅ Subscribes to all topics when unit is bound
- ✅ Unsubscribes when unit is removed
- ✅ Re-subscribes on reconnection

### 5. **Data Request Methods**
- ✅ `requestStatus(uuid)` - Request complete status
- ✅ `requestAnalytics(uuid)` - Request usage analytics
- ✅ `requestFirmware(uuid)` - Request firmware info
- ✅ Manual refresh buttons in UI

## MQTT Topic Structure

```
linervac/{uuid}/{type}
```

### Control Topics (Publish)
- `linervac/{uuid}/vacuum` - Control vacuum
- `linervac/{uuid}/water_valve` - Control water valve
- `linervac/{uuid}/camera` - Control camera
- `linervac/{uuid}/fan` - Control fan
- `linervac/{uuid}/reed` - Control reed switch
- `linervac/{uuid}/shutdown` - Shutdown command
- `linervac/{uuid}/resume` - Resume command

### Status Topics (Subscribe)
- `linervac/{uuid}/status` - Complete status (JSON)
- `linervac/{uuid}/system_status` - System status
- `linervac/{uuid}/network_status` - Network info
- `linervac/{uuid}/vacuum` - Vacuum state
- `linervac/{uuid}/water_valve` - Water valve state
- `linervac/{uuid}/camera` - Camera state
- `linervac/{uuid}/fan` - Fan state
- `linervac/{uuid}/reed` - Reed switch state
- `linervac/{uuid}/reed_switch` - Reed switch trigger
- `linervac/{uuid}/analytics` - Usage analytics
- `linervac/{uuid}/firmware` - Firmware version

## Data Flow

### Receiving Data
1. App connects to MQTT broker
2. Subscribes to all relevant topics for bound units
3. Receives real-time updates via `onMessageArrived`
4. Automatically updates UI when data changes
5. Periodic refresh requests every 30 seconds

### Sending Commands
1. User interacts with control (toggle/button)
2. App publishes command to MQTT topic
3. Device receives and executes command
4. Device publishes status update
5. App receives update and reflects in UI

## Features

### Automatic Data Sync
- ✅ Status updates received in real-time
- ✅ Analytics data fetched automatically
- ✅ System status monitored continuously
- ✅ Network status tracked

### Manual Refresh
- ✅ "Refresh Data" button in UnitInfoScreen
- ✅ Pull-to-refresh capability (can be added)
- ✅ On-screen-focus refresh

### Connection Management
- ✅ Visual connection indicator
- ✅ Auto-reconnect on failure
- ✅ Error messages displayed
- ✅ Graceful degradation when offline

## Usage Examples

### Request Status
```typescript
const { requestStatus } = useMqttStore()
requestStatus(unit.uuid)
```

### Send Control Command
```typescript
const { sendCommand } = useMqttStore()
sendCommand(unit.uuid, "vacuum", true) // Turn on
sendCommand(unit.uuid, "waterValve", false) // Turn off
```

### Request Analytics
```typescript
const { requestAnalytics } = useMqttStore()
requestAnalytics(unit.uuid)
```

## Benefits

1. **Real-time Updates**: No polling needed, instant updates
2. **Efficient**: Only receives data when it changes
3. **Reliable**: MQTT handles connection management
4. **Scalable**: Can handle multiple units efficiently
5. **Standard Protocol**: Industry-standard MQTT protocol

## Testing

1. Check connection status in HomeScreen header
2. Monitor console logs for MQTT messages
3. Use controls and verify commands are sent
4. Verify status updates appear in real-time
5. Test reconnection by toggling network

## Next Steps (Optional Enhancements)

- [ ] Add MQTT authentication if required
- [ ] Implement QoS levels for critical commands
- [ ] Add message persistence for offline scenarios
- [ ] Implement topic wildcards for bulk operations
- [ ] Add MQTT connection metrics/analytics

