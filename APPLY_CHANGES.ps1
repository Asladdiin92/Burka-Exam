# Quick Implementation Script
# Run this to apply premium notes restriction and Telegram link changes

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Burka Exam: Premium Notes & Telegram Setup   " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Manual Steps Required:" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 1: Update Notes Controller" -ForegroundColor Green
Write-Host "File: Backend/src/controllers/notes.controller.js"  
Write-Host "Line 16-20: Replace the if (!isStaff) block with premium check"
Write-Host "See: PREMIUM_NOTES_TELEGRAM_GUIDE.md for exact code"
Write-Host ""

Write-Host "STEP 2: Update Profile Screen (Mobile)" -ForegroundColor Green
Write-Host "File: Mobile/src/screens/ProfileScreen.js"
Write-Host "- Add 'Linking' to React Native imports (line 2)"
Write-Host "- Add Telegram link section after phone field"
Write-Host "See: PREMIUM_NOTES_TELEGRAM_GUIDE.md for exact code"
Write-Host ""

Write-Host "STEP 3: Update Student with Telegram Link" -ForegroundColor Green
Write-Host "Run one of these options:"
Write-Host ""
Write-Host "Option A - Direct MongoDB Update (FASTEST):" -ForegroundColor Cyan
Write-Host 'mongo "mongodb+srv://Burkakoo:burqaaman%2412@cluster1.t7t6gsx.mongodb.net/ethioprep"'
Write-Host 'db.users.updateOne({email:"student@ethioprep.com"},{$set:{"profile.telegramLink":"https://t.me/Ethio_student_preparetion"}})'
Write-Host ""
Write-Host "Option B - Via Backend Script:" -ForegroundColor Cyan
Write-Host "cd Backend"
Write-Host "# Edit src/scripts/seedStaffAccounts.js - add seedStudentWithTelegram function"
Write-Host "node src/scripts/seedStaffAccounts.js"
Write-Host ""

Write-Host "✅ After making changes:" -ForegroundColor Yellow
Write-Host "1. Commit: git add -A && git commit -m 'Add premium notes restriction and Telegram link'"
Write-Host "2. Push: git push origin main"
Write-Host "3. Render will auto-redeploy backend"
Write-Host "4. Redeploy Web: cd Web && npm run deploy"
Write-Host ""

Write-Host "📖 Full details in: PREMIUM_NOT ES_TELEGRAM_GUIDE.md" -ForegroundColor Cyan

