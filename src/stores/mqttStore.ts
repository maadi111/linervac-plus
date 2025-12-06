import { create } from "zustand"
import { Client, Message } from "paho-mqtt"
import { MQTT_CONFIG, MQTT_TOPICS, MQTT_COMMANDS } from "../constants/mqtt"

interface MqttState {
  client: Client | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  lastMessage: { topic: string; payload: string } | null
  pendingCommands: Map<string, number> // Track recently sent commands to ignore echo responses

  // Actions
  connect: () => void
  disconnect: () => void
  subscribeToUnit: (uuid: string) => void
  unsubscribeFromUnit: (uuid: string) => void
  sendCommand: (uuid: string, command: "vacuum" | "waterValve" | "camera" | "fan" | "reed" | "shutdown" | "resume", value: boolean) => void
  requestStatus: (uuid: string) => void
  requestAnalytics: (uuid: string) => void
  requestFirmware: (uuid: string) => void
  subscribeToTopic: (topic: string) => void
  unsubscribeFromTopic: (topic: string) => void
}

export const useMqttStore = create<MqttState>((set, get) => ({
  client: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  lastMessage: null,
  pendingCommands: new Map<string, number>(), // Map of "uuid/command" -> timestamp

  connect: () => {
    const { client, isConnected, isConnecting } = get()

    // If already connected, return early
    if (isConnected && client) {
      console.log("MQTT already connected")
      return
    }

    // If connecting, don't start another connection
    if (isConnecting) {
      console.log("MQTT connection already in progress")
      return
    }

    // If client exists but not connected, disconnect it first
    if (client) {
      try {
        if (client.isConnected()) {
          console.log("MQTT client exists and is connected")
          return
        }
        // Disconnect existing client before creating new one
        client.disconnect()
      } catch (error) {
        console.log("Error disconnecting existing client:", error)
      }
    }

    set({ isConnecting: true, error: null, client: null, isConnected: false })

    const clientId = `${MQTT_CONFIG.clientIdPrefix}${Date.now()}`
    
    // Extract host and path from WebSocket URL
    // Parse URL safely for React Native compatibility
    let host: string
    let path: string
    let port: number
    
    try {
      const url = new URL(MQTT_CONFIG.brokerUrl)
      host = url.hostname
      path = url.pathname || "/mqtt"
      port = MQTT_CONFIG.port
    } catch (error) {
      // Fallback parsing if URL constructor fails
      const match = MQTT_CONFIG.brokerUrl.match(/wss?:\/\/([^\/]+)(\/.*)?/)
      if (match) {
        host = match[1].split(':')[0]
        path = match[2] || "/mqtt"
        port = MQTT_CONFIG.port
      } else {
        set({ error: "Invalid MQTT broker URL", isConnecting: false })
        return
      }
    }

    try {
      const mqttClient = new Client(host, port, path, clientId)

      mqttClient.onConnectionLost = (responseObject) => {
        console.log("MQTT Connection Lost:", responseObject.errorMessage)
        set({ isConnected: false, client: null, error: responseObject.errorMessage })
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          const { isConnected } = get()
          if (!isConnected) {
            console.log("Attempting to reconnect to MQTT...")
            get().connect()
          }
        }, MQTT_CONFIG.reconnectPeriod)
      }

      mqttClient.onMessageArrived = (message: Message) => {
        const topic = message.destinationName
        const payload = message.payloadString
        console.log(`MQTT Message: ${topic} -> ${payload}`)

        // Store last message for debugging/monitoring
        set({ lastMessage: { topic, payload } })

        // Lazy import to avoid circular dependency
        const { useUnitsStore } = require("./unitsStore")
        const { units, getActiveUnit } = useUnitsStore.getState()
        const activeUnit = getActiveUnit()
        
        if (!activeUnit) return

        const { updateUnitStatus } = useUnitsStore.getState()
        const { pendingCommands } = get()
        const now = Date.now()
        const IGNORE_DURATION = 3000

        // Helper to check if command was recently sent
        const checkPending = (cmd: string) => {
          const timestamp = pendingCommands.get(cmd)
          return timestamp && (now - timestamp) < IGNORE_DURATION
        }

        // Parse boolean values (Node-RED sends "true"/"false" strings or booleans)
        const parseBool = (val: any) => val === true || val === "true" || val === 1 || val === "1"

        // Handle different topic patterns from Node-RED
        switch (topic) {
          // Camera control and state
          case MQTT_TOPICS.camera.set:
          case MQTT_TOPICS.camera.state:
            if (!checkPending("camera")) {
              const cameraOn = parseBool(payload)
              updateUnitStatus(activeUnit.id, { 
                cameraOn,
                cameraState: cameraOn ? "ON" : "OFF"
              })
            }
            break

          // Fan control and state
          case MQTT_TOPICS.fan.set:
          case MQTT_TOPICS.fan.state:
            if (!checkPending("fan")) {
              const fanOn = parseBool(payload)
              updateUnitStatus(activeUnit.id, { fanOn })
            }
            break

          // Water valve control and state
          case MQTT_TOPICS.valve.set:
          case MQTT_TOPICS.valve.state:
            if (!checkPending("waterValve")) {
              const valveOn = parseBool(payload)
              updateUnitStatus(activeUnit.id, { waterValveOn: valveOn })
            }
            break

          // Reed switch state (from Node-RED: "open"/"closed")
          case MQTT_TOPICS.reed.state:
            const reedClosed = payload === "closed"
            updateUnitStatus(activeUnit.id, {
              reedState: payload as "open" | "closed",
              reedSwitchClosed: reedClosed,
              reedSwitchTriggered: reedClosed,
            })
            break

          // System status (LOCKOUT/NORMAL/CLEARED)
          case MQTT_TOPICS.system.status:
            updateUnitStatus(activeUnit.id, {
              systemStatus: payload as any,
              powerLockout: payload === "LOCKOUT",
            })
            break

          // Network status (e.g., "WiFi (192.168.1.242)")
          case MQTT_TOPICS.system.network:
            // Parse network status: "WiFi (192.168.1.242)" or "GSM (10.0.0.1)"
            const networkMatch = payload.match(/^(WiFi|GSM|Unknown)\s*\(([^)]+)\)/)
            if (networkMatch) {
              updateUnitStatus(activeUnit.id, {
                networkStatus: payload,
                networkActive: networkMatch[1] as any,
                networkIP: networkMatch[2],
              })
            } else {
              updateUnitStatus(activeUnit.id, { networkStatus: payload })
            }
            break

          // Data usage
          case MQTT_TOPICS.data.usage:
            const dataUsage = parseFloat(payload) || 0
            updateUnitStatus(activeUnit.id, { dataUsageMB: dataUsage })
            break

          // Device UUID
          case MQTT_TOPICS.system.uuid:
            // Node-RED sends UUID on startup
            console.log(`Device UUID received: ${payload}`)
            break

          default:
            console.log(`Unhandled MQTT topic: ${topic}`)
        }
      }

      const connectOptions = {
        timeout: MQTT_CONFIG.connectTimeout / 1000, // Convert to seconds
        keepAliveInterval: 60,
        cleanSession: true,
        useSSL: true,
        onSuccess: () => {
          console.log("MQTT Connected successfully")
          set({ isConnected: true, isConnecting: false, client: mqttClient, error: null })

          // Subscribe to test topic
          try {
            mqttClient.subscribe(MQTT_TOPICS.test)
            console.log("Subscribed to test topic")
          } catch (error) {
            console.error("Failed to subscribe to test topic:", error)
          }

          // Subscribe to all bound units (lazy import to avoid circular dependency)
          const { useUnitsStore } = require("./unitsStore")
          const units = useUnitsStore.getState().units
          units.forEach((unit) => {
            get().subscribeToUnit(unit.uuid)
          })

          // Request initial status for all units
          units.forEach((unit) => {
            // Request status after a short delay to ensure subscription is active
            setTimeout(() => {
              get().requestStatus(unit.uuid)
              get().requestAnalytics(unit.uuid)
            }, 1000)
          })
        },
        onFailure: (error: Error) => {
          console.error("MQTT Connection Failed:", error)
          set({ error: error.message || "Connection failed", isConnecting: false, client: null, isConnected: false })
        },
      }

      // Store client before connecting
      set({ client: mqttClient })
      
      // Connect with error handling
      try {
        mqttClient.connect(connectOptions)
      } catch (error: any) {
        console.error("Error starting MQTT connection:", error)
        set({ error: error.message || "Failed to start connection", isConnecting: false, client: null })
      }
    } catch (error: any) {
      console.error("Error creating MQTT client:", error)
      set({ error: error.message || "Failed to create client", isConnecting: false, client: null })
    }
  },

  disconnect: () => {
    const { client } = get()
    if (client) {
      client.disconnect()
      set({ client: null, isConnected: false })
    }
  },

  subscribeToUnit: (uuid: string) => {
    const { client, isConnected } = get()
    if (client && isConnected) {
      try {
        // Subscribe to all control and status topics (flat structure from Node-RED)
        client.subscribe(MQTT_TOPICS.camera.set)
        client.subscribe(MQTT_TOPICS.camera.state)
        client.subscribe(MQTT_TOPICS.fan.set)
        client.subscribe(MQTT_TOPICS.fan.state)
        client.subscribe(MQTT_TOPICS.valve.set)
        client.subscribe(MQTT_TOPICS.valve.state)
        client.subscribe(MQTT_TOPICS.reed.state)
        client.subscribe(MQTT_TOPICS.reed.sim)
        client.subscribe(MQTT_TOPICS.led.set)
        client.subscribe(MQTT_TOPICS.shutdown)
        client.subscribe(MQTT_TOPICS.resume)
        client.subscribe(MQTT_TOPICS.system.status)
        client.subscribe(MQTT_TOPICS.system.network)
        client.subscribe(MQTT_TOPICS.data.usage)
        console.log(`Subscribed to all LinerVac topics`)
      } catch (error) {
        console.error(`Failed to subscribe to topics:`, error)
      }
    } else {
      console.warn("MQTT not connected, cannot subscribe")
    }
  },

  unsubscribeFromUnit: (uuid: string) => {
    const { client, isConnected } = get()
    if (client && isConnected) {
      try {
        client.unsubscribe(MQTT_TOPICS.camera.set)
        client.unsubscribe(MQTT_TOPICS.fan.set)
        client.unsubscribe(MQTT_TOPICS.valve.set)
        client.unsubscribe(MQTT_TOPICS.reed.state)
        console.log(`Unsubscribed from topics`)
      } catch (error) {
        console.error(`Failed to unsubscribe:`, error)
      }
    }
  },

  sendCommand: (uuid: string, command: "vacuum" | "waterValve" | "camera" | "shutdown", value: boolean) => {
    const { client, isConnected } = get()
    
    if (!client) {
      console.warn("MQTT client not available, attempting to connect...")
      get().connect()
      return
    }

    if (!isConnected) {
      console.warn("MQTT not connected, attempting to connect...")
      get().connect()
      return
    }

    // Check if client is actually connected
    try {
      if (!client.isConnected()) {
        console.warn("MQTT client reports not connected, attempting to reconnect...")
        set({ isConnected: false })
        get().connect()
        return
      }
    } catch (error) {
      console.warn("Error checking connection status:", error)
      set({ isConnected: false })
      get().connect()
      return
    }

    let topic: string
    let payload: string

    switch (command) {
      case "camera":
        topic = MQTT_TOPICS.camera.set
        payload = value ? "true" : "false"
        break
      case "fan":
        topic = MQTT_TOPICS.fan.set
        payload = value ? "true" : "false"
        break
      case "waterValve":
        topic = MQTT_TOPICS.valve.set
        payload = value ? "true" : "false"
        break
      case "reed":
        topic = MQTT_TOPICS.reed.sim
        payload = value ? "true" : "false"
        break
      case "shutdown":
        topic = MQTT_TOPICS.shutdown
        payload = MQTT_COMMANDS.SHUTDOWN
        break
      case "resume":
        topic = MQTT_TOPICS.resume
        payload = MQTT_COMMANDS.RESUME
        break
      default:
        console.error("Unknown command:", command)
        return
    }

    try {
      const message = new Message(payload)
      message.destinationName = topic
      client.send(message)
      console.log(`Sent command: ${topic} -> ${payload}`)
      
      // Track this command to ignore echo responses for 3 seconds
      const commandKey = `${uuid}/${command}`
      const { pendingCommands } = get()
      const newPendingCommands = new Map(pendingCommands)
      newPendingCommands.set(commandKey, Date.now())
      set({ pendingCommands: newPendingCommands })
      
      // Clean up old pending commands after 4 seconds
      setTimeout(() => {
        const { pendingCommands: currentPending } = get()
        const cleaned = new Map(currentPending)
        cleaned.delete(commandKey)
        set({ pendingCommands: cleaned })
      }, 4000)
    } catch (error) {
      console.error(`Failed to send command: ${topic}:`, error)
      // Try to reconnect on send failure
      set({ isConnected: false })
      get().connect()
    }
  },

  requestStatus: (uuid: string) => {
    // Node-RED doesn't have explicit status request - status comes via state topics
    console.log(`Status updates come automatically via state topics`)
  },

  requestAnalytics: (uuid: string) => {
    // Node-RED doesn't have analytics topics yet
    console.log(`Analytics not implemented in Node-RED flow`)
  },

  requestFirmware: (uuid: string) => {
    // Node-RED doesn't have firmware topics yet  
    console.log(`Firmware info not implemented in Node-RED flow`)
  },

  subscribeToTopic: (topic: string) => {
    const { client, isConnected } = get()
    if (client && isConnected) {
      try {
        client.subscribe(topic)
        console.log(`Subscribed to topic: ${topic}`)
      } catch (error) {
        console.error(`Failed to subscribe to topic ${topic}:`, error)
      }
    } else {
      console.warn("MQTT not connected, cannot subscribe")
    }
  },

  unsubscribeFromTopic: (topic: string) => {
    const { client, isConnected } = get()
    if (client && isConnected) {
      try {
        client.unsubscribe(topic)
        console.log(`Unsubscribed from topic: ${topic}`)
      } catch (error) {
        console.error(`Failed to unsubscribe from topic ${topic}:`, error)
      }
    }
  },
}))
