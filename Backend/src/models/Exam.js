import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    type: {
      type: String,
      enum: ["practice", "mock_exam", "entrance_exam"],
      default: "mock_exam"
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true
    },
    // Ethiopian exam year used by students to choose a past paper.
    // Optional only for records created before this field existed.
    examYear: {
      type: Number,
      min: 1900,
      max: 3000,
      index: true
    },
    chapterIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter"
    }],
    questionIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    }],
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
      max: 1440
    },
    passingScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    accessLevel: {
      type: String,
      enum: ["free", "premium"],
      default: "free"
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
    randomizeQuestions: {
      type: Boolean,
      default: true
    },
    randomizeOptions: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true, collection: "exams" }
);

examSchema.index({ status: 1, accessLevel: 1, type: 1 });
examSchema.index({ subjectId: 1, examYear: -1, status: 1 });
examSchema.index({ createdAt: -1 });

export const Exam = mongoose.model("Exam", examSchema);
