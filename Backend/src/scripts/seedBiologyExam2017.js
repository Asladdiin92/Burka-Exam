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

export async function seedBiologyExam2017() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding ESSLCE Biology Exam for Year 2017 E.C....");
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

  // 3. Define and sync Curriculum Chapters for this ESSLCE Biology Exam
  const chapterDefs = [
    // Modern Grade 12 chapters
    { title: "Chapter 1: Application of Biology", order: 1 },
    { title: "Chapter 2: Microorganisms", order: 2 },
    { title: "Chapter 3: Energy Transformation", order: 3 },
    { title: "Chapter 4: Evolution", order: 4 },
    { title: "Chapter 5: Human Body System", order: 5 },
    { title: "Chapter 6: Climate Change", order: 6 },
    // Grade 9
    { title: "Unit 1: Biology and Technology (Grade 9)", order: 120 },
    { title: "Unit 2: Cell Biology (Grade 9)", order: 121 },
    { title: "Unit 3: Human Biology and Health (Grade 9)", order: 122 },
    { title: "Unit 5: Classification (Grade 9)", order: 123 },
    { title: "Unit 6: Environment (Grade 9)", order: 124 },
    // Grade 10
    { title: "Unit 1: Biotechnology (Grade 10)", order: 130 },
    { title: "Unit 2: Heredity (Grade 10)", order: 131 },
    { title: "Unit 3: Human Biology and Health (Grade 10)", order: 125 },
    { title: "Unit 4: Food Making and Growth in Plants (Grade 10)", order: 126 },
    { title: "Unit 5: Conservation of Natural Resources (Grade 10)", order: 127 },
    // Grade 11
    { title: "Unit 1: The Science of Biology (Grade 11)", order: 101 },
    { title: "Unit 2: Biochemical Molecules (Grade 11)", order: 102 },
    { title: "Unit 3: Enzymes (Grade 11)", order: 103 },
    { title: "Unit 4: Cell Biology (Grade 11)", order: 104 },
    { title: "Unit 5: Energy Transformation (Grade 11)", order: 105 },
    // Grade 12
    { title: "Unit 1: Microorganisms (Grade 12)", order: 106 },
    { title: "Unit 2: Ecology (Grade 12)", order: 107 },
    { title: "Unit 3: Genetics (Grade 12)", order: 108 },
    { title: "Unit 4: Evolution (Grade 12)", order: 109 },
    { title: "Unit 5: Behavior (Grade 12)", order: 110 }
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
        description: `ESSLCE Biology Curriculum: ${def.title}`,
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

  // 4. Load the 100 questions from JSON data
  const jsonPath = path.resolve(__dirname, "../seeds/data/biology_esslce_2017_booklet351.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`Loaded ${rawData.length} questions from ${path.basename(jsonPath)}`);

  const bulkOps = [];
  const prompts = [];

  for (const item of rawData) {
    const matchedChapterId = chapterMap[item.unit] || allChapterIds[0];

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
      "booklet-351",
      "biology",
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
  const examTitle = "ESSLCE Biology (2017 E.C.) - Booklet 351";
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
      "Ethiopian Secondary School Leaving Certificate Examination (ESSLCE) Biology — 2017 E.C. (2025 G.C.), Subject Code: 06, Booklet Code: 351. Complete 100 multiple-choice master reference items covering Grade 9 (Biodiversity, Cell Biology, Nutrition, Respiration, Transport, Classification, Plant Diversity, Ecosystems), Grade 10 (Cell Division, Plant Anatomy, Plant Hormones, Animal Biology, Thermoregulation), Grade 11 (Enzymology & Metabolism, Genetics, Meiosis, Mendelian Genetics, Cellular Respiration, Photosynthesis), and Grade 12 (Human Reproduction, Environmental Science, Biotechnology & Genetic Engineering, Microbiology & Virology, Evolution, Human Body Systems & Sensory Organs, Endocrine & Excretory Homeostasis, Climate Change & Green Legacy) with verified answers and detailed step-by-step explanations.",
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
  console.log("SUCCESS: Biology Exam for Year 2017 E.C. successfully registered!");
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

if (process.argv[1] && process.argv[1].endsWith("seedBiologyExam2017.js")) {
  connectDatabase()
    .then(async () => {
      await seedBiologyExam2017();
      await disconnectDatabase();
      console.log("Database connection closed.");
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Error during 2017 E.C. Biology exam seeding:", err);
      try {
        await disconnectDatabase();
      } catch (_) {}
      process.exit(1);
    });
}
