export interface User {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
}

export interface Unit {
  id: string
  uuid: string
  name: string
  bindDate: Date
  firmwareVersion: string
  dataUsage: number
  lifetimeHours: number
  sessionHours: number
  lastPowerOn: Date | null
  lastPowerOff: Date | null
  status: {
    vacuum: boolean
    waterValve: boolean
    camera: boolean
    reedSwitch: boolean
  }
}

export interface AppState {
  user: User | null
  units: Unit[]
  activeUnitId: string | null
  isAuthenticated: boolean
  notifications: Notification[]
}

export interface Notification {
  id: string
  unitId: string
  type: "reed_switch" | "system" | "info"
  message: string
  timestamp: Date
  acknowledged: boolean
}

export type AppScreen =
  | "splash"
  | "login"
  | "register"
  | "profile-setup"
  | "bind-unit"
  | "home"
  | "camera-fullscreen"
  | "unit-info"
  | "settings"
  | "add-unit"
