import mongoose from "mongoose";

const learningProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    contentType: {
      type: String,
      enum: ["subject", "chapter", "question", "exam"],
      required: true
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    progressPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
      min: 0
    },
    lastAccessedAt: Date,
    localUpdatedAt: Date
  },
  { timestamps: true, collection: "learningProgress" }
);

learningProgressSchema.index(
  { userId: 1, contentType: 1, contentId: 1 },
  { unique: true }
);
learningProgressSchema.index({ userId: 1, updatedAt: -1 });

export const LearningProgress = mongoose.model("LearningProgress", learningProgressSchema);
