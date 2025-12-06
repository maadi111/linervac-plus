// LinerVac+ Theme - Dark theme with teal accents (matching UI design)

export const colors = {
  // Primary teal (accent color)
  primary: "#14B8A6", // Teal accent
  primaryLight: "#5EEAD4",
  primaryDark: "#0D9488",

  // Secondary blues
  secondary: "#0A4D8C",
  secondaryLight: "#1E6BB8",
  secondaryDark: "#063A6A",

  // Tans (for pool industry aesthetic)
  tan: "#D4B896",
  tanLight: "#E8D4BC",
  tanDark: "#B89B6A",

  // Neutrals (dark theme)
  white: "#FFFFFF",
  offWhite: "#F8F9FA",
  lightGrey: "#E9ECEF",
  grey: "#6C757D",
  darkGrey: "#343A40",
  darkerGrey: "#1E1E1E", // Dark background
  black: "#0A0A0A", // Almost black for darkest areas

  // Status colors
  success: "#10B981", // Green for ON states
  successLight: "#34D399",
  danger: "#EF4444", // Red for OFF states
  dangerLight: "#F87171",
  warning: "#F59E0B",
  warningBright: "#FCD34D",

  // Background (dark theme - less grey, more black)
  background: "#0F0F0F", // Darker, less grey background
  cardBackground: "#1F1F1F", // Slightly lighter for cards
  sectionBackground: "#1A1A1A", // For sections

  // Text (light text on dark)
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0A0",
  textLight: "#FFFFFF",
  textMuted: "#6B7280",
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
}

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
  },
}
