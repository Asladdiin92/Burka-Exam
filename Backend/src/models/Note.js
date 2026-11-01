import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    body: {
      type: String,
      trim: true,
      maxlength: 50000,
      default: ""
    },
    fileType: {
      type: String,
      enum: ["pdf", "ppt", "pptx", "doc", "docx", "text", "other"],
      default: "pdf"
    },
    fileUrl: {
      type: String,
      trim: true
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      index: true
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      index: true
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      index: true
    },
    color: {
      type: String,
      trim: true,
      maxlength: 20
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active"
    },
    localId: {
      type: String,
      trim: true,
      index: true
    },
    syncVersion: {
      type: Number,
      default: 0,
      min: 0
    },
    lastSyncedAt: Date
  },
  { timestamps: true, collection: "notes" }
);

noteSchema.index(
  { userId: 1, localId: 1 },
  {
    unique: true,
    partialFilterExpression: { localId: { $type: "string" } }
  }
);
noteSchema.index({ userId: 1, status: 1, updatedAt: -1 });

export const Note = mongoose.model("Note", noteSchema);
