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

export async function seedChemistryExam2015() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding ESSLCE Chemistry Exam for Year 2015 E.C....");
  console.log("===============================================================\n");

  // 1. Locate Subject (Prefer CHEM_12 or CHEM)
  let subject = await Subject.findOne({ code: "CHEM_12" });
  if (!subject) {
    subject = await Subject.findOne({ code: "CHEM" });
  }
  if (!subject) {
    subject = await Subject.create({
      name: "Grade 12 Chemistry",
      code: "CHEM_12",
      gradeLevel: "grade-12",
      stream: "natural",
      description: "Ethiopian University Entrance Examination (ESSLCE) Chemistry Curriculum.",
      isActive: true
    });
    console.log("Created Subject: Grade 12 Chemistry (CHEM_12)");
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

  // 3. Define and sync Curriculum Chapters for this ESSLCE Chemistry Exam
  const chapterDefs = [
    // Grade 9
    { key: "g9_atom", title: "Unit 1: Structure of the Atom (Grade 9)", order: 191 },
    { key: "g9_periodic", title: "Unit 2: Periodic Classification of the Elements (Grade 9)", order: 192 },
    { key: "g9_bonding", title: "Unit 3: Chemical Bonding & Intermolecular Forces (Grade 9)", order: 193 },
    { key: "g9_reactions", title: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)", order: 198 },
    { key: "g9_matter", title: "Unit 5: Physical States of Matter (Grade 9)", order: 194 },
    // Grade 10
    { key: "g10_organic", title: "Unit 1: Introduction to Organic Chemistry (Grade 10)", order: 201 },
    { key: "g10_inorganic", title: "Unit 2: Important Inorganic Compounds (Grade 10)", order: 195 },
    { key: "g10_energy", title: "Unit 3: Energy Changes & Electrochemistry (Grade 10)", order: 196 },
    { key: "g10_metals", title: "Unit 4: Chemistry of Metals & Metallurgy (Grade 10)", order: 197 },
    // Grade 11
    { key: "g11_concepts", title: "Unit 1: Fundamental Concepts in Chemistry (Grade 11)", order: 202 },
    { key: "g11_atomic", title: "Unit 2: Atomic Structure & Periodic Table (Grade 11)", order: 203 },
    { key: "g11_bonding", title: "Unit 3: Chemical Bonding and Structure (Grade 11)", order: 204 },
    { key: "g11_kinetics", title: "Unit 4: Chemical Kinetics (Grade 11)", order: 205 },
    { key: "g11_equilibrium", title: "Unit 5: Chemical Equilibrium (Grade 11)", order: 206 },
    { key: "g11_carboxylic", title: "Unit 6: Carboxylic Acids, Esters, Fats and Oils (Grade 11)", order: 212 },
    // Grade 12
    { key: "g12_solutions", title: "Unit 1: Solutions (Grade 12)", order: 207 },
    { key: "g12_acid_base", title: "Unit 2: Acid-Base Equilibria (Grade 12)", order: 208 },
    { key: "g12_thermo", title: "Unit 3: Chemical Thermodynamics (Grade 12)", order: 213 },
    { key: "g12_electro", title: "Unit 4: Electrochemistry (Grade 12)", order: 209 },
    { key: "g12_industry", title: "Unit 5: Chemistry in Industry & Elements (Grade 12)", order: 210 },
    { key: "g12_polymers", title: "Unit 6: Chemistry of Polymers (Grade 12)", order: 211 }
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

  // 4. Load the 80 questions from JSON data
  const jsonPath = path.resolve(__dirname, "../seeds/data/chemistry_esslce_2015_booklet495.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`Loaded ${rawData.length} questions from ${path.basename(jsonPath)}`);

  const seededQuestionIds = [];
  let createdCount = 0;
  let updatedCount = 0;

  for (const item of rawData) {
    const chapterTitle = item.unit;
    const matchedChapterId = chapterMap[chapterTitle] || allChapterIds[0];

    const topicTag = (item.topic || "")
      .toLowerCase()
      .replace(/^unit\s*\d+:\s*/i, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\/.*$/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 35);

    const tags = ["esslce", "euee", "2015", "2015-ec", "booklet-495", "chemistry", topicTag].filter(t => Boolean(t) && t.length <= 40);

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

  console.log(`Questions processed: ${createdCount} created, ${updatedCount} updated (Total: ${seededQuestionIds.length})\n`);

  // 5. Create or update Exam for 2015 E.C.
  const examTitle = "ESSLCE Chemistry (2015 E.C.) - Booklet 495";
  let exam = await Exam.findOne({
    subjectId: subject._id,
    examYear: 2015
  });

  if (!exam) {
    exam = await Exam.findOne({ title: examTitle });
  }

  const examPayload = {
    title: examTitle,
    description: "Educational Assessment and Examination Service (EAES) Ethiopian Secondary School Leaving Certificate Examination (ESSLCE) Chemistry — Hamle 2015 E.C. (July 2023 G.C.), Subject Code: 05, Booklet Code: 495. Complete 80 multiple-choice master reference items covering Grade 9–12 Ethiopian chemistry curriculum: Atomic Structure, Periodic Table, Chemical Bonding and Molecular Geometry, States of Matter, Chemical Reactions & Stoichiometry, Chemical Kinetics, Chemical Equilibrium, Solutions, Acid-Base Equilibria, Chemical Thermodynamics, Electrochemistry, Organic Chemistry (Hydrocarbons, Alcohols, Carboxylic Acids, Esters, Fats & Oils), Polymers, and Industrial Chemistry with verified answer keys, embedded molecular/electrochemical diagrams, and comprehensive chemical explanations.",
    type: "entrance_exam",
    subjectId: subject._id,
    examYear: 2015,
    chapterIds: allChapterIds,
    questionIds: seededQuestionIds,
    durationMinutes: 150,
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
    console.log(`[UPDATED EXAM] "${examTitle}" (${exam._id}) for Year 2015 E.C. with ${seededQuestionIds.length} questions.`);
  } else {
    exam = await Exam.create(examPayload);
    console.log(`[CREATED EXAM] "${examTitle}" (${exam._id}) for Year 2015 E.C. with ${seededQuestionIds.length} questions.`);
  }

  console.log("\n===============================================================");
  console.log(`SUCCESS: Chemistry Exam for Year 2015 E.C. successfully registered!`);
  console.log(`- Exam ID: ${exam._id}`);
  console.log(`- Title: ${exam.title}`);
  console.log(`- Year: ${exam.examYear} E.C.`);
  console.log(`- Subject: ${subject.name} (${subject.code})`);
  console.log(`- Questions: ${seededQuestionIds.length}`);
  console.log(`- Time: ${exam.durationMinutes} Minutes (2:30 Hours)`);
  console.log(`- Status: ${exam.status}`);
  console.log("===============================================================\n");

  return exam;
}

async function runStandalone() {
  await connectDatabase();
  try {
    await seedChemistryExam2015();
  } catch (err) {
    console.error("Error during 2015 E.C. Chemistry exam seeding:", err);
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
