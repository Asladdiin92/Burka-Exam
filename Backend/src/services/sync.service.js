import { Note } from "../models/Note.js";
import { LearningProgress } from "../models/LearningProgress.js";
import { Payment } from "../models/Payment.js";
import { SyncChange } from "../models/SyncChange.js";

export async function processSyncBatch(userId, changes = []) {
  const results = [];

  for (const item of changes) {
    const { operation, entity, entityId, payload } = item;
    try {
      if (entity === "note") {
        if (operation === "create" || operation === "upsert") {
          const note = await Note.findOneAndUpdate(
            { userId, localId: entityId },
            {
              userId,
              localId: entityId,
              title: payload.title,
              body: payload.body,
              subjectId: payload.subjectId,
              chapterId: payload.chapterId,
              status: "active"
            },
            { upsert: true, new: true }
          );
          results.push({ entityId, status: "synced", remoteId: note._id });
        }
      } else if (entity === "progress") {
        const prog = await LearningProgress.findOneAndUpdate(
          { userId, contentType: payload.contentType, contentId: payload.contentId },
          {
            progressPercent: payload.progressPercent,
            completed: payload.completed,
            timeSpentSeconds: payload.timeSpentSeconds,
            localUpdatedAt: new Date()
          },
          { upsert: true, new: true }
        );
        results.push({ entityId, status: "synced", remoteId: prog._id });
      } else if (entity === "payment") {
        const pay = await Payment.findOneAndUpdate(
          { userId, clientMutationId: entityId },
          {
            userId,
            clientMutationId: entityId,
            amount: payload.amount,
            currency: payload.currency || "ETB",
            provider: payload.provider,
            transactionReference: payload.transactionReference,
            status: "pending"
          },
          { upsert: true, new: true }
        );
        results.push({ entityId, status: "synced", remoteId: pay._id });
      }

      await SyncChange.create({
        userId,
        entityType: entity,
        entityId: String(entityId),
        operation,
        status: "applied"
      });
    } catch (err) {
      results.push({ entityId, status: "failed", error: err.message });
    }
  }

  return results;
}
