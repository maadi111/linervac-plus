import { useState } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography, borderRadius, shadows } from "../../constants/theme"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import { useUnitsStore } from "../../stores/unitsStore"
import { useMqttStore } from "../../stores/mqttStore"
import type { RootStackParamList } from "../../types"
import { isValidUUID, formatUUID } from "../../utils/uuid"

type BindUnitNavigationProp = NativeStackNavigationProp<RootStackParamList, "BindUnit">

export function BindUnitScreen() {
  const navigation = useNavigation<BindUnitNavigationProp>()
  const { addUnit, units } = useUnitsStore()
  const { connect, subscribeToUnit } = useMqttStore()

  const [uuid, setUuid] = useState("")
  const [unitName, setUnitName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleScan = () => {
    navigation.navigate("QRScanner")
  }

  const handleManualBind = async () => {
    const formattedUuid = formatUUID(uuid)
    
    if (!formattedUuid) {
      setError("Please enter a valid UUID")
      return
    }

    if (!isValidUUID(formattedUuid)) {
      setError("Invalid UUID format. Expected format: XXXXXX-XXXX (e.g., D4RWC-Y316)")
      return
    }

    if (!unitName.trim()) {
      setError("Please enter a name for this unit")
      return
    }

    setError("")
    setLoading(true)

    try {
      const newUnit = {
        id: Date.now().toString(),
        uuid: formattedUuid,
        name: unitName.trim(),
        bindDate: new Date().toISOString(),
        firmwareVersion: "1.0.0",
        isOnline: false,
      }

      await addUnit(newUnit)

      // Connect to MQTT and subscribe to the new unit
      connect()
      subscribeToUnit(newUnit.uuid)

      // Check if this is the first unit (before adding, units.length was 0)
      const isFirstUnit = units.length === 0

      if (isFirstUnit) {
        // This is the first unit - navigate to Main dashboard
        requestAnimationFrame(() => {
          try {
            navigation.reset({
              index: 0,
              routes: [{ name: "Main" }],
            })
          } catch (error) {
            // If navigation fails, RootNavigator will handle showing Main on next render
            console.log("Navigation will be handled by RootNavigator")
          }
        })
      } else {
        // Additional unit - navigate to Main instead of goBack to avoid navigation errors
        try {
          if (navigation.canGoBack && navigation.canGoBack()) {
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
    } catch (err) {
      setError("Failed to bind unit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="cube" size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Bind Your Unit</Text>
            <Text style={styles.subtitle}>Scan the QR code on your LinerVac+ unit or enter the UUID manually</Text>
          </View>

          {/* QR Scan Card */}
          <Card variant="elevated" style={styles.scanCard}>
            <View style={styles.scanIconContainer}>
              <Ionicons name="qr-code" size={64} color={colors.primary} />
            </View>
            <Text style={styles.scanTitle}>Scan QR Code</Text>
            <Text style={styles.scanDescription}>Find the QR code on your LinerVac+ unit and scan it</Text>
            <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
              <Ionicons name="camera" size={20} color={colors.white} />
              <Text style={styles.scanButtonText}>Open Scanner</Text>
            </TouchableOpacity>
          </Card>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or enter manually</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Manual Entry Card */}
          <Card variant="elevated" style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Ionicons name="finger-print" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Input
                    label="Unit UUID"
                    placeholder="D4RWC-Y316"
                    value={uuid}
                    onChangeText={(text) => setUuid(text.toUpperCase())}
                    autoCapitalize="characters"
                    maxLength={13}
                    autoCorrect={false}
                    keyboardType="default"
                  />
                  <Text style={styles.hint}>Format: XXXXXX-XXXX (6 chars - 4 chars)</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="pricetag" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Input
                    label="Unit Name"
                    placeholder="e.g., Pool Vacuum 1"
                    value={unitName}
                    onChangeText={setUnitName}
                  />
                </View>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color={colors.danger} />
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}

              <Button title="Bind Unit" onPress={handleManualBind} loading={loading} style={styles.bindButton} />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  scanCard: {
    alignItems: "center",
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  scanIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  scanTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: "700",
  },
  scanDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    width: "100%",
    ...shadows.md,
  },
  scanButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.darkGrey,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
  },
  formCard: {
    padding: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  inputIcon: {
    marginTop: spacing.md + 4, // Align with input field
  },
  inputWrapper: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: `${colors.danger}20`,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
    flex: 1,
  },
  bindButton: {
    marginTop: spacing.sm,
    ...shadows.md,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontStyle: "italic",
  },
})
