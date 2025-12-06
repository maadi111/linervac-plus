# 🐙 GitHub + iOS Testing Guide

## Can GitHub CLI Build iOS Apps?

**Short answer:** Not directly, but GitHub Actions can!

**What each tool does:**
- **GitHub CLI** (`gh`) - Manages repos, PRs, issues (not for building apps)
- **GitHub Actions** - Automates builds using EAS/Xcode (perfect for iOS!)
- **EAS Build** - Expo's cloud build service (what actually builds the app)

---

## ✅ Best Solution: GitHub Actions + EAS

I already created a workflow for you! Here's how to use it:

### What You Get

**Automated iOS builds triggered by:**
- Push to main/master branch
- Pull requests
- Manual trigger (button click in GitHub)

**No local setup needed:**
- Runs on GitHub servers
- Uses your Expo account
- Builds automatically
- Emails you when complete

---

## 🚀 Setup GitHub Actions for iOS (5 Minutes)

### Step 1: Get Your Expo Token

```bash
# Login to Expo (already done)
npx eas-cli login

# Generate token for GitHub
npx eas-cli token:create

# Copy the token that appears
```

### Step 2: Create GitHub Repository

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - LinerVac+ iOS app"

# Create repo on GitHub
gh repo create linervac-plus --public --source=. --remote=origin --push
```

**Or manually:**
1. Go to: https://github.com/new
2. Name: `linervac-plus`
3. Create repository
4. Follow the push instructions

### Step 3: Add Expo Token to GitHub Secrets

**Via GitHub Website:**
1. Go to your repo: `https://github.com/[username]/linervac-plus`
2. Click: **Settings** → **Secrets and variables** → **Actions**
3. Click: **New repository secret**
4. Name: `EXPO_TOKEN`
5. Value: [Paste the token from Step 1]
6. Click: **Add secret**

**Or via GitHub CLI:**
```bash
# Set the secret
gh secret set EXPO_TOKEN

# Paste your token when prompted
```

### Step 4: Push Your Code

```bash
# Push to GitHub
git push origin main
```

### Step 5: Build Starts Automatically! 🎉

- Go to: **Actions** tab in GitHub
- See: Build running
- Wait: 15-20 minutes
- Get: Download link when complete

---

## 🎯 Using GitHub Actions

### Trigger Build Manually

**Via GitHub Website:**
1. Go to: **Actions** tab
2. Click: **iOS Build & Test**
3. Click: **Run workflow**
4. Select branch: `main`
5. Click: **Run workflow**

**Via GitHub CLI:**
```bash
gh workflow run ios-build.yml
```

### Check Build Status

```bash
# List workflow runs
gh run list --workflow=ios-build.yml

# Watch specific run
gh run watch

# View logs
gh run view --log
```

### Download Build Artifact

After build completes:
```bash
# List runs
gh run list

# Download artifacts from a run
gh run download [run-id]
```

Or visit Expo dashboard: https://expo.dev

---

## 📋 Complete Setup Script

Save this as `setup-github-ios.sh`:

```bash
#!/bin/bash

echo "🚀 Setting up GitHub Actions for iOS builds"
echo ""

# Step 1: Generate Expo token
echo "Step 1: Generate Expo token"
echo "─────────────────────────────────────"
npx eas-cli token:create
echo ""
echo "📋 Copy the token above!"
echo ""
read -p "Press Enter when you've copied the token..."

# Step 2: Create GitHub repo
echo ""
echo "Step 2: Create GitHub repository"
echo "─────────────────────────────────────"
gh repo create linervac-plus --public --source=. --remote=origin --push

# Step 3: Add secret
echo ""
echo "Step 3: Add Expo token as GitHub secret"
echo "─────────────────────────────────────"
echo "Paste your Expo token:"
gh secret set EXPO_TOKEN

# Step 4: Trigger first build
echo ""
echo "Step 4: Trigger first build"
echo "─────────────────────────────────────"
gh workflow run ios-build.yml

echo ""
echo "✅ Setup complete!"
echo ""
echo "Monitor build at:"
echo "https://github.com/$(gh repo view --json owner --jq .owner.login)/linervac-plus/actions"
echo ""
echo "Or run: gh run watch"
```

---

## 🔄 Workflow Features

Your `.github/workflows/ios-build.yml` includes:

**Automatic Triggers:**
- ✅ Push to main/master/develop
- ✅ Pull requests to main/master
- ✅ Manual trigger (workflow_dispatch)

**Build Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Setup Expo/EAS
5. Trigger iOS build
6. Report status

**Notifications:**
- ✅ Email when complete
- ✅ Comment on PRs
- ✅ GitHub status checks

---

## 💡 Advantages of GitHub Actions

**vs Local Building:**
- ✅ No Mac required
- ✅ No Xcode installation
- ✅ Runs in cloud
- ✅ Parallel builds possible

**vs Manual EAS:**
- ✅ Automatic on git push
- ✅ CI/CD pipeline
- ✅ Team collaboration
- ✅ Build history tracked

**Free Tier:**
- ✅ 2,000 minutes/month
- ✅ Unlimited for public repos
- ✅ All features included

---

## 🐛 Troubleshooting

### Error: "EXPO_TOKEN not found"
```bash
# Check secrets
gh secret list

# Set again
gh secret set EXPO_TOKEN
```

### Error: "Workflow not found"
```bash
# Check workflows exist
ls -la .github/workflows/

# Push workflows to GitHub
git add .github/workflows/
git commit -m "Add iOS build workflow"
git push
```

### Build Fails in GitHub Actions
```bash
# View logs
gh run view --log

# Check Expo dashboard
# https://expo.dev
```

---

## 📊 Comparison

| Method | Setup Time | Build Time | Cost | Apple Auth Needed? |
|--------|------------|------------|------|-------------------|
| **GitHub Actions** | 5 min | 15-20 min | FREE | Only for device builds |
| **Local EAS** | 2 min | 15-20 min | FREE | Only for device builds |
| **Local Xcode** | Hours | 5-10 min | FREE | Yes |

---

## 🎯 Recommended Workflow

1. **Development:**
   ```bash
   # Test locally (Android)
   npm run android
   ```

2. **iOS Testing:**
   ```bash
   # Push to GitHub
   git push origin main
   
   # Build starts automatically!
   # Or trigger manually:
   gh workflow run ios-build.yml
   ```

3. **Monitor:**
   ```bash
   # Watch build progress
   gh run watch
   
   # Or check GitHub Actions tab
   ```

4. **Download & Test:**
   - Get link from Expo email
   - Or download from GitHub artifacts
   - Install on simulator/device

---

## ✅ Quick Start

```bash
# 1. Install GitHub CLI (if not installed)
sudo apt install gh

# 2. Login to GitHub
gh auth login

# 3. Run setup script
chmod +x setup-github-ios.sh
./setup-github-ios.sh

# 4. Done! Builds happen automatically on push
git push origin main
```

---

## 🎉 Summary

**Yes, you can use GitHub for iOS testing!**

- ✅ GitHub Actions automates EAS builds
- ✅ No local Mac/Xcode needed
- ✅ Free for public repos
- ✅ Automatic on every push
- ✅ Download links provided
- ✅ Team collaboration built-in

**Still uses EAS under the hood, but:**
- Automated workflow
- No manual commands
- CI/CD pipeline included
- Professional development setup

Would you like me to set this up for you? 🚀

