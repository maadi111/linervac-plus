import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export async function setupNotifications() {
  if (!Device.isDevice) {
    console.log("Notifications only work on physical devices")
    return null
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification")
    return null
  }

  // Configure Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reed-switch-alerts", {
      name: "Reed Switch Alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF0000",
      sound: "alert.wav",
    })
  }

  return true
}

export async function scheduleReedSwitchAlert(unitName: string) {
  // Schedule initial notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "LinerVac+ Alert",
      body: `Reed switch triggered on ${unitName}! Please check your unit.`,
      sound: "alert.wav",
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null, // Immediately
  })

  // Schedule repeating notification every 15 minutes until dismissed
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "LinerVac+ Alert - Reminder",
      body: `Reed switch still triggered on ${unitName}! Please check your unit.`,
      sound: "alert.wav",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      seconds: 900, // 15 minutes
      repeats: true,
    },
  })

  return notificationId
}

export async function cancelReedSwitchAlert(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId)
}

export async function cancelAllAlerts() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}
