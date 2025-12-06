
import { useRef, useState } from "react"
import { TouchableOpacity, Text, StyleSheet, View, Animated, Vibration } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, borderRadius, spacing, typography, shadows } from "../constants/theme"

interface ControlButtonProps {
  label: string
  icon: keyof typeof Ionicons.glyphMap
  isOn: boolean
  onToggle: () => void
  disabled?: boolean
  requiresDoubleTap?: boolean
}

export function ControlButton({
  label,
  icon,
  isOn,
  onToggle,
  disabled = false,
  requiresDoubleTap = true,
}: ControlButtonProps) {
  const [tapCount, setTapCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current
  const tapTimeout = useRef<NodeJS.Timeout | null>(null)

  const handlePress = () => {
    if (disabled) return

    if (!requiresDoubleTap) {
      onToggle()
      return
    }

    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start()

    if (tapCount === 0) {
      // First tap - show hint
      setTapCount(1)
      setShowHint(true)
      Vibration.vibrate(50)

      tapTimeout.current = setTimeout(() => {
        setTapCount(0)
        setShowHint(false)
      }, 1500)
    } else {
      // Second tap - execute action
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current)
      }
      setTapCount(0)
      setShowHint(false)
      Vibration.vibrate(100)
      onToggle()
    }
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.button, isOn ? styles.buttonOn : styles.buttonOff, disabled && styles.buttonDisabled]}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <View style={[styles.iconContainer, isOn ? styles.iconContainerOn : styles.iconContainerOff]}>
          <Ionicons name={icon} size={32} color={isOn ? colors.success : colors.danger} />
        </View>
        <Text style={[styles.label, isOn && styles.labelOn]}>{label}</Text>
        <View style={[styles.statusDot, isOn ? styles.statusOn : styles.statusOff]} />

        {showHint && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>Tap again to {isOn ? "turn off" : "turn on"}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    minWidth: 140,
    ...shadows.md,
    borderWidth: 3,
  },
  buttonOn: {
    borderColor: colors.success,
  },
  buttonOff: {
    borderColor: colors.danger,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  iconContainerOn: {
    backgroundColor: `${colors.success}20`,
  },
  iconContainerOff: {
    backgroundColor: `${colors.danger}20`,
  },
  label: {
    ...typography.button,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  labelOn: {
    color: colors.success,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusOn: {
    backgroundColor: colors.success,
  },
  statusOff: {
    backgroundColor: colors.danger,
  },
  hintContainer: {
    position: "absolute",
    bottom: -30,
    backgroundColor: colors.darkGrey,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  hintText: {
    ...typography.caption,
    color: colors.white,
  },
})
