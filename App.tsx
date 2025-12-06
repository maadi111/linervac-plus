import { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { RootNavigator } from "./src/navigation/RootNavigator"
import { useAuthStore } from "./src/stores/authStore"
import { useMqttStore } from "./src/stores/mqttStore"
import { setupNotifications } from "./src/services/notifications"

export default function App() {
  const { loadUser } = useAuthStore()
  const { connect } = useMqttStore()

  useEffect(() => {
    // Load persisted user data
    loadUser()
    // Setup push notifications
    setupNotifications()
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
