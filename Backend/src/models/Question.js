import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      index: true
    },
    questionType: {
      type: String,
      enum: ["multiple_choice", "true_false", "short_answer", "fill_blank"],
      default: "multiple_choice"
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium"
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    imageUrl: {
      type: String,
      trim: true,
      maxlength: 8000000
    },
    options: [{
      type: String,
      trim: true,
      maxlength: 1000
    }],
    optionImages: {
      type: Map,
      of: {
        type: String,
        trim: true,
        maxlength: 8000000
      },
      default: {}
    },
    correctAnswer: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    explanation: {
      type: String,
      trim: true,
      maxlength: 3000
    },
    explanationImageUrl: {
      type: String,
      trim: true,
      maxlength: 8000000
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 40
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, collection: "questions" }
);

questionSchema.index({ subjectId: 1, isActive: 1 });
questionSchema.index({ chapterId: 1, isActive: 1 });
questionSchema.index({ subjectId: 1, difficulty: 1, isActive: 1 });
questionSchema.index({ subjectId: 1, questionType: 1, isActive: 1 });

export const Question = mongoose.model("Question", questionSchema);
