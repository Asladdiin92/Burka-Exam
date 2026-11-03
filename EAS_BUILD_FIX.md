# 🔧 EAS Build Fix Guide

## Issue
The build is failing because it's using an old commit with asset references that don't exist.

## Solution
Rebuild with the latest commit that has the fixes.

---

## ✅ Step-by-Step Fix

### 1. Verify Latest Changes
```bash
cd D:\Burka-Exam\Mobile
git pull origin main
```

This ensures you have the latest app.json without asset references.

### 2. Clear Any Cached Data
```bash
# Clear local cache
rm -rf .expo
rm -rf node_modules/.cache

# Reinstall dependencies (optional but recommended)
npm install
```

### 3. Rebuild with Latest Code
```bash
eas build --platform android --profile preview --clear-cache
```

The `--clear-cache` flag ensures EAS uses your latest changes.

---

## 🎯 Alternative: Simple Retry

Just run:
```bash
cd D:\Burka-Exam\Mobile
eas build --platform android --profile preview
```

EAS should pick up the latest commit (84faf2d) which has the fixes.

---

## 📋 What Was Fixed

Commit `84faf2d` removed:
- ✅ All icon references
- ✅ All splash screen references  
- ✅ All plugins that need assets
- ✅ All adaptiveIcon references

Current app.json is minimal and should build successfully.

---

## 🔍 Verify Current Configuration

Run this to check your current app.json:
```bash
cat app.json
```

Should show:
```json
{
  "expo": {
    "name": "Burka Exam",
    "slug": "burka-exam",
    "version": "1.0.0",
    "android": {
      "package": "com.burkaexam.mobile",
      "versionCode": 1,
      "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
    },
    "plugins": [],
    "extra": {
      "eas": {
        "projectId": "cda4b880-ca35-4f71-9db9-d7ad932e2614"
      }
    }
  }
}
```

NO icon, splash, or adaptiveIcon fields!

---

## 🚀 Build Command

```bash
eas build --platform android --profile preview
```

Expected output:
```
✔ Uploaded to EAS Build
✔ Build queued
⠙ Building... (10-15 minutes)
✔ Build finished
```

---

## 📱 After Successful Build

1. Download APK from link provided
2. Test on Android device
3. Upload to GitHub Releases

---

## 🆘 If Still Fails

Share the error message and I'll create a different approach:
- Option A: Use local build instead of EAS
- Option B: Create even simpler configuration
- Option C: Use expo-dev-client approach

