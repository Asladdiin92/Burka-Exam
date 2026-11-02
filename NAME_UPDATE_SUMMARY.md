# Project Name Update Summary

## Changes Made: "Burka-Exam" → "Burka Exam"

### ✅ Files Updated (Display Names)

1. **metadata.json**
   - "name": "Burka Exam"

2. **package.json** (root)
   - "name": "burka-exam" (kebab-case for npm)
   - "description": "Burka Exam entrance exam preparation platform"

3. **README.md**
   - Title: # Burka Exam
   - All references updated

4. **AGENTS.md**
   - Title: # Burka Exam Development Guide
   - All references updated

5. **DEPLOYMENT.md**
   - Title: # Burka Exam Deployment Guide
   - All display references updated
   - Technical URLs kept as burka-exam (lowercase with hyphen)

6. **DEPLOYMENT_QUICK.md**
   - Updated email references

7. **Backend/package.json**
   - "name": "burka-exam-backend"
   - Description updated

8. **Backend/src/app.js**
   - API name: "Burka Exam API"

9. **Web/package.json**
   - "name": "burka-exam-web" (already correct)

10. **Mobile/package.json**
    - "name": "burka-exam-mobile"

11. **Mobile/app.json**
    - "name": "Burka Exam" (display name)
    - "slug": "burka-exam"
    - Package IDs: com.burkaexam.mobile

12. **Comments in Code Files**
    - Web/public/sw.js
    - Backend/mongodb-schema.js
    - Web/JavaScript/src/utils/questionContentParser.js
    - Web/JavaScript/src/utils/offlineExamEngine.js

### 📝 Intentionally NOT Changed (Technical Identifiers)

These are kept as "ethioprep" to maintain backward compatibility with existing user data:

**LocalStorage Keys (Web):**
- ethioprep_token
- ethioprep_refresh_token
- ethioprep_user
- ethioprep_web_api_cache_v5
- ethioprep_theme

**AsyncStorage Keys (Mobile):**
- ethioprep_token
- ethioprep_refresh_token
- ethioprep_user
- ethioprep_offline_queue
- ethioprep_device_id
- ethioprep_favorite_questions

**Cache Names:**
- ethioprep-static-*
- ethioprep-api-data-*
- ethioprep-exam-sessions-*

**Service Worker:**
- Cache name prefixes remain as "ethioprep-" for version compatibility

**Technical URLs (Keep lowercase with hyphen):**
- burka-exam-backend.onrender.com
- github.com/Burkakoo/burka-exam
- YOUR_USERNAME.github.io/burka-exam

### ⚠️ Important Notes

1. **Package Names**: Use kebab-case (burka-exam) for npm compatibility
2. **URLs/Slugs**: Keep lowercase with hyphens for web standards
3. **Display Names**: Use "Burka Exam" (with space) for user-facing text
4. **Storage Keys**: Left as "ethioprep" to avoid breaking existing user sessions
5. **Email Addresses**: Updated to @burkaexam.com (no hyphen)

### 🎯 Result

- ✅ All user-visible names show "Burka Exam"
- ✅ Technical identifiers follow proper conventions
- ✅ Existing user data remains compatible
- ✅ URLs and package names follow web/npm standards
