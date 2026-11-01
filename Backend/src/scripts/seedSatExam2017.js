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

export async function seedSatExam2017() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding ESSLCE SAT Exam for Year 2017 E.C....");
  console.log("===============================================================\n");

  // 1. Locate Subject (Prefer APTITUDE or SAT)
  let subject = await Subject.findOne({
    $or: [{ code: "APTITUDE" }, { code: "SAT" }]
  });

  if (!subject) {
    subject = await Subject.create({
      name: "Scholastic Aptitude Test (SAT)",
      code: "APTITUDE",
      gradeLevel: "grade-12",
      stream: "both",
      description: "Ethiopian University Entrance Examination (EUEE / ESSLCE) Scholastic Aptitude Curriculum.",
      isActive: true
    });
    console.log("Created Subject: Scholastic Aptitude Test (APTITUDE)");
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
      title: "Unit 1: Verbal Classification & Vocabulary (Synonyms & Antonyms)",
      order: 501
    },
    {
      title: "Unit 2: Analytical & Logical Reasoning (Puzzles, Deductions & Critical Thinking)",
      order: 502
    },
    {
      title: "Unit 3: Reading Comprehension (Informational & Scientific Texts)",
      order: 503
    },
    {
      title: "Unit 4: Verbal Analogies",
      order: 504
    },
    {
      title: "Unit 5: Data Interpretation & Statistical Analysis",
      order: 505
    },
    {
      title: "Unit 6: Quantitative Reasoning & Mathematical Problem Solving",
      order: 506
    }
  ];

  const chapterMap = {};
  const allChapterIds = [];

  for (const def of chapterDefs) {
    let chapter = await Chapter.findOne({
      subjectId: subject._id,
      $or: [
        { title: def.title },
        { title: new RegExp(`^Unit\\s*${def.order - 500}:`, "i") }
      ]
    });

    if (!chapter) {
      chapter = await Chapter.create({
        subjectId: subject._id,
        title: def.title,
        description: `ESSLCE Scholastic Aptitude Test (SAT) Section: ${def.title}`,
        order: def.order,
        isActive: true
      });
      console.log(`+ Created Chapter: ${def.title}`);
    } else {
      console.log(`* Found Chapter: ${chapter.title}`);
    }

    chapterMap[def.title] = chapter._id;
    allChapterIds.push(chapter._id);
  }
  console.log("");

  // 4. Load the 60 questions from JSON data
  const jsonPath = path.resolve(__dirname, "../seeds/data/sat_esslce_2017_master.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`Loaded ${rawData.length} questions from ${path.basename(jsonPath)}`);

  const bulkOps = [];
  const prompts = [];

  for (const item of rawData) {
    const matchedChapterId = chapterMap[item.unit] || allChapterIds[allChapterIds.length - 1];

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
      "sat",
      "aptitude",
      item.questionNumber <= 35 ? "verbal-reasoning" : "quantitative-reasoning",
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
  const examTitle = "ESSLCE Scholastic Aptitude Test (SAT) (2017 E.C.)";
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
      "Ethiopian University Entrance Examination (EUEE / ESSLCE) Scholastic Aptitude Test (SAT) — 2017 E.C. (2025 G.C.). Complete 60 multiple-choice master reference items covering Section One (Verbal Reasoning: Analytical & Logical Reasoning, Reading Comprehension Passages I & II, Sentence Correction, Classification Items, Verbal Analogies, Synonyms, Antonyms, Word Substitution) and Section Two (Quantitative Reasoning: Combinatorial Geometry, Rational Numbers, Functions, Fractions, Radicals, Pipe Rates, Sphere Mensuration, Quadratic Optimization, Statistical Data Interpretation, Logic & Inequalities) with embedded high-resolution diagrams and detailed step-by-step explanations.",
    type: "entrance_exam",
    subjectId: subject._id,
    examYear: 2017,
    chapterIds: allChapterIds,
    questionIds: seededQuestionIds,
    durationMinutes: 120,
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
  console.log("SUCCESS: SAT Exam for Year 2017 E.C. successfully registered!");
  console.log(`- Exam ID: ${exam._id}`);
  console.log(`- Title: ${exam.title}`);
  console.log(`- Year: ${exam.examYear} E.C.`);
  console.log(`- Subject: ${subject.name} (${subject.code})`);
  console.log(`- Questions: ${exam.questionIds.length}`);
  console.log(`- Time: ${exam.durationMinutes} Minutes (2:00 Hours)`);
  console.log(`- Status: ${exam.status}`);
  console.log("===============================================================\n");

  return exam;
}

if (process.argv[1] && process.argv[1].endsWith("seedSatExam2017.js")) {
  connectDatabase()
    .then(async () => {
      await seedSatExam2017();
      await disconnectDatabase();
      console.log("Database connection closed.");
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Error during 2017 E.C. SAT exam seeding:", err);
      try {
        await disconnectDatabase();
      } catch (_) {}
      process.exit(1);
    });
}
