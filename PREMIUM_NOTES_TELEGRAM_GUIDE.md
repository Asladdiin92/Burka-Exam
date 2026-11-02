# Implementation Guide: Premium Notes & Telegram Link

## 🎯 Changes Required

### 1. Restrict Study Notes to Premium Users Only

**File**: `Backend/src/controllers/notes.controller.js`

**Function**: `listNotes` (lines 14-20)

**Current Code**:
```javascript
if (!isStaff) {
  // Students see all public study notes (PDF, PPT, DOCX) plus their own notebook entries
  filter.$or = [
    { isPublic: true },
    { userId: request.user._id }
  ];
}
```

**Replace with**:
```javascript
if (!isStaff) {
  // Students see public notes + their own private notes
  // FREE users can only see non-premium public notes
  // PREMIUM users can see all public notes (including premium ones)
  const isPremiumUser = request.user.isPremium === true;
  
  if (isPremiumUser) {
    // Premium students: all public notes + own private notes
    filter.$or = [
      { isPublic: true },
      { userId: request.user._id }
    ];
  } else {
    // Free students: only non-premium public notes + own private notes
    filter.$or = [
      { isPublic: true, isPremium: false },
      { userId: request.user._id }
    ];
  }
}
```

---

### 2. Add Telegram Link to Student Profile (Mobile App)

**File**: `Mobile/src/screens/ProfileScreen.js`

**Location**: After phone number field (around line 155)

**Add Clickable Telegram Link**:

Find this section in the NOT-editing view (around line 185):
```javascript
<View style={styles.field}>
  <Text style={styles.fieldLabel}>Phone</Text>
  <Text style={styles.fieldValue}>{user?.phoneNumber || "Not set"}</Text>
</View>
```

**Add AFTER it**:
```javascript
{user?.profile?.telegramLink && (
  <TouchableOpacity
    onPress={() => Linking.openURL(user.profile.telegramLink)}
    style={styles.field}
  >
    <Text style={styles.fieldLabel}>Join Our Telegram Channel</Text>
    <Text style={[styles.fieldValue, { color: COLORS.primary, textDecorationLine: 'underline' }]}>
      {user.profile.telegramLink}
    </Text>
    <Text style={styles.fieldNote}>Tap to open in Telegram</Text>
  </TouchableOpacity>
)}
```

**Import Linking at the top**:
```javascript
import { Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
```

---

### 3. Seed Student Account with Telegram Link

**File**: `Backend/src/scripts/seedStaffAccounts.js`

**Add at the end of the file** (after the seedStaffAccounts function):

```javascript
async function seedStudentWithTelegram() {
  console.log("Updating student account with Telegram link...");
  await connectDatabase();
  
  try {
    const student = await User.findOne({ email: "student@ethioprep.com" });
    
    if (student) {
      student.profile = student.profile || {};
      student.profile.telegramLink = "https://t.me/Ethio_student_preparetion";
      await student.save();
      
      console.log("✅ Student account updated with Telegram link!");
      console.table([{
        Email: student.email,
        "Telegram Link": student.profile.telegramLink,
        Role: student.role
      }]);
    } else {
      console.log("❌ Student account not found. Run seed first.");
    }
  } catch (error) {
    console.error("Error updating student:", error);
  } finally {
    await disconnectDatabase();
  }
}

// Run it
// seedStudentWithTelegram();
```

**To run**: Uncomment the last line and execute:
```bash
cd D:\Burka-Exam\Backend
node src/scripts/seedStaffAccounts.js
```

---

## 📝 Alternative: Quick MongoDB Update

Instead of modifying seed script, you can update directly via MongoDB:

```javascript
// Run this in MongoDB Compass or mongosh
db.users.updateOne(
  { email: "student@ethioprep.com" },
  { $set: { "profile.telegramLink": "https://t.me/Ethio_student_preparetion" } }
)
```

---

## 🧪 Testing

### Test 1: Premium Notes Restriction
1. Login as `student@ethioprep.com` (free user)
2. Navigate to Study Notes
3. **Should see**: Only non-premium notes
4. Change `isPremium: true` for the student in database
5. **Should see**: All notes including premium ones

### Test 2: Telegram Link
1. Login as `student@ethioprep.com`
2. Go to Profile screen
3. **Should see**: "Join Our Telegram Channel" with link
4. Tap the link
5. **Should**: Open Telegram app/web with your channel

---

## 🎯 Summary

**What Changes**:
- ✅ Study notes now restricted to premium users only
- ✅ Free users see only basic (non-premium) notes
- ✅ Telegram channel link added to student profile (clickable)
- ✅ Link opens in Telegram when tapped

**Files to Modify**:
1. `Backend/src/controllers/notes.controller.js` - Add premium check
2. `Mobile/src/screens/ProfileScreen.js` - Add Telegram link UI
3. Database - Update student account with Telegram URL

