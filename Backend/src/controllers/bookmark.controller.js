import { Bookmark } from "../models/Bookmark.js";

export async function listBookmarks(request, response) {
  try {
    const bookmarks = await Bookmark.find({ userId: request.user._id }).sort({ createdAt: -1 }).limit(200);
    return response.json({ bookmarks });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to fetch favorite questions." });
  }
}

export async function createBookmark(request, response) {
  try {
    const { questionId, prompt, options, correctAnswer, explanation, subjectCode } = request.body;

    if (!prompt) {
      return response.status(400).json({ error: "Question prompt is required." });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId: request.user._id, prompt },
      {
        $set: {
          questionId: questionId || undefined,
          prompt,
          options: Array.isArray(options) ? options : [],
          correctAnswer,
          explanation,
          subjectCode
        }
      },
      { upsert: true, new: true }
    );

    return response.status(201).json({ message: "Question saved to favorites.", bookmark });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to save favorite question." });
  }
}

export async function deleteBookmark(request, response) {
  try {
    const { id } = request.params;
    await Bookmark.findOneAndDelete({
      $or: [
        { _id: id, userId: request.user._id },
        { questionId: id, userId: request.user._id }
      ]
    });
    return response.json({ message: "Favorite question removed." });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to remove favorite question." });
  }
}
