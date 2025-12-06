import { useState } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography, borderRadius, shadows } from "../../constants/theme"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import { useAuthStore } from "../../stores/authStore"
import type { RootStackParamList } from "../../types"

type ProfileSetupNavigationProp = NativeStackNavigationProp<RootStackParamList, "ProfileSetup">

export function ProfileSetupScreen() {
  const navigation = useNavigation<ProfileSetupNavigationProp>()
  const { setUser } = useAuthStore()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)

    try {
      await setUser({
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        createdAt: new Date().toISOString(),
      })

      // Navigation will happen automatically via RootNavigator
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setLoading(false)
    }
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
              <Ionicons name="person-add" size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Create Your Profile</Text>
            <Text style={styles.subtitle}>Enter your information to get started with LinerVac+</Text>
          </View>

          {/* Form Card */}
          <Card variant="elevated" style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Ionicons name="person" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={name}
                    onChangeText={setName}
                    error={errors.name}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="mail" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Input
                    label="Email Address"
                    placeholder="john@example.com"
                    value={email}
                    onChangeText={setEmail}
                    error={errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="call" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Input
                    label="Phone Number"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChangeText={setPhone}
                    error={errors.phone}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                  />
                </View>
              </View>
            </View>
          </Card>

          <View style={styles.footer}>
            <Button title="Continue" onPress={handleSubmit} loading={loading} size="lg" style={styles.button} />
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
  formCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  inputIcon: {
    marginTop: spacing.md + 4, // Align with input field
  },
  inputWrapper: {
    flex: 1,
  },
  footer: {
    marginTop: spacing.md,
  },
  button: {
    ...shadows.md,
  },
})
