import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, borderRadius, spacing, typography, shadows } from "../constants/theme"

interface CameraPreviewProps {
  isActive: boolean
  streamUrl?: string
  onPress: () => void
}

export function CameraPreview({ isActive, streamUrl, onPress }: CameraPreviewProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.preview}>
        {isActive && streamUrl ? (
          <Image source={{ uri: streamUrl }} style={styles.stream} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name={isActive ? "videocam" : "videocam-off"}
              size={48}
              color={isActive ? colors.primary : colors.grey}
            />
            <Text style={styles.placeholderText}>{isActive ? "Tap to view full screen" : "Camera Off"}</Text>
          </View>
        )}

        <View style={styles.badge}>
          <View style={[styles.statusDot, isActive ? styles.statusOn : styles.statusOff]} />
          <Text style={styles.badgeText}>{isActive ? "LIVE" : "OFF"}</Text>
        </View>

        <View style={styles.expandIcon}>
          <Ionicons name="expand" size={20} color={colors.white} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  preview: {
    height: 200,
    backgroundColor: colors.darkGrey,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  stream: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    ...typography.bodySmall,
    color: colors.grey,
    marginTop: spacing.sm,
  },
  badge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusOn: {
    backgroundColor: colors.success,
  },
  statusOff: {
    backgroundColor: colors.grey,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "700",
  },
  expandIcon: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
})
