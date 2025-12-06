// MQTT Configuration for LinerVac+

export const MQTT_CONFIG = {
  brokerUrl: "wss://mqtt.linervac.com/mqtt",
  port: 443,
  protocol: "wss" as const,
  // Anonymous auth enabled for development
  username: undefined,
  password: undefined,
  clientIdPrefix: "linervac_app_",
  reconnectPeriod: 5000,
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
