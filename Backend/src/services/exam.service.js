import mongoose from "mongoose";
import { Exam } from "../models/Exam.js";
import { ExamAttempt } from "../models/ExamAttempt.js";
import { Question } from "../models/Question.js";
import { Subscription } from "../models/Subscription.js";

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function listPublishedExams() {
  return Exam.find({ status: "published" }).sort({ createdAt: -1 }).limit(100);
}

export async function startExamAttempt(examId, user) {
  const exam = await Exam.findOne({ _id: examId, status: "published" });
  if (!exam) {
    const error = new Error("Exam not found or unavailable.");
    error.status = 404;
    throw error;
  }

  if (exam.accessLevel === "premium" && user.role === "student") {
    const subscription = await Subscription.findOne({
      userId: user._id,
      status: "active",
      endDate: { $gt: new Date() }
    });

    if (!subscription) {
      const error = new Error("A premium subscription is required to access this exam.");
      error.status = 403;
      throw error;
    }
  }

  let questions = await Question.find({
    _id: { $in: exam.questionIds },
    isActive: true
  })
    .select("-correctAnswer")
    .lean();

  if (exam.randomizeQuestions) {
    questions = shuffle(questions);
  }

  const sanitizedQuestions = questions.map((q) => {
    let options = (q.options || []).map((opt, idx) =>
      typeof opt === "object" && opt !== null && opt.key
        ? opt
        : { key: String.fromCharCode(65 + idx), text: String(opt) }
    );

    if (exam.randomizeOptions) {
      options = shuffle(options);
    }

    return {
      _id: q._id,
      prompt: q.prompt,
      options: options.map((option) => ({
        ...option,
        imageUrl: option.imageUrl || q.optionImages?.[option.key] || undefined
      })),
      imageUrl: q.imageUrl,
      explanation: q.explanation,
      explanationImageUrl: q.explanationImageUrl,
      difficulty: q.difficulty,
      subjectId: q.subjectId,
      chapterId: q.chapterId
    };
  });

  const attempt = await ExamAttempt.create({
    examId: exam._id,
    userId: user._id,
    startedAt: new Date(),
    status: "in_progress",
    totalMarks: exam.questionIds.length,
    score: 0,
    percentage: 0
  });

  return {
    attempt,
    exam: {
      _id: exam._id,
      title: exam.title,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
      passingScore: exam.passingScore,
      accessLevel: exam.accessLevel,
      questions: sanitizedQuestions
    }
  };
}

export async function submitExamAttempt(attemptId, user, answers = []) {
  const attempt = await ExamAttempt.findOne({
    _id: attemptId,
    userId: user._id,
    status: "in_progress"
  });

  if (!attempt) {
    const error = new Error("Active exam attempt not found.");
    error.status = 404;
    throw error;
  }

  const exam = await Exam.findById(attempt.examId);
  if (!exam) {
    const error = new Error("Associated exam not found.");
    error.status = 404;
    throw error;
  }

  const questions = await Question.find({
    _id: { $in: exam.questionIds }
  })
    .select("correctAnswer options explanation")
    .lean();

  const questionMap = new Map(questions.map((q) => [String(q._id), q]));
  let score = 0;

  const evaluatedAnswers = answers.map((ans) => {
    const q = questionMap.get(String(ans.questionId));
    let isCorrect = false;

    if (q) {
      const selected = Array.isArray(ans.selectedOptionKeys)
        ? ans.selectedOptionKeys[0]
        : ans.selectedOption;

      if (
        selected !== undefined &&
        String(selected).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase()
      ) {
        isCorrect = true;
        score += 1;
      }
    }

    return {
      questionId: ans.questionId,
      selectedOptionKeys: ans.selectedOptionKeys || (ans.selectedOption ? [ans.selectedOption] : []),
      isCorrect
    };
  });

  const totalQuestions = questions.length || 1;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= (exam.passingScore || 50);

  attempt.answers = evaluatedAnswers;
  attempt.score = score;
  attempt.totalMarks = totalQuestions;
  attempt.percentage = percentage;
  attempt.passed = passed;
  attempt.completedAt = new Date();
  attempt.status = "completed";
  await attempt.save();

  return {
    attempt: {
      _id: attempt._id,
      examId: attempt.examId,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      passed: attempt.passed,
      completedAt: attempt.completedAt,
      status: attempt.status
    }
  };
}
