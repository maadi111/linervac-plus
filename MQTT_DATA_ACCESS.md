# MQTT Data Access & Control Guide

This document describes how the app accesses data and controls devices through the MQTT server.

## MQTT Connection

- **Broker URL**: `wss://mqtt.linervac.com/mqtt`
- **Port**: 443
- **Protocol**: WebSocket Secure (WSS)
- **Authentication**: Currently anonymous (can be configured)

## Data Access via MQTT

### Automatic Data Subscription

When a unit is bound, the app automatically subscribes to all relevant MQTT topics:

1. **Status Topics**:
   - `linervac/{uuid}/status` - Complete unit status (JSON)
   - `linervac/{uuid}/system_status` - System status (LOCKOUT, NORMAL, etc.)
   - `linervac/{uuid}/network_status` - Network information

2. **Control State Topics**:
   - `linervac/{uuid}/vacuum` - Vacuum on/off state
   - `linervac/{uuid}/water_valve` - Water valve on/off state
   - `linervac/{uuid}/camera` - Camera on/off state
   - `linervac/{uuid}/fan` - Fan on/off state
   - `linervac/{uuid}/reed` - Reed switch state
   - `linervac/{uuid}/reed_switch` - Reed switch trigger

3. **Analytics Topics**:
   - `linervac/{uuid}/analytics` - Usage statistics, hours, data usage
   - `linervac/{uuid}/firmware` - Firmware version

### Data Request Methods

The app can actively request data via MQTT:

```typescript
// Request complete status
requestStatus(uuid)

// Request analytics data
requestAnalytics(uuid)

// Request firmware info
requestFirmware(uuid)
```

### Automatic Refresh

- **HomeScreen**: Automatically requests status every 30 seconds
- **UnitInfoScreen**: Automatically requests status and analytics every 30 seconds
- **On Connection**: Automatically requests initial data for all units

## Control Commands via MQTT

All control commands are sent through MQTT topics:

### Command Format

Commands are published to control topics with payload values:
- `"1"` or `"ON"` = Turn ON
- `"0"` or `"OFF"` = Turn OFF

### Available Commands

1. **Vacuum Control**:
   - Topic: `linervac/{uuid}/vacuum`
   - Payload: `"1"` (ON) or `"0"` (OFF)

2. **Water Valve Control**:
   - Topic: `linervac/{uuid}/water_valve`
   - Payload: `"1"` (ON) or `"0"` (OFF)

3. **Camera Control**:
   - Topic: `linervac/{uuid}/camera`
   - Payload: `"1"` (ON) or `"0"` (OFF)

4. **Fan Control**:
   - Topic: `linervac/{uuid}/fan`
   - Payload: `"1"` (ON) or `"0"` (OFF)

5. **Reed Switch Control**:
   - Topic: `linervac/{uuid}/reed`
   - Payload: `"1"` (ON/Closed) or `"0"` (OFF/Open)

6. **Shutdown**:
   - Topic: `linervac/{uuid}/shutdown`
   - Payload: `"shutdown"`

7. **Resume Operation**:
   - Topic: `linervac/{uuid}/resume`
   - Payload: `"resume"`

## Data Flow

### Receiving Data

1. App subscribes to MQTT topics when unit is bound
2. MQTT broker sends updates when device state changes
3. App receives messages via `onMessageArrived` callback
4. Status is automatically updated in the units store
5. UI reflects changes immediately

### Sending Commands

1. User interacts with control (toggle, button)
2. App sends MQTT command via `sendCommand()`
3. Command is published to appropriate topic
4. Device receives command and executes
5. Device publishes status update back
6. App receives update and reflects in UI

## Status Update Handling

The app handles various payload formats:

- **Boolean**: `true`/`false`
- **String**: `"1"`/`"0"`, `"ON"`/`"OFF"`, `"closed"`/`"open"`
- **JSON**: Complete status object with all fields

## Connection Management

- **Auto-connect**: Connects automatically on app launch
- **Auto-reconnect**: Attempts to reconnect if connection is lost
- **Status Monitoring**: Connection status displayed in UI
- **Error Handling**: Errors are logged and displayed to user

## Best Practices

1. **Always check connection** before sending commands
2. **Use optimistic updates** for better UX (update UI immediately, sync via MQTT)
3. **Handle offline scenarios** gracefully
4. **Request fresh data** when screen becomes active
5. **Subscribe to all relevant topics** when unit is bound

## Testing MQTT

You can test MQTT connectivity:

1. Check connection status indicator in HomeScreen
2. Monitor console logs for MQTT messages
3. Use test topic: `linervac/test`
4. Send test message: `"hello"`

## Troubleshooting

- **Not receiving updates**: Check subscription to topics
- **Commands not working**: Verify connection status
- **Connection lost**: Check network and broker availability
- **Status not updating**: Verify topic format matches device

