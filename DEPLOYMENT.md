# Burka-Exam Deployment Guide

Complete step-by-step guide to deploy your application to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deploy Backend to Render](#deploy-backend-to-render)
3. [Deploy Web Frontend to GitHub Pages](#deploy-web-frontend-to-github-pages)
4. [Deploy Mobile App](#deploy-mobile-app)
5. [Post-Deployment Configuration](#post-deployment-configuration)

---

## Prerequisites

### Required Accounts
- [ ] GitHub account (free)
- [ ] Render account (free tier available - https://render.com)
- [ ] MongoDB Atlas account (free tier available - https://www.mongodb.com/cloud/atlas)
- [ ] Expo account (for mobile deployment - https://expo.dev)

### Local Setup
- [ ] Git installed on your computer
- [ ] Node.js installed (v18 or higher)
- [ ] Your project code ready at D:\Burka-Exam

---

## 1. Deploy Backend to Render

### Step 1.1: Prepare MongoDB Atlas

1. **Log in to MongoDB Atlas** (https://cloud.mongodb.com)

2. **Create a Database Cluster** (if you haven''t already):
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select a cloud provider and region (choose closest to your users)
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `burkaexam_admin` (or your choice)
   - Password: Click "Autogenerate Secure Password" and **SAVE IT SAFELY**
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
   - **Note**: For production, you should whitelist specific IPs later

5. **Get Connection String**:
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` with your database username
   - Replace `<password>` with the password you saved
   - Add `/burkaexam` before the `?` to specify database name:
     ```
     mongodb+srv://burkaexam_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/burkaexam?retryWrites=true&w=majority
     ```
   - **SAVE THIS CONNECTION STRING** - you''ll need it for Render

### Step 1.2: Push Code to GitHub

1. **Create a GitHub Repository**:
   ```powershell
   # Open PowerShell in D:\Burka-Exam
   cd D:\Burka-Exam
   ```

2. **Initialize Git** (if not already done):
   ```powershell
   git init
   ```

3. **Create .gitignore** (to exclude sensitive files):
   ```powershell
   @"
   # Dependencies
   node_modules/
   
   # Environment variables
   .env
   .env.local
   .env.production
   
   # Build outputs
   dist/
   build/
   .vite/
   
   # Logs
   logs/
   *.log
   npm-debug.log*
   
   # OS files
   .DS_Store
   Thumbs.db
   
   # IDE
   .vscode/
   .idea/
   
   # Expo
   .expo/
   
   # React Native
   .expo-shared/
   "@ | Out-File -FilePath ".gitignore" -Encoding UTF8
   ```

4. **Commit and Push**:
   ```powershell
   git add .
   git commit -m "Initial commit - Burka-Exam application"
   ```

5. **Create GitHub repository**:
   - Go to https://github.com/new
   - Repository name: `burka-exam`
   - Description: "Ethiopian entrance exam preparation platform"
   - Choose "Public" or "Private"
   - **DO NOT** initialize with README (you already have one)
   - Click "Create repository"

6. **Push to GitHub**:
   ```powershell
   # Replace YOUR_USERNAME with your GitHub username
   git remote add origin https://github.com/YOUR_USERNAME/burka-exam.git
   git branch -M main
   git push -u origin main
   ```

### Step 1.3: Deploy Backend on Render

1. **Log in to Render** (https://dashboard.render.com)

2. **Create New Web Service**:
   - Click "New +" button
   - Select "Web Service"
   - Click "Build and deploy from a Git repository"
   - Click "Next"

3. **Connect GitHub Repository**:
   - Click "Connect account" to connect your GitHub
   - Authorize Render to access your repositories
   - Find and select your `burka-exam` repository
   - Click "Connect"

4. **Configure Web Service**:
   - **Name**: `burka-exam-backend`
   - **Region**: Choose closest to your users (e.g., Oregon (US West))
   - **Branch**: `main`
   - **Root Directory**: `Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or choose paid plan)

5. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable" and add these:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://burkaexam_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/burkaexam?retryWrites=true&w=majority
   JWT_SECRET=YOUR_SUPER_SECRET_KEY_MIN_32_CHARACTERS_LONG_RANDOM_STRING
   BCRYPT_SALT_ROUNDS=12
   CLIENT_ORIGIN=https://YOUR_USERNAME.github.io
   CLIENT_ORIGINS=https://YOUR_USERNAME.github.io/burka-exam,https://burka-exam-backend.onrender.com
   ```

   **IMPORTANT**:
   - Replace `MONGODB_URI` with your actual MongoDB connection string
   - Replace `JWT_SECRET` with a random 32+ character string (generate one below)
   - Replace `YOUR_USERNAME` with your GitHub username (you''ll get this URL in Step 2)

   **Generate JWT_SECRET** (run in PowerShell):
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

6. **Create Web Service**:
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment to complete
   - Your backend will be available at: `https://burka-exam-backend.onrender.com`

7. **Verify Backend is Running**:
   - Once deployed, click on your service URL
   - Add `/api/health` to the URL: `https://burka-exam-backend.onrender.com/api/health`
   - You should see: `{"status":"ok","timestamp":"..."}`

8. **Important Note About Free Tier**:
   - Free Render services spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading to paid tier for production use

---

## 2. Deploy Web Frontend to GitHub Pages

### Step 2.1: Update Web Configuration

1. **Update API URL in Web/.env**:
   ```powershell
   cd D:\Burka-Exam\Web
   
   @"
   VITE_API_URL=https://burka-exam-backend.onrender.com/api
   "@ | Out-File -FilePath ".env.production" -Encoding UTF8
   ```

2. **Install GitHub Pages deployment package**:
   ```powershell
   cd D:\Burka-Exam\Web
   npm install --save-dev gh-pages
   ```

3. **Update Web/package.json** to add deployment scripts:
   ```powershell
   cd D:\Burka-Exam\Web
   ```
   
   Open `Web/package.json` and add these fields:
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/burka-exam",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

4. **Update vite.config.js** for GitHub Pages:
   
   Create or update `Web/vite.config.js`:
   ```javascript
   import { defineConfig } from ''vite''
   import react from ''@vitejs/plugin-react''
   
   export default defineConfig({
     plugins: [react()],
     base: ''/burka-exam/'',
     build: {
       outDir: ''dist'',
       assetsDir: ''assets'',
       rollupOptions: {
         output: {
           manualChunks: undefined
         }
       }
     }
   })
   ```

### Step 2.2: Update HTML Entry Point

1. **Update Web/HTML/index.html** to fix asset paths:
   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Burka-Exam Admin Dashboard</title>
       <link rel="stylesheet" href="/CSS/styles.css" />
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/JavaScript/src/main.jsx"></script>
     </body>
   </html>
   ```

### Step 2.3: Deploy to GitHub Pages

1. **Build and deploy**:
   ```powershell
   cd D:\Burka-Exam\Web
   npm run deploy
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/burka-exam`
   - Click "Settings" tab
   - Scroll down to "Pages" in left sidebar
   - Under "Source", ensure `gh-pages` branch is selected
   - Click "Save"

3. **Access Your Web App**:
   - Wait 2-3 minutes
   - Visit: `https://YOUR_USERNAME.github.io/burka-exam/HTML/index.html`
   - Your web dashboard should load and connect to your Render backend

### Step 2.4: Update CORS on Backend

Go back to Render dashboard and update `CLIENT_ORIGINS`:
```
CLIENT_ORIGINS=https://YOUR_USERNAME.github.io,https://burka-exam-backend.onrender.com
```
Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 3. Deploy Mobile App

### Option A: Expo Go (Easiest for Testing)

1. **Update Mobile API URL**:
   ```powershell
   cd D:\Burka-Exam\Mobile
   
   @"
   EXPO_PUBLIC_API_URL=https://burka-exam-backend.onrender.com/api
   EXPO_PUBLIC_APP_NAME=Burka-Exam
   EXPO_PUBLIC_APP_VERSION=1.0.0
   "@ | Out-File -FilePath ".env" -Encoding UTF8
   ```

2. **Test Locally First**:
   ```powershell
   cd D:\Burka-Exam\Mobile
   npm install
   npm start
   ```
   - Scan QR code with Expo Go app on your phone
   - Test that the app connects to your Render backend

### Option B: Build APK/IPA (For Distribution)

#### For Android APK:

1. **Install EAS CLI**:
   ```powershell
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```powershell
   cd D:\Burka-Exam\Mobile
   eas login
   ```

3. **Configure EAS Build**:
   ```powershell
   eas build:configure
   ```

4. **Update app.json** with your details:
   ```json
   {
     "expo": {
       "name": "Burka-Exam",
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
         "package": "com.yourcompany.burkaexam",
         "versionCode": 1,
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#ffffff"
         }
       },
       "ios": {
         "bundleIdentifier": "com.yourcompany.burkaexam",
         "buildNumber": "1.0.0"
       },
       "extra": {
         "eas": {
           "projectId": "YOUR_PROJECT_ID"
         }
       }
     }
   }
   ```

5. **Build Android APK**:
   ```powershell
   eas build --platform android --profile preview
   ```
   - This creates an APK file you can distribute
   - Wait 10-20 minutes for build to complete
   - Download APK from Expo dashboard

6. **Build for Google Play Store** (optional):
   ```powershell
   eas build --platform android --profile production
   ```

#### For iOS (Requires Mac):

1. **Build iOS App**:
   ```powershell
   eas build --platform ios --profile production
   ```

2. **Submit to App Store**:
   ```powershell
   eas submit --platform ios
   ```

### Option C: Publish Update Over-The-Air (OTA):

1. **Publish Update**:
   ```powershell
   cd D:\Burka-Exam\Mobile
   eas update --branch production --message "Initial release"
   ```

---

## 4. Post-Deployment Configuration

### Step 4.1: Seed Production Database

1. **Update Backend seed script** to run in production:
   ```powershell
   # SSH into Render or use Render Shell
   # In Render Dashboard → Your Service → Shell tab
   npm run seed
   ```

   Or create an API endpoint to trigger seeding (recommended for security).

### Step 4.2: Create Admin User

Option 1: Using MongoDB Atlas UI:
1. Go to MongoDB Atlas → Collections
2. Find `users` collection
3. Insert document:
   ```json
   {
     "name": "Admin User",
     "email": "admin@burka-exam.com",
     "password": "$2a$12$YOUR_HASHED_PASSWORD",
     "role": "admin",
     "status": "active",
     "isEmailVerified": true,
     "createdAt": {"$date": "2024-01-01T00:00:00.000Z"}
   }
   ```

Option 2: Register through API and manually update role in database.

### Step 4.3: Update Backend Environment Variables

If you need to update environment variables:
1. Go to Render Dashboard
2. Select your service
3. Click "Environment" in left sidebar
4. Update variables
5. Service will automatically redeploy

### Step 4.4: Monitor Your Application

1. **Render Logs**:
   - Render Dashboard → Your Service → Logs
   - Monitor for errors

2. **MongoDB Atlas Monitoring**:
   - MongoDB Atlas → Metrics
   - Check database performance

3. **Set Up Alerts** (optional):
   - Render: Set up Slack/email alerts
   - MongoDB: Set up performance alerts

---

## 5. Deployment Checklist

### Before Going Live:

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with strong password
- [ ] Backend deployed to Render and health check passing
- [ ] Environment variables set correctly on Render
- [ ] Web frontend deployed to GitHub Pages
- [ ] CORS configured to allow your frontend domain
- [ ] Mobile app tested with production backend
- [ ] Admin user created in database
- [ ] Database seeded with initial data (subjects, chapters, questions)
- [ ] SSL/HTTPS working (Render provides this automatically)
- [ ] API rate limiting configured
- [ ] Error logging working (check Render logs)

### Security Checklist:

- [ ] JWT_SECRET is strong and random (32+ characters)
- [ ] MongoDB password is strong
- [ ] .env files are in .gitignore (never commit secrets)
- [ ] MongoDB network access properly configured
- [ ] Rate limiting enabled on all endpoints
- [ ] CORS only allows your domains
- [ ] Helmet security headers enabled
- [ ] User passwords hashed with bcrypt

### Testing Checklist:

- [ ] Can register new user
- [ ] Email verification works
- [ ] Can login with credentials
- [ ] JWT token refresh works
- [ ] Can access protected endpoints
- [ ] Web dashboard loads correctly
- [ ] Mobile app connects to backend
- [ ] Offline sync works in mobile app
- [ ] File uploads work (if applicable)
- [ ] Payment processing works (if applicable)

---

## 6. Updating Your Deployment

### Update Backend:

```powershell
cd D:\Burka-Exam
git add .
git commit -m "Update backend"
git push origin main
```
Render will automatically redeploy.

### Update Web Frontend:

```powershell
cd D:\Burka-Exam\Web
npm run deploy
```

### Update Mobile App:

```powershell
cd D:\Burka-Exam\Mobile
eas update --branch production --message "Bug fixes"
```

---

## 7. Troubleshooting

### Backend Issues:

**Problem**: Backend won''t start
- Check Render logs for errors
- Verify MONGODB_URI is correct
- Ensure all required environment variables are set

**Problem**: Database connection fails
- Check MongoDB Atlas network access (0.0.0.0/0 allowed)
- Verify database user credentials
- Check connection string format

**Problem**: CORS errors
- Add your frontend domain to CLIENT_ORIGINS
- Ensure no trailing slashes in URLs

### Frontend Issues:

**Problem**: Web app shows blank page
- Check browser console for errors
- Verify VITE_API_URL is correct
- Check that backend is accessible

**Problem**: API calls fail
- Verify backend URL is correct
- Check CORS configuration
- Ensure backend is running (may need to wake up from sleep)

### Mobile Issues:

**Problem**: Can''t connect to backend
- Verify EXPO_PUBLIC_API_URL is correct
- Check that device has internet connection
- Ensure backend is accessible from mobile network

**Problem**: Build fails
- Check app.json configuration
- Verify all required assets exist
- Check EAS build logs

---

## 8. Cost Estimates

### Free Tier:
- MongoDB Atlas: Free (512 MB storage)
- Render: Free (750 hours/month, sleeps after 15 min inactivity)
- GitHub Pages: Free
- Expo: Free (with Expo Go, limited builds)

### Recommended Paid Tier (for production):
- MongoDB Atlas: $9/month (M2 shared cluster)
- Render: $7/month (always-on, custom domain)
- Expo: $29/month (unlimited builds)
- **Total**: ~$45/month

---

## 9. Custom Domain (Optional)

### For Backend (Render):
1. Purchase domain (e.g., api.burka-exam.com)
2. Render Dashboard → Settings → Custom Domain
3. Add domain and follow DNS instructions

### For Web (GitHub Pages):
1. Purchase domain (e.g., burka-exam.com)
2. Create CNAME file in Web/public: `burka-exam.com`
3. Update DNS records as per GitHub instructions
4. GitHub repo Settings → Pages → Custom domain

---

## 10. Resources

- [Render Documentation](https://render.com/docs)
- [GitHub Pages Guide](https://pages.github.com/)
- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [EAS Build](https://docs.expo.dev/build/setup/)

---

## Support

For issues specific to Burka-Exam deployment, check:
- Render logs for backend errors
- Browser console for frontend errors
- Expo logs for mobile errors

Good luck with your deployment! 🚀
