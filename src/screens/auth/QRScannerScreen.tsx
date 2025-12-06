
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Camera, CameraView } from "expo-camera"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography, borderRadius } from "../../constants/theme"
import { Button } from "../../components/ui/Button"
import { useUnitsStore } from "../../stores/unitsStore"
import { useMqttStore } from "../../stores/mqttStore"
import type { RootStackParamList } from "../../types"

type QRScannerNavigationProp = NativeStackNavigationProp<RootStackParamList, "QRScanner">

export function QRScannerScreen() {
  const navigation = useNavigation<QRScannerNavigationProp>()
  const { addUnit, units } = useUnitsStore()
  const { connect, subscribeToUnit } = useMqttStore()

  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    }
    getCameraPermission()
  }, [])

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return
    setScanned(true)

    try {
      // Parse the scanned data - expecting UUID format
      const uuid = data.trim()

      // Check if unit already exists
      if (units.some((u) => u.uuid === uuid)) {
        Alert.alert("Unit Already Bound", "This unit is already added to your account.", [
          { text: "OK", onPress: () => setScanned(false) },
        ])
        return
      }

      const newUnit = {
        id: Date.now().toString(),
        uuid,
        name: `LinerVac+ Unit ${units.length + 1}`,
        bindDate: new Date().toISOString(),
        firmwareVersion: "1.0.0",
        isOnline: false,
      }

      await addUnit(newUnit)
      connect()
      subscribeToUnit(newUnit.uuid)

      // Check if this is the first unit (before adding, units.length was 0)
      const isFirstUnit = units.length === 0

      Alert.alert("Unit Bound Successfully", `${newUnit.name} has been added to your account.`, [
        {
          text: "OK",
          onPress: () => {
            if (isFirstUnit) {
              // This is the first unit - navigate to Main dashboard
              requestAnimationFrame(() => {
                try {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Main" }],
                  })
                } catch (error) {
                  // If navigation fails, RootNavigator will handle it on next render
                  console.log("Navigation will be handled by RootNavigator")
                }
              })
            } else {
              // Additional unit - navigate to Main instead of goBack
              try {
                if (navigation.canGoBack()) {
                  navigation.goBack()
                } else {
                  // If we can't go back, reset to Main
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Main" }],
                  })
                }
              } catch (error) {
                // Fallback: always reset to Main
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Main" }],
                })
              }
            }
          },
        },
      ])
    } catch (error) {
      Alert.alert("Scan Error", "Failed to process QR code. Please try again.", [
        { text: "OK", onPress: () => setScanned(false) },
      ])
    }
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera" size={64} color={colors.primary} />
          </View>
          <Text style={styles.message}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera-off" size={64} color={colors.danger} />
          </View>
          <Text style={styles.message}>Camera access is required to scan QR codes</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} variant="outline" style={styles.backButton} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "code39"],
        }}
      />

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="sm"
            style={styles.cancelButton}
            textStyle={{ color: colors.white }}
          />
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.instructions}>Position the QR code within the frame</Text>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.md,
  },
  backButton: {
    marginTop: spacing.xl,
  },
  overlay: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    alignItems: "flex-start",
  },
  cancelButton: {
    borderColor: colors.white,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scanArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: colors.white,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: borderRadius.sm,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: borderRadius.sm,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: borderRadius.sm,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: borderRadius.sm,
  },
  instructions: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
    marginTop: spacing.xl,
  },
})
