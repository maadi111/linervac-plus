# 🔧 Quick Fix for EAS Project Creation Error

## The Issue

You got: `request to https://api.expo.dev/graphql failed`

This happens when the EAS project needs to be created manually first.

---

## ✅ Solution: Create Project on Expo Website

### Step 1: Go to Expo Dashboard

Visit: **https://expo.dev/accounts/maadi01/projects**

### Step 2: Create New Project

1. Click **"+ New Project"** button
2. Fill in details:
   - **Project Name**: `linervac-plus`
   - **Account**: `maadi01` (your account)
3. Click **"Create Project"**

### Step 3: Get Project ID

After creation, you'll see a **Project ID** like:
```
abc12345-6789-def0-1234-567890abcdef
```

Copy this ID!

### Step 4: Update app.json

```bash
nano app.json
```

Find this section:
```json
"extra": {
  "eas": {
    "projectId": ""
  }
}
```

Replace with:
```json
"extra": {
  "eas": {
    "projectId": "abc12345-6789-def0-1234-567890abcdef"
  }
},
"owner": "maadi01"
```

Save and exit (Ctrl+X, Y, Enter)

### Step 5: Try Build Again

```bash
npx eas-cli build --platform ios --profile preview
```

---

## 🚀 Alternative: Let EAS Create Automatically

If the website method doesn't work, try this command directly:

```bash
# Set project owner
npx eas-cli init --id

# Then build
npx eas-cli build --platform ios --profile preview
```

---

## 🔍 Troubleshooting Network Error

If you keep getting network errors:

### Check 1: Internet Connection
```bash
ping expo.dev
# Should see responses
```

### Check 2: Firewall/VPN
- Disable VPN temporarily
- Check if firewall blocks api.expo.dev
- Try different network

### Check 3: API Status
Visit: https://status.expo.dev
Check if Expo services are operational

### Check 4: Retry with Timeout Increase
```bash
# Set longer timeout
export EAS_BUILD_TIMEOUT=300000
npx eas-cli build --platform ios --profile preview
```

---

## 💡 Quick Commands Reference

```bash
# Login to Expo
npx eas-cli login

# Check who you're logged in as
npx eas-cli whoami

# Create/link project
npx eas-cli init

# Configure build
npx eas-cli build:configure

# Start iOS build
npx eas-cli build --platform ios --profile preview

# Check build status
npx eas-cli build:list

# View build logs
npx eas-cli build:view [build-id]
```

---

## 🎯 Recommended Next Steps

1. **Create project on Expo website** (easiest!)
   - Go to https://expo.dev
   - Create project manually
   - Copy project ID

2. **Update app.json** with project ID

3. **Run build command directly:**
   ```bash
   npx eas-cli build --platform ios --profile preview
   ```

---

## 📞 Still Having Issues?

Try the manual approach:

```bash
# 1. Login (already done)
npx eas-cli login

# 2. Initialize project
npx eas-cli init

# 3. Configure iOS build
npx eas-cli build:configure

# 4. Build for iOS
npx eas-cli build --platform ios --profile preview --non-interactive
```

If errors persist, share the error message and we'll debug further!

