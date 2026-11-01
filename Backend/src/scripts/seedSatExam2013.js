import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";
import { Question } from "../models/Question.js";
import { Exam } from "../models/Exam.js";
import { User } from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedSatExam2013() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding EUEE SAT / Aptitude Exam for Year 2013 E.C....");
  console.log("===============================================================\n");

  // 1. Locate or create Subject (Prefer APTITUDE or SAT_12 or SAT)
  let subject = await Subject.findOne({
    $or: [
      { code: "APTITUDE" },
      { code: "SAT_12" },
      { code: "SAT" }
    ]
  });

  if (!subject) {
    subject = await Subject.create({
      name: "Scholastic Aptitude Test (SAT)",
      code: "APTITUDE",
      gradeLevel: "grade-12",
      stream: "both",
      description: "Ethiopian University Entrance Examination (EUEE) Scholastic Aptitude Test (SAT) Curriculum — Verbal Reasoning, Reading Comprehension, Analytical Reasoning, Data Interpretation, and Quantitative Reasoning.",
      isActive: true
    });
    console.log("Created Subject: Scholastic Aptitude Test (SAT) (APTITUDE)");
  } else {
    console.log(`Using Subject: ${subject.name} (${subject.code}) - ID: ${subject._id}`);
  }

  // 2. Author User
  let authorUser = await User.findOne({
    role: { $in: ["admin", "content_manager", "teacher"] }
  });
  if (!authorUser) {
    const passwordHash = await User.hashPassword("adminPassword123");
    authorUser = await User.create({
      email: "admin@ethioprep.com",
      displayName: "System Administrator",
      role: "admin",
      passwordHash,
      status: "active",
      emailVerified: true
    });
    console.log("Created Administrator user for content ownership.");
  }
  const authorId = authorUser._id;
  console.log(`Author Assigned: ${authorUser.displayName} (${authorUser.email})\n`);

  // 3. Define and sync Curriculum Chapters for this EUEE SAT Exam
  const chapterDefs = [
    {
      key: "verbal_classification_vocab",
      matchFn: (item) =>
        (item.questionNumber >= 1 && item.questionNumber <= 4) ||
        (item.questionNumber >= 15 && item.questionNumber <= 17) ||
        (item.questionNumber >= 26 && item.questionNumber <= 28),
      title: "Unit 1: Verbal Classification & Vocabulary (Synonyms & Antonyms)",
      order: 501
    },
    {
      key: "analytical_logical_reasoning",
      matchFn: (item) => item.questionNumber >= 5 && item.questionNumber <= 14,
      title: "Unit 2: Analytical & Logical Reasoning (Puzzles, Deductions & Critical Thinking)",
      order: 502
    },
    {
      key: "reading_comprehension",
      matchFn: (item) => item.questionNumber >= 18 && item.questionNumber <= 25,
      title: "Unit 3: Reading Comprehension (Informational & Scientific Texts)",
      order: 503
    },
    {
      key: "verbal_analogies",
      matchFn: (item) => item.questionNumber >= 29 && item.questionNumber <= 35,
      title: "Unit 4: Verbal Analogies",
      order: 504
    },
    {
      key: "data_interpretation",
      matchFn: (item) => item.questionNumber >= 36 && item.questionNumber <= 40,
      title: "Unit 5: Data Interpretation & Statistical Analysis",
      order: 505
    },
    {
      key: "quantitative_reasoning",
      matchFn: (item) => item.questionNumber >= 41 && item.questionNumber <= 60,
      title: "Unit 6: Quantitative Reasoning & Mathematical Problem Solving",
      order: 506
    }
  ];

  const chapterMap = {};
  const allChapterIds = [];

  for (const def of chapterDefs) {
    let chapter = await Chapter.findOne({
      subjectId: subject._id,
      title: def.title
    });

    if (!chapter) {
      chapter = await Chapter.create({
        subjectId: subject._id,
        title: def.title,
        description: `EUEE SAT Entrance Exam Section: ${def.title}`,
        order: def.order,
        isActive: true
      });
      console.log(`+ Created Chapter: ${def.title}`);
    } else {
      console.log(`* Found Chapter: ${def.title}`);
    }

    chapterMap[def.key] = chapter._id;
    allChapterIds.push(chapter._id);
  }
  console.log("");

  // 4. Load the 60 questions from JSON data
  const jsonPath = path.resolve(__dirname, "../seeds/data/sat_esslce_2013_booklet26.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`Loaded ${rawData.length} questions from ${path.basename(jsonPath)}`);

  const seededQuestionIds = [];
  let createdCount = 0;
  let updatedCount = 0;

  for (const item of rawData) {
    let matchedChapterId = null;
    for (const def of chapterDefs) {
      if (def.matchFn(item)) {
        matchedChapterId = chapterMap[def.key];
        break;
      }
    }
    if (!matchedChapterId) {
      matchedChapterId = allChapterIds[0];
    }

    const topicTag = (item.topic || "aptitude")
      .toLowerCase()
      .replace(/^unit\s*\d+:\s*/i, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\/.*$/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 35);

    const tags = ["euee", "sat", "aptitude", "2013", "2013-ec", "booklet-26", topicTag].filter(
      (t) => Boolean(t) && t.length <= 40
    );

    const questionData = {
      subjectId: subject._id,
      chapterId: matchedChapterId,
      questionType: "multiple_choice",
      difficulty: item.difficulty || "medium",
      prompt: item.prompt,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      imageUrl: item.imageUrl || undefined,
      tags,
      createdBy: authorId,
      isActive: true
    };

    let existingQ = await Question.findOne({
      subjectId: subject._id,
      prompt: item.prompt
    });

    if (existingQ) {
      existingQ.options = questionData.options;
      existingQ.correctAnswer = questionData.correctAnswer;
      existingQ.explanation = questionData.explanation;
      existingQ.difficulty = questionData.difficulty;
      existingQ.tags = questionData.tags;
      existingQ.imageUrl = questionData.imageUrl;
      existingQ.chapterId = questionData.chapterId;
      existingQ.isActive = true;
      await existingQ.save();
      seededQuestionIds.push(existingQ._id);
      updatedCount++;
    } else {
      const createdQ = await Question.create(questionData);
      seededQuestionIds.push(createdQ._id);
      createdCount++;
    }
  }

  console.log(
    `Questions processed: ${createdCount} created, ${updatedCount} updated (Total: ${seededQuestionIds.length})\n`
  );

  // 5. Create or update Exam for 2013 E.C.
  const examTitle = "EUEE Scholastic Aptitude Test (SAT) (2013 E.C.) - Booklet 26";
  let exam = await Exam.findOne({
    subjectId: subject._id,
    examYear: 2013
  });

  if (!exam) {
    exam = await Exam.findOne({ title: examTitle });
  }

  const examPayload = {
    title: examTitle,
    description:
      "Ethiopian University Entrance Examination (EUEE) Scholastic Aptitude Test (SAT) — November 2013/2014, Subject Code: 03, Booklet Code: 26. Complete 60 multiple-choice master items (35 Verbal Reasoning + 25 Quantitative Reasoning) covering Verbal Classification, Analytical & Logical Reasoning, Reading Comprehension, Analogies, Data Interpretation, and Quantitative Problem Solving with verified answers and comprehensive step-by-step solutions.",
    type: "entrance_exam",
    subjectId: subject._id,
    examYear: 2013,
    chapterIds: allChapterIds,
    questionIds: seededQuestionIds,
    durationMinutes: 120,
    passingScore: 50,
    accessLevel: "premium",
    status: "published",
    randomizeQuestions: false,
    randomizeOptions: false,
    createdBy: authorId
  };

  if (exam) {
    Object.assign(exam, examPayload);
    await exam.save();
    console.log(
      `[UPDATED EXAM] "${examTitle}" (${exam._id}) for Year 2013 E.C. with ${seededQuestionIds.length} questions.`
    );
  } else {
    exam = await Exam.create(examPayload);
    console.log(
      `[CREATED EXAM] "${examTitle}" (${exam._id}) for Year 2013 E.C. with ${seededQuestionIds.length} questions.`
    );
  }

  console.log("\n===============================================================");
  console.log(`SUCCESS: SAT Exam for Year 2013 E.C. successfully registered!`);
  console.log(`- Exam ID: ${exam._id}`);
  console.log(`- Title: ${exam.title}`);
  console.log(`- Year: ${exam.examYear} E.C.`);
  console.log(`- Subject: ${subject.name} (${subject.code})`);
  console.log(`- Questions: ${seededQuestionIds.length}`);
  console.log(`- Time: ${exam.durationMinutes} Minutes (2:00 Hours)`);
  console.log(`- Status: ${exam.status}`);
  console.log("===============================================================\n");
}

async function runStandalone() {
  await connectDatabase();
  try {
    await seedSatExam2013();
  } catch (err) {
    console.error("Error during 2013 E.C. SAT exam seeding:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

if (process.argv[1] && process.argv[1].includes("seedSatExam2013")) {
  runStandalone();
}
