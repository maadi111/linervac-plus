#!/bin/bash

# Comprehensive Android License Fix
# Run with: sudo ./scripts/fix-all-android-licenses.sh

echo "📜 Creating All Android SDK License Files"
echo ""

LICENSE_DIR="/usr/lib/android-sdk/licenses"
mkdir -p "$LICENSE_DIR"

# Create all known license files with their hashes
cat > "$LICENSE_DIR/android-sdk-license" << 'EOF'
efa68a6b3c661d18699d5c026771d5911cdc2f83
EOF

cat > "$LICENSE_DIR/android-sdk-preview-license" << 'EOF'
24333f8a63b6825ea9c5514f83c2829b004d1fee
8933bad161af4178b1185d1a37fbf41ea5269c55
EOF

cat > "$LICENSE_DIR/android-googletv-license" << 'EOF'
601085b94cd77f0b54ff86406957099ebe79c4d6
EOF

cat > "$LICENSE_DIR/android-sdk-arm-dbt-license" << 'EOF'
33b6a2b64607f17b47f9f6d0b3c23e2d1c67084e
EOF

cat > "$LICENSE_DIR/intel-android-extra-license" << 'EOF'
d975f751698a77b662f1254ddbeed3901e976f5a
EOF

cat > "$LICENSE_DIR/google-gdk-license" << 'EOF'
8403addf88ab4874007e1c1e80a0025de2550a16
EOF

# Try NDK-specific license file
cat > "$LICENSE_DIR/android-ndk-license" << 'EOF'
8933bad161af4178b1185d1a37fbf41ea5269c55
EOF

echo "✅ All license files created!"
echo ""
echo "License files:"
ls -la "$LICENSE_DIR"
echo ""
echo "File contents:"
echo "--- android-sdk-preview-license ---"
cat "$LICENSE_DIR/android-sdk-preview-license"
echo ""
echo "Now try building:"
echo "  npm run android:dev"



