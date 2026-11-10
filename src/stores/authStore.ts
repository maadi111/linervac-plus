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

// Dev-only: allow a local session when the API login endpoint returns 404.
// Always false in release builds, regardless of the env var.
const ALLOW_LOCAL_AUTH = __DEV__ && process.env.EXPO_PUBLIC_ALLOW_LOCAL_AUTH === "true"

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
        // Local (offline) login is a development-only escape hatch for when the
        // API has no /auth/login endpoint yet. It is disabled in release builds
        // and must be explicitly enabled with EXPO_PUBLIC_ALLOW_LOCAL_AUTH=true.
        const apiMissing = response.error?.includes("404")
        if (ALLOW_LOCAL_AUTH && apiMissing) {
          console.warn("API login endpoint not found; using DEV-ONLY local authentication")
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
      // Never grant access because of a network error.
      console.error("API login error:", error?.message)
      set({ isLoading: false, error: "Unable to reach the server. Check your connection and try again." })
      return false
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
