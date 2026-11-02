# 🚀 Quick Start: Build Android APK

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Burka Exam - Android APK Build Script      " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Prerequisites Check:" -ForegroundColor Yellow
Write-Host ""

# Check Node
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    exit 1
}

# Check npm
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

# Check EAS CLI
$easVersion = eas --version 2>$null
if ($easVersion) {
    Write-Host "✅ EAS CLI: $easVersion" -ForegroundColor Green
} else {
    Write-Host "⚠️  EAS CLI not installed" -ForegroundColor Yellow
    Write-Host "   Installing EAS CLI globally..." -ForegroundColor Cyan
    npm install -g eas-cli
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Ready to Build!                            " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 Follow these steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "STEP 1: Login to Expo" -ForegroundColor Green
Write-Host "   cd D:\Burka-Exam\Mobile" -ForegroundColor Cyan
Write-Host "   eas login" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 2: Configure EAS Build (First time only)" -ForegroundColor Green
Write-Host "   eas build:configure" -ForegroundColor Cyan
Write-Host "   (Select 'All' when prompted)" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 3: Build Android APK" -ForegroundColor Green
Write-Host "   eas build --platform android --profile preview" -ForegroundColor Cyan
Write-Host "   (This takes 5-15 minutes)" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: Download APK" -ForegroundColor Green
Write-Host "   Click the link provided in terminal" -ForegroundColor Cyan
Write-Host "   Or visit: https://expo.dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 5: Create GitHub Release" -ForegroundColor Green
Write-Host "   1. Go to: https://github.com/Burkakoo/Burka-Exam/releases/new" -ForegroundColor Cyan
Write-Host "   2. Tag: v1.0.0" -ForegroundColor Cyan
Write-Host "   3. Title: Burka Exam Mobile v1.0.0" -ForegroundColor Cyan
Write-Host "   4. Upload your APK file" -ForegroundColor Cyan
Write-Host "   5. Publish release" -ForegroundColor Cyan
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📚 Full Guide: ANDROID_APK_BUILD_GUIDE.md" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press any key to open Mobile folder and start..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Set-Location "D:\Burka-Exam\Mobile"
Write-Host ""
Write-Host "✅ Ready! Run: eas login" -ForegroundColor Green
Write-Host ""
