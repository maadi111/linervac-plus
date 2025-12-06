import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "../types"
import { apiService } from "../services/api"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  setUser: (user: User) => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  loadUser: () => Promise<void>
  logout: () => Promise<void>
}

const STORAGE_KEY = "@linervac_user"

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiService.login(username, password)
      
      if (response.success && response.data) {
        const user: User = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone || "",
          createdAt: new Date().toISOString(),
        }
        await get().setUser(user)
        set({ isLoading: false, error: null })
        return true
      } else {
        // If API login fails (e.g., 404), allow local login since MQTT is primary
        // This allows the app to work even if API endpoints don't exist
        if (response.error?.includes("404") || response.error?.includes("Server error: 404")) {
          console.log("API endpoint not found, using local authentication")
          // Create a local user for MQTT access
          const user: User = {
            id: `local_${Date.now()}`,
            name: username,
            email: `${username}@local`,
            phone: "",
            createdAt: new Date().toISOString(),
          }
          await get().setUser(user)
          set({ isLoading: false, error: null })
          return true
        }
        set({ isLoading: false, error: response.error || "Login failed" })
        return false
      }
    } catch (error: any) {
      // On network errors, allow local login for MQTT access
      console.log("API login error, using local authentication:", error.message)
      const user: User = {
        id: `local_${Date.now()}`,
        name: username,
        email: `${username}@local`,
        phone: "",
        createdAt: new Date().toISOString(),
      }
      await get().setUser(user)
      set({ isLoading: false, error: null })
      return true
    }
  },

  setUser: async (user: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      set({ user, isAuthenticated: true })
    } catch (error) {
      console.error("Failed to save user:", error)
    }
  },

  updateUser: async (updates: Partial<User>) => {
    const { user } = get()
    if (user) {
      const updatedUser = { ...user, ...updates }
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
        set({ user: updatedUser })
      } catch (error) {
        console.error("Failed to update user:", error)
      }
    }
  },

  loadUser: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        const user = JSON.parse(stored) as User
        set({ user, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      console.error("Failed to load user:", error)
      set({ isLoading: false })
    }
  },

  logout: async () => {
    try {
      // Call API logout
      await apiService.logout()
      await AsyncStorage.removeItem(STORAGE_KEY)
      set({ user: null, isAuthenticated: false, error: null })
    } catch (error) {
      console.error("Failed to logout:", error)
      // Still clear local state even if API call fails
      await AsyncStorage.removeItem(STORAGE_KEY)
      set({ user: null, isAuthenticated: false })
    }
  },
}))
