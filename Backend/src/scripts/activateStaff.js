import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { User } from "../models/User.js";

async function activateStaff() {
  const targetEmail = process.argv[2]?.trim().toLowerCase();

  console.log("Connecting to MongoDB...");
  await connectDatabase();

  try {
    if (targetEmail) {
      console.log(`Searching for user with email: ${targetEmail}`);
      const user = await User.findOne({ email: targetEmail });
      if (!user) {
        console.error(`Error: No user found with email "${targetEmail}"`);
        process.exit(1);
      }

      user.emailVerified = true;
      user.status = "active";
      user.verificationOTP = undefined;
      user.verificationOTPExpiresAt = undefined;
      await user.save();

      console.log(`[SUCCESS] User activated and verified:`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Name: ${user.displayName}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Status: ${user.status}`);
      console.log(`- Email Verified: ${user.emailVerified}`);
    } else {
      console.log("Activating all staff members (admin, content_manager, cash_manager, teacher)...");
      const staffRoles = ["admin", "content_manager", "cash_manager", "teacher"];
      
      const result = await User.updateMany(
        { role: { $in: staffRoles } },
        {
          $set: {
            emailVerified: true,
            status: "active"
          },
          $unset: {
            verificationOTP: 1,
            verificationOTPExpiresAt: 1
          }
        }
      );

      console.log(`[SUCCESS] Updated ${result.modifiedCount} staff user accounts to active and verified.`);

      const staffUsers = await User.find({ role: { $in: staffRoles } }).select("email displayName role status emailVerified");
      console.log("\nCurrent Staff Accounts:");
      console.table(staffUsers.map(u => ({
        Name: u.displayName,
        Email: u.email,
        Role: u.role,
        Status: u.status,
        Verified: u.emailVerified
      })));
    }
  } catch (err) {
    console.error("Error activating staff accounts:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

activateStaff();
