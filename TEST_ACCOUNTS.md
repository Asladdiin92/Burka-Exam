# 🔐 Burka Exam Test Accounts

All accounts are **pre-seeded** in your MongoDB database and ready for testing.

---

## 📋 **All Test Accounts**

### 👨‍💼 **Admin Account** (Full System Access)
- **Email**: admin@ethioprep.com
- **Password**: adminPassword123
- **Role**: Administrator
- **Name**: System Administrator
- **Access**: Full system control, user management, analytics, content management, payments

---

### 📝 **Content Manager Account** (Content & Questions)
- **Email**: content@ethioprep.com
- **Password**: contentPassword123
- **Role**: Content Manager
- **Name**: Content Lead Manager
- **Access**: Manage subjects, chapters, questions, exams, notes

---

### 💰 **Cash Manager Account #1** (Finance & Payments)
- **Email**: cashier@ethioprep.com
- **Password**: cashierPassword123
- **Role**: Cash Manager
- **Name**: Cash & Finance Officer
- **Access**: View and manage payments, subscriptions, financial reports

---

### 💵 **Cash Manager Account #2** (Alternative)
- **Email**: cash@ethioprep.com
- **Password**: cashPassword123
- **Role**: Cash Manager
- **Name**: Cash Manager
- **Access**: View and manage payments, subscriptions, financial reports

---

### 🎓 **Student Account** (Testing Mobile App)
- **Email**: student@ethioprep.com
- **Password**: studentPassword123
- **Role**: Student
- **Name**: Abebe Kebede
- **Access**: Take exams, view notes, track progress, leaderboard

---

## 🌐 **Where to Use These Accounts**

### **Web Portal** (Staff Only)
**URL**: https://burkakoo.github.io/Burka-Exam

Use these accounts:
- ✅ admin@ethioprep.com
- ✅ content@ethioprep.com
- ✅ cashier@ethioprep.com
- ✅ cash@ethioprep.com

❌ **student@ethioprep.com** - Not accessible on Web (students use Mobile app only)

---

### **Mobile App** (Students Only)
**Access via**: Expo Go app or Android/iOS build

Use this account:
- ✅ student@ethioprep.com

❌ **Staff accounts** - Not accessible on Mobile (staff use Web portal)

---

## 🧪 **Quick Test Scenarios**

### **Test 1: Admin Login (Web)**
1. Visit: https://burkakoo.github.io/Burka-Exam
2. Login: admin@ethioprep.com / adminPassword123
3. Verify: Dashboard, analytics, user management access

### **Test 2: Content Manager (Web)**
1. Login: content@ethioprep.com / contentPassword123
2. Navigate to: Question Bank, Subjects, Exams
3. Verify: Can create/edit questions and exams

### **Test 3: Cash Manager (Web)**
1. Login: cashier@ethioprep.com / cashierPassword123
2. Navigate to: Payments, Reports
3. Verify: Can view payment history and financial data

### **Test 4: Student (Mobile)**
1. Open Expo app
2. Login: student@ethioprep.com / studentPassword123
3. Verify: Can browse exams, take tests, view leaderboard

---

## 🔒 **Security Notes**

- All accounts are **verified** and **active** (no email verification needed)
- All passwords are **temporary** - change them in production
- Student account has sample exam history and progress data
- Staff accounts have different permission levels

---

## 📊 **Account Permissions Summary**

| Account Type | Dashboard | Users | Questions | Exams | Payments | Notes | Analytics |
|--------------|-----------|-------|-----------|-------|----------|-------|-----------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Content Manager** | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Cash Manager** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Student** | ❌ | ❌ | ❌ | Take Only | View Own | ✅ | View Own |

---

## 🎯 **Platform URLs Recap**

- **Backend API**: https://burka-exam-backend.onrender.com
- **Web Portal**: https://burkakoo.github.io/Burka-Exam
- **Mobile App**: Via Expo (npx expo start from D:\Burka-Exam\Mobile)

---

**All accounts are ready for testing! Start with the Admin account on Web Portal.** 🚀
