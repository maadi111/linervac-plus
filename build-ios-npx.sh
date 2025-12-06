#!/bin/bash

# LinerVac+ iOS Build Script (Using npx - No Installation Needed!)
# This script uses npx to run EAS CLI without global installation

echo ""
echo "════════════════════════════════════════════════"
echo "  📱 LinerVac+ iOS Build Setup (npx version)"
echo "════════════════════════════════════════════════"
echo ""
echo "✨ Using npx - no installation required!"
echo ""

echo "─────────────────────────────────────────────────"
echo "  Step 1: Login to Expo"
echo "─────────────────────────────────────────────────"
echo ""
echo "If you don't have an Expo account:"
echo "→ Visit https://expo.dev and sign up (free!)"
echo ""
read -p "Press Enter to login to Expo..."
npx eas-cli login

echo ""
echo "─────────────────────────────────────────────────"
echo "  Step 2: Initialize EAS Build"
echo "─────────────────────────────────────────────────"
echo ""
npx eas-cli build:configure

echo ""
echo "─────────────────────────────────────────────────"
echo "  Step 3: Choose Build Type"
echo "─────────────────────────────────────────────────"
echo ""
echo "1) Simulator Build (For testing on Mac)"
echo "2) TestFlight Build (For testing on real iPhone)"
echo "3) Production Build (For App Store)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🏗 Building for iOS Simulator..."
        npx eas-cli build --platform ios --profile development
        ;;
    2)
        echo ""
        echo "🏗 Building for TestFlight..."
        echo "⚠️  You'll need:"
        echo "   • Apple Developer Account ($99/year)"
        echo "   • Apple ID credentials"
        echo ""
        read -p "Press Enter to continue..."
        npx eas-cli build --platform ios --profile preview
        ;;
    3)
        echo ""
        echo "🏗 Building for App Store..."
        echo "⚠️  You'll need:"
        echo "   • Apple Developer Account"
        echo "   • App Store Connect setup"
        echo "   • Certificates and profiles"
        echo ""
        read -p "Press Enter to continue..."
        npx eas-cli build --platform ios --profile production
        ;;
    *)
        echo "❌ Invalid choice. Run script again."
        exit 1
        ;;
esac

echo ""
echo "════════════════════════════════════════════════"
echo "  🎉 Build Started!"
echo "════════════════════════════════════════════════"
echo ""
echo "📊 Monitor progress at: https://expo.dev"
echo "⏱️  Estimated time: 15-20 minutes"
echo ""
echo "You'll receive:"
echo "  • Build completion notification"
echo "  • Download link for .ipa file"
echo "  • Installation instructions"
echo ""
echo "════════════════════════════════════════════════"

