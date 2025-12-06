import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, borderRadius, spacing, typography } from "../constants/theme"
import type { Unit } from "../types"

interface UnitSelectorProps {
  units: Unit[]
  activeUnitId: string | null
  onSelectUnit: (unitId: string) => void
  onAddUnit: () => void
}

export function UnitSelector({ units, activeUnitId, onSelectUnit, onAddUnit }: UnitSelectorProps) {
  if (units.length <= 1) return null

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {units.map((unit) => (
          <TouchableOpacity
            key={unit.id}
            style={[styles.tab, activeUnitId === unit.id && styles.tabActive]}
            onPress={() => onSelectUnit(unit.id)}
          >
            <Ionicons name="cube" size={16} color={activeUnitId === unit.id ? colors.white : colors.primary} />
            <Text style={[styles.tabText, activeUnitId === unit.id && styles.tabTextActive]}>{unit.name}</Text>
            <View style={[styles.onlineIndicator, unit.isOnline ? styles.online : styles.offline]} />
          </TouchableOpacity>
        ))}

        {units.length < 5 && (
          <TouchableOpacity style={styles.addButton} onPress={onAddUnit}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.white,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  online: {
    backgroundColor: colors.success,
  },
  offline: {
    backgroundColor: colors.grey,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
})
