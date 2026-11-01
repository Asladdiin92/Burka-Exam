import { LearningProgress } from "../models/LearningProgress.js";

export async function getUserProgress(userId, contentType) {
  const filter = { userId };
  if (contentType) filter.contentType = contentType;
  return LearningProgress.find(filter).sort({ updatedAt: -1 }).limit(500);
}

export async function upsertUserProgress({
  userId,
  contentType,
  contentId,
  progressPercent,
  completed,
  timeSpentSeconds,
  localUpdatedAt
}) {
  const normalizedProgress = Number(progressPercent);
  const normalizedTime = timeSpentSeconds === undefined ? 0 : Number(timeSpentSeconds);

  return LearningProgress.findOneAndUpdate(
    { userId, contentType, contentId },
    {
      progressPercent: Math.min(100, Math.max(0, normalizedProgress)),
      completed: completed !== undefined ? Boolean(completed) : normalizedProgress >= 100,
      timeSpentSeconds: Math.max(0, normalizedTime),
      localUpdatedAt: localUpdatedAt ? new Date(localUpdatedAt) : undefined
    },
    { upsert: true, new: true, runValidators: true }
  );
}
