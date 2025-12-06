"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"

interface MQTTContextType {
  isConnected: boolean
  connectionStatus: "disconnected" | "connecting" | "connected" | "error"
  lastMessage: { topic: string; payload: string } | null
  publish: (topic: string, message: string) => void
  subscribe: (topic: string) => void
  unsubscribe: (topic: string) => void
}

const MQTTContext = createContext<MQTTContextType | null>(null)

const MQTT_URL = "wss://mqtt.linervac.com/mqtt"

export function MQTTProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">(
    "disconnected",
  )
  const [lastMessage, setLastMessage] = useState<{ topic: string; payload: string } | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setConnectionStatus("connecting")

    try {
      const ws = new WebSocket(MQTT_URL)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setConnectionStatus("connected")
        // Subscribe to default topics
        ws.send(JSON.stringify({ type: "subscribe", topic: "linervac/test" }))
        ws.send(JSON.stringify({ type: "subscribe", topic: "linervac/+/status" }))
        ws.send(JSON.stringify({ type: "subscribe", topic: "linervac/+/alert" }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage({ topic: data.topic || "unknown", payload: data.payload || event.data })
        } catch {
          setLastMessage({ topic: "raw", payload: event.data })
        }
      }

      ws.onerror = () => {
        setConnectionStatus("error")
      }

      ws.onclose = () => {
        setIsConnected(false)
        setConnectionStatus("disconnected")
        // Attempt reconnection after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 5000)
      }
    } catch {
      setConnectionStatus("error")
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      wsRef.current?.close()
    }
  }, [connect])

  const publish = useCallback((topic: string, message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "publish", topic, payload: message }))
    }
  }, [])

  const subscribe = useCallback((topic: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "subscribe", topic }))
    }
  }, [])

  const unsubscribe = useCallback((topic: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "unsubscribe", topic }))
    }
  }, [])

  return (
    <MQTTContext.Provider
      value={{
        isConnected,
        connectionStatus,
        lastMessage,
        publish,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </MQTTContext.Provider>
  )
}

export function useMQTT() {
  const context = useContext(MQTTContext)
  if (!context) {
    throw new Error("useMQTT must be used within MQTTProvider")
  }
  return context
}
