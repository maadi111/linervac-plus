#!/bin/bash

# Create symlink for NDK 29 to /usr/lib/android-sdk/ndk
# Run with: sudo ./scripts/create-ndk-symlink.sh

echo "🔗 Creating NDK symlink..."
echo ""

SOURCE_NDK="$HOME/Android/Sdk/ndk/29.0.14206865"
TARGET_DIR="/usr/lib/android-sdk/ndk"
TARGET_NDK="$TARGET_DIR/29.0.14206865"

if [ ! -d "$SOURCE_NDK" ]; then
  echo "❌ Source NDK not found: $SOURCE_NDK"
  exit 1
fi

# Create target directory
mkdir -p "$TARGET_DIR"

# Remove existing symlink or directory if it exists
if [ -e "$TARGET_NDK" ]; then
  echo "Removing existing $TARGET_NDK..."
  rm -rf "$TARGET_NDK"
fi

# Create symlink
echo "Creating symlink: $TARGET_NDK -> $SOURCE_NDK"
ln -sf "$SOURCE_NDK" "$TARGET_NDK"

echo ""
echo "✅ Symlink created!"
echo ""
echo "Verifying:"
ls -la "$TARGET_NDK"

echo ""
echo "Now try building:"
echo "  npm run android:dev"


