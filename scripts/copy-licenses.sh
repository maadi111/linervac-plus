#!/bin/bash

# Copy Android SDK licenses to /usr/lib/android-sdk/licenses
# Run with: sudo ./scripts/copy-licenses.sh

echo "📜 Copying Android SDK licenses..."
echo ""

SOURCE_LICENSES="$HOME/Android/Sdk/licenses"
TARGET_LICENSES="/usr/lib/android-sdk/licenses"

if [ ! -d "$SOURCE_LICENSES" ]; then
  echo "❌ Source licenses directory not found: $SOURCE_LICENSES"
  exit 1
fi

# Create target directory
mkdir -p "$TARGET_LICENSES"

# Copy all license files
echo "Copying license files from $SOURCE_LICENSES to $TARGET_LICENSES..."
cp "$SOURCE_LICENSES"/* "$TARGET_LICENSES/" 2>/dev/null

# Ensure NDK license exists
if [ ! -f "$TARGET_LICENSES/android-sdk-preview-license" ]; then
  echo "Creating android-sdk-preview-license..."
  cat > "$TARGET_LICENSES/android-sdk-preview-license" << 'EOF'
24333f8a63b6825ea9c5514f83c2829b004d1fee
8933bad161af4178b1185d1a37fbf41ea5269c55
EOF
fi

echo ""
echo "✅ License files copied!"
echo ""
echo "License files in $TARGET_LICENSES:"
ls -la "$TARGET_LICENSES"

echo ""
echo "Now try building:"
echo "  npm run android:dev"


