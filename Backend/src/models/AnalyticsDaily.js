import mongoose from "mongoose";

const analyticsDailySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true
    },
    metric: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    dimensions: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({})
    },
    value: {
      type: Number,
      required: true,
      default: 0
    },
    uniqueUsers: {
      type: Number,
      default: 0,
      min: 0
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({})
    }
  },
  { timestamps: true, collection: "analyticsDaily" }
);

analyticsDailySchema.index({ date: 1, metric: 1, dimensions: 1 }, { unique: true });
analyticsDailySchema.index({ metric: 1, date: -1 });

export const AnalyticsDaily = mongoose.model("AnalyticsDaily", analyticsDailySchema);
