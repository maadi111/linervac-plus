import { View, TextInput, Text, StyleSheet, type TextInputProps, type ViewStyle } from "react-native"
import { colors, borderRadius, spacing, typography } from "../../constants/theme"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput 
        style={[styles.input, error && styles.inputError]} 
        placeholderTextColor={colors.textMuted} 
        {...props} 
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.darkGrey,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.textPrimary, // White text on dark background
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
})
