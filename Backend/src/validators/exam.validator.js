import mongoose from "mongoose";

export function validateExamSubmission(body) {
  const errors = [];
  const { answers } = body || {};

  if (!Array.isArray(answers)) {
    errors.push("Answers must be an array.");
    return { isValid: false, errors };
  }

  for (let i = 0; i < answers.length; i++) {
    const item = answers[i];
    if (!item.questionId || !mongoose.isValidObjectId(item.questionId)) {
      errors.push(`Answer at index ${i} requires a valid questionId.`);
    }
    if (!Array.isArray(item.selectedOptionKeys)) {
      errors.push(`Answer at index ${i} requires selectedOptionKeys array.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
