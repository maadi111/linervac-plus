"use client"

import { AppProvider, useApp } from "@/lib/app-context"
import { MQTTProvider } from "@/lib/mqtt-context"
import { SplashScreen } from "@/components/screens/splash-screen"
import { LoginScreen } from "@/components/screens/login-screen"
import { RegisterScreen } from "@/components/screens/register-screen"
import { ProfileSetupScreen } from "@/components/screens/profile-setup-screen"
import { BindUnitScreen } from "@/components/screens/bind-unit-screen"
import { HomeScreen } from "@/components/screens/home-screen"
import { CameraFullscreen } from "@/components/screens/camera-fullscreen"
import { UnitInfoScreen } from "@/components/screens/unit-info-screen"
import { SettingsScreen } from "@/components/screens/settings-screen"
import { AddUnitScreen } from "@/components/screens/add-unit-screen"

function AppScreens() {
  const { currentScreen } = useApp()

  switch (currentScreen) {
    case "splash":
      return <SplashScreen />
    case "login":
      return <LoginScreen />
    case "register":
      return <RegisterScreen />
    case "profile-setup":
      return <ProfileSetupScreen />
    case "bind-unit":
      return <BindUnitScreen />
    case "home":
      return <HomeScreen />
    case "camera-fullscreen":
      return <CameraFullscreen />
    case "unit-info":
      return <UnitInfoScreen />
    case "settings":
      return <SettingsScreen />
    case "add-unit":
      return <AddUnitScreen />
    default:
      return <SplashScreen />
  }
}

export default function LinerVacApp() {
  return (
    <AppProvider>
      <MQTTProvider>
        <div className="max-w-md mx-auto min-h-screen bg-background">
          <AppScreens />
        </div>
      </MQTTProvider>
    </AppProvider>
  )
}
