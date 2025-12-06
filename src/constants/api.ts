// LinerVac+ API Configuration

export const API_CONFIG = {
  baseUrl: "https://linervac.linervac.com",
  apiPath: "", // Adjust based on actual API structure - empty if API is at root
  timeout: 30000,
  // If API uses different structure, update these:
  // apiPath: "/api/v1" or "/api" or "" (for root level)
}

export const API_ENDPOINTS = {
  // Authentication
  login: "/auth/login",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  profile: "/auth/profile",

  // Units
  units: "/units",
  unitById: (id: string) => `/units/${id}`,
  bindUnit: "/units/bind",
  unbindUnit: (id: string) => `/units/${id}/unbind`,

  // Status & Control
  unitStatus: (uuid: string) => `/units/${uuid}/status`,
  sendCommand: (uuid: string) => `/units/${uuid}/command`,

  // Analytics
  analytics: (uuid: string) => `/units/${uuid}/analytics`,
  history: (uuid: string) => `/units/${uuid}/history`,

  // Settings
  settings: "/settings",
  notifications: "/notifications",
}

