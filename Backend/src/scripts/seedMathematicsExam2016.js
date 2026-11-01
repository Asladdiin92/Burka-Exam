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

export async function seedMathematicsExam2016() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding ESSLCE Mathematics Exam for Year 2016 E.C....");
  console.log("===============================================================\n");

  // 1. Locate Subject (Prefer MATH_12 or MATH_NAT or MATH)
  let subject = await Subject.findOne({ code: "MATH_12" });
  if (!subject) {
    subject = await Subject.findOne({ code: "MATH_NAT" });
  }
  if (!subject) {
    subject = await Subject.findOne({ code: "MATH" });
  }
  if (!subject) {
    subject = await Subject.create({
      name: "Grade 12 Mathematics",
      code: "MATH_12",
      gradeLevel: "grade-12",
      stream: "both",
      description: "Ethiopian University Entrance Examination (ESSLCE) Mathematics Curriculum.",
      isActive: true
    });
    console.log("Created Subject: Grade 12 Mathematics (MATH_12)");
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

  // 3. Define and sync Curriculum Chapters for this ESSLCE Math Exam
  const chapterDefs = [
    { key: "foundations_algebra", title: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)", order: 298 },
    { key: "foundations_geometry", title: "Foundations: Plane Geometry, Solids & Measurement (Grades 9–10)", order: 299 },
    { key: "g11_relations", title: "Unit 1: Further on Relations & Functions (Grade 11)", order: 301 },
    { key: "g11_rational", title: "Unit 2: Rational Expressions & Functions (Grade 11)", order: 302 },
    { key: "g11_coordinate", title: "Unit 3: Coordinate Geometry (Grade 11)", order: 303 },
    { key: "g11_reasoning", title: "Unit 4: Mathematical Reasoning (Grade 11)", order: 304 },
    { key: "g11_statistics", title: "Unit 5: Statistics and Probability (Grade 11)", order: 305 },
    { key: "g11_matrices", title: "Unit 6: Matrices and Determinants (Grade 11)", order: 306 },
    { key: "g11_complex", title: "Unit 7: The Set of Complex Numbers (Grade 11)", order: 307 },
    { key: "g11_vectors", title: "Unit 8: Vectors & Transformations (Grade 11)", order: 308 },
    { key: "g11_trig", title: "Unit 9: Further on Trigonometric Functions (Grade 11)", order: 309 },
    { key: "g12_sequences", title: "Unit 1: Sequences and Series (Grade 12)", order: 310 },
    { key: "g12_limits", title: "Unit 2: Limits and Continuity (Grade 12)", order: 311 },
    { key: "g12_diff", title: "Unit 3: Differential Calculus (Grade 12)", order: 312 },
    { key: "g12_diff_app", title: "Unit 4: Applications of Derivatives (Grade 12)", order: 313 },
    { key: "g12_integral", title: "Unit 5: Integral Calculus (Grade 12)", order: 314 },
    { key: "g12_3d", title: "Unit 6: 3D Geometry & Vectors (Grade 12)", order: 315 }
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
        description: `ESSLCE Mathematics Curriculum: ${def.title}`,
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
  const jsonPath = path.resolve(__dirname, "../seeds/data/mathematics_esslce_2016_booklet112.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`Loaded ${rawData.length} questions from ${path.basename(jsonPath)}`);

  const seededQuestionIds = [];
  let createdCount = 0;
  let updatedCount = 0;

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

    const tags = ["esslce", "euee", "2016", "2016-ec", "booklet-112", "mathematics", topicTag].filter(
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

  // 5. Create or update Exam for 2016 E.C.
  const examTitle = "ESSLCE Mathematics (2016 E.C.) - Booklet 112";
  let exam = await Exam.findOne({
    subjectId: subject._id,
    examYear: 2016
  });

  if (!exam) {
    exam = await Exam.findOne({ title: examTitle });
  }

  const examPayload = {
    title: examTitle,
    description:
      "Educational Assessment and Examination Service (EAES) Ethiopian Secondary School Leaving Certificate Examination (ESSLCE) Mathematics — Hamlie 2016 E.C. (July 2024 G.C.), Subject Code: 02, Booklet Code: 112. Complete 60 multiple-choice master reference items covering Statistics & Data Analysis, Binomial Theorem, Solid Geometry & Frustums, Absolute Value Inequalities, Circles & Sectors, Radical Expressions, Relations & Functions Graphs, Polynomial Division Theorem, Trigonometry, Mathematical Logic & Tautologies, Sequences & Series, Linear Programming, Geometric Progressions, Coordinate Geometry, Vectors, Sets, Matrices & Determinants, Complex Numbers, Calculus (Derivatives & Integrals), with verified answers, embedded coordinate and geometric diagrams, and comprehensive step-by-step solutions.",
    type: "entrance_exam",
    subjectId: subject._id,
    examYear: 2016,
    chapterIds: allChapterIds,
    questionIds: seededQuestionIds,
    durationMinutes: 180,
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
      `[UPDATED EXAM] "${examTitle}" (${exam._id}) for Year 2016 E.C. with ${seededQuestionIds.length} questions.`
    );
  } else {
    exam = await Exam.create(examPayload);
    console.log(
      `[CREATED EXAM] "${examTitle}" (${exam._id}) for Year 2016 E.C. with ${seededQuestionIds.length} questions.`
    );
  }

  console.log("\n===============================================================");
  console.log(`SUCCESS: Mathematics Exam for Year 2016 E.C. successfully registered!`);
  console.log(`- Exam ID: ${exam._id}`);
  console.log(`- Title: ${exam.title}`);
  console.log(`- Year: ${exam.examYear} E.C.`);
  console.log(`- Subject: ${subject.name} (${subject.code})`);
  console.log(`- Questions: ${seededQuestionIds.length}`);
  console.log(`- Time: ${exam.durationMinutes} Minutes (3:00 Hours)`);
  console.log(`- Status: ${exam.status}`);
  console.log("===============================================================\n");

  return exam;
}

async function runStandalone() {
  await connectDatabase();
  try {
    await seedMathematicsExam2016();
  } catch (err) {
    console.error("Error during 2016 E.C. Mathematics exam seeding:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

if (process.argv[1] && process.argv[1].includes("seedMathematicsExam2016")) {
  runStandalone();
}
