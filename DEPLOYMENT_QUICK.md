# QUICK DEPLOYMENT REFERENCE

## 🚀 Quick Start (5 Main Steps)

### 1️⃣ Setup MongoDB (5 minutes)
- Create free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
- Create cluster → Create user → Allow all IPs → Get connection string

### 2️⃣ Push to GitHub (5 minutes)
cd D:\Burka-Exam
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/burka-exam.git
git push -u origin main

### 3️⃣ Deploy Backend to Render (10 minutes)
- Create free Render account: https://render.com
- New Web Service → Connect GitHub repo
- Root Directory: Backend
- Build: npm install
- Start: npm start
- Add Environment Variables (see DEPLOYMENT.md)

### 4️⃣ Deploy Web to GitHub Pages (5 minutes)
cd D:\Burka-Exam\Web
npm install --save-dev gh-pages
# Update package.json (see DEPLOYMENT.md)
npm run deploy

### 5️⃣ Setup Mobile (2 minutes)
cd D:\Burka-Exam\Mobile
# Update .env with your Render backend URL
EXPO_PUBLIC_API_URL=https://burka-exam-backend.onrender.com/api

## 📝 Environment Variables for Render

NODE_ENV=production
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-random-32-char-string>
BCRYPT_SALT_ROUNDS=12
CLIENT_ORIGINS=https://YOUR_USERNAME.github.io

## 🔗 Your URLs After Deployment

Backend:  https://burka-exam-backend.onrender.com
Web:      https://YOUR_USERNAME.github.io/burka-exam/HTML/index.html
Mobile:   Expo Go app (scan QR code)

## 💰 Cost: 100% FREE

MongoDB Atlas (Free): 512 MB storage
Render (Free): 750 hours/month
GitHub Pages (Free): Unlimited
Expo (Free): Development mode

## 📚 Full Guide

See DEPLOYMENT.md for detailed step-by-step instructions!
