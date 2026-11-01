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

export async function seedEnglishExam2017() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding EUEE / ESSLCE English Exam for Year 2017 E.C....");
  console.log("===============================================================\n");

  // 1. Locate Subject (Prefer ENG_12 or ENG)
  let subject = await Subject.findOne({ code: "ENG_12" });
  if (!subject) {
    subject = await Subject.findOne({ code: "ENG" });
  }
  if (!subject) {
    subject = await Subject.create({
      name: "Grade 12 English",
      code: "ENG_12",
      gradeLevel: "grade-12",
      stream: "both",
      description: "Ethiopian University Entrance Examination (ESSLCE) English Curriculum.",
      isActive: true
    });
    console.log("Created Subject: Grade 12 English (ENG_12)");
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

  // 3. Define and sync Curriculum Chapters for this English Exam
  const chapterDefs = [
    {
      key: "reading",
      matchFn: (item) => item.questionNumber >= 1 && item.questionNumber <= 18,
      title: "Unit 4: Reading Comprehension & Passage Analysis",
      order: 404
    },
    {
      key: "vocabulary",
      matchFn: (item) => item.questionNumber >= 19 && item.questionNumber <= 34,
      title: "Unit 3: Sentence Comprehension & Vocabulary",
      order: 403
    },
    {
      key: "grammar",
      matchFn: (item) => item.questionNumber >= 35 && item.questionNumber <= 62,
      title: "Unit 5: Grammar and Usage (Conditionals, Tenses, Modals & Connectors)",
      order: 405
    },
    {
      key: "writing",
      matchFn: (item) => item.questionNumber >= 63 && item.questionNumber <= 80,
      title: "Unit 1: Writing Skills (Letter Writing, Coherence, Mechanics & Spelling)",
      order: 401
    },
    {
      key: "communicative",
      matchFn: (item) => item.questionNumber >= 81 && item.questionNumber <= 100,
      title: "Unit 2: Communicative Activities & Functional Dialogue",
      order: 402
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
        description: `ESSLCE English Entrance Exam Section: ${def.title}`,
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

  // 4. Load the 100 questions from JSON data
  const jsonPath = path.resolve(__dirname, "../seeds/data/english_esslce_2017_master.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`Loaded ${rawData.length} questions from ${path.basename(jsonPath)}`);

  const bulkOps = [];
  const prompts = [];

  for (const item of rawData) {
    let matchedChapterId = null;
    for (const def of chapterDefs) {
      if (def.matchFn(item)) {
        matchedChapterId = chapterMap[def.key];
        break;
      }
    }

    if (!matchedChapterId) {
      matchedChapterId = chapterMap["reading"];
    }

    const topicTag = (item.topic || "english")
      .toLowerCase()
      .replace(/^unit\s*\d+:\s*/i, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\/.*$/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 35);

    const tags = ["esslce", "euee", "2017", "2017-ec", "english", topicTag].filter(
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
      tags,
      createdBy: authorId,
      isActive: true
    };

    prompts.push(item.prompt);
    bulkOps.push({
      updateOne: {
        filter: {
          subjectId: subject._id,
          prompt: item.prompt
        },
        update: {
          $set: questionData
        },
        upsert: true
      }
    });
  }

  console.log(`Executing bulkWrite for ${bulkOps.length} questions...`);
  const bulkResult = await Question.bulkWrite(bulkOps);
  console.log(
    `Bulk write completed: matched=${bulkResult.matchedCount}, modified=${bulkResult.modifiedCount}, upserted=${bulkResult.upsertedCount}`
  );

  // Retrieve all questions in exact order of rawData
  const savedQuestions = await Question.find({
    subjectId: subject._id,
    prompt: { $in: prompts }
  }).select("_id prompt");

  const promptToId = new Map(savedQuestions.map((q) => [q.prompt, q._id]));
  const seededQuestionIds = prompts.map((p) => promptToId.get(p)).filter(Boolean);

  console.log(
    `Questions processed: Total mapped = ${seededQuestionIds.length} / ${rawData.length}\n`
  );

  // 5. Create or update Exam for 2017 E.C.
  const examTitle = "ESSLCE English (2017 E.C.)";
  let exam = await Exam.findOne({
    subjectId: subject._id,
    examYear: 2017
  });

  if (!exam) {
    exam = await Exam.findOne({ title: examTitle });
  }

  const examPayload = {
    title: examTitle,
    description:
      "Ethiopian University Entrance Examination (EUEE / ESSLCE) English — 2017 E.C. (2025 G.C.), Natural Science Stream. Complete 100 multiple-choice master reference items covering Reading Comprehension (Passage I: Homelessness and Personal Responsibility; Passage II: Environmental Protection), Vocabulary (Completion, Substitution & Analogies), Sentence Comprehension, Language Focus / Grammar (Tenses, Conditionals, Modals, Passive Voice, Reported Speech & Inversion), Writing Skills (Spelling, Punctuation, Jumbled Sentences, Paragraph Coherence, Paragraph Types & Formal Application Letter), and Communicative Dialogue Activities with verified answers and detailed explanations.",
    type: "entrance_exam",
    subjectId: subject._id,
    examYear: 2017,
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
      `[UPDATED EXAM] "${examTitle}" (${exam._id}) for Year 2017 E.C. with ${seededQuestionIds.length} questions.`
    );
  } else {
    exam = await Exam.create(examPayload);
    console.log(
      `[CREATED EXAM] "${examTitle}" (${exam._id}) for Year 2017 E.C. with ${seededQuestionIds.length} questions.`
    );
  }

  console.log("\n===============================================================");
  console.log(`SUCCESS: English Exam for Year 2017 E.C. successfully registered!`);
  console.log(`- Exam ID: ${exam._id}`);
  console.log(`- Title: ${exam.title}`);
  console.log(`- Year: ${exam.examYear} E.C.`);
  console.log(`- Subject: ${subject.name} (${subject.code})`);
  console.log(`- Questions: ${seededQuestionIds.length}`);
  console.log(`- Time: ${exam.durationMinutes} Minutes (2:00 Hours)`);
  console.log(`- Status: ${exam.status}`);
  console.log("===============================================================\n");

  return exam;
}

async function runStandalone() {
  await connectDatabase();
  try {
    await seedEnglishExam2017();
  } catch (err) {
    console.error("Error during 2017 E.C. English exam seeding:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runStandalone();
}
