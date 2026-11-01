import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    plan: {
      type: String,
      enum: ["monthly", "quarterly", "annual", "lifetime"],
      default: "monthly"
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled", "rejected"],
      default: "pending"
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
      maxlength: 3
    },
    startsAt: {
      type: Date,
      required: true
    },
    endsAt: {
      type: Date,
      required: true
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    }
  },
  { timestamps: true, collection: "subscriptions" }
);

subscriptionSchema.index({ userId: 1, status: 1, endsAt: -1 });
subscriptionSchema.index({ endsAt: 1 });
subscriptionSchema.index({ paymentId: 1 }, { unique: true, sparse: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
