import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography, borderRadius, shadows } from "../../constants/theme"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import type { RootStackParamList } from "../../types"

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Auth">

export function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>LinerVac+</Text>
          </View>
          <Text style={styles.tagline}>Pool Automation Control</Text>
        </View>

        {/* Welcome Card */}
        <Card variant="elevated" style={styles.welcomeCard}>
          <Text style={styles.title}>Welcome to LinerVac+</Text>
          <Text style={styles.subtitle}>
            Take control of your pool vacuum and water-valve automation system with ease.
          </Text>

          <View style={styles.features}>
            <FeatureItem icon="water" text="Real-time vacuum control" />
            <FeatureItem icon="logo-dropbox" text="Water valve automation" />
            <FeatureItem icon="videocam" text="Live camera monitoring" />
            <FeatureItem icon="notifications" text="Instant alerts & notifications" />
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title="Sign In"
          onPress={() => navigation.navigate("Login")}
          size="lg"
          style={styles.button}
        />
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate("ProfileSetup")}
        >
          <Text style={styles.createAccountText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  logoText: {
    ...typography.h1,
    color: colors.white,
    fontWeight: "800",
    letterSpacing: 2,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  welcomeCard: {
    padding: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.md,
    fontWeight: "700",
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  features: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  button: {
    ...shadows.md,
    marginBottom: spacing.md,
  },
  createAccountButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  createAccountText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
})
