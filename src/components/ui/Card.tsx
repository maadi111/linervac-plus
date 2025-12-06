import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import { colors, borderRadius, spacing, shadows } from "../../constants/theme"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  variant?: "default" | "elevated"
}

export function Card({ children, style, variant = "default" }: CardProps) {
  return <View style={[styles.card, variant === "elevated" && shadows.md, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.darkGrey,
    ...shadows.md,
  },
})
