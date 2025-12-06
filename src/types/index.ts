// Type definitions for LinerVac+ app

export interface User {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export interface Unit {
  id: string
  uuid: string
  name: string
  bindDate: string
  firmwareVersion: string
  isOnline: boolean
}

export interface UnitStatus {
  vacuumOn: boolean
  waterValveOn: boolean
  cameraOn: boolean
  fanOn: boolean
  reedSwitchTriggered: boolean
  reedSwitchClosed: boolean // Reed closed = ON (N/C reed switch)
  reedState: "open" | "closed" | "unknown" // Text state from Node-RED
  systemStatus: "LOCKOUT" | "NORMAL" | "CLEARED" | "SHUTDOWN" | "ERROR"
  cameraState: string | null
  networkStatus: string | null // e.g., "WiFi (192.168.1.242)"
  networkActive: "WiFi" | "GSM" | "Unknown" | null
  networkIP: string | null
  lastPowerOn: string | null
  lastPowerOff: string | null
  sessionHours: number
  lifetimeHours: number
  dataUsageMB: number
  powerLockout: boolean // 30-second lockout after power outage
}

export interface Notification {
  id: string
  unitId: string
  type: "reed_switch" | "system" | "alert"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export interface ControlState {
  vacuum: boolean
  waterValve: boolean
  camera: boolean
  fan: boolean
  reed: boolean
}

export type RootStackParamList = {
  Auth: undefined
  Login: undefined
  Main: undefined
  ProfileSetup: undefined
  BindUnit: undefined
  QRScanner: undefined
  FullCamera: { unitId: string }
}

export type MainTabParamList = {
  Home: undefined
  UnitInfo: undefined
  Settings: undefined
}
