import mongoose from "mongoose";

const syncChangeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    deviceId: { type: String, required: true, trim: true },
    operation: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true
    },
    entity: {
      type: String,
      enum: ["note", "bookmark", "progress", "examAttempt", "payment"],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    clientMutationId: { type: String, required: true, unique: true, trim: true },
    payload: { type: mongoose.Schema.Types.Mixed },
    appliedAt: Date,
    error: String
  },
  { timestamps: true, collection: "syncChanges" }
);

syncChangeSchema.index({ userId: 1, clientMutationId: 1 }, { unique: true });
syncChangeSchema.index({ userId: 1, deviceId: 1, createdAt: 1 });
syncChangeSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

export const SyncChange = mongoose.model("SyncChange", syncChangeSchema);
