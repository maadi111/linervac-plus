import React from "react"
import { ActivityIndicator, View } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuthStore } from "../stores/authStore"
import { useUnitsStore } from "../stores/unitsStore"
import type { RootStackParamList } from "../types"
import { colors } from "../constants/theme"

// Screens
import { WelcomeScreen } from "../screens/auth/WelcomeScreen"
import { LoginScreen } from "../screens/auth/LoginScreen"
import { ProfileSetupScreen } from "../screens/auth/ProfileSetupScreen"
import { BindUnitScreen } from "../screens/auth/BindUnitScreen"
import { QRScannerScreen } from "../screens/auth/QRScannerScreen"
import { MainTabs } from "./MainTabs"
import { FullCameraScreen } from "../screens/FullCameraScreen"

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore()
  const { units, isLoading: unitsLoading } = useUnitsStore()

  // Load units when component mounts
  React.useEffect(() => {
    useUnitsStore.getState().loadUnits()
  }, [])

  if (authLoading || unitsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Auth" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        </>
      ) : units.length === 0 ? (
        <>
          <Stack.Screen name="BindUnit" component={BindUnitScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="FullCamera"
            component={FullCameraScreen}
            options={{
              presentation: "fullScreenModal",
              animation: "fade",
            }}
          />
          <Stack.Screen name="BindUnit" component={BindUnitScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}
