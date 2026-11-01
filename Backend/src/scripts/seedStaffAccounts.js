import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { User } from "../models/User.js";

const staffAccounts = [
  {
    email: "admin@ethioprep.com",
    displayName: "System Administrator",
    role: "admin",
    password: "adminPassword123"
  },
  {
    email: "content@ethioprep.com",
    displayName: "Content Lead Manager",
    role: "content_manager",
    password: "contentPassword123"
  },
  {
    email: "cashier@ethioprep.com",
    displayName: "Cash & Finance Officer",
    role: "cash_manager",
    password: "cashierPassword123"
  },
  {
    email: "cash@ethioprep.com",
    displayName: "Cash Manager",
    role: "cash_manager",
    password: "cashPassword123"
  }
];

async function seedStaffAccounts() {
  console.log("Connecting to MongoDB Atlas...");
  await connectDatabase();

  try {
    console.log("Creating/Updating staff accounts...\n");

    const createdList = [];

    for (const acc of staffAccounts) {
      const passwordHash = await User.hashPassword(acc.password);
      
      const user = await User.findOneAndUpdate(
        { email: acc.email.toLowerCase() },
        {
          $set: {
            displayName: acc.displayName,
            role: acc.role,
            passwordHash,
            status: "active",
            emailVerified: true
          },
          $unset: {
            verificationOTP: 1,
            verificationOTPExpiresAt: 1,
            resetPasswordOTP: 1,
            resetPasswordOTPExpiresAt: 1
          }
        },
        { upsert: true, new: true, runValidators: true }
      );

      createdList.push({
        Email: acc.email,
        "Temporary Password": acc.password,
        Role: acc.role,
        Name: acc.displayName,
        Status: user.status,
        Verified: user.emailVerified
      });
    }

    console.log("==================================================================");
    console.log("             ETHIOPREP STAFF ACCOUNTS CREATED                     ");
    console.log("==================================================================");
    console.table(createdList);
    console.log("\nAll accounts are activated, verified, and ready for login!");
  } catch (error) {
    console.error("Error creating staff accounts:", error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Disconnected from database.");
  }
}

seedStaffAccounts();
