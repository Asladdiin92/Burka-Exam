import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    deviceId: {
      type: String,
      trim: true
    },
    sessionId: {
      type: String,
      trim: true
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    entityType: {
      type: String,
      trim: true,
      maxlength: 80
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    properties: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({})
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    appVersion: {
      type: String,
      trim: true,
      maxlength: 40
    },
    platform: {
      type: String,
      enum: ["android", "ios", "web"]
    }
  },
  { timestamps: true, collection: "analyticsEvents" }
);

analyticsEventSchema.index({ userId: 1, occurredAt: -1 });
analyticsEventSchema.index({ eventName: 1, occurredAt: -1 });

export const AnalyticsEvent = mongoose.model("AnalyticsEvent", analyticsEventSchema);
