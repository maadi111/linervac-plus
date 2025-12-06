import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Unit, UnitStatus } from "../types"
import { apiService } from "../services/api"

interface UnitsState {
  units: Unit[]
  activeUnitId: string | null
  unitStatuses: Record<string, UnitStatus>
  isLoading: boolean

  // Actions
  addUnit: (unit: Unit) => Promise<void>
  removeUnit: (unitId: string) => Promise<void>
  setActiveUnit: (unitId: string) => void
  updateUnitStatus: (unitId: string, status: Partial<UnitStatus>) => void
  loadUnits: () => Promise<void>
  syncUnits: () => Promise<void>
  getActiveUnit: () => Unit | undefined
  getActiveUnitStatus: () => UnitStatus | undefined
  resetDataUsage: (unitId: string) => void
}

const STORAGE_KEY = "@linervac_units"

const defaultUnitStatus: UnitStatus = {
  vacuumOn: false,
  waterValveOn: false,
  cameraOn: false,
  fanOn: false,
  reedSwitchTriggered: false,
  reedSwitchClosed: false,
  reedState: "unknown",
  systemStatus: "NORMAL",
  cameraState: null,
  networkStatus: null,
  networkActive: null,
  networkIP: null,
  lastPowerOn: null,
  lastPowerOff: null,
  sessionHours: 0,
  lifetimeHours: 0,
  dataUsageMB: 0,
  powerLockout: false,
}

export const useUnitsStore = create<UnitsState>((set, get) => ({
  units: [],
  activeUnitId: null,
  unitStatuses: {},
  isLoading: true,

  addUnit: async (unit: Unit) => {
    const { units, unitStatuses } = get()
    const newUnits = [...units, unit]
    const newStatuses = { ...unitStatuses, [unit.id]: defaultUnitStatus }

    try {
      // Sync with API if authenticated
      if (apiService.isAuthenticated()) {
        const response = await apiService.bindUnit(unit.uuid, unit.name)
        if (!response.success) {
          console.warn("Failed to sync unit with API:", response.error)
        }
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUnits))
      set({
        units: newUnits,
        unitStatuses: newStatuses,
        activeUnitId: get().activeUnitId || unit.id,
      })

      // Subscribe to MQTT topics for the new unit
      // Lazy import to avoid circular dependency
      const { useMqttStore } = require("./mqttStore")
      const mqttStore = useMqttStore.getState()
      if (mqttStore.isConnected) {
        mqttStore.subscribeToUnit(unit.uuid)
        // Request initial data
        setTimeout(() => {
          mqttStore.requestStatus(unit.uuid)
          mqttStore.requestAnalytics(unit.uuid)
        }, 500)
      } else {
        // Connect first, then subscribe
        mqttStore.connect()
        setTimeout(() => {
          // Lazy import to avoid circular dependency
          const { useMqttStore } = require("./mqttStore")
          if (useMqttStore.getState().isConnected) {
            useMqttStore.getState().subscribeToUnit(unit.uuid)
            useMqttStore.getState().requestStatus(unit.uuid)
            useMqttStore.getState().requestAnalytics(unit.uuid)
          }
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to add unit:", error)
    }
  },

  removeUnit: async (unitId: string) => {
    const { units, unitStatuses, activeUnitId } = get()
    const unit = units.find((u) => u.id === unitId)
    const newUnits = units.filter((u) => u.id !== unitId)
    const newStatuses = { ...unitStatuses }
    delete newStatuses[unitId]

    try {
      // Sync with API if authenticated
      if (apiService.isAuthenticated() && unit) {
        const response = await apiService.unbindUnit(unitId)
        if (!response.success) {
          console.warn("Failed to sync unit removal with API:", response.error)
        }
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUnits))
      set({
        units: newUnits,
        unitStatuses: newStatuses,
        activeUnitId: activeUnitId === unitId ? newUnits[0]?.id || null : activeUnitId,
      })
    } catch (error) {
      console.error("Failed to remove unit:", error)
    }
  },

  setActiveUnit: (unitId: string) => {
    set({ activeUnitId: unitId })
  },

  updateUnitStatus: (unitId: string, status: Partial<UnitStatus>) => {
    const { unitStatuses } = get()
    set({
      unitStatuses: {
        ...unitStatuses,
        [unitId]: { ...unitStatuses[unitId], ...status },
      },
    })
  },

  loadUnits: async () => {
    try {
      // Try to sync with API first if authenticated
      if (apiService.isAuthenticated()) {
        await get().syncUnits()
      } else {
        // Fallback to local storage
        const stored = await AsyncStorage.getItem(STORAGE_KEY)
        if (stored) {
          const units = JSON.parse(stored) as Unit[]
          const statuses: Record<string, UnitStatus> = {}
          units.forEach((u) => {
            statuses[u.id] = defaultUnitStatus
          })
          set({
            units,
            unitStatuses: statuses,
            activeUnitId: units[0]?.id || null,
            isLoading: false,
          })
        } else {
          set({ isLoading: false })
        }
      }
    } catch (error) {
      console.error("Failed to load units:", error)
      set({ isLoading: false })
    }
  },

  syncUnits: async () => {
    try {
      const response = await apiService.getUnits()
      if (response.success && response.data) {
        // Map API units to local format
        const units: Unit[] = response.data.map((apiUnit: any) => ({
          id: apiUnit.id || apiUnit.uuid,
          uuid: apiUnit.uuid,
          name: apiUnit.name || `Unit ${apiUnit.uuid.substring(0, 8)}`,
          bindDate: apiUnit.bindDate || new Date().toISOString(),
          firmwareVersion: apiUnit.firmwareVersion || "1.0.0",
          isOnline: apiUnit.isOnline || false,
        }))

        const statuses: Record<string, UnitStatus> = {}
        units.forEach((u) => {
          statuses[u.id] = defaultUnitStatus
        })

        // Save to local storage
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(units))

        set({
          units,
          unitStatuses: statuses,
          activeUnitId: units[0]?.id || null,
          isLoading: false,
        })
      } else {
        // Fallback to local storage if API fails
        const stored = await AsyncStorage.getItem(STORAGE_KEY)
        if (stored) {
          const units = JSON.parse(stored) as Unit[]
          const statuses: Record<string, UnitStatus> = {}
          units.forEach((u) => {
            statuses[u.id] = defaultUnitStatus
          })
          set({
            units,
            unitStatuses: statuses,
            activeUnitId: units[0]?.id || null,
            isLoading: false,
          })
        } else {
          set({ isLoading: false })
        }
      }
    } catch (error) {
      console.error("Failed to sync units:", error)
      set({ isLoading: false })
    }
  },

  getActiveUnit: () => {
    const { units, activeUnitId } = get()
    return units.find((u) => u.id === activeUnitId)
  },

  getActiveUnitStatus: () => {
    const { unitStatuses, activeUnitId } = get()
    return activeUnitId ? unitStatuses[activeUnitId] : undefined
  },

  resetDataUsage: (unitId: string) => {
    const { unitStatuses } = get()
    set({
      unitStatuses: {
        ...unitStatuses,
        [unitId]: { ...unitStatuses[unitId], dataUsageMB: 0 },
      },
    })
  },
}))
