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

export async function seedSatExam2014() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding ESSLCE SAT / Aptitude Exam for Year 2014 E.C....");
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
      description: "Ethiopian University Entrance Examination (EUEE / ESSLCE) Scholastic Aptitude Test (SAT) Curriculum — Verbal Reasoning, Reading Comprehension, Analytical Reasoning, Data Interpretation, and Quantitative Reasoning.",
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

  // 3. Define and sync Curriculum Chapters for SAT
  const chapterDefs = [
    {
      key: "verbal_classification_vocab",
      matchFn: (item) =>
        (item.questionNumber >= 14 && item.questionNumber <= 22) ||
        (item.questionNumber >= 28 && item.questionNumber <= 30),
      title: "Unit 1: Verbal Classification & Vocabulary (Synonyms & Antonyms)",
      order: 501
    },
    {
      key: "analytical_logical_reasoning",
      matchFn: (item) => item.questionNumber >= 1 && item.questionNumber <= 8,
      title: "Unit 2: Analytical & Logical Reasoning (Puzzles, Deductions & Critical Thinking)",
      order: 502
    },
    {
      key: "reading_comprehension",
      matchFn: (item) =>
        (item.questionNumber >= 23 && item.questionNumber <= 27) ||
        (item.questionNumber >= 31 && item.questionNumber <= 35),
      title: "Unit 3: Reading Comprehension (Informational & Scientific Texts)",
      order: 503
    },
    {
      key: "verbal_analogies",
      matchFn: (item) => item.questionNumber >= 9 && item.questionNumber <= 13,
      title: "Unit 4: Verbal Analogies",
      order: 504
    },
    {
      key: "data_interpretation",
      matchFn: (item) => item.questionNumber >= 42 && item.questionNumber <= 46,
      title: "Unit 5: Data Interpretation & Statistical Analysis",
      order: 505
    },
    {
      key: "quantitative_reasoning",
      matchFn: (item) =>
        (item.questionNumber >= 36 && item.questionNumber <= 41) ||
        (item.questionNumber >= 47 && item.questionNumber <= 60),
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
        description: `ESSLCE SAT Entrance Exam Section: ${def.title}`,
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
  const jsonPath = path.resolve(__dirname, "../seeds/data/sat_esslce_2014_booklet074.json");
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

    const tags = ["esslce", "eaes", "sat", "aptitude", "2014", "2014-ec", "booklet-074", topicTag].filter(
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

  // 5. Create or update Exam for 2014 E.C.
  const examTitle = "ESSLCE Scholastic Aptitude Test (SAT) (2014 E.C.) - Booklet 074";
  let exam = await Exam.findOne({
    subjectId: subject._id,
    examYear: 2014
  });

  if (!exam) {
    exam = await Exam.findOne({ title: examTitle });
  }

  const examPayload = {
    title: examTitle,
    description:
      "Educational Assessment and Examination Service (EAES) Ethiopian Secondary School Leaving Certificate Examination (ESSLCE) Scholastic Aptitude Test (SAT) — Tikimte 2014/15 E.C. (October 2022 G.C.), Subject Code: 03, Booklet Code: 074. Complete 60 multiple-choice master reference items (35 Verbal Reasoning + 25 Quantitative Reasoning) covering Analytical & Logical Reasoning, Verbal Analogies, Classifications, Synonyms & Antonyms, Reading Comprehension, Sequences & Series, Data Interpretation, and Quantitative Problem Solving with verified answers and comprehensive step-by-step solutions.",
    type: "entrance_exam",
    subjectId: subject._id,
    examYear: 2014,
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
      `[UPDATED EXAM] "${examTitle}" (${exam._id}) for Year 2014 E.C. with ${seededQuestionIds.length} questions.`
    );
  } else {
    exam = await Exam.create(examPayload);
    console.log(
      `[CREATED EXAM] "${examTitle}" (${exam._id}) for Year 2014 E.C. with ${seededQuestionIds.length} questions.`
    );
  }

  console.log("\n===============================================================");
  console.log(`SUCCESS: SAT Exam for Year 2014 E.C. successfully registered!`);
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
    await seedSatExam2014();
  } catch (err) {
    console.error("Error during 2014 E.C. SAT exam seeding:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

if (process.argv[1] && process.argv[1].includes("seedSatExam2014")) {
  runStandalone();
}
