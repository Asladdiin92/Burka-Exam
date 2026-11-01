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

export async function seedPhysicsExam2013() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding ESSLCE Physics Exam for Year 2013 E.C....");
  console.log("===============================================================\n");

  // 1. Locate or create Subject (Prefer PHYS_12 or PHYS)
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
    {
      key: "vectors_kinematics",
      matchFn: (item) =>
        (item.questionNumber >= 21 && item.questionNumber <= 29) || item.questionNumber === 42,
      title: "Unit 1: Measurement, Vectors & Kinematics",
      order: 601
    },
    {
      key: "dynamics_energy_momentum",
      matchFn: (item) =>
        item.questionNumber === 30 ||
        item.questionNumber === 41 ||
        (item.questionNumber >= 43 && item.questionNumber <= 47),
      title: "Unit 2: Dynamics, Work, Energy & Momentum",
      order: 602
    },
    {
      key: "rotational_motion",
      matchFn: (item) =>
        item.questionNumber === 31 ||
        item.questionNumber === 32 ||
        (item.questionNumber >= 48 && item.questionNumber <= 50),
      title: "Unit 3: Rotational Motion & Equilibrium",
      order: 603
    },
    {
      key: "properties_matter_fluids",
      matchFn: (item) => item.questionNumber >= 33 && item.questionNumber <= 36,
      title: "Unit 4: Properties of Matter & Fluid Mechanics",
      order: 604
    },
    {
      key: "thermal_thermodynamics",
      matchFn: (item) =>
        item.questionNumber === 11 || (item.questionNumber >= 37 && item.questionNumber <= 40),
      title: "Unit 5: Thermal Physics & Thermodynamics",
      order: 605
    },
    {
      key: "oscillations_waves_optics",
      matchFn: (item) => item.questionNumber >= 12 && item.questionNumber <= 16,
      title: "Unit 6: Oscillations, Waves & Optics",
      order: 606
    },
    {
      key: "electromagnetism_circuits",
      matchFn: (item) =>
        item.questionNumber === 1 ||
        (item.questionNumber >= 2 && item.questionNumber <= 10) ||
        (item.questionNumber >= 17 && item.questionNumber <= 20),
      title: "Unit 7: Electricity, Magnetism & Electromagnetism",
      order: 607
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
        description: `ESSLCE Physics Entrance Exam Section: ${def.title}`,
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

  // 4. Load the 50 questions from JSON data
  const jsonPath = path.resolve(__dirname, "../seeds/data/physics_esslce_2013_booklet21.json");
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

    const topicTag = (item.topic || "physics")
      .toLowerCase()
      .replace(/^unit\s*\d+:\s*/i, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\/.*$/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 35);

    const tags = ["esslce", "euee", "physics", "2013", "2013-ec", "booklet-21", topicTag].filter(
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
  const examTitle = "ESSLCE Physics (2013 E.C.) - Booklet 21";
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
      "Ethiopian Secondary School Leaving Certificate Examination (ESSLCE) Physics Entrance Examination — November 2013/2014 E.C., Subject Code: 04, Booklet Code: 21. Complete 50 multiple-choice master reference items covering Measurement & Vectors, Kinematics & Dynamics, Rotational Motion, Fluid Mechanics, Thermal Physics, Oscillations & Waves, Wave Optics, and Electromagnetism with verified answer keys, step-by-step mathematical solutions, and diagram descriptions.",
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
  console.log(`SUCCESS: Physics Exam for Year 2013 E.C. successfully registered!`);
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
    await seedPhysicsExam2013();
  } catch (err) {
    console.error("Error during 2013 E.C. Physics exam seeding:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

if (process.argv[1] && process.argv[1].includes("seedPhysicsExam2013")) {
  runStandalone();
}
