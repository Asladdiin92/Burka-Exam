import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    fullName: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      maxlength: 3,
      default: "ETB"
    },
    provider: {
      type: String,
      enum: ["telebirr", "cbe_birr", "cbe", "coop", "ebirr", "awash", "bank_transfer", "chapa", "cash"],
      default: "telebirr"
    },
    transactionReference: {
      type: String,
      trim: true
    },
    receiptUrl: {
      type: String,
      trim: true
    },
    clientMutationId: {
      type: String,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "refunded"],
      default: "pending"
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewNote: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: Date
  },
  { timestamps: true, collection: "payments" }
);

paymentSchema.index(
  { transactionReference: 1 },
  {
    unique: true,
    partialFilterExpression: { transactionReference: { $type: "string" } }
  }
);
paymentSchema.index(
  { userId: 1, clientMutationId: 1 },
  {
    unique: true,
    partialFilterExpression: { clientMutationId: { $type: "string" } }
  }
);
paymentSchema.index({ status: 1, submittedAt: 1 });
paymentSchema.index({ userId: 1, status: 1, submittedAt: -1 });

export const Payment = mongoose.model("Payment", paymentSchema);
