import { LearningProgress } from "../models/LearningProgress.js";
import mongoose from "mongoose";

const contentTypes = new Set(["subject", "chapter", "question", "exam"]);

export async function listProgress(request, response) {
  try {
    const filter = { userId: request.user._id };
    if (request.query.contentType) {
      if (!contentTypes.has(request.query.contentType)) {
        return response.status(400).json({ error: "Invalid contentType." });
      }
      filter.contentType = request.query.contentType;
    }

    const progress = await LearningProgress.find(filter).sort({ updatedAt: -1 }).limit(500);
    return response.json({ progress });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to fetch learning progress." });
  }
}

export async function upsertProgress(request, response) {
  try {
    const { contentType, contentId, progressPercent, completed, timeSpentSeconds, localUpdatedAt } = request.body;

    if (
      !contentTypes.has(contentType) ||
      !contentId ||
      !mongoose.isValidObjectId(contentId) ||
      progressPercent === undefined
    ) {
      return response.status(400).json({
        error: "contentType, contentId, and progressPercent are required."
      });
    }

    const normalizedProgress = Number(progressPercent);
    const normalizedTime = timeSpentSeconds === undefined ? 0 : Number(timeSpentSeconds);

    if (!Number.isFinite(normalizedProgress) || normalizedProgress < 0 || normalizedProgress > 100) {
      return response.status(400).json({ error: "progressPercent must be between 0 and 100." });
    }

    if (!Number.isInteger(normalizedTime) || normalizedTime < 0) {
      return response.status(400).json({ error: "timeSpentSeconds must be a non-negative integer." });
    }

    const parsedLocalUpdatedAt = localUpdatedAt ? new Date(localUpdatedAt) : undefined;
    if (parsedLocalUpdatedAt && Number.isNaN(parsedLocalUpdatedAt.getTime())) {
      return response.status(400).json({ error: "localUpdatedAt must be a valid date." });
    }

    const progress = await LearningProgress.findOneAndUpdate(
      { userId: request.user._id, contentType, contentId },
      {
        $set: {
          progressPercent: normalizedProgress,
          completed: completed === undefined ? normalizedProgress >= 100 : Boolean(completed),
          timeSpentSeconds: normalizedTime,
          lastAccessedAt: new Date(),
          localUpdatedAt: parsedLocalUpdatedAt
        }
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return response.json({ progress });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to save learning progress." });
  }
}

export async function getLeaderboard(request, response) {
  try {
    const leaderboard = await LearningProgress.aggregate([
      {
        $group: {
          _id: "$userId",
          totalTimeSpent: { $sum: "$timeSpentSeconds" },
          itemsCompleted: {
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
          },
          avgProgress: { $avg: "$progressPercent" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id",
          displayName: { $ifNull: ["$userInfo.displayName", "Student"] },
          totalTimeSpent: 1,
          itemsCompleted: 1,
          avgProgress: { $round: ["$avgProgress", 0] },
          score: {
            $add: [
              { $multiply: ["$itemsCompleted", 50] },
              { $round: [{ $divide: ["$totalTimeSpent", 60] }, 0] }
            ]
          }
        }
      },
      { $sort: { score: -1, totalTimeSpent: -1 } },
      { $limit: 20 }
    ]);

    // Compute rank
    const rankedList = leaderboard.map((item, idx) => ({
      rank: idx + 1,
      ...item
    }));

    const userRankIndex = rankedList.findIndex(
      (r) => String(r.userId) === String(request.user._id)
    );
    const currentUserRank = userRankIndex >= 0 ? userRankIndex + 1 : 1;

    return response.json({
      leaderboard: rankedList,
      currentUserRank
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to fetch leaderboard." });
  }
}

