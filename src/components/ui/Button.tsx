import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"
import { colors, borderRadius, spacing, typography } from "../../constants/theme"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles = [styles.base, styles[variant], styles[`size_${size}`], disabled && styles.disabled, style]

  const textStyles = [styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? colors.primary : colors.white} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  size_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  size_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
    color: colors.white,
  },
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.textPrimary,
  },
  text_danger: {
    color: colors.white,
  },
  text_outline: {
    color: colors.primary,
  },
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
})
