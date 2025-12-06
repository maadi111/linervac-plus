import { useState, useEffect, useRef, memo } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native"
import { colors, spacing, typography } from "../constants/theme"

interface ToggleSwitchProps {
  label: string
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
  requiresDoubleTap?: boolean
}

export const ToggleSwitch = memo(function ToggleSwitch({
  label,
  value,
  onValueChange,
  disabled = false,
  requiresDoubleTap = false,
}: ToggleSwitchProps) {
  const [tapCount, setTapCount] = useState(0)
  const [internalValue, setInternalValue] = useState(value)
  const lockoutRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sync with prop value (with lockout protection)
  useEffect(() => {
    if (!lockoutRef.current) {
      setInternalValue(value)
    }
  }, [value])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handlePress = () => {
    if (disabled) return

    if (!requiresDoubleTap) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Lock out prop updates for 3 seconds
      lockoutRef.current = true
      
      // Toggle value immediately
      const newValue = !internalValue
      setInternalValue(newValue)
      onValueChange(newValue)
      
      // Release lockout after 3 seconds
      timeoutRef.current = setTimeout(() => {
        lockoutRef.current = false
        setInternalValue(value) // Sync with prop after lockout
      }, 3000)
      return
    }

    // Double tap logic
    if (tapCount === 0) {
      setTapCount(1)
      setTimeout(() => setTapCount(0), 1500)
    } else {
      setTapCount(0)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      lockoutRef.current = true
      const newValue = !internalValue
      setInternalValue(newValue)
      onValueChange(newValue)
      timeoutRef.current = setTimeout(() => {
        lockoutRef.current = false
        setInternalValue(value)
      }, 3000)
    }
  }

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text> : null}
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        style={[styles.switchContainer, disabled && styles.disabled]}
      >
        <Switch
          value={internalValue}
          onValueChange={undefined}
          disabled={true}
          trackColor={{ false: colors.darkGrey, true: colors.primary }}
          thumbColor={internalValue ? colors.white : colors.grey}
          ios_backgroundColor={colors.darkGrey}
        />
      </TouchableOpacity>
      {tapCount === 1 && requiresDoubleTap && (
        <Text style={styles.hint}>Tap again to {internalValue ? "turn off" : "turn on"}</Text>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  hint: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
  },
})
