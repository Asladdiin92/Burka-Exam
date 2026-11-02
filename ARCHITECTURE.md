# Burka Exam - Application Architecture

See full architecture documentation at: https://github.com/Burkakoo/Burka-Exam

## Quick Overview

Burka Exam consists of **two distinct portals**:

### 🖥️ Web Portal (Staff & Admin)
- **Users**: Administrators, Teachers, Content Managers, Cash Managers
- **Technology**: React.js - Responsive web application
- **Access**: All devices (desktop, tablet, mobile browsers)
- **Purpose**: Content management, user administration, analytics

### 📱 Mobile App (Student Portal)
- **Users**: Students only
- **Technology**: React Native (Expo) - Cross-platform mobile app
- **Platforms**: Android & iOS
- **Purpose**: Exam practice, offline study, progress tracking

### 🔧 Backend API
- **Technology**: Node.js/Express + MongoDB Atlas
- **Purpose**: Unified REST API serving both portals
- **Deployment**: Render (auto-deploy from GitHub)

## Key Features

**Web Portal (Staff)**:
- Question bank management (by grade, subject, chapter)
- Exam creation and publishing
- User management and roles
- Payment verification
- Analytics dashboard
- Responsive design (works on all devices)

**Mobile App (Students)**:
- Exam practice (by year and by chapter)
- Offline support with auto-sync
- Progress tracking
- Notes and bookmarks
- Multi-grade filtering
- Native mobile experience

## User Access

| User Type | Portal | Access | Use Case |
|-----------|--------|--------|----------|
| Administrator | Web | Browser (any device) | Full system access |
| Content Manager | Web | Browser (any device) | Content creation |
| Cash Manager | Web | Browser (any device) | Payment verification |
| Teacher | Web | Browser (any device) | Content & monitoring |
| **Student** | **Mobile** | **Android/iOS App** | **Exam practice** |

## Why Two Portals?

**Web Portal Benefits**:
- Rich admin interface (forms, tables, charts)
- Optimized for desktop workflows
- No app store required
- Instant updates

**Mobile App Benefits**:
- Offline-first architecture
- Native app experience
- App store distribution
- Future: Push notifications, biometrics

## Documentation

- **README.md**: Quick start and setup
- **AGENTS.md**: Developer guide with all features
- **DEPLOYMENT.md**: Production deployment steps
- **ARCHITECTURE.md**: This document

For detailed architecture, API endpoints, data flow diagrams, and development workflow, see AGENTS.md.
