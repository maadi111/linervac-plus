"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { User, Unit, AppState, AppScreen, Notification } from "./types"

interface AppContextType extends AppState {
  currentScreen: AppScreen
  setScreen: (screen: AppScreen) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string) => Promise<boolean>
  updateProfile: (name: string, phone: string, email: string) => void
  bindUnit: (uuid: string, name?: string) => void
  addUnit: (uuid: string, name?: string) => void
  removeUnit: (unitId: string) => void
  setActiveUnit: (unitId: string) => void
  toggleVacuum: () => void
  toggleWaterValve: () => void
  toggleCamera: () => void
  safeHomeShutdown: () => void
  acknowledgeNotification: (notificationId: string) => void
  resetDataUsage: (unitId: string) => void
  logout: () => void
  activeUnit: Unit | null
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash")
  const [user, setUser] = useState<User | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const activeUnit = units.find((u) => u.id === activeUnitId) || null

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("linervac_state")
    if (saved) {
      try {
        const state = JSON.parse(saved)
        if (state.user) {
          setUser(state.user)
          setIsAuthenticated(true)
        }
        if (state.units) {
          setUnits(state.units)
        }
        if (state.activeUnitId) {
          setActiveUnitId(state.activeUnitId)
        }
        // Go to home if authenticated with units
        if (state.user && state.units?.length > 0) {
          setCurrentScreen("home")
        } else if (state.user) {
          setCurrentScreen("bind-unit")
        } else {
          setTimeout(() => setCurrentScreen("login"), 1500)
        }
      } catch {
        setTimeout(() => setCurrentScreen("login"), 1500)
      }
    } else {
      setTimeout(() => setCurrentScreen("login"), 1500)
    }
  }, [])

  // Save state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "linervac_state",
        JSON.stringify({
          user,
          units,
          activeUnitId,
        }),
      )
    }
  }, [user, units, activeUnitId])

  const setScreen = useCallback((screen: AppScreen) => {
    setCurrentScreen(screen)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in production this would hit an API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (email && password) {
      const savedState = localStorage.getItem("linervac_state")
      if (savedState) {
        const state = JSON.parse(savedState)
        if (state.user) {
          setUser(state.user)
          setUnits(state.units || [])
          setActiveUnitId(state.activeUnitId)
          setIsAuthenticated(true)
          if (state.units?.length > 0) {
            setCurrentScreen("home")
          } else {
            setCurrentScreen("bind-unit")
          }
          return true
        }
      }
      // New user - go to profile setup
      setIsAuthenticated(true)
      setCurrentScreen("profile-setup")
      return true
    }
    return false
  }, [])

  const register = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (email && password.length >= 6) {
      setIsAuthenticated(true)
      setCurrentScreen("profile-setup")
      return true
    }
    return false
  }, [])

  const updateProfile = useCallback((name: string, phone: string, email: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      createdAt: new Date(),
    }
    setUser(newUser)
    setCurrentScreen("bind-unit")
  }, [])

  const bindUnit = useCallback((uuid: string, name?: string) => {
    const newUnit: Unit = {
      id: crypto.randomUUID(),
      uuid,
      name: name || `LinerVac+ ${uuid.slice(-4).toUpperCase()}`,
      bindDate: new Date(),
      firmwareVersion: "1.0.0",
      dataUsage: 0,
      lifetimeHours: 0,
      sessionHours: 0,
      lastPowerOn: null,
      lastPowerOff: null,
      status: {
        vacuum: false,
        waterValve: false,
        camera: false,
        reedSwitch: false,
      },
    }
    setUnits([newUnit])
    setActiveUnitId(newUnit.id)
    setCurrentScreen("home")
  }, [])

  const addUnit = useCallback(
    (uuid: string, name?: string) => {
      if (units.length >= 5) return
      const newUnit: Unit = {
        id: crypto.randomUUID(),
        uuid,
        name: name || `LinerVac+ ${uuid.slice(-4).toUpperCase()}`,
        bindDate: new Date(),
        firmwareVersion: "1.0.0",
        dataUsage: 0,
        lifetimeHours: 0,
        sessionHours: 0,
        lastPowerOn: null,
        lastPowerOff: null,
        status: {
          vacuum: false,
          waterValve: false,
          camera: false,
          reedSwitch: false,
        },
      }
      setUnits((prev) => [...prev, newUnit])
      setActiveUnitId(newUnit.id)
      setCurrentScreen("home")
    },
    [units.length],
  )

  const removeUnit = useCallback(
    (unitId: string) => {
      setUnits((prev) => prev.filter((u) => u.id !== unitId))
      if (activeUnitId === unitId) {
        setActiveUnitId(units.find((u) => u.id !== unitId)?.id || null)
      }
    },
    [activeUnitId, units],
  )

  const setActiveUnit = useCallback((unitId: string) => {
    setActiveUnitId(unitId)
  }, [])

  const toggleVacuum = useCallback(() => {
    if (!activeUnitId) return
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === activeUnitId) {
          const newVacuumState = !u.status.vacuum
          return {
            ...u,
            lastPowerOn: newVacuumState ? new Date() : u.lastPowerOn,
            lastPowerOff: !newVacuumState ? new Date() : u.lastPowerOff,
            status: { ...u.status, vacuum: newVacuumState },
          }
        }
        return u
      }),
    )
  }, [activeUnitId])

  const toggleWaterValve = useCallback(() => {
    if (!activeUnitId) return
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === activeUnitId) {
          return {
            ...u,
            status: { ...u.status, waterValve: !u.status.waterValve },
          }
        }
        return u
      }),
    )
  }, [activeUnitId])

  const toggleCamera = useCallback(() => {
    if (!activeUnitId) return
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === activeUnitId) {
          return {
            ...u,
            status: { ...u.status, camera: !u.status.camera },
          }
        }
        return u
      }),
    )
  }, [activeUnitId])

  const safeHomeShutdown = useCallback(() => {
    if (!activeUnitId) return
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === activeUnitId) {
          return {
            ...u,
            lastPowerOff: new Date(),
            status: {
              vacuum: false,
              waterValve: false,
              camera: false,
              reedSwitch: u.status.reedSwitch,
            },
          }
        }
        return u
      }),
    )
  }, [activeUnitId])

  const acknowledgeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, acknowledged: true } : n)))
  }, [])

  const resetDataUsage = useCallback((unitId: string) => {
    setUnits((prev) => prev.map((u) => (u.id === unitId ? { ...u, dataUsage: 0 } : u)))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("linervac_state")
    setUser(null)
    setUnits([])
    setActiveUnitId(null)
    setIsAuthenticated(false)
    setNotifications([])
    setCurrentScreen("login")
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        units,
        activeUnitId,
        isAuthenticated,
        notifications,
        currentScreen,
        setScreen,
        login,
        register,
        updateProfile,
        bindUnit,
        addUnit,
        removeUnit,
        setActiveUnit,
        toggleVacuum,
        toggleWaterValve,
        toggleCamera,
        safeHomeShutdown,
        acknowledgeNotification,
        resetDataUsage,
        logout,
        activeUnit,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
