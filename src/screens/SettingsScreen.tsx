import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography, borderRadius, shadows } from "../constants/theme"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { useAuthStore } from "../stores/authStore"
import { useUnitsStore } from "../stores/unitsStore"
import { useMqttStore } from "../stores/mqttStore"

export function SettingsScreen() {
  const { user, logout } = useAuthStore()
  const { units, removeUnit } = useUnitsStore()
  const { disconnect } = useMqttStore()

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          disconnect()
          logout()
        },
      },
    ])
  }

  const handleRemoveUnit = (unitId: string, unitName: string) => {
    Alert.alert("Remove Unit", `Are you sure you want to remove "${unitName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeUnit(unitId),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* User Profile Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="person-circle" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Profile</Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <InfoRow icon="person" label="Name" value={user?.name ?? "N/A"} />
            <InfoRow icon="mail" label="Email" value={user?.email ?? "N/A"} />
            <InfoRow icon="call" label="Phone" value={user?.phone ?? "N/A"} />
          </View>
        </Card>

        {/* Bound Units Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="cube" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Bound Units</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{units.length}</Text>
            </View>
          </View>

          {units.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No units bound</Text>
              <Text style={styles.emptySubtext}>Add a unit from the Home screen</Text>
            </View>
          ) : (
            <View style={styles.unitsList}>
              {units.map((unit) => (
                <View key={unit.id} style={styles.unitItem}>
                  <View style={styles.unitIconContainer}>
                    <Ionicons name="cube" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.unitInfo}>
                    <Text style={styles.unitName}>{unit.name}</Text>
                    <Text style={styles.unitUuid}>{unit.uuid}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveUnit(unit.id, unit.name)} style={styles.removeButton}>
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Notification Settings Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Notifications</Text>
            </View>
            <View style={styles.notificationBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            </View>
          </View>

          <View style={styles.notificationInfo}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingDescription}>
              Reed switch alerts are enabled by default. Notifications will repeat every 15 minutes until acknowledged.
            </Text>
          </View>
        </Card>

        {/* App Info Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>About</Text>
            </View>
          </View>

          <View style={styles.aboutInfo}>
            <InfoRow icon="logo-react" label="App Version" value="1.0.0" />
            <InfoRow icon="build" label="Build" value="2024.12.05" />
          </View>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.white} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <Ionicons name={icon as any} size={18} color={colors.textSecondary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
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
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: "800",
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
  countBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    minWidth: 32,
    alignItems: "center",
  },
  countText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "700",
  },
  profileInfo: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.darkerGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontWeight: "600",
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  unitsList: {
    gap: spacing.md,
  },
  unitItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkerGrey,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  unitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  unitInfo: {
    flex: 1,
  },
  unitName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs / 2,
  },
  unitUuid: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: "monospace",
  },
  removeButton: {
    padding: spacing.sm,
  },
  notificationBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.success}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationInfo: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  aboutInfo: {
    gap: spacing.md,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.danger,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginTop: spacing.md,
    ...shadows.md,
  },
  logoutButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: "700",
  },
})
