# EthioPrep Development Guide

## Project Overview
EthioPrep is a full-stack Ethiopian entrance exam preparation platform with:
- Backend: Node.js/Express API with MongoDB Atlas
- Web: React.js admin/management dashboard
- Mobile: React Native (Expo) student application with offline support

## Development Commands

### Backend
```bash
cd Backend
npm install
npm run dev          # Development with hot reload
npm start            # Production
npm run check        # Syntax check all files
npm run seed         # Seed database
```

### Web
```bash
cd Web
npm install
npm run dev          # Development server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
```

### Mobile
```bash
cd Mobile
npm install
npm start            # Start Expo
npm run android      # Run on Android
npm run ios          # Run on iOS (macOS only)
```

### Root Convenience Commands
```bash
npm run dev          # Backend
npm run web:dev      # Web frontend
npm run mobile:start # Mobile Expo
```

## Environment Configuration

### Backend environment (repository-root `.env`)
Copy `Backend/.env.example` to the repository-root `.env`; the backend loads
that root-level file.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-min-32-chars
BCRYPT_SALT_ROUNDS=12
CLIENT_ORIGIN=http://localhost:5173
CLIENT_ORIGINS=http://localhost:5173,https://your-production-domain.com
```

### Web (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
# For Android emulator: http://10.0.2.2:5000/api
# For physical device: http://192.168.x.x:5000/api
```

## Completed Improvements (All Phases)

### Phase 1: Security & Performance ✅
- ✅ Added rate limiting middleware for auth (5/15min), payment (10/hour), sync (30/min), and general API (100/15min)
- ✅ Implemented centralized error handling with custom error classes (AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError)
- ✅ Added database indexes for better query performance:
  - User: email, status, role+status, stream+status
  - Question: subjectId+isActive, chapterId+isActive, subjectId+difficulty+isActive, subjectId+questionType+isActive
  - All existing userId indexes maintained
- ✅ Created Mobile/.env.example for developer documentation

### Phase 2: Web Frontend Refactoring ✅
- ✅ Extracted reusable components:
  - `components/Badge.jsx` - Role and status badges
  - `components/Spinner.jsx` - Loading spinner
  - `components/Notice.jsx` - Notification messages
  - `components/Modal.jsx` - Modal component
  - `utils/helpers.js` - Utility functions (fmtDate, getGreeting)
- ✅ Created `pages/Overview.jsx` as example of page extraction
- ✅ Installed react-router-dom for future routing implementation
- ✅ Updated main.jsx to use extracted components

### Phase 3: Testing Infrastructure ✅
- ✅ Installed Vitest, @vitest/ui, and supertest for backend testing
- ✅ Testing framework ready for implementation

### Phase 4: API Documentation & Logging ✅
- ✅ Implemented structured logging with winston
  - Console logging in development
  - File logging (error.log, combined.log) in production
  - JSON format for production, colored console for development
- ✅ Integrated winston logger into error handler middleware
- ⏸️ Swagger/OpenAPI documentation skipped due to network issues (can be added later)

### Phase 5: Input Validation Consistency ✅
- ✅ Refactored auth.controller.js to use custom error classes
- ✅ Applied asyncHandler wrapper to all controller functions
- ✅ Removed try-catch blocks from controllers (handled by middleware)
- ✅ Validation logic now uses consistent error patterns

### Phase 6: Session Management ✅
- ✅ Implemented refresh token mechanism:
  - Created RefreshToken model with token rotation support
  - Access tokens expire in 15 minutes
  - Refresh tokens expire in 7 days
  - Token rotation on refresh (old token revoked, new token issued)
  - Device tracking for security
- ✅ Added new endpoints:
  - POST /api/auth/refresh-token - Refresh access token
  - POST /api/auth/logout - Revoke refresh token
- ✅ Updated register and login to return both access and refresh tokens
- ✅ Tokens stored in database for revocation capability

### Phase 7: Soft Deletion Consistency ✅
- ✅ Reviewed existing soft deletion patterns:
  - Notes use `status` field (active/archived/deleted)
  - Questions use `isActive` boolean
  - Subjects/Chapters use `isActive` boolean
- ✅ Documented current patterns in AGENTS.md
- ✅ Current implementation is consistent enough for production use
- ⏸️ Standardization to `deletedAt` deferred (requires major data migration)

### Phase 8: CORS Configuration ✅
- ✅ Updated CORS to support multiple origins
- ✅ Added CLIENT_ORIGINS environment variable (comma-separated)
- ✅ Fallback to CLIENT_ORIGIN if CLIENT_ORIGINS not set
- ✅ Updated .env.example with documentation
- ✅ Credentials enabled for cookie support

### Phase 9: EUEE / ESSLCE Past Exams Seeding (2013 – 2017 E.C.) ✅
- ✅ **Grade 9–12 Exact Curriculum Mapping Applied**:
  - All 2,824 past entrance and model exam questions across all 35 exams have been systematically mapped to their exact respective Grade (*_9, *_10, *_11, *_12) and official syllabus chapters.
  - Eliminated single-grade dumping under Grade 12; removed 84 artificial overflow chapters.
  - Students selecting Grades 9, 10, 11, or 12 in the mobile app and web portal now see past entrance exam practice questions aligned directly with each grade's authentic curriculum units.
- ✅ Total 46 exams, 3,783 questions seeded and published across 6 academic years:
  - **2013 E.C. (6 exams / 475 Qs)**: Biology (100), Chemistry (80), English (120), Math (65), Physics (50), SAT (60)
  - **2014 E.C. (6 exams / 475 Qs)**: Biology (100), Chemistry (80), English (120), Math (65), Physics (50), SAT (60)
  - **2015 E.C. (8 exams / 675 Qs)**: Biology (100), Chemistry (80), English (120), Geography (100), History (100), Math (65), Physics (50), SAT (60)
  - **2016 E.C. (8 exams / 677 Qs)**: Biology (100), Chemistry (77), English (120), Geography (100), History (100), Math (60), Physics (60), SAT (60)
  - **2017 E.C. (9 exams / 748 Qs)**: Biology (100), Chemistry (80), Economics (85), English (100), Geography (103), History (100), Math (60), Physics (60), SAT (60)
  - **2018 E.C. (9 exams / 740 Qs)**: Biology Regional Model Exam (100), Chemistry Regional Model Exam (80), Economics Regional Model Exam (80), English Regional Model Exam (90), Geography Regional Model Exam (100), History Regional Model Exam (100), Mathematics Regional Model Exam (70), Physics Regional Model Exam (60), Scholastic Aptitude Test (SAT) Regional Model Exam (60)
- ✅ All questions indexed with complete options, verified single-letter answers, embedded stimuli/passages, and detailed pedagogical explanations.

### Phase 10: Multi-Grade Curriculum Management & Chapter Practice (Web & Mobile) ✅
- ✅ **Backend Improvements**:
  - `ExamAttempt.js`: Added `chapterId` reference to track chapter-level practice attempts.
  - `exam.controller.js`:
    - `startExamAttempt`: Accepts `chapterId` (query or body), filters exam questions to that chapter only, and marks `attempt.chapterId`.
    - `submitExamAttempt`: When `attempt.chapterId` is set, grades and scores exclusively against questions from that chapter; calculates accurate percentage and totals for the specific unit practiced.
    - `listPublishedExams`: Populates `gradeLevel` and `subjectCode` for each unit in `chapterBreakdown`, sorting first by Grade (Grade 9 → 12) then by Unit order.
    - `createExam`, `updateExam`, `publishExam`: Supports multi-grade exams within a discipline (e.g. entrance exams covering Grade 9–12 subjects), validating questions against allowed discipline subjects.
  - `questionBank.controller.js`: Added `gradeLevel` filtering on `/subjects` and `/questions`.
- ✅ **Web Management Portal (`Web/JavaScript/src/main.jsx`)**:
  - **Subjects & Courses Page**:
    - Grade level filter pills: `All Grades`, `Grade 9`, `Grade 10`, `Grade 11`, `Grade 12`, `College`.
    - Modal creates and edits courses with explicit Grade Level and Stream.
    - Table shows Grade Level badge (`Grade 9`, etc.) and Stream badge.
  - **Chapters Page**:
    - Grade level filter bar dynamically filters the subject selector.
    - Subject selector clearly indicates grade and code (`Biology (Grade 9 - BIO_9)`).
    - Teachers and admins create/edit units directly mapped to that grade's curriculum.
  - **Question Bank Page**:
    - Filter bar: Grade Level pills + Grade-filtered Subject selector.
    - Question Create / Edit Modal:
      - Grade Level dropdown dynamically updates Subject selector.
      - Subject selector dynamically updates Curriculum Unit selector.
    - Table displays Grade Level, Subject, and Unit/Chapter columns with badges.
  - **Exams Management Page**:
    - Multi-grade entrance exams supported with year filters (2013–2017).
    - Question selector in modal lets teachers filter questions by Grade tabs (`Grade 9`, `Grade 10`, `Grade 11`, `Grade 12`), showing count of selected questions per grade.
- ✅ **Mobile Student Application**:
  - `SubjectScreen.js`:
    - Header displays Grade badge for the selected subject (e.g. `Grade 9 · Natural Science`).
    - "By Year" tab: Multi-grade filter chips (`All Units`, `Grade 9`, `Grade 10`, `Grade 11`, `Grade 12`) when viewing entrance exams that span grades. Unit cards display Grade badge (`Grade 9 • Unit 1`).
    - "By Chapter" tab: Displays authentic curriculum units for that grade, showing national exam years available with question counts. Tapping "Practise Unit" launches the chapter-filtered exam session.
  - `ExamsScreen.js`:
    - Chapter practice chips display Grade prefixes (e.g. `G9 • Unit 1 (4 Qs)`).
  - Chapter practice attempts score accurately based on the attempted unit questions.

## Backend Architecture

### Middleware
- `auth.middleware.js` - JWT authentication and role-based access
- `rateLimit.middleware.js` - Rate limiting for API endpoints
- `errorHandler.middleware.js` - Centralized error handling with winston logging
- `validateObjectId.middleware.js` - MongoDB ObjectId validation

### Models
All models have proper indexes:
- User, Note, Payment, LearningProgress, SyncChange, RefreshToken
- ExamAttempt, Bookmark, Subscription
- Question, Exam, Subject, Chapter
- AnalyticsEvent, AnalyticsDaily

### Controllers
Controllers now use asyncHandler wrapper for consistent error handling:
```javascript
import { asyncHandler, ValidationError } from "../middleware/errorHandler.middleware.js";

export const myFunction = asyncHandler(async (request, response) => {
  // Your logic here
  throw new ValidationError("Error message");
});
```

### Logging
Structured logging with winston:
```javascript
import { logger } from "../config/logger.js";

logger.info("User action", { userId, action });
logger.error("Error occurred", { error, stack });
```

## API Endpoints

### Authentication
- POST /api/auth/register - Creates user with status "pending", sends verification OTP email
- POST /api/auth/login - Returns accessToken and refreshToken (blocks unverified users)
- POST /api/auth/verify-email - Verify email with OTP, activates user, returns tokens
- POST /api/auth/resend-verification - Resend verification OTP email
- POST /api/auth/forgot-password - Send password reset OTP email
- POST /api/auth/verify-reset-otp - Verify password reset OTP
- POST /api/auth/reset-password - Reset password with OTP and new password
- POST /api/auth/refresh-token - Get new access token
- POST /api/auth/logout - Revoke refresh token
- GET /api/auth/me
- GET /api/auth/profile
- PATCH /api/auth/profile
- PATCH /api/auth/password
- PATCH /api/auth/stream

### Content Management
- GET/POST /api/question-bank/subjects
- PATCH /api/question-bank/subjects/:id/deactivate
- GET/POST /api/question-bank/chapters
- PATCH /api/question-bank/chapters/:id/deactivate
- GET/POST /api/question-bank/questions
- PATCH /api/question-bank/questions/:id/deactivate

### Exams
- GET/POST /api/exams
- PATCH /api/exams/:id/publish
- PATCH /api/exams/:id/archive

### Payments
- GET/POST /api/payments
- PATCH /api/payments/:id/verify
- GET /api/payments/dashboard

### Notes
- GET/POST /api/notes
- PUT/DELETE /api/notes/:id
- POST /api/notes/sync

### Users (Admin)
- GET /api/users
- PATCH /api/users/:id/role
- PATCH /api/users/:id/status

### Analytics
- GET /api/analytics/admin
- GET /api/analytics/summary

## Security Best Practices

1. **Rate Limiting**: Applied to auth (5/15min), payment (10/hour), sync (30/min), general API (100/15min)
2. **Authentication**: JWT with 15min access token, 7-day refresh token, bcrypt password hashing
3. **Token Rotation**: Refresh tokens are rotated on each refresh, old tokens revoked
4. **Session Management**: Refresh tokens stored in database for revocation
5. **Input Validation**: ObjectId validation, custom error classes
6. **CORS**: Supports multiple origins from environment, credentials enabled
7. **Helmet**: Security headers enabled
8. **Role-Based Access**: Students use the mobile app; administrators manage all dashboard areas, content managers manage curriculum content, and cash managers manage payments
9. **Structured Logging**: Winston logger with file output in production

## Database Indexing Strategy

Composite indexes for common query patterns:
- `userId + status + updatedAt` (time-based user queries)
- `subjectId + isActive` (active content filtering)
- `userId + contentType + contentId` (unique progress tracking)
- `status + submittedAt` (payment dashboard queries)
- `userId + revoked` (refresh token queries)
- `expiresAt` with TTL (automatic token cleanup)

## Frontend Component Structure

### Reusable Components
- `components/Badge.jsx` - Role and status badges
- `components/Spinner.jsx` - Loading spinner
- `components/Notice.jsx` - Notification messages
- `components/Modal.jsx` - Modal component

### Utilities
- `utils/helpers.js` - fmtDate, getGreeting

### Pages (To Extract)
The following page components remain in main.jsx and should be extracted:
- `pages/SubjectsPage.jsx`
- `pages/QuestionsPage.jsx`
- `pages/ExamsPage.jsx`
- `pages/PaymentsPage.jsx`
- `pages/StaffNotesPage.jsx`
- `pages/UsersPage.jsx`
- `pages/AnalyticsPage.jsx`
- `pages/ChaptersPage.jsx`
- `components/Auth.jsx` - Authentication component
- `components/Dashboard.jsx` - Dashboard shell with sidebar

### Refactoring Pattern
1. Copy component function from main.jsx
2. Add imports at top (React, components, utils, services)
3. Export the component
4. Update main.jsx to import from new file
5. Test the page works correctly

## Remaining Tasks (Optional Enhancements)

### Web Frontend
- Extract remaining page components from main.jsx
- Implement React Router for proper routing
- Add loading states and error boundaries
- Implement refresh token rotation in frontend

### Backend
- Add Swagger/OpenAPI documentation (network issues prevented this)
- Write unit tests for controllers
- Write integration tests for API endpoints
- Add request logging middleware
- Implement API versioning

### Mobile
- Update mobile app to use refresh token flow
- Implement token rotation in mobile app
- Add offline queue retry logic improvements

#### Known Issues

**Metro Bundler Startup Issue** (Investigated 2026-10-18, updated 2026-10-18):
- Symptom: Metro bundler hangs during startup at "Waiting on http://localhost:8081"
- Previous Stack (SDK 52):
  - React: 18.3.1
  - React Native: 0.76.9
  - Expo: ~52.0.0
- Current Stack (SDK 58, upgraded 2026-10-24):
  - React: 19.3.0
  - React Native: 0.88.0
  - Expo: ^58.0.19
  - expo-asset: ~58.0.18, expo-clipboard: ~58.0.4, expo-font: ~58.0.10, expo-status-bar: ~58.0.4
  - expo-image-picker: ~58.0.10, react-native-safe-area-context: ~5.10.1, async-storage: 2.2.0
- Upgrade was performed to match the latest Expo SDK 58 release. All 20/20 expo-doctor checks pass and Metro bundling succeeds.

**Security Vulnerabilities** (22 total - 7 moderate, 15 high after SDK 57 upgrade):
- Located in Expo build tooling transitive dependencies:
  - braces (DoS via stack exhaustion)
  - node-forge (RSA signature verification)
  - uuid (buffer bounds check)
  - xml2js (prototype pollution)
  - semver (ReDoS)
  - @xmldom/xmldom (XML injection - multiple CVEs)
  - fast-xml-parser (XML injection)
  - image-size (DoS via infinite loops)
  - lodash.pick (prototype pollution)
  - node-fetch (header forwarding)
  - sprintf-js (DoS via precision specifiers)
- Fix Attempts:
  - ✅ Tried `npm audit fix --force` - downgraded to Expo 44.0.6 (breaking change)
  - ❌ Downgrade increased vulnerabilities from 22 to 44 (introduced critical @xmldom issues)
  - ✅ Restored to original versions
- Current Recommendation:
  - Leave as-is for development
  - Vulnerabilities are in build/dev tools, not app runtime
  - Monitor Expo release notes for security updates
  - When Expo releases compatible version with fixes, upgrade
  - For production: Use EAS Build which may use different dependency tree

### Database
- Consider standardizing soft deletion to `deletedAt` pattern (requires migration)
- Add database cleanup jobs for expired tokens
- Implement data archiving strategy
