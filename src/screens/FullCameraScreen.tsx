import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography } from "../constants/theme"
import { useUnitsStore } from "../stores/unitsStore"
import type { RootStackParamList } from "../types"

type FullCameraRouteProp = RouteProp<RootStackParamList, "FullCamera">

export function FullCameraScreen() {
  const navigation = useNavigation()
  const route = useRoute<FullCameraRouteProp>()
  const { units, unitStatuses } = useUnitsStore()

  const unit = units.find((u) => u.id === route.params.unitId)
  const status = unit ? unitStatuses[unit.id] : null

  return (
    <View style={styles.container}>
      <View style={styles.cameraView}>
        {status?.cameraOn ? (
          <Image
            source={{ uri: "https://placeholder.com/camera-feed" }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.offlineView}>
            <Ionicons name="videocam-off" size={80} color={colors.grey} />
            <Text style={styles.offlineText}>Camera is offline</Text>
          </View>
        )}
      </View>

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.unitBadge}>
            <Text style={styles.unitName}>{unit?.name ?? "Unknown Unit"}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, status?.cameraOn ? styles.statusOn : styles.statusOff]} />
            <Text style={styles.statusText}>{status?.cameraOn ? "LIVE" : "OFFLINE"}</Text>
          </View>

          <Text style={styles.hint}>Pinch to zoom</Text>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  cameraView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  offlineView: {
    alignItems: "center",
    justifyContent: "center",
  },
  offlineText: {
    ...typography.body,
    color: colors.grey,
    marginTop: spacing.md,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  unitBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  unitName: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    padding: spacing.lg,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusOn: {
    backgroundColor: colors.danger,
  },
  statusOff: {
    backgroundColor: colors.grey,
  },
  statusText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "700",
  },
  hint: {
    ...typography.caption,
    color: colors.grey,
  },
})
