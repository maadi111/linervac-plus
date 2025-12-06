# LinerVac+ Web App API Integration

This document describes the integration between the mobile app and the LinerVac+ web application.

## Base URL
- **Web App**: https://linervac.linervac.com
- **API Base**: https://linervac.linervac.com/api (adjust based on actual API structure)

## Authentication

### Default Credentials
- **Username**: `admin`
- **Password**: `LinerVac1`

### Login Flow
1. User enters credentials in LoginScreen
2. App calls `apiService.login(username, password)`
3. API returns JWT token and refresh token
4. Tokens are stored securely in AsyncStorage
5. User data is synced from API response

## API Endpoints

The following endpoints are configured (adjust based on actual API):

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile

### Units
- `GET /units` - Get all bound units
- `GET /units/:id` - Get unit by ID
- `POST /units/bind` - Bind a new unit
- `DELETE /units/:id/unbind` - Unbind a unit

### Status & Control
- `GET /units/:uuid/status` - Get unit status
- `POST /units/:uuid/command` - Send control command

### Analytics
- `GET /units/:uuid/analytics` - Get unit analytics
- `GET /units/:uuid/history` - Get historical data

### Settings
- `GET /settings` - Get user settings
- `PUT /settings` - Update settings

### Notifications
- `GET /notifications` - Get notifications
- `PUT /notifications/:id/read` - Mark notification as read

## Data Synchronization

### Units Sync
- On app launch, if authenticated, units are synced from API
- When adding/removing units, changes are synced to API
- Local storage is used as fallback if API is unavailable

### Status Updates
- Real-time status updates via MQTT (existing)
- Periodic status sync via API (optional, can be added)

## Implementation Notes

### API Service (`src/services/api.ts`)
- Handles all HTTP requests
- Manages authentication tokens
- Provides error handling and retry logic
- Supports offline mode with local storage fallback

### Auth Store (`src/stores/authStore.ts`)
- Integrated with API service
- Handles login/logout
- Manages user session

### Units Store (`src/stores/unitsStore.ts`)
- Syncs units with API when authenticated
- Falls back to local storage if API unavailable
- Automatically syncs when adding/removing units

## Configuration

Update `src/constants/api.ts` to match your actual API structure:
- Adjust `baseUrl` if different
- Update `apiPath` based on your API routing
- Modify endpoints to match your API specification

## Testing

1. Use the "Use Test Credentials" button in LoginScreen for quick testing
2. Credentials are pre-filled: `admin` / `LinerVac1`
3. Check console logs for API request/response details

## Error Handling

- Network errors are caught and displayed to user
- API errors return error messages
- Local storage fallback ensures app works offline
- Token refresh handles expired sessions

## Next Steps

1. Verify actual API endpoints match the configured ones
2. Adjust API response format mapping if needed
3. Add additional sync functionality as required
4. Implement periodic background sync if needed

