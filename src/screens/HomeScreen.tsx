import { useEffect, useState, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography, borderRadius, shadows } from "../constants/theme"
import { ToggleSwitch } from "../components/ToggleSwitch"
import { CameraPreview } from "../components/CameraPreview"
import { UnitSelector } from "../components/UnitSelector"
import { Card } from "../components/ui/Card"
import { useUnitsStore } from "../stores/unitsStore"
import { useMqttStore } from "../stores/mqttStore"
import type { RootStackParamList } from "../types"

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Main">

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const { units, activeUnitId, setActiveUnit, getActiveUnit, getActiveUnitStatus, updateUnitStatus } = useUnitsStore()
  const { connect, isConnected, sendCommand, requestStatus, requestAnalytics } = useMqttStore()
  const [shutdownModalVisible, setShutdownModalVisible] = useState(false)
  const [shutdownHoldTime, setShutdownHoldTime] = useState(0)
  const [shutdownInterval, setShutdownInterval] = useState<NodeJS.Timeout | null>(null)

  const activeUnit = getActiveUnit()
  const status = getActiveUnitStatus()

  // Connect to MQTT on mount
  useEffect(() => {
    if (!isConnected) {
      connect()
    }
    // Status updates come automatically via MQTT state topics
  }, [isConnected, connect])

  // Status updates come automatically via MQTT state topics
  // No need for periodic polling - Node-RED publishes changes
  // useEffect(() => {
  //   if (!isConnected || !activeUnit) return
  //   const interval = setInterval(() => {
  //     requestStatus(activeUnit.uuid)
  //     requestAnalytics(activeUnit.uuid)
  //   }, 30000)
  //   return () => clearInterval(interval)
  // }, [isConnected, activeUnit, requestStatus, requestAnalytics])

  // Optimized toggle handler
  const handleControl = useCallback((control: "camera" | "reed" | "fan" | "waterValve", newValue: boolean) => {
    if (!activeUnit) return

    // Update status immediately
    const statusUpdate = {
      camera: { cameraOn: newValue },
      reed: { reedSwitchClosed: newValue },
      fan: { fanOn: newValue },
      waterValve: { waterValveOn: newValue }
    }[control]

    updateUnitStatus(activeUnit.id, statusUpdate)

    // Send MQTT command
    sendCommand(activeUnit.uuid, control, newValue)
  }, [activeUnit, updateUnitStatus, sendCommand])

  const handleResumeOperation = useCallback(() => {
    if (!activeUnit) return
    sendCommand(activeUnit.uuid, "resume", true)
    updateUnitStatus(activeUnit.id, {
      systemStatus: "NORMAL",
      powerLockout: false,
    })
  }, [activeUnit, sendCommand, updateUnitStatus])

  const handleShutdownPress = useCallback(() => {
    // Use setTimeout to defer state updates after render
    setTimeout(() => {
      setShutdownModalVisible(true)
      setShutdownHoldTime(0)
      
      // Simulate 5-second hold
      const interval = setInterval(() => {
        setShutdownHoldTime((prev) => {
          const newTime = prev + 0.1
          if (newTime >= 5) {
            clearInterval(interval)
            setShutdownInterval(null)
            handleShutdownConfirm()
            return 5
          }
          return newTime
        })
      }, 100)

      setShutdownInterval(interval)
    }, 0)
  }, [])

  const handleShutdownConfirm = useCallback(() => {
    if (!activeUnit) return

    if (shutdownInterval) {
      clearInterval(shutdownInterval)
      setShutdownInterval(null)
    }
    
    // Defer state updates
    setTimeout(() => {
      setShutdownModalVisible(false)
      setShutdownHoldTime(0)
      
      // Turn off all controls and set shutdown status
      updateUnitStatus(activeUnit.id, {
        cameraOn: false,
        waterValveOn: false,
        fanOn: false,
        systemStatus: "SHUTDOWN",
      })

      // Send shutdown command (Node-RED holds GPIO 3 LOW for 5s)
      sendCommand(activeUnit.uuid, "shutdown", true)
    }, 0)
  }, [activeUnit, shutdownInterval, updateUnitStatus, sendCommand])

  const handleShutdownCancel = useCallback(() => {
    if (shutdownInterval) {
      clearInterval(shutdownInterval)
      setShutdownInterval(null)
    }
    
    setTimeout(() => {
      setShutdownModalVisible(false)
      setShutdownHoldTime(0)
    }, 0)
  }, [shutdownInterval])

  const handleCameraPress = () => {
    if (activeUnit) {
      navigation.navigate("FullCamera", { unitId: activeUnit.id })
    }
  }

  const handleAddUnit = () => {
    navigation.navigate("BindUnit")
  }

  if (!activeUnit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color={colors.primary} />
          <Text style={styles.emptyText}>No unit selected</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddUnit}>
            <Ionicons name="add" size={20} color={colors.white} style={{ marginRight: spacing.xs }} />
            <Text style={styles.addButtonText}>Add Unit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header with Connection Status */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>LinerVac+</Text>
            </View>
            <View style={styles.connectionBadge}>
              <View style={[styles.connectionDot, isConnected ? styles.connected : styles.disconnected]} />
              <Text style={styles.connectionText}>{isConnected ? "Connected" : "Disconnected"}</Text>
            </View>
          </View>
          <View style={styles.unitInfo}>
            <Text style={styles.unitName}>{activeUnit.name}</Text>
            <Text style={styles.unitUuid}>{activeUnit.uuid.substring(0, 12)}...</Text>
          </View>
        </View>

        {/* Unit Selector */}
        {units.length > 1 && (
          <View style={styles.unitSelectorWrapper}>
            <UnitSelector
              units={units}
              activeUnitId={activeUnitId}
              onSelectUnit={setActiveUnit}
              onAddUnit={handleAddUnit}
            />
          </View>
        )}

        {/* Live Camera Section */}
        <Card variant="elevated" style={styles.cameraCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="videocam" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Live Camera</Text>
            </View>
            <View style={[styles.statusBadge, status?.cameraOn && styles.statusBadgeActive]}>
              <View style={[styles.statusDotSmall, status?.cameraOn && styles.statusDotActive]} />
              <Text style={styles.statusBadgeText}>{status?.cameraOn ? "LIVE" : "OFF"}</Text>
            </View>
          </View>
          <View style={styles.cameraContainer}>
            {status?.cameraOn ? (
              <CameraPreview isActive={true} onPress={handleCameraPress} />
            ) : (
              <TouchableOpacity style={styles.cameraOffContainer} onPress={handleCameraPress}>
                <Ionicons name="videocam-off" size={48} color={colors.textMuted} />
                <Text style={styles.cameraOffText}>Camera Off</Text>
                <Text style={styles.cameraOffSubtext}>Enable camera to view live feed</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Control Cards Grid */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <View style={styles.controlsGrid}>
            {/* Camera Control */}
            <Card variant="elevated" style={styles.controlCard}>
              <View style={styles.controlCardHeader}>
                <Ionicons name="videocam" size={28} color={colors.primary} />
                <Text style={styles.controlLabel}>Camera</Text>
              </View>
              <ToggleSwitch
                label=""
                value={status?.cameraOn ?? false}
                onValueChange={(newValue) => handleControl("camera", newValue)}
                disabled={!isConnected}
              />
              <View style={styles.controlStatus}>
                <View style={[styles.statusIndicator, status?.cameraOn && styles.statusIndicatorActive]} />
                <Text style={styles.controlStatusText}>{status?.cameraOn ? "ON" : "OFF"}</Text>
              </View>
            </Card>

            {/* Reed Switch Control */}
            <Card variant="elevated" style={styles.controlCard}>
              <View style={styles.controlCardHeader}>
                <Ionicons name="magnet" size={28} color={colors.primary} />
                <Text style={styles.controlLabel}>Reed Switch</Text>
              </View>
              <ToggleSwitch
                label="Closed=ON"
                value={status?.reedSwitchClosed ?? false}
                onValueChange={(newValue) => handleControl("reed", newValue)}
                disabled={!isConnected}
              />
              <View style={styles.controlStatus}>
                <View style={[styles.statusIndicator, status?.reedSwitchClosed && styles.statusIndicatorActive]} />
                <Text style={styles.controlStatusText}>{status?.reedSwitchClosed ? "CLOSED" : "OPEN"}</Text>
              </View>
            </Card>

            {/* Fan Control */}
            <Card variant="elevated" style={styles.controlCard}>
              <View style={styles.controlCardHeader}>
                <Ionicons name="airplane" size={28} color={colors.primary} />
                <Text style={styles.controlLabel}>Fan</Text>
              </View>
              <ToggleSwitch
                label=""
                value={status?.fanOn ?? false}
                onValueChange={(newValue) => handleControl("fan", newValue)}
                disabled={!isConnected}
              />
              <View style={styles.controlStatus}>
                <View style={[styles.statusIndicator, status?.fanOn && styles.statusIndicatorActive]} />
                <Text style={styles.controlStatusText}>{status?.fanOn ? "ON" : "OFF"}</Text>
              </View>
            </Card>

            {/* Water Valve Control */}
            <Card variant="elevated" style={styles.controlCard}>
              <View style={styles.controlCardHeader}>
                <Ionicons name="water" size={28} color={colors.primary} />
                <Text style={styles.controlLabel}>Water Valve</Text>
              </View>
              <ToggleSwitch
                label=""
                value={status?.waterValveOn ?? false}
                onValueChange={(newValue) => handleControl("waterValve", newValue)}
                disabled={!isConnected}
              />
              <View style={styles.controlStatus}>
                <View style={[styles.statusIndicator, status?.waterValveOn && styles.statusIndicatorActive]} />
                <Text style={styles.controlStatusText}>{status?.waterValveOn ? "ON" : "OFF"}</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {status?.powerLockout && (
            <TouchableOpacity
              style={[styles.actionButton, styles.resumeButton, (!isConnected || !activeUnit) && styles.buttonDisabled]}
              onPress={handleResumeOperation}
              disabled={!isConnected || !activeUnit}
            >
              <Ionicons name="play-circle" size={24} color={colors.white} />
              <Text style={styles.actionButtonText}>Resume Operation</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.shutdownButton, (!isConnected || !activeUnit) && styles.buttonDisabled]}
            onPress={handleShutdownPress}
            disabled={!isConnected || !activeUnit}
          >
            <Ionicons name="power" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Shutdown (Hold 5s)</Text>
          </TouchableOpacity>
        </View>

        {/* System Status Card */}
        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>System Status</Text>
            </View>
          </View>
          
          <View style={styles.statusGrid}>
            <StatusItem 
              label="System Status" 
              value={status?.systemStatus || "NORMAL"} 
              isWarning={status?.systemStatus === "LOCKOUT"} 
            />
            <StatusItem 
              label="Reed Switch" 
              value={status?.reedState || (status?.reedSwitchClosed ? "closed" : "open")} 
            />
            <StatusItem 
              label="Camera State" 
              value={status?.cameraOn ? "ON" : "OFF"} 
            />
            <StatusItem 
              label="Network" 
              value={status?.networkActive ? `${status.networkActive} (${status.networkIP || "N/A"})` : (status?.networkStatus || "Unknown")} 
            />
            <StatusItem 
              label="Data Usage" 
              value={`${status?.dataUsageMB?.toFixed(2) || "0.00"} MB`} 
            />
          </View>

          <TouchableOpacity
            style={styles.clearDataButton}
            onPress={() => {
              Alert.alert("Clear Data", "Are you sure you want to clear data usage?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Clear",
                  style: "destructive",
                  onPress: () => {
                    updateUnitStatus(activeUnit.id, { dataUsageMB: 0 })
                  },
                },
              ])
            }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.primary} />
            <Text style={styles.clearDataText}>Clear Data</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {/* Shutdown Modal */}
      <Modal
        visible={shutdownModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleShutdownCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={48} color={colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Shutdown System</Text>
            <Text style={styles.modalMessage}>
              Hold for 5 seconds to confirm shutdown. This will power down all systems.
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(shutdownHoldTime / 5) * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.min(5, Math.ceil(shutdownHoldTime))}s</Text>
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={handleShutdownCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

function StatusItem({ label, value, isWarning }: { label: string; value: string; isWarning?: boolean }) {
  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusItemLabel}>{label}</Text>
      <Text style={[styles.statusItemValue, isWarning && styles.statusItemWarning]}>{value}</Text>
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
  logoContainer: {
    marginBottom: spacing.sm,
  },
  logoText: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: "800",
    letterSpacing: 1,
  },
  connectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
    gap: spacing.xs,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connected: {
    backgroundColor: colors.success,
  },
  disconnected: {
    backgroundColor: colors.danger,
  },
  connectionText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  unitInfo: {
    alignItems: "flex-end",
  },
  unitName: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  unitUuid: {
    ...typography.caption,
    color: colors.textMuted,
    fontFamily: "monospace",
    marginTop: spacing.xs,
  },
  unitSelectorWrapper: {
    marginBottom: spacing.lg,
  },
  cameraCard: {
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkGrey,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusBadgeActive: {
    backgroundColor: `${colors.success}20`,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.grey,
  },
  statusDotActive: {
    backgroundColor: colors.success,
  },
  statusBadgeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
    fontSize: 10,
  },
  cameraContainer: {
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginTop: spacing.xs,
  },
  cameraOffContainer: {
    height: 200,
    backgroundColor: colors.darkerGrey,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  cameraOffText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  cameraOffSubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  controlsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: "700",
  },
  controlsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  controlCard: {
    flex: 1,
    minWidth: "47%",
    padding: spacing.lg,
  },
  controlCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  controlLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  controlStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.darkGrey,
  },
  statusIndicatorActive: {
    backgroundColor: colors.success,
  },
  controlStatusText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  actionsSection: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  resumeButton: {
    backgroundColor: colors.primary,
  },
  shutdownButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  statusCard: {
    marginBottom: spacing.md,
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
  },
  statusItemValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  statusItemWarning: {
    color: colors.danger,
  },
  clearDataButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  clearDataText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
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
    marginBottom: spacing.xl,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  addButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    ...shadows.lg,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.danger}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: "700",
  },
  modalMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  progressBarContainer: {
    width: "100%",
    marginBottom: spacing.lg,
  },
  progressBar: {
    width: "100%",
    height: 12,
    backgroundColor: colors.darkGrey,
    borderRadius: borderRadius.full,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressText: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: "center",
    fontWeight: "700",
  },
  cancelButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.darkGrey,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: "700",
  },
})
