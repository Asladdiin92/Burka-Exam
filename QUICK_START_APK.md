# 📱 Android APK Build & Distribution - Quick Reference

## 🚀 **TL;DR - Fast Track**

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Go to Mobile folder
cd D:\Burka-Exam\Mobile

# 3. Login to Expo
eas login

# 4. Configure (first time only)
eas build:configure

# 5. Build APK
eas build --platform android --profile preview

# 6. Wait 5-15 minutes, download APK

# 7. Upload to GitHub Releases
# Go to: https://github.com/Burkakoo/Burka-Exam/releases/new
```

---

## 📚 **Available Documentation**

| File | Purpose |
|------|---------|
| `ANDROID_APK_BUILD_GUIDE.md` | Complete build guide with all methods |
| `GITHUB_RELEASE_TEMPLATE.md` | Copy-paste template for GitHub release |
| `BUILD_ANDROID_APK.ps1` | Quick-start script (run this!) |
| `TEST_ACCOUNTS.md` | Login credentials for testing |

---

## 🎯 **Step-by-Step (Beginner-Friendly)**

### **Step 1: Prepare (One-time setup)**

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Create Expo Account** (if you don't have one):
   - Visit: https://expo.dev/signup
   - Use your email
   - Verify email

3. **Update production URL** (already done ✅):
   - `Mobile/.env` has correct backend URL

### **Step 2: Build the APK**

1. **Open PowerShell/Terminal**

2. **Navigate to Mobile folder**:
   ```bash
   cd D:\Burka-Exam\Mobile
   ```

3. **Login to Expo**:
   ```bash
   eas login
   ```
   - Enter your Expo email and password

4. **Configure EAS** (first time only):
   ```bash
   eas build:configure
   ```
   - Press Enter when prompted
   - Select "All" for platforms

5. **Build the APK**:
   ```bash
   eas build --platform android --profile preview
   ```
   
   **What happens**:
   - Uploads your code to Expo servers
   - Builds APK in the cloud
   - Takes 5-15 minutes
   - Shows progress bar
   - Provides download link when done

6. **Download your APK**:
   - Click the link in terminal
   - Or visit: https://expo.dev
   - Click on your project "burka-exam"
   - Go to "Builds"
   - Download the latest APK

### **Step 3: Test the APK**

**Option A: Test on Real Phone**
1. Transfer APK to your Android phone
2. Open the file
3. Allow installation
4. Install and test

**Option B: Test with Android Emulator**
1. Open Android Studio
2. Start emulator
3. Drag APK onto emulator
4. Test the app

### **Step 4: Upload to GitHub**

1. **Rename your APK**:
   ```
   burka-exam-v1.0.0.apk
   ```

2. **Go to GitHub**:
   - Visit: https://github.com/Burkakoo/Burka-Exam
   - Click "Releases" (right sidebar)
   - Click "Create a new release"

3. **Fill the form**:
   - **Tag**: `v1.0.0`
   - **Title**: `Burka Exam Mobile v1.0.0`
   - **Description**: Copy from `GITHUB_RELEASE_TEMPLATE.md`
   - **Attach file**: Drag and drop your APK

4. **Publish release**

### **Step 5: Share with Students**

**Download Link**:
```
https://github.com/Burkakoo/Burka-Exam/releases/download/v1.0.0/burka-exam-v1.0.0.apk
```

**Share via**:
- Telegram: https://t.me/Ethio_student_preparetion
- Facebook/WhatsApp groups
- School announcements
- Email

---

## 🔄 **Updating the App (Future)**

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

2. **Rebuild**:
   ```bash
   eas build --platform android --profile preview
   ```

3. **Create new release** on GitHub:
   - Tag: `v1.0.1`
   - New APK: `burka-exam-v1.0.1.apk`

---

## 📊 **Build Profiles Explained**

Your `Mobile/eas.json` will have:

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

- **preview**: For testing (what we use)
- **production**: For Google Play Store

---

## ⚡ **Pro Tips**

1. **Build Time**:
   - First build: 10-15 minutes
   - Subsequent builds: 5-10 minutes

2. **Check Build Status**:
   ```bash
   eas build:list
   ```

3. **View in Browser**:
   ```bash
   eas build:view
   ```

4. **Cancel Build**:
   - Press Ctrl+C in terminal
   - Or cancel on Expo website

5. **Build Logs**:
   - Available on Expo dashboard
   - Useful for debugging errors

---

## 🆘 **Common Issues & Fixes**

### "EAS CLI not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "Build failed"
- Check `app.json` syntax
- Verify package name is unique
- Check build logs on Expo

### "Can't download APK"
- Check internet connection
- Try opening link in browser
- Check Expo dashboard

### "APK won't install"
- Enable "Unknown Sources" on phone
- Check Android version (need 5.0+)
- Clear previous installation

---

## 📞 **Get Help**

- **Expo Docs**: https://docs.expo.dev/build/introduction/
- **GitHub Issues**: https://github.com/Burkakoo/Burka-Exam/issues
- **Telegram**: https://t.me/Ethio_student_preparetion
- **Email**: burkamuhammed3@gmail.com

---

## ✅ **Pre-Flight Checklist**

Before building, verify:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Expo account created
- [ ] EAS CLI installed (`eas --version`)
- [ ] In Mobile folder (`cd D:\Burka-Exam\Mobile`)
- [ ] `.env` has production URL
- [ ] `app.json` version is correct

---

## 🎉 **You're Ready!**

**Quick Command**:
```bash
cd D:\Burka-Exam\Mobile && eas login && eas build --platform android --profile preview
```

That's it! In 15 minutes you'll have your APK ready to distribute!

**Good luck! 🚀**
