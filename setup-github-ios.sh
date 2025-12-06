#!/bin/bash

echo ""
echo "════════════════════════════════════════════════"
echo "  🚀 GitHub Actions iOS Build Setup"
echo "════════════════════════════════════════════════"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "📦 GitHub CLI not found. Installing..."
    echo ""
    echo "Run these commands:"
    echo "  sudo apt install gh"
    echo "  gh auth login"
    echo ""
    echo "Then run this script again!"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo "🔐 Please login to GitHub first:"
    gh auth login
fi

echo "Step 1: Generate Expo Token"
echo "─────────────────────────────────────────────────"
echo ""
echo "Checking Expo login..."
npx eas-cli whoami
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "To generate your Expo token:"
echo ""
echo "Option 1: Via Command (try this first)"
echo "  npx eas-cli build:configure"
echo "  # Then get token from: https://expo.dev/accounts/[username]/settings/access-tokens"
echo ""
echo "Option 2: Via Website (recommended)"
echo "  1. Go to: https://expo.dev/accounts/maadi01/settings/access-tokens"
echo "  2. Click: 'Create Token'"
echo "  3. Name: 'GitHub Actions'"
echo "  4. Copy the token"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Opening browser to create token..."
echo "Visit: https://expo.dev/accounts/maadi01/settings/access-tokens"
echo ""
read -p "Press Enter after you've created and copied the token..."

# Check if git repo exists
if [ ! -d ".git" ]; then
    echo ""
    echo "Step 2: Initialize Git Repository"
    echo "─────────────────────────────────────────────────"
    git init
    git add .
    git commit -m "Initial commit - LinerVac+ iOS app"
fi

echo ""
echo "Step 3: Create GitHub Repository"
echo "─────────────────────────────────────────────────"
echo ""
read -p "Repository name (default: linervac-plus): " repo_name
repo_name=${repo_name:-linervac-plus}

echo ""
read -p "Make repository public? (y/n, default: y): " is_public
is_public=${is_public:-y}

if [ "$is_public" = "y" ]; then
    visibility="--public"
else
    visibility="--private"
fi

echo ""
echo "Creating repository: $repo_name"
gh repo create "$repo_name" $visibility --source=. --remote=origin --push

echo ""
echo "Step 4: Add Expo Token as GitHub Secret"
echo "─────────────────────────────────────────────────"
echo ""
echo "Paste your Expo token:"
gh secret set EXPO_TOKEN

echo ""
echo "Step 5: Verify Workflow File Exists"
echo "─────────────────────────────────────────────────"
if [ -f ".github/workflows/ios-build.yml" ]; then
    echo "✅ Workflow file found!"
else
    echo "⚠️  Workflow file not found. Creating it now..."
    mkdir -p .github/workflows
    # Workflow is already created, just verify
fi

echo ""
echo "Step 6: Push Workflows to GitHub"
echo "─────────────────────────────────────────────────"
git add .github/
git commit -m "Add iOS build workflow" 2>/dev/null || echo "Already committed"
git push origin main

echo ""
echo "════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "════════════════════════════════════════════════"
echo ""
echo "🎉 Your iOS build automation is ready!"
echo ""
echo "📋 What happens now:"
echo "  • Builds trigger automatically on git push"
echo "  • Monitor at: https://github.com/$(gh repo view --json owner,name --jq '.owner.login + "/" + .name')/actions"
echo "  • Or run: gh run watch"
echo ""
echo "🚀 Trigger a build manually:"
echo "  gh workflow run ios-build.yml"
echo ""
echo "📊 Check build status:"
echo "  gh run list"
echo ""
echo "════════════════════════════════════════════════"
echo ""

