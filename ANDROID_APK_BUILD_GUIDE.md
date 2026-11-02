# 📱 Build & Distribute Android APK - Complete Guide

## 🎯 Goal
Build an Android APK file that users can download from GitHub and install directly on their phones to use the Burka Exam mobile app offline.

---

## 📋 Prerequisites

Before building, ensure you have:
- ✅ Expo CLI installed globally: `npm install -g expo-cli eas-cli`
- ✅ Active Expo account (free): https://expo.dev/signup
- ✅ Your app configured in `Mobile/app.json`

---

## 🔧 Step 1: Update App Configuration

**File**: `Mobile/app.json`

Ensure these settings are correct:

```json
{
  "expo": {
    "name": "Burka Exam",
    "slug": "burka-exam",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "package": "com.burkaexam.mobile",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    }
  }
}
```

**Key Fields**:
- `package`: Unique identifier (com.burkaexam.mobile)
- `versionCode`: Increment with each release (1, 2, 3...)
- `version`: User-facing version (1.0.0, 1.0.1, etc.)

---

## 🏗️ Step 2: Build APK Using EAS Build

### Option A: Using EAS Build (Recommended - Cloud Build)

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Login to Expo
```bash
eas login
```

#### 3. Configure EAS Build
```bash
cd D:\Burka-Exam\Mobile
eas build:configure
```

This creates `eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

#### 4. Build APK
```bash
eas build --platform android --profile preview
```

**This will**:
- Build the APK in the cloud (5-15 minutes)
- Provide a download link when complete
- Store the APK on Expo servers for 30 days

#### 5. Download APK
- Click the link provided in terminal
- Or visit: https://expo.dev/accounts/YOUR_USERNAME/projects/burka-exam/builds
- Download the `.apk` file

---

### Option B: Local Build with Expo (Faster, But Requires Android Studio)

#### Prerequisites
- Android Studio installed
- Android SDK configured
- Java JDK installed

#### Build Command
```bash
cd D:\Burka-Exam\Mobile
npx expo run:android --variant release
```

**APK Location**:
```
Mobile/android/app/build/outputs/apk/release/app-release.apk
```

---

## 📤 Step 3: Upload APK to GitHub Releases

### Method 1: Via GitHub Website (Easiest)

1. **Go to your repo**: https://github.com/Burkakoo/Burka-Exam

2. **Click "Releases"** (right sidebar)

3. **Click "Create a new release"**

4. **Fill in the details**:
   - **Tag**: `v1.0.0` (version number)
   - **Release title**: `Burka Exam Mobile v1.0.0 - Android APK`
   - **Description**:
   ```markdown
   ## 📱 Burka Exam Mobile App - Android

   Download and install the official Burka Exam mobile app for offline practice.

   ### ✨ Features
   - 📚 Practice 9000+ EUEE questions offline
   - 📝 Take mock exams with timer
   - 📊 Track your progress and scores
   - 🏆 View leaderboard rankings
   - 💡 AI-powered tutor for explanations
   - 🔖 Bookmark difficult questions
   - 📖 Access study notes and materials

   ### 📥 Installation Instructions
   1. Download `burka-exam-v1.0.0.apk` below
   2. Open the file on your Android phone
   3. Allow installation from unknown sources (if prompted)
   4. Install and launch the app
   5. Login with your credentials or create an account

   ### ℹ️ Requirements
   - Android 5.0 or higher
   - 50MB free storage
   - Internet for initial login (offline afterwards)

   ### 🔗 Links
   - Backend API: https://burka-exam-backend.onrender.com
   - Web Portal: https://burkakoo.github.io/Burka-Exam
   - Telegram: https://t.me/Ethio_student_preparetion

   ### 📝 Changelog
   - Initial release
   - Full offline exam functionality
   - Premium notes for paid users
   - Telegram channel integration
   ```

5. **Attach APK file**:
   - Rename your APK to: `burka-exam-v1.0.0.apk`
   - Drag and drop it into the "Attach binaries" section

6. **Click "Publish release"**

### Method 2: Via Git Command Line

```bash
# Create and push a tag
git tag -a v1.0.0 -m "Release v1.0.0 - Android APK"
git push origin v1.0.0

# Use GitHub CLI to create release with APK
gh release create v1.0.0 burka-exam-v1.0.0.apk \
  --title "Burka Exam Mobile v1.0.0" \
  --notes "See release notes on GitHub"
```

---

## 🔗 Step 4: Share Download Link

After publishing the release, users can download from:

```
https://github.com/Burkakoo/Burka-Exam/releases/download/v1.0.0/burka-exam-v1.0.0.apk
```

**Direct download link format**:
```
https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/TAG/FILENAME.apk
```

---

## 📝 Step 5: Update README with Download Instructions

Add to your `README.md`:

```markdown
## 📱 Download Mobile App

### Android
Download the latest APK: [Burka Exam v1.0.0 APK](https://github.com/Burkakoo/Burka-Exam/releases/download/v1.0.0/burka-exam-v1.0.0.apk)

**Installation**:
1. Download the APK file
2. Open it on your Android device
3. Allow installation from unknown sources if prompted
4. Install and launch

**Requirements**: Android 5.0+

### iOS
Coming soon (requires Apple Developer account)
```

---

## 🔄 Updating the App (Future Releases)

When you make changes:

1. **Update version** in `Mobile/app.json`:
   ```json
   {
     "version": "1.0.1",
     "android": {
       "versionCode": 2
     }
   }
   ```

2. **Rebuild APK**:
   ```bash
   eas build --platform android --profile preview
   ```

3. **Create new release** on GitHub:
   - Tag: `v1.0.1`
   - Upload new APK: `burka-exam-v1.0.1.apk`

4. **Add changelog** in release notes

---

## ⚠️ Important Notes

### Security & Permissions
- Users will see "Install from unknown sources" warning (normal for APKs)
- This is safe - it's YOUR official app
- Alternative: Publish to Google Play Store (requires $25 one-time fee)

### APK vs AAB
- **APK** = Direct install (what we're building)
- **AAB** (Android App Bundle) = For Google Play Store only

### File Size
- Your APK will be ~30-50MB
- GitHub allows files up to 2GB per file

### Testing Before Release
```bash
# Install on connected Android device
adb install burka-exam-v1.0.0.apk

# Or test with emulator
```

---

## 🎯 Quick Command Reference

```bash
# Setup
npm install -g eas-cli
eas login
cd D:\Burka-Exam\Mobile

# Configure (first time only)
eas build:configure

# Build APK
eas build --platform android --profile preview

# Check build status
eas build:list

# View project on Expo
eas build:view
```

---

## 🆘 Troubleshooting

### Build Fails
- Check `app.json` for syntax errors
- Ensure `package` name is unique (com.burkaexam.mobile)
- Verify Expo account is active

### APK Too Large
- Remove unused dependencies
- Optimize images in `assets/` folder
- Use `--profile production` for smaller build

### Can't Upload to GitHub
- Check file size (max 2GB)
- Rename file to avoid special characters
- Try GitHub CLI if web upload fails

---

## 📞 Support Links

- **Expo Documentation**: https://docs.expo.dev/build/setup/
- **EAS Build Guide**: https://docs.expo.dev/build/introduction/
- **GitHub Releases**: https://docs.github.com/en/repositories/releasing-projects-on-github

---

## ✅ Checklist

- [ ] Update `app.json` with correct package name and version
- [ ] Update `.env` to point to production backend
- [ ] Install EAS CLI and login
- [ ] Run `eas build --platform android --profile preview`
- [ ] Download APK when build completes
- [ ] Rename APK to `burka-exam-v1.0.0.apk`
- [ ] Create GitHub release with tag `v1.0.0`
- [ ] Upload APK to release
- [ ] Add release notes with installation instructions
- [ ] Update README with download link
- [ ] Test APK on real Android device
- [ ] Share link with students

---

**Ready to build? Start with `eas build:configure` in your Mobile folder!**
