import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    },
    prompt: {
      type: String,
      required: true,
      trim: true
    },
    options: [
      {
        key: String,
        text: String
      }
    ],
    correctAnswer: String,
    explanation: String,
    subjectCode: String,
    tags: [String]
  },
  { timestamps: true, collection: "bookmarks" }
);

bookmarkSchema.index({ userId: 1, questionId: 1 }, { unique: true, sparse: true });
bookmarkSchema.index({ userId: 1, createdAt: -1 });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
