#!/bin/bash

echo ""
echo "════════════════════════════════════════════════"
echo "  🚀 Quick GitHub iOS Setup (Manual Token)"
echo "════════════════════════════════════════════════"
echo ""

# Check GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI not found!"
    echo ""
    echo "Install it with:"
    echo "  sudo apt install gh"
    echo ""
    exit 1
fi

# Check GitHub auth
if ! gh auth status &> /dev/null; then
    echo "🔐 Login to GitHub:"
    gh auth login
fi

echo "Step 1: Get Expo Token"
echo "─────────────────────────────────────────────────"
echo ""
echo "Go to: https://expo.dev/accounts/maadi01/settings/access-tokens"
echo ""
echo "1. Click 'Create Token'"
echo "2. Name: 'GitHub Actions'"  
echo "3. Copy the token"
echo ""
read -p "Paste your Expo token here: " expo_token

if [ -z "$expo_token" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

echo ""
echo "✅ Token received!"

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo ""
    echo "Step 2: Initialize Git"
    echo "─────────────────────────────────────────────────"
    git init
    git add .
    git commit -m "Initial commit - LinerVac+ app"
fi

echo ""
echo "Step 3: Create GitHub Repository"
echo "─────────────────────────────────────────────────"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "✅ Git remote already configured"
    repo_url=$(git remote get-url origin)
    echo "   $repo_url"
else
    read -p "Repository name (default: linervac-plus): " repo_name
    repo_name=${repo_name:-linervac-plus}
    
    echo ""
    echo "Creating repository: $repo_name"
    gh repo create "$repo_name" --public --source=. --remote=origin
fi

echo ""
echo "Step 4: Add Expo Token to GitHub Secrets"
echo "─────────────────────────────────────────────────"
echo ""
echo "$expo_token" | gh secret set EXPO_TOKEN

echo ""
echo "Step 5: Push Code to GitHub"
echo "─────────────────────────────────────────────────"
git add .
git commit -m "Add GitHub Actions workflow" 2>/dev/null || echo "Nothing to commit"
git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || echo "Already pushed"

echo ""
echo "════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "════════════════════════════════════════════════"
echo ""
echo "🎉 Your GitHub Actions iOS build is ready!"
echo ""
echo "📊 Monitor builds:"
echo "  gh run list"
echo "  gh run watch"
echo ""
echo "🚀 Trigger build manually:"
echo "  gh workflow run ios-build.yml"
echo ""
echo "🌐 View on GitHub:"
repo_info=$(gh repo view --json url --jq .url)
echo "  $repo_info/actions"
echo ""
echo "💡 Builds happen automatically on 'git push'!"
echo ""
echo "════════════════════════════════════════════════"
echo ""

