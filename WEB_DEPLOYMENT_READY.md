# Web Portal Deployment to GitHub Pages

## ✅ Backend Status
- **URL**: https://burka-exam-backend.onrender.com
- **Status**: ✅ Live and running
- **Database**: ✅ Connected to MongoDB Atlas

---

## 🚀 Deploy Web Portal Now

### Step 1: Install gh-pages package
\\\ash
cd D:\Burka-Exam\Web
npm install
\\\

### Step 2: Build and Deploy
\\\ash
npm run deploy
\\\

This will:
1. Build the production version (connects to Render backend)
2. Deploy to GitHub Pages
3. Make it available at: https://burkakoo.github.io/Burka-Exam

---

## 📝 Configuration Files Created

✅ **Web/.env.production** - Backend URL for production
\\\
VITE_API_URL=https://burka-exam-backend.onrender.com
\\\

✅ **Web/vite.config.js** - Added base path for GitHub Pages
\\\javascript
base: "/Burka-Exam/"
\\\

✅ **Web/package.json** - Added deployment scripts
\\\json
"homepage": "https://burkakoo.github.io/Burka-Exam",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
\\\

---

## 🔍 After Deployment

1. **Visit Web Portal**: https://burkakoo.github.io/Burka-Exam
2. **Test Staff Login** with your admin credentials
3. **Verify** it connects to the Render backend

---

## 📱 Next: Mobile App Setup

After Web deployment succeeds, update Mobile app:

### Update Mobile/.env
\\\ash
cd D:\Burka-Exam\Mobile
\\\

**Edit Mobile/.env**:
\\\
EXPO_PUBLIC_API_URL=https://burka-exam-backend.onrender.com/api
\\\

### Test Mobile App
\\\ash
npx expo start
\\\

---

## ⚠️ Troubleshooting

**If npm install fails/hangs:**
Try with increased timeout:
\\\ash
npm install --fetch-timeout=600000
\\\

Or install just gh-pages:
\\\ash
npm install gh-pages --save-dev --fetch-timeout=600000
\\\

**If deployment fails:**
Check that you're logged into GitHub:
\\\ash
git config user.name
git config user.email
\\\

---

## 🎯 Summary

**What's Ready:**
- ✅ Backend live on Render
- ✅ Web configured for GitHub Pages
- ✅ Production environment set up

**Next Steps:**
1. Run: \
pm install\ in Web folder
2. Run: \
pm run deploy\ in Web folder
3. Access: https://burkakoo.github.io/Burka-Exam
4. Update Mobile/.env and test
