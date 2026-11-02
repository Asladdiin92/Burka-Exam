import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { User } from "../models/User.js";

async function updateStudentTelegram() {
  console.log("Updating student account with Telegram link...\n");
  
  await connectDatabase();
  
  try {
    const student = await User.findOne({ email: "student@ethioprep.com" });
    
    if (student) {
      student.profile = student.profile || {};
      student.profile.telegramLink = "https://t.me/Ethio_student_preparetion";
      await student.save();
      
      console.log("✅ Student account updated successfully!");
      console.log("\n==================================================");
      console.log("         STUDENT ACCOUNT - TELEGRAM LINK          ");
      console.log("==================================================\n");
      console.table([{
        Email: student.email,
        Name: student.displayName,
        "Telegram Link": student.profile.telegramLink,
        Role: student.role,
        Status: student.status
      }]);
      console.log("\n✅ Students can now see and tap the Telegram link in their profile!");
    } else {
      console.log("❌ Student account not found. Please run the main seed script first.");
    }
  } catch (error) {
    console.error("❌ Error updating student:", error.message);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("\nDisconnected from database.");
    process.exit(0);
  }
}

updateStudentTelegram();
