// MQTT Configuration for LinerVac+

// Broker settings come from EXPO_PUBLIC_* env vars (set in .env or EAS secrets/env),
// with the current production broker as the default. Note: EXPO_PUBLIC_* values are
// embedded in the app bundle, so they are NOT secret. Use them for a shared
// app-level broker account restricted by ACLs (see mosquitto-acl.example), and plan
// for per-user credentials/tokens before a wide release.
const brokerUrl = process.env.EXPO_PUBLIC_MQTT_URL || "wss://mqtt.linervac.com/mqtt"

export const MQTT_CONFIG = {
  brokerUrl,
  port: Number(process.env.EXPO_PUBLIC_MQTT_PORT) || 443,
  useSSL: brokerUrl.startsWith("wss://"),
  username: process.env.EXPO_PUBLIC_MQTT_USERNAME || undefined,
  password: process.env.EXPO_PUBLIC_MQTT_PASSWORD || undefined,
  clientIdPrefix: "linervac_app_",
  reconnectPeriod: 5000,
  maxReconnectPeriod: 60000,
  connectTimeout: 30000,
}

export const MQTT_TOPICS = {
  // Base topic prefix
  base: "linervac",

  // Test topics
  test: "linervac/test",

  // Control topics (matching Node-RED flow - simple topics, not UUID-based)
  camera: {
    set: "linervac/camera/set",
    state: "linervac/camera/state",
  },
  fan: {
    set: "linervac/fan/set",
    state: "linervac/fan/state",
  },
  valve: {
    set: "linervac/valve/set",
    state: "linervac/valve/state",
  },
  reed: {
    state: "linervac/reed/state",
    sim: "linervac/reed/sim",
  },
  led: {
    set: "linervac/led/set",
  },
  
  // System control
  shutdown: "linervac/shutdown",
  resume: "linervac/resume",
  
  // Data and status
  data: {
    clear: "linervac/data/clear",
    usage: "linervac/data/usage",
  },
  system: {
    status: "linervac/system/status",
    network: "linervac/network/status",
    uuid: "device/uuid",
  },
}

export const MQTT_COMMANDS = {
  ON: true,
  OFF: false,
  SHUTDOWN: "shutdown",
  RESUME: "resume",
  STATUS_REQUEST: "status",
}
