import { useState } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography, borderRadius, shadows } from "../../constants/theme"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import { useAuthStore } from "../../stores/authStore"
import { apiService } from "../../services/api"
import type { RootStackParamList } from "../../types"

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Auth">

export function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const { login, isLoading, error } = useAuthStore()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setLocalError("Please enter both username and password")
      return
    }

    setLocalError("")
    const success = await login(username.trim(), password.trim())

    if (success) {
      // Navigation will be handled by RootNavigator
      Alert.alert("Success", "Logged in successfully!", [{ text: "OK" }])
    } else {
      setLocalError("Invalid credentials. Please try again.")
    }
  }

  const handleQuickLogin = () => {
    // Pre-fill with provided credentials for testing
    setUsername("admin")
    setPassword("LinerVac1")
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="log-in" size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to access your LinerVac+ account</Text>
          </View>

          {/* Login Card */}
          <Card variant="elevated" style={styles.loginCard}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Ionicons name="person" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Input
                    label="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoComplete="username"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="lock-closed" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                </View>
              </View>

              {(localError || error) && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color={colors.danger} />
                  <Text style={styles.errorText}>{localError || error}</Text>
                </View>
              )}

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                size="lg"
                style={styles.loginButton}
              />

              {/* Quick login for testing */}
              <TouchableOpacity style={styles.quickLoginButton} onPress={handleQuickLogin}>
                <Ionicons name="flash" size={16} color={colors.primary} />
                <Text style={styles.quickLoginText}>Use Test Credentials</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Alternative Options */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ProfileSetup")}>
              <Text style={styles.footerLink}>Create Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  loginCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  inputIcon: {
    marginTop: spacing.md + 4,
  },
  inputWrapper: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: `${colors.danger}20`,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.danger,
    flex: 1,
  },
  loginButton: {
    marginTop: spacing.sm,
    ...shadows.md,
  },
  quickLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  quickLoginText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
})

