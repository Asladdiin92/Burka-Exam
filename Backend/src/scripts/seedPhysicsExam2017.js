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

export async function seedPhysicsExam2017() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding ESSLCE Physics Exam for Year 2017 E.C....");
  console.log("===============================================================\n");

  // 1. Locate Subject (Prefer PHYS_12 or PHYS)
  let subject = await Subject.findOne({ code: "PHYS_12" });
  if (!subject) {
    subject = await Subject.findOne({ code: "PHYS" });
  }
  if (!subject) {
    subject = await Subject.create({
      name: "Grade 12 Physics",
      code: "PHYS_12",
      gradeLevel: "grade-12",
      stream: "natural",
      description: "Ethiopian University Entrance Examination (ESSLCE) Physics Curriculum.",
      isActive: true
    });
    console.log("Created Subject: Grade 12 Physics (PHYS_12)");
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

  // 3. Define and sync Curriculum Chapters for this ESSLCE Physics Exam
  const chapterDefs = [
    { title: "Chapter 1: Application of Physics in Other Fields", order: 1 },
    { title: "Unit 1: Measurement, Vectors & Kinematics", order: 601 },
    { title: "Unit 2: Dynamics, Work, Energy & Momentum", order: 602 },
    { title: "Unit 3: Rotational Motion & Equilibrium", order: 603 },
    { title: "Unit 4: Properties of Matter & Fluid Mechanics", order: 604 },
    { title: "Unit 5: Thermal Physics & Thermodynamics", order: 605 },
    { title: "Unit 6: Oscillations, Waves & Optics", order: 606 },
    { title: "Unit 7: Electricity, Magnetism & Electromagnetism", order: 607 }
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
        description: `ESSLCE Entrance Exam Topic: ${def.title}`,
        order: def.order,
        isActive: true
      });
      console.log(`+ Created Chapter: ${def.title}`);
    } else {
      console.log(`* Found Chapter: ${def.title}`);
    }

    chapterMap[def.title] = chapter._id;
    allChapterIds.push(chapter._id);
  }
  console.log("");

  // 4. Load the 60 questions from JSON data
  const jsonPath = path.resolve(__dirname, "../seeds/data/physics_esslce_2017_booklet321.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`Loaded ${rawData.length} questions from ${path.basename(jsonPath)}`);

  const bulkOps = [];
  const prompts = [];

  for (const item of rawData) {
    const matchedChapterId = chapterMap[item.unit] || allChapterIds[1];

    const topicTag = item.topic
      .toLowerCase()
      .replace(/^unit\s*\d+:\s*/i, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\/.*$/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 35);

    const tags = [
      "esslce",
      "euee",
      "2017",
      "2017-ec",
      "booklet-321",
      "physics",
      topicTag
    ].filter((t) => Boolean(t) && t.length <= 40);

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

  if (seededQuestionIds.length !== rawData.length) {
    throw new Error(
      `Question mapping mismatch: expected ${rawData.length}, mapped ${seededQuestionIds.length}`
    );
  }

  // 5. Create or update Exam for 2017 E.C.
  const examTitle = "ESSLCE Physics (2017 E.C.) - Booklet 321";
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
      "Ethiopian Secondary School Leaving Certificate Examination (ESSLCE) Physics — Sene 2017 E.C. (June/July 2025 G.C.), Subject Code: 04, Booklet Code: 321. Complete 60 multiple-choice master reference items covering Measurement, Vectors, Kinematics, Dynamics, Energy & Momentum, Simple Machines, Fluid Mechanics, Thermal Physics, Waves, Optics, Electricity, Magnetism, Electronics, and Engineering Applications with 8 embedded high-resolution apparatus and circuit diagrams and detailed step-by-step explanations.",
    type: "entrance_exam",
    subjectId: subject._id,
    examYear: 2017,
    chapterIds: allChapterIds,
    questionIds: seededQuestionIds,
    durationMinutes: 150,
    passingScore: 50,
    totalQuestions: seededQuestionIds.length,
    status: "published",
    isPublished: true,
    publishedAt: new Date()
  };

  if (exam) {
    Object.assign(exam, examPayload);
    await exam.save();
    console.log(
      `[UPDATED EXAM] "${exam.title}" (${exam._id}) for Year ${exam.examYear} E.C. with ${exam.questionIds.length} questions.`
    );
  } else {
    exam = await Exam.create(examPayload);
    console.log(
      `[CREATED EXAM] "${exam.title}" (${exam._id}) for Year ${exam.examYear} E.C. with ${exam.questionIds.length} questions.`
    );
  }

  console.log("\n===============================================================");
  console.log("SUCCESS: Physics Exam for Year 2017 E.C. successfully registered!");
  console.log(`- Exam ID: ${exam._id}`);
  console.log(`- Title: ${exam.title}`);
  console.log(`- Year: ${exam.examYear} E.C.`);
  console.log(`- Subject: ${subject.name} (${subject.code})`);
  console.log(`- Questions: ${exam.questionIds.length}`);
  console.log(`- Time: ${exam.durationMinutes} Minutes (2:30 Hours)`);
  console.log(`- Status: ${exam.status}`);
  console.log("===============================================================\n");

  return exam;
}

if (process.argv[1] && process.argv[1].endsWith("seedPhysicsExam2017.js")) {
  connectDatabase()
    .then(async () => {
      await seedPhysicsExam2017();
      await disconnectDatabase();
      console.log("Database connection closed.");
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Error during 2017 E.C. Physics exam seeding:", err);
      try {
        await disconnectDatabase();
      } catch (_) {}
      process.exit(1);
    });
}
