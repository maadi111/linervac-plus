// API Service for LinerVac+ Web App Integration

import { API_CONFIG, API_ENDPOINTS } from "../constants/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEY_TOKEN = "@linervac_auth_token"
const STORAGE_KEY_REFRESH_TOKEN = "@linervac_refresh_token"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface LoginResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

class ApiService {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl + API_CONFIG.apiPath
    this.loadToken()
  }

  private async loadToken() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEY_TOKEN)
      this.token = token
    } catch (error) {
      console.error("Failed to load token:", error)
    }
  }

  private async saveToken(token: string, refreshToken?: string) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_TOKEN, token)
      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEY_REFRESH_TOKEN, refreshToken)
      }
      this.token = token
    } catch (error) {
      console.error("Failed to save token:", error)
    }
  }

  private async clearToken() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_TOKEN)
      await AsyncStorage.removeItem(STORAGE_KEY_REFRESH_TOKEN)
      this.token = null
    } catch (error) {
      console.error("Failed to clear token:", error)
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Construct URL - handle both absolute and relative endpoints
      // Note: this.baseUrl already includes API_CONFIG.apiPath from constructor
      const url = endpoint.startsWith("http")
        ? endpoint
        : `${this.baseUrl}${endpoint}`
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      }

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`
      }

      const response = await fetch(url, {
        ...options,
        headers,
        timeout: API_CONFIG.timeout,
      } as any)

      // Get response text first to check if it's JSON
      const responseText = await response.text()
      
      // Check if response is JSON by looking at Content-Type header or response content
      const contentType = response.headers.get("content-type") || ""
      const isJson = contentType.includes("application/json") || 
                     (responseText.trim().startsWith("{") || responseText.trim().startsWith("["))

      let data: any
      
      if (isJson && responseText) {
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          // If JSON parsing fails, treat as error
          return {
            success: false,
            error: `Invalid JSON response: ${response.status} ${response.statusText}`,
          }
        }
      } else {
        // Non-JSON response (likely HTML error page)
        if (!response.ok) {
          return {
            success: false,
            error: `Server error: ${response.status} ${response.statusText}`,
          }
        }
        // If response is OK but not JSON, return the text
        return {
          success: true,
          data: responseText,
        }
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `Request failed: ${response.status} ${response.statusText}`,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error: any) {
      console.error("API request error:", error)
      return {
        success: false,
        error: error.message || "Network error occurred",
      }
    }
  }

  // Authentication
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>(API_ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })

    if (response.success && response.data) {
      await this.saveToken(response.data.token, response.data.refreshToken)
    }

    return response
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request(API_ENDPOINTS.logout, {
      method: "POST",
    })

    await this.clearToken()
    return response
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEY_REFRESH_TOKEN)
      if (!refreshToken) {
        return { success: false, error: "No refresh token available" }
      }

      const response = await this.request<{ token: string }>(API_ENDPOINTS.refresh, {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      })

      if (response.success && response.data) {
        await this.saveToken(response.data.token)
      }

      return response
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.profile)
  }

  // Units
  async getUnits(): Promise<ApiResponse<any[]>> {
    return this.request(API_ENDPOINTS.units)
  }

  async getUnitById(id: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.unitById(id))
  }

  async bindUnit(uuid: string, name: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.bindUnit, {
      method: "POST",
      body: JSON.stringify({ uuid, name }),
    })
  }

  async unbindUnit(id: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.unbindUnit(id), {
      method: "DELETE",
    })
  }

  // Status & Control
  async getUnitStatus(uuid: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.unitStatus(uuid))
  }

  async sendCommand(uuid: string, command: string, value: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.sendCommand(uuid), {
      method: "POST",
      body: JSON.stringify({ command, value }),
    })
  }

  // Analytics
  async getAnalytics(uuid: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.analytics(uuid))
  }

  async getHistory(uuid: string, startDate?: string, endDate?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    const query = params.toString()
    return this.request(`${API_ENDPOINTS.history(uuid)}${query ? `?${query}` : ""}`)
  }

  // Settings
  async getSettings(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.settings)
  }

  async updateSettings(settings: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.settings, {
      method: "PUT",
      body: JSON.stringify(settings),
    })
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<any[]>> {
    return this.request(API_ENDPOINTS.notifications)
  }

  async markNotificationRead(id: string): Promise<ApiResponse> {
    return this.request(`${API_ENDPOINTS.notifications}/${id}/read`, {
      method: "PUT",
    })
  }

  // Helper to check if authenticated
  isAuthenticated(): boolean {
    return !!this.token
  }

  // Get current token
  getToken(): string | null {
    return this.token
  }
}

export const apiService = new ApiService()

