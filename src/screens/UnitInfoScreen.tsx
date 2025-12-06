import { useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Alert, Linking, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography, borderRadius, shadows } from "../constants/theme"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { useUnitsStore } from "../stores/unitsStore"
import { useMqttStore } from "../stores/mqttStore"

export function UnitInfoScreen() {
  const { getActiveUnit, getActiveUnitStatus, resetDataUsage } = useUnitsStore()
  const { isConnected, requestStatus, requestAnalytics, requestFirmware } = useMqttStore()

  const unit = getActiveUnit()
  const status = getActiveUnitStatus()

  // Request data from MQTT when screen loads or unit changes
  useEffect(() => {
    if (isConnected && unit) {
      // Request all data via MQTT
      requestStatus(unit.uuid)
      requestAnalytics(unit.uuid)
      requestFirmware(unit.uuid)
    }
  }, [isConnected, unit?.uuid])

  // Periodic refresh every 30 seconds
  useEffect(() => {
    if (!isConnected || !unit) return

    const interval = setInterval(() => {
      requestStatus(unit.uuid)
      requestAnalytics(unit.uuid)
    }, 30000)

    return () => clearInterval(interval)
  }, [isConnected, unit?.uuid])

  const handleResetData = () => {
    Alert.alert("Reset Data Usage", "Are you sure you want to reset the data usage counter?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => unit && resetDataUsage(unit.id),
      },
    ])
  }

  const handleContact = () => {
    Linking.openURL("mailto:support@linervac.com?subject=LinerVac+ Support Request")
  }

  if (!unit || !status) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color={colors.primary} />
          <Text style={styles.emptyText}>No unit selected</Text>
        </View>
      </SafeAreaView>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)} hrs`
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Unit Information</Text>
            <Text style={styles.unitName}>{unit.name}</Text>
          </View>
          <View style={styles.unitBadge}>
            <Ionicons name="cube" size={20} color={colors.primary} />
          </View>
        </View>

        {/* System Status Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>System Status</Text>
            </View>
            <View style={[styles.statusBadge, status.systemStatus === "LOCKOUT" && styles.statusBadgeWarning]}>
              <Text style={styles.statusBadgeText}>{status.systemStatus || "NORMAL"}</Text>
            </View>
          </View>

          <View style={styles.statusGrid}>
            <StatusItem label="System Status" value={status.systemStatus || "NORMAL"} isWarning={status.systemStatus === "LOCKOUT"} />
            <StatusItem label="Reed" value={status.reedSwitchClosed ? "closed" : "open"} />
            <StatusItem label="Camera State" value={status.cameraState || "N/A"} />
            <StatusItem label="Network" value={status.networkStatus || "N/A"} />
            <StatusItem label="UUID" value={unit.uuid} isMonospace />
            <StatusItem label="Data Usage" value={`${status.dataUsageMB.toFixed(2)} MB`} />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.refreshButton} onPress={() => unit && (requestStatus(unit.uuid), requestAnalytics(unit.uuid))}>
              <Ionicons name="refresh" size={18} color={colors.primary} />
              <Text style={styles.refreshText}>Refresh Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearDataButton} onPress={handleResetData}>
              <Ionicons name="trash-outline" size={18} color={colors.primary} />
              <Text style={styles.clearDataText}>Clear Data</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Analytics Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="analytics" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Analytics</Text>
            </View>
          </View>

          <View style={styles.analyticsGrid}>
            <AnalyticsItem icon="stats-chart" label="Session Hours" value={formatHours(status.sessionHours)} />
            <AnalyticsItem icon="time" label="Lifetime Hours" value={formatHours(status.lifetimeHours)} />
            <AnalyticsItem icon="cloud-download" label="Data Usage" value={`${status.dataUsageMB.toFixed(2)} MB`} />
            <AnalyticsItem icon="hardware-chip" label="Firmware" value={unit.firmwareVersion} />
          </View>
        </Card>

        {/* Power History Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="flash" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Power History</Text>
            </View>
          </View>

          <View style={styles.powerHistory}>
            <PowerItem label="Last Power On" value={formatDate(status.lastPowerOn)} isOn />
            <PowerItem label="Last Power Off" value={formatDate(status.lastPowerOff)} isOn={false} />
          </View>
        </Card>

        {/* Registration Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Registration</Text>
            </View>
          </View>
          <View style={styles.registrationInfo}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.registrationText}>Bound on {formatDate(unit.bindDate)}</Text>
          </View>
        </Card>

        {/* Help Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="help-circle" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Need Help?</Text>
            </View>
          </View>
          <Text style={styles.helpText}>
            Having issues with your LinerVac+ unit? Our support team is here to help.
          </Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <Ionicons name="mail" size={18} color={colors.primary} />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

function StatusItem({ label, value, isWarning, isMonospace }: { label: string; value: string; isWarning?: boolean; isMonospace?: boolean }) {
  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusItemLabel}>{label}</Text>
      <Text style={[styles.statusItemValue, isWarning && styles.statusItemWarning, isMonospace && styles.monospace]}>
        {value}
      </Text>
    </View>
  )
}

function AnalyticsItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.analyticsItem}>
      <View style={styles.analyticsIconContainer}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <Text style={styles.analyticsLabel}>{label}</Text>
      <Text style={styles.analyticsValue}>{value}</Text>
    </View>
  )
}

function PowerItem({ label, value, isOn }: { label: string; value: string; isOn: boolean }) {
  return (
    <View style={styles.powerItem}>
      <View style={[styles.powerIconContainer, isOn ? styles.powerIconOn : styles.powerIconOff]}>
        <Ionicons name={isOn ? "power" : "close-circle"} size={20} color={isOn ? colors.success : colors.danger} />
      </View>
      <View style={styles.powerInfo}>
        <Text style={styles.powerLabel}>{label}</Text>
        <Text style={styles.powerValue}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },
  unitName: {
    ...typography.body,
    color: colors.textSecondary,
  },
  unitBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: `${colors.success}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusBadgeWarning: {
    backgroundColor: `${colors.danger}20`,
  },
  statusBadgeText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 10,
  },
  statusGrid: {
    gap: spacing.md,
  },
  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGrey,
  },
  statusItemLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  statusItemValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  statusItemWarning: {
    color: colors.danger,
  },
  monospace: {
    fontFamily: "monospace",
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  refreshButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    gap: spacing.xs,
    backgroundColor: `${colors.primary}20`,
    borderRadius: borderRadius.md,
  },
  refreshText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
  clearDataButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  clearDataText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  analyticsItem: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: colors.darkerGrey,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  analyticsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  analyticsLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  analyticsValue: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
  powerHistory: {
    gap: spacing.md,
  },
  powerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  powerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  powerIconOn: {
    backgroundColor: `${colors.success}20`,
  },
  powerIconOff: {
    backgroundColor: `${colors.danger}20`,
  },
  powerInfo: {
    flex: 1,
  },
  powerLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  powerValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  registrationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  registrationText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  helpText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}20`,
    gap: spacing.sm,
  },
  contactButtonText: {
    ...typography.button,
    color: colors.primary,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
})
