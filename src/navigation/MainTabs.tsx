import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import type { MainTabParamList } from "../types"
import { colors } from "../constants/theme"

// Screens
import { HomeScreen } from "../screens/HomeScreen"
import { UnitInfoScreen } from "../screens/UnitInfoScreen"
import { SettingsScreen } from "../screens/SettingsScreen"

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.lightGrey,
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          tabBarLabel: "Control",
        }}
      />
      <Tab.Screen
        name="UnitInfo"
        component={UnitInfoScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="analytics" size={size} color={color} />,
          tabBarLabel: "Unit Info",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  )
}
