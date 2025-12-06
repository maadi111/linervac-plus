/**
 * Native Module Utilities
 * Helper functions for native module initialization and checks
 */

import { Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Camera } from "expo-camera"

/**
 * Check if running on a physical device
 */
export function isPhysicalDevice(): boolean {
  return Device.isDevice
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  return Platform.OS === "ios"
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  return Platform.OS === "android"
}

/**
 * Request camera permissions
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync()
    return status === "granted"
  } catch (error) {
    console.error("Error requesting camera permission:", error)
    return false
  }
}

/**
 * Check camera permissions
 */
export async function checkCameraPermission(): Promise<boolean> {
  try {
    const { status } = await Camera.getCameraPermissionsAsync()
    return status === "granted"
  } catch (error) {
    console.error("Error checking camera permission:", error)
    return false
  }
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync()
    return status === "granted"
  } catch (error) {
    console.error("Error requesting notification permission:", error)
    return false
  }
}

/**
 * Check notification permissions
 */
export async function checkNotificationPermission(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync()
    return status === "granted"
  } catch (error) {
    console.error("Error checking notification permission:", error)
    return false
  }
}

/**
 * Get device information
 */
export function getDeviceInfo() {
  return {
    isDevice: Device.isDevice,
    platform: Platform.OS,
    version: Platform.Version,
    deviceName: Device.deviceName,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
  }
}

/**
 * Initialize all native modules (called on app start)
 */
export async function initializeNativeModules(): Promise<void> {
  console.log("Initializing native modules...")
  
  const deviceInfo = getDeviceInfo()
  console.log("Device Info:", deviceInfo)

  // Check permissions
  const cameraPermission = await checkCameraPermission()
  const notificationPermission = await checkNotificationPermission()

  console.log("Permissions:", {
    camera: cameraPermission,
    notifications: notificationPermission,
  })

  // Request permissions if not granted (optional - can be done on-demand)
  // await requestCameraPermission()
  // await requestNotificationPermission()
}

