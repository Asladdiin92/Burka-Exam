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

export async function seedBiologyExam2013() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding ESSLCE Biology Exam for Year 2013 E.C....");
  console.log("===============================================================\n");

  // 1. Locate Subject (Prefer BIO_12 or BIO)
  let subject = await Subject.findOne({ code: "BIO_12" });
  if (!subject) {
    subject = await Subject.findOne({ code: "BIO" });
  }
  if (!subject) {
    subject = await Subject.create({
      name: "Grade 12 Biology",
      code: "BIO_12",
      gradeLevel: "grade-12",
      stream: "natural",
      description: "Ethiopian University Entrance Examination (ESSLCE) Biology Curriculum.",
      isActive: true
    });
    console.log("Created Subject: Grade 12 Biology (BIO_12)");
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

  // 3. Define and sync Curriculum Chapters for this ESSLCE Exam
  const chapterDefs = [
    { key: "Grade 11 - Unit 1: The Science of Biology", title: "Unit 1: The Science of Biology (Grade 11)", order: 101 },
    { key: "Grade 11 - Unit 2: Biochemical Molecules", title: "Unit 2: Biochemical Molecules (Grade 11)", order: 102 },
    { key: "Grade 11 - Unit 3: Enzymes", title: "Unit 3: Enzymes (Grade 11)", order: 103 },
    { key: "Grade 11 - Unit 4: Cell Biology", title: "Unit 4: Cell Biology (Grade 11)", order: 104 },
    { key: "Grade 11 - Unit 5: Energy Transformation", title: "Unit 5: Energy Transformation (Grade 11)", order: 105 },
    { key: "Grade 12 - Unit 1: Microorganisms", title: "Unit 1: Microorganisms (Grade 12)", order: 106 },
    { key: "Grade 12 - Unit 2: Ecology", title: "Unit 2: Ecology (Grade 12)", order: 107 },
    { key: "Grade 12 - Unit 3: Genetics", title: "Unit 3: Genetics (Grade 12)", order: 108 },
    { key: "Grade 12 - Unit 4: Evolution", title: "Unit 4: Evolution (Grade 12)", order: 109 },
    { key: "Grade 12 - Unit 5: Behavior", title: "Unit 5: Behavior (Grade 12)", order: 110 },
    { key: "Grade 9 - Unit 4: Microorganisms and Disease", title: "Unit 4: Microorganisms and Disease (Grade 9)", order: 111 }
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
        description: `ESSLCE Entrance Exam Topic: ${def.key}`,
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
  const jsonPath = path.resolve(__dirname, "../seeds/data/biology_esslce_2014_booklet12.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`Loaded ${rawData.length} questions from ${path.basename(jsonPath)}`);

  const seededQuestionIds = [];
  let createdCount = 0;
  let updatedCount = 0;

  for (const item of rawData) {
    const chapterKey = `${item.grade} - ${item.topic}`;
    const chapterId = chapterMap[chapterKey] || allChapterIds[0];

    const topicTag = item.topic
      .toLowerCase()
      .replace(/^unit\s*\d+:\s*/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const tags = ["esslce", "euee", "2013", "2013-ec", "booklet-12", "biology", topicTag];

    const questionData = {
      subjectId: subject._id,
      chapterId,
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

  console.log(`Questions processed: ${createdCount} created, ${updatedCount} updated (Total: ${seededQuestionIds.length})\n`);

  // 5. Create or update Exam for 2013 E.C.
  const examTitle = "ESSLCE Biology (2013 E.C.) - Booklet 12";
  let exam = await Exam.findOne({
    subjectId: subject._id,
    examYear: 2013
  });

  if (!exam) {
    exam = await Exam.findOne({ title: examTitle });
  }

  const examPayload = {
    title: examTitle,
    description: "Ethiopian University Entrance Examination (ESSLCE) Biology — November 2013 E.C. (Subject Code: 06, Booklet Code: 12). 100 complete multiple-choice items with full answer options, verified answer keys, detailed biological explanations, and embedded diagrams.",
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
    console.log(`[UPDATED EXAM] "${examTitle}" (${exam._id}) for Year 2013 E.C. with ${seededQuestionIds.length} questions.`);
  } else {
    exam = await Exam.create(examPayload);
    console.log(`[CREATED EXAM] "${examTitle}" (${exam._id}) for Year 2013 E.C. with ${seededQuestionIds.length} questions.`);
  }

  console.log("\n===============================================================");
  console.log(`SUCCESS: Exam for Year 2013 E.C. successfully registered!`);
  console.log(`- Exam ID: ${exam._id}`);
  console.log(`- Title: ${exam.title}`);
  console.log(`- Year: ${exam.examYear} E.C.`);
  console.log(`- Subject: ${subject.name} (${subject.code})`);
  console.log(`- Questions: ${seededQuestionIds.length}`);
  console.log(`- Time: ${exam.durationMinutes} Minutes (2 Hours)`);
  console.log(`- Status: ${exam.status}`);
  console.log("===============================================================\n");
}

async function runStandalone() {
  await connectDatabase();
  try {
    await seedBiologyExam2013();
  } catch (err) {
    console.error("Error during 2013 E.C. Biology exam seeding:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

if (process.argv[1] && process.argv[1].includes("seedBiologyExam2013")) {
  runStandalone();
}
