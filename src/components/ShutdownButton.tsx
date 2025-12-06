
import { useState } from "react"
import { TouchableOpacity, Text, StyleSheet, View, Modal, Vibration } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, borderRadius, spacing, typography, shadows } from "../constants/theme"
import { Button } from "./ui/Button"

interface ShutdownButtonProps {
  onShutdown: () => void
  disabled?: boolean
}

export function ShutdownButton({ onShutdown, disabled = false }: ShutdownButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handlePress = () => {
    if (disabled) return
    Vibration.vibrate(100)
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    Vibration.vibrate([0, 100, 100, 100])
    onShutdown()
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="power" size={28} color={colors.white} />
        </View>
        <Text style={styles.label}>Safe Home</Text>
      </TouchableOpacity>

      <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.warningIcon}>
              <Ionicons name="warning" size={48} color={colors.warning} />
            </View>
            <Text style={styles.modalTitle}>Confirm Shutdown</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to initiate Safe Home shutdown? This will power down the entire system.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowConfirm(false)}
                style={styles.modalButton}
              />
              <Button title="Shutdown" variant="danger" onPress={handleConfirm} style={styles.modalButton} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.danger,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  label: {
    ...typography.button,
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    ...shadows.lg,
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.warning}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  modalMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
})
