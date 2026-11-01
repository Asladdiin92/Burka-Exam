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

export async function seedEnglishExam2014() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding ESSLCE English Exam for Year 2014 E.C....");
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

  // 3. Define and sync Curriculum Chapters for this ESSLCE English Exam
  const chapterDefs = [
    {
      key: "writing",
      matchFn: (item) => item.questionNumber >= 77 && item.questionNumber <= 94,
      title: "Unit 1: Writing Skills (Letter Writing, Coherence, Mechanics & Spelling)",
      order: 401
    },
    {
      key: "communicative",
      matchFn: (item) => item.questionNumber >= 95 && item.questionNumber <= 120,
      title: "Unit 2: Communicative Activities & Functional Dialogue",
      order: 402
    },
    {
      key: "vocabulary",
      matchFn: (item) =>
        (item.questionNumber >= 39 && item.questionNumber <= 40) ||
        (item.questionNumber >= 61 && item.questionNumber <= 76),
      title: "Unit 3: Sentence Comprehension & Vocabulary",
      order: 403
    },
    {
      key: "reading",
      matchFn: (item) => item.questionNumber >= 41 && item.questionNumber <= 60,
      title: "Unit 4: Reading Comprehension & Passage Analysis",
      order: 404
    },
    {
      key: "grammar",
      matchFn: (item) => item.questionNumber >= 1 && item.questionNumber <= 38,
      title: "Unit 5: Grammar and Usage (Conditionals, Tenses, Modals & Connectors)",
      order: 405
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

  // 4. Load the 120 questions from JSON data
  const jsonPath = path.resolve(__dirname, "../seeds/data/english_esslce_2014_booklet028.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`Loaded ${rawData.length} questions from ${path.basename(jsonPath)}`);

  const seededQuestionIds = [];
  let createdCount = 0;
  let updatedCount = 0;

  for (const item of rawData) {
    const matchedDef = chapterDefs.find((def) => def.matchFn(item)) || chapterDefs[4];
    const chapterId = chapterMap[matchedDef.key];

    const topicTag = item.topic
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 35);

    const tags = ["esslce", "euee", "2014", "2014-ec", "booklet-028", "english", topicTag].filter(t => Boolean(t) && t.length <= 40);

    const questionData = {
      subjectId: subject._id,
      chapterId,
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

  console.log(`Questions processed: ${createdCount} created, ${updatedCount} updated (Total: ${seededQuestionIds.length})\n`);

  // 5. Create or update Exam for 2014 E.C.
  const examTitle = "ESSLCE English (2014 E.C.) - Booklet 028";
  let exam = await Exam.findOne({
    subjectId: subject._id,
    examYear: 2014
  });

  if (!exam) {
    exam = await Exam.findOne({ title: examTitle });
  }

  const examPayload = {
    title: examTitle,
    description: "Educational Assessment and Examination Service (EAES) Ethiopian Secondary School Leaving Certificate Examination (ESSLCE) English — Tikimt 2014/15 E.C. (October 2022 G.C.), Subject Code: 01, Booklet Code: 028. Complete 120 multiple-choice master reference items covering Grammar & Usage, Sentence Comprehension, Reading Comprehension Passages, Contextual Vocabulary, Writing Skills (Word Order, Spelling, Punctuation, Topic Sentences, Letter Writing, Paragraph Coherence), and Communicative Dialogue Activities with verified answer keys and detailed explanations.",
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
    console.log(`[UPDATED EXAM] "${examTitle}" (${exam._id}) for Year 2014 E.C. with ${seededQuestionIds.length} questions.`);
  } else {
    exam = await Exam.create(examPayload);
    console.log(`[CREATED EXAM] "${examTitle}" (${exam._id}) for Year 2014 E.C. with ${seededQuestionIds.length} questions.`);
  }

  console.log("\n===============================================================");
  console.log(`SUCCESS: English Exam for Year 2014 E.C. successfully registered!`);
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
    await seedEnglishExam2014();
  } catch (err) {
    console.error("Error during 2014 E.C. English exam seeding:", err);
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
