import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 20
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    gradeLevel: {
      type: String,
      enum: ["grade-9", "grade-10", "grade-11", "grade-12", "college"],
      default: "grade-12"
    },
    stream: {
      type: String,
      enum: ["natural", "social", "both"],
      default: "both"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, collection: "subjects" }
);

export const Subject = mongoose.model("Subject", subjectSchema);
