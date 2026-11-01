import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "./env.js";
import { buildFallbackExamQuestions } from "../seeds/socialAndModelQuestions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

mongoose.set("bufferCommands", false);

const memoryCollections = new Map();
let fallbackInstalled = false;

function getCollection(modelName) {
  if (!memoryCollections.has(modelName)) {
    memoryCollections.set(modelName, new Map());
  }
  return memoryCollections.get(modelName);
}

function newId() {
  return new mongoose.Types.ObjectId().toString();
}

function attachDocHelpers(modelName, rawDoc) {
  if (!rawDoc || typeof rawDoc !== "object") return rawDoc;
  const doc = { ...rawDoc };
  Object.defineProperty(doc, "toObject", {
    value: () => ({ ...doc }),
    enumerable: false
  });
  Object.defineProperty(doc, "save", {
    value: async function () {
      doc.updatedAt = new Date();
      getCollection(modelName).set(String(doc._id), { ...doc });
      return doc;
    },
    enumerable: false
  });
  if (modelName === "User") {
    const checkPw = async (candidate) => {
      if (!doc.passwordHash) return false;
      return bcrypt.compare(String(candidate), doc.passwordHash);
    };
    Object.defineProperty(doc, "comparePassword", { value: checkPw, enumerable: false });
    Object.defineProperty(doc, "verifyPassword", { value: checkPw, enumerable: false });
  }
  return doc;
}

function matchesFilter(doc, filter = {}) {
  if (!filter || typeof filter !== "object") return true;
  for (const [key, cond] of Object.entries(filter)) {
    if (key === "$or" && Array.isArray(cond)) {
      if (!cond.some((sub) => matchesFilter(doc, sub))) return false;
      continue;
    }
    const val = doc[key];
    if (cond && typeof cond === "object" && !(cond instanceof Date) && !Array.isArray(cond)) {
      if ("$ne" in cond && String(val) === String(cond.$ne)) return false;
      if ("$in" in cond && Array.isArray(cond.$in)) {
        const set = cond.$in.map(String);
        if (Array.isArray(val)) {
          if (!val.some((v) => set.includes(String(v)))) return false;
        } else if (!set.includes(String(val))) {
          return false;
        }
      }
      if ("$gt" in cond && !(new Date(val) > new Date(cond.$gt))) return false;
      if ("$gte" in cond && !(new Date(val) >= new Date(cond.$gte))) return false;
      if ("$regex" in cond) {
        const re = new RegExp(cond.$regex, cond.$options || "");
        if (!re.test(String(val || ""))) return false;
      }
    } else if (cond !== undefined) {
      if (key === "_id" || key.endsWith("Id")) {
        const rawVal = val && typeof val === "object" && val._id ? val._id : val;
        if (String(rawVal) !== String(cond)) return false;
      } else if (val !== cond) {
        return false;
      }
    }
  }
  return true;
}

function createQueryChain(modelName, resolver) {
  const state = {
    populates: [],
    sortSpec: null,
    limitNum: null,
    isLean: false
  };

  const execute = async () => {
    let result = await resolver(state);
    if (Array.isArray(result)) {
      if (state.sortSpec) {
        const entries = Object.entries(state.sortSpec);
        result.sort((a, b) => {
          for (const [field, dir] of entries) {
            const av = a[field] ?? "";
            const bv = b[field] ?? "";
            if (av < bv) return dir < 0 ? 1 : -1;
            if (av > bv) return dir < 0 ? -1 : 1;
          }
          return 0;
        });
      }
      if (state.limitNum) {
        result = result.slice(0, state.limitNum);
      }
      result = result.map((item) => applyPopulate(item, state.populates));
      return state.isLean ? result.map((d) => ({ ...d })) : result.map((d) => attachDocHelpers(modelName, d));
    } else if (result) {
      const populated = applyPopulate(result, state.populates);
      return state.isLean ? { ...populated } : attachDocHelpers(modelName, populated);
    }
    return null;
  };

  const chain = {
    select() { return chain; },
    populate(field) { state.populates.push(field); return chain; },
    sort(spec) { state.sortSpec = spec; return chain; },
    limit(n) { state.limitNum = Number(n); return chain; },
    lean() { state.isLean = true; return chain; },
    then(onFulfilled, onRejected) {
      return execute().then(onFulfilled, onRejected);
    },
    catch(onRejected) {
      return execute().catch(onRejected);
    }
  };
  return chain;
}

function applyPopulate(doc, fields) {
  if (!doc || !fields.length) return doc;
  const copy = { ...doc };
  const refMap = {
    subjectId: "Subject",
    chapterId: "Chapter",
    chapterIds: "Chapter",
    examId: "Exam",
    uploadedBy: "User",
    userId: "User"
  };
  for (const field of fields) {
    const targetModel = refMap[field];
    if (!targetModel) continue;
    const col = getCollection(targetModel);
    if (Array.isArray(copy[field])) {
      copy[field] = copy[field].map((id) => col.get(String(id)) || id);
    } else if (copy[field]) {
      const id = typeof copy[field] === "object" && copy[field]._id ? copy[field]._id : copy[field];
      const found = col.get(String(id));
      if (found) copy[field] = { ...found };
    }
  }
  return copy;
}

async function seedMemoryStore() {
  if (getCollection("User").size > 0) return;
  const now = new Date();
  const staff = [
    { email: "admin@ethioprep.com", displayName: "System Administrator", role: "admin", password: "adminPassword123" },
    { email: "content@ethioprep.com", displayName: "Content Lead Manager", role: "content_manager", password: "contentPassword123" },
    { email: "cashier@ethioprep.com", displayName: "Cash & Finance Officer", role: "cash_manager", password: "cashierPassword123" },
    { email: "cash@ethioprep.com", displayName: "Cash Manager", role: "cash_manager", password: "cashPassword123" },
    { email: "student@ethioprep.com", displayName: "Abebe Kebede", role: "student", password: "studentPassword123" }
  ];

  const usersCol = getCollection("User");
  let adminId = null;
  for (const acc of staff) {
    const id = newId();
    if (acc.role === "admin") adminId = id;
    const passwordHash = bcrypt.hashSync(acc.password, 4);
    usersCol.set(id, {
      _id: id,
      id,
      email: acc.email,
      displayName: acc.displayName,
      role: acc.role,
      stream: "natural",
      passwordHash,
      status: "active",
      emailVerified: true,
      isPremium: true,
      createdAt: now,
      updatedAt: now
    });
  }

  const [{ grade9And10SubjectsData }, { grade11SubjectsData }, { grade12SubjectsData }] = await Promise.all([
    import("../scripts/seedGrade9_10Subjects.js"),
    import("../scripts/seedGrade11Subjects.js"),
    import("../scripts/seedGrade12Subjects.js")
  ]);

  const satSubjectDef = {
    gradeLevel: "grade-12",
    code: "APTITUDE",
    name: "Scholastic Aptitude Test (SAT)",
    stream: "both",
    description: "Ethiopian University Entrance Examination (EUEE / ESSLCE) Scholastic Aptitude Curriculum covering verbal reasoning, reading comprehension, analytical reasoning, and quantitative problem solving.",
    chapters: [
      { order: 1, title: "Unit 1: Verbal Classification & Vocabulary (Synonyms & Antonyms)", description: "Synonyms, antonyms, word relationships, and contextual vocabulary." },
      { order: 2, title: "Unit 2: Analytical & Logical Reasoning (Puzzles, Deductions & Critical Thinking)", description: "Logical deductions, seating arrangements, ordering, and critical reasoning." },
      { order: 3, title: "Unit 3: Reading Comprehension (Informational & Scientific Texts)", description: "Main idea retrieval, inference, tone analysis, and passage interpretation." },
      { order: 4, title: "Unit 4: Verbal Analogies", description: "Proportional word relationships and functional/structural analogies." },
      { order: 5, title: "Unit 5: Data Interpretation & Statistical Analysis", description: "Tables, charts, ratios, percentages, and quantitative trends." },
      { order: 6, title: "Unit 6: Quantitative Reasoning & Mathematical Problem Solving", description: "Arithmetic, algebra, geometry, probability, and quantitative comparisons." }
    ]
  };

  const allSubjectsDefs = [
    ...grade9And10SubjectsData,
    ...grade11SubjectsData,
    ...grade12SubjectsData,
    satSubjectDef
  ];

  const subjectsCol = getCollection("Subject");
  const chaptersCol = getCollection("Chapter");
  const questionsCol = getCollection("Question");
  const examsCol = getCollection("Exam");
  const notesCol = getCollection("Note");

  const subjectByCode = new Map();
  const chaptersBySubjectCode = new Map();

  for (const sDef of allSubjectsDefs) {
    const subId = newId();
    const subjectDoc = {
      _id: subId,
      name: sDef.name,
      code: sDef.code,
      gradeLevel: sDef.gradeLevel,
      stream: sDef.stream,
      description: sDef.description,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    subjectsCol.set(subId, subjectDoc);
    subjectByCode.set(sDef.code, subjectDoc);

    const subjChapters = [];
    for (const cDef of sDef.chapters || []) {
      const chId = newId();
      const chDoc = {
        _id: chId,
        subjectId: subId,
        title: cDef.title,
        description: cDef.description,
        order: cDef.order,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };
      chaptersCol.set(chId, chDoc);
      subjChapters.push(chDoc);

      const noteId = newId();
      notesCol.set(noteId, {
        _id: noteId,
        userId: adminId,
        uploadedBy: adminId,
        subjectId: subId,
        chapterId: chId,
        title: `${sDef.name} — ${cDef.title}`,
        body: `${cDef.description}\n\nKey Curriculum Summary:\n• Official Ethiopian Secondary Curriculum Unit (${sDef.code})\n• High-yield definitions, core principles, worked examples, and ESSLCE exam strategies for ${cDef.title}.`,
        fileType: "pdf",
        isPublic: true,
        isPremium: false,
        status: "active",
        createdAt: now,
        updatedAt: now
      });
    }
    chaptersBySubjectCode.set(sDef.code, subjChapters);
  }

  function resolveGradeCode(discipline, rawGradeText, fallbackIndex = 0) {
    if (discipline === "APTITUDE") return "APTITUDE";
    const text = String(rawGradeText || "");
    const m = text.match(/Grade\s*(9|10|11|12)/i);
    if (m) {
      return `${discipline}_${m[1]}`;
    }
    const grades = [9, 10, 11, 12];
    const g = grades[fallbackIndex % grades.length];
    return `${discipline}_${g}`;
  }

  function resolveChapterForSubject(subjCode, unitOrTopicText, fallbackIndex = 0) {
    const chList = chaptersBySubjectCode.get(subjCode) || [];
    if (chList.length === 0) return null;
    const text = String(unitOrTopicText || "");
    const numMatch = text.match(/(?:Unit|Chapter)\s*(\d+)/i);
    if (numMatch) {
      const orderNum = Number(numMatch[1]);
      const exact = chList.find((c) => c.order === orderNum);
      if (exact) return exact;
    }
    return chList[fallbackIndex % chList.length];
  }

  // All 46 Exams across 2013 E.C. - 2018 E.C. (matching AGENTS.md Phase 9)
  const examDefinitions = [
    // 2013 E.C. (6 exams / 475 Qs)
    { year: 2013, discipline: "BIO", anchorCode: "BIO_12", title: "ESSLCE Biology (2013 E.C.) - Booklet 12", duration: 120, file: "biology_esslce_2014_booklet12.json", count: 100 },
    { year: 2013, discipline: "CHEM", anchorCode: "CHEM_12", title: "ESSLCE Chemistry (2013 E.C.) - Booklet 17", duration: 150, file: "chemistry_esslce_2013_booklet17.json", count: 80 },
    { year: 2013, discipline: "ENG", anchorCode: "ENG_12", title: "ESSLCE English (2013 E.C.) - Booklet 34", duration: 120, file: "english_esslce_2013_booklet34.json", count: 120 },
    { year: 2013, discipline: "MATH", anchorCode: "MATH_12", title: "ESSLCE Mathematics (2013 E.C.) - Booklet 28", duration: 180, file: "mathematics_esslce_2013_booklet28.json", count: 65 },
    { year: 2013, discipline: "PHYS", anchorCode: "PHYS_12", title: "ESSLCE Physics (2013 E.C.) - Booklet 21", duration: 120, file: "physics_esslce_2013_booklet21.json", count: 50 },
    { year: 2013, discipline: "APTITUDE", anchorCode: "APTITUDE", title: "EUEE Scholastic Aptitude Test (SAT) (2013 E.C.) - Booklet 26", duration: 120, file: "sat_esslce_2013_booklet26.json", count: 60 },

    // 2014 E.C. (6 exams / 475 Qs)
    { year: 2014, discipline: "BIO", anchorCode: "BIO_12", title: "ESSLCE Biology (2014 E.C.) - Booklet 154", duration: 120, file: "biology_esslce_2014_booklet154.json", count: 100 },
    { year: 2014, discipline: "CHEM", anchorCode: "CHEM_12", title: "ESSLCE Chemistry (2014 E.C.) - Booklet 125", duration: 120, file: "chemistry_esslce_2014_booklet125.json", count: 80 },
    { year: 2014, discipline: "ENG", anchorCode: "ENG_12", title: "ESSLCE English (2014 E.C.) - Booklet 028", duration: 120, file: "english_esslce_2014_booklet028.json", count: 120 },
    { year: 2014, discipline: "MATH", anchorCode: "MATH_12", title: "ESSLCE Mathematics (2014 E.C.) - Booklet 058", duration: 180, file: "mathematics_esslce_2014_booklet058.json", count: 65 },
    { year: 2014, discipline: "PHYS", anchorCode: "PHYS_12", title: "ESSLCE Physics (2014 E.C.) - Booklet 099", duration: 120, file: "physics_esslce_2014_booklet099.json", count: 50 },
    { year: 2014, discipline: "APTITUDE", anchorCode: "APTITUDE", title: "ESSLCE Scholastic Aptitude Test (SAT) (2014 E.C.) - Booklet 074", duration: 120, file: "sat_esslce_2014_booklet074.json", count: 60 },

    // 2015 E.C. (8 exams / 675 Qs)
    { year: 2015, discipline: "BIO", anchorCode: "BIO_12", title: "ESSLCE Biology (2015 E.C.) - Booklet 480", duration: 120, file: "biology_esslce_2015_booklet480.json", count: 100 },
    { year: 2015, discipline: "CHEM", anchorCode: "CHEM_12", title: "ESSLCE Chemistry (2015 E.C.) - Booklet 495", duration: 150, file: "chemistry_esslce_2015_booklet495.json", count: 80 },
    { year: 2015, discipline: "ENG", anchorCode: "ENG_12", title: "ESSLCE English (2015 E.C.) - Booklet 304", duration: 120, file: "english_esslce_2015_booklet304.json", count: 120 },
    { year: 2015, discipline: "GEOG", anchorCode: "GEOG_12", title: "ESSLCE Geography (2015 E.C.)", duration: 120, file: null, count: 100 },
    { year: 2015, discipline: "HIST", anchorCode: "HIST_12", title: "ESSLCE History (2015 E.C.)", duration: 120, file: null, count: 100 },
    { year: 2015, discipline: "MATH", anchorCode: "MATH_12", title: "ESSLCE Mathematics (2015 E.C.) - Booklet 339", duration: 180, file: "mathematics_esslce_2015_booklet339.json", count: 65 },
    { year: 2015, discipline: "PHYS", anchorCode: "PHYS_12", title: "ESSLCE Physics (2015 E.C.) - Booklet 527", duration: 120, file: "physics_esslce_2015_booklet527.json", count: 50 },
    { year: 2015, discipline: "APTITUDE", anchorCode: "APTITUDE", title: "ESSLCE Scholastic Aptitude Test (SAT) (2015 E.C.) - Booklet 432", duration: 120, file: "sat_esslce_2015_booklet432.json", count: 60 },

    // 2016 E.C. (8 exams / 677 Qs)
    { year: 2016, discipline: "BIO", anchorCode: "BIO_12", title: "ESSLCE Biology (2016 E.C.) - Booklet 153", duration: 150, file: "biology_esslce_2016_booklet153.json", count: 100 },
    { year: 2016, discipline: "CHEM", anchorCode: "CHEM_12", title: "ESSLCE Chemistry (2016 E.C.) - Booklet 195", duration: 120, file: "chemistry_esslce_2016_booklet195.json", count: 77 },
    { year: 2016, discipline: "ENG", anchorCode: "ENG_12", title: "ESSLCE English (2016 E.C.)", duration: 120, file: "english_esslce_2016_master.json", count: 120 },
    { year: 2016, discipline: "GEOG", anchorCode: "GEOG_12", title: "ESSLCE Geography (2016 E.C.)", duration: 120, file: null, count: 100 },
    { year: 2016, discipline: "HIST", anchorCode: "HIST_12", title: "ESSLCE History (2016 E.C.)", duration: 120, file: null, count: 100 },
    { year: 2016, discipline: "MATH", anchorCode: "MATH_12", title: "ESSLCE Mathematics (2016 E.C.) - Booklet 112", duration: 180, file: "mathematics_esslce_2016_booklet112.json", count: 60 },
    { year: 2016, discipline: "PHYS", anchorCode: "PHYS_12", title: "ESSLCE Physics (2016 E.C.) - Booklet 177", duration: 150, file: "physics_esslce_2016_booklet177.json", count: 60 },
    { year: 2016, discipline: "APTITUDE", anchorCode: "APTITUDE", title: "ESSLCE Scholastic Aptitude Test (SAT) (2016 E.C.) - Booklet 094", duration: 120, file: "sat_esslce_2016_booklet094.json", count: 60 },

    // 2017 E.C. (9 exams / 748 Qs)
    { year: 2017, discipline: "BIO", anchorCode: "BIO_12", title: "ESSLCE Biology (2017 E.C.) - Booklet 351", duration: 150, file: "biology_esslce_2017_booklet351.json", count: 100 },
    { year: 2017, discipline: "CHEM", anchorCode: "CHEM_12", title: "ESSLCE Chemistry (2017 E.C.)", duration: 150, file: null, count: 80 },
    { year: 2017, discipline: "ECON", anchorCode: "ECON_12", title: "ESSLCE Economics (2017 E.C.)", duration: 150, file: null, count: 85 },
    { year: 2017, discipline: "ENG", anchorCode: "ENG_12", title: "ESSLCE English (2017 E.C.)", duration: 120, file: "english_esslce_2017_master.json", count: 100 },
    { year: 2017, discipline: "GEOG", anchorCode: "GEOG_12", title: "ESSLCE Geography (2017 E.C.)", duration: 150, file: null, count: 103 },
    { year: 2017, discipline: "HIST", anchorCode: "HIST_12", title: "ESSLCE History (2017 E.C.)", duration: 150, file: null, count: 100 },
    { year: 2017, discipline: "MATH", anchorCode: "MATH_12", title: "ESSLCE Mathematics (2017 E.C.) - Booklet 291", duration: 180, file: "mathematics_esslce_2017_booklet291.json", count: 60 },
    { year: 2017, discipline: "PHYS", anchorCode: "PHYS_12", title: "ESSLCE Physics (2017 E.C.) - Booklet 321", duration: 150, file: "physics_esslce_2017_booklet321.json", count: 60 },
    { year: 2017, discipline: "APTITUDE", anchorCode: "APTITUDE", title: "ESSLCE Scholastic Aptitude Test (SAT) (2017 E.C.)", duration: 120, file: "sat_esslce_2017_master.json", count: 60 },

    // 2018 E.C. (9 Regional Model Exams / 733 Qs -> total 3,783 Qs)
    { year: 2018, discipline: "BIO", anchorCode: "BIO_12", title: "Biology Regional Model Exam (2018 E.C.)", duration: 150, file: null, count: 100 },
    { year: 2018, discipline: "CHEM", anchorCode: "CHEM_12", title: "Chemistry Regional Model Exam (2018 E.C.)", duration: 150, file: null, count: 80 },
    { year: 2018, discipline: "ECON", anchorCode: "ECON_12", title: "Economics Regional Model Exam (2018 E.C.)", duration: 150, file: null, count: 80 },
    { year: 2018, discipline: "ENG", anchorCode: "ENG_12", title: "English Regional Model Exam (2018 E.C.)", duration: 120, file: null, count: 90 },
    { year: 2018, discipline: "GEOG", anchorCode: "GEOG_12", title: "Geography Regional Model Exam (2018 E.C.)", duration: 150, file: null, count: 100 },
    { year: 2018, discipline: "HIST", anchorCode: "HIST_12", title: "History Regional Model Exam (2018 E.C.)", duration: 150, file: null, count: 93 },
    { year: 2018, discipline: "MATH", anchorCode: "MATH_12", title: "Mathematics Regional Model Exam (2018 E.C.)", duration: 180, file: null, count: 70 },
    { year: 2018, discipline: "PHYS", anchorCode: "PHYS_12", title: "Physics Regional Model Exam (2018 E.C.)", duration: 150, file: null, count: 60 },
    { year: 2018, discipline: "APTITUDE", anchorCode: "APTITUDE", title: "Scholastic Aptitude Test (SAT) Regional Model Exam (2018 E.C.)", duration: 120, file: null, count: 60 }
  ];

  const seedsDataDir = path.resolve(__dirname, "../seeds/data");

  for (const exDef of examDefinitions) {
    const anchorSubject = subjectByCode.get(exDef.anchorCode);
    if (!anchorSubject) continue;

    let rawItems = null;
    if (exDef.file) {
      const jsonPath = path.join(seedsDataDir, exDef.file);
      if (fs.existsSync(jsonPath)) {
        try {
          rawItems = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        } catch {
          rawItems = null;
        }
      }
    }

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      rawItems = buildFallbackExamQuestions(seedsDataDir, exDef);
    }

    const examQuestionIds = [];
    const examChapterIdsSet = new Set();

    rawItems.forEach((item, idx) => {
      const gradeCode = resolveGradeCode(
        exDef.discipline,
        item.grade || item.gradeLevel || item.unit || item.topic,
        idx
      );
      const qSubject = subjectByCode.get(gradeCode) || anchorSubject;
      const qChapter = resolveChapterForSubject(qSubject.code, item.unit || item.topic || item.section, idx);
      const qId = newId();
      if (qChapter) examChapterIdsSet.add(qChapter._id);

      questionsCol.set(qId, {
        _id: qId,
        subjectId: qSubject._id,
        chapterId: qChapter?._id,
        prompt: item.prompt,
        imageUrl: item.imageUrl || undefined,
        options: Array.isArray(item.options) ? item.options : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: String(item.correctAnswer || "A").trim(),
        explanation: item.explanation || "",
        difficulty: ["easy", "medium", "hard"].includes(item.difficulty) ? item.difficulty : "medium",
        questionType: "multiple_choice",
        tags: ["esslce", String(exDef.year), qSubject.code.toLowerCase()],
        isActive: true,
        createdBy: adminId,
        createdAt: now,
        updatedAt: now
      });
      examQuestionIds.push(qId);
    });

    const examId = newId();
    examsCol.set(examId, {
      _id: examId,
      title: exDef.title,
      description: `Official Ethiopian Secondary School Leaving Certificate Examination (${exDef.year} E.C.) covering Grade 9–12 ${anchorSubject.name} curriculum units.`,
      type: exDef.year === 2018 ? "mock_exam" : "past_exam",
      subjectId: anchorSubject._id,
      examYear: exDef.year,
      chapterIds: Array.from(examChapterIdsSet),
      questionIds: examQuestionIds,
      durationMinutes: exDef.duration,
      passingScore: 50,
      accessLevel: "free",
      status: "published",
      createdBy: adminId,
      createdAt: now,
      updatedAt: now
    });
  }

  // Seed 8 weeks of ExamAttempt records for weekly quiz performance trends
  const attemptsCol = getCollection("ExamAttempt");
  const allExams = Array.from(examsCol.values());
  const weeklyProfiles = [
    { weeksAgo: 7, scores: [54, 58, 62, 51, 60, 56], socialScores: [52, 57, 55] },
    { weeksAgo: 6, scores: [59, 63, 65, 57, 62, 61, 64], socialScores: [56, 60, 58, 61] },
    { weeksAgo: 5, scores: [62, 66, 68, 60, 65, 67, 63, 64], socialScores: [59, 63, 62, 64] },
    { weeksAgo: 4, scores: [65, 70, 72, 64, 68, 71, 67, 69, 66], socialScores: [63, 67, 65, 68] },
    { weeksAgo: 3, scores: [69, 73, 75, 68, 72, 74, 71, 76, 70, 72], socialScores: [66, 70, 69, 71, 68] },
    { weeksAgo: 2, scores: [72, 77, 79, 74, 76, 78, 75, 80, 73, 77, 75], socialScores: [70, 74, 72, 75, 73] },
    { weeksAgo: 1, scores: [76, 81, 83, 78, 80, 82, 79, 84, 77, 81, 80, 79], socialScores: [74, 78, 76, 79, 77, 75] },
    { weeksAgo: 0, scores: [80, 85, 87, 82, 84, 86, 83, 88, 81, 85, 84, 83, 86], socialScores: [78, 82, 80, 83, 81, 79] }
  ];

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  for (const profile of weeklyProfiles) {
    const weekBaseTime = now.getTime() - profile.weeksAgo * 7 * MS_PER_DAY;
    profile.scores.forEach((pct, idx) => {
      const targetExam = allExams[idx % allExams.length];
      if (!targetExam) return;
      const attId = newId();
      const submittedAt = new Date(weekBaseTime - (idx % 5) * MS_PER_DAY);
      const totalQ = 20;
      const correctQ = Math.round((pct / 100) * totalQ);
      const answers = Array.from({ length: totalQ }, (_, qIdx) => ({
        questionId: targetExam.questionIds?.[0] || newId(),
        selectedOption: qIdx < correctQ ? "A" : "B",
        isCorrect: qIdx < correctQ
      }));
      attemptsCol.set(attId, {
        _id: attId,
        userId: adminId,
        examId: targetExam._id,
        stream: "natural",
        status: "submitted",
        score: correctQ,
        percentage: pct,
        passed: pct >= 50,
        startedAt: new Date(submittedAt.getTime() - 45 * 60 * 1000),
        submittedAt,
        answers,
        createdAt: submittedAt,
        updatedAt: submittedAt
      });
    });

    profile.socialScores.forEach((pct, idx) => {
      const targetExam = allExams[(idx + 4) % allExams.length];
      if (!targetExam) return;
      const attId = newId();
      const submittedAt = new Date(weekBaseTime - (idx % 5) * MS_PER_DAY);
      const totalQ = 20;
      const correctQ = Math.round((pct / 100) * totalQ);
      const answers = Array.from({ length: totalQ }, (_, qIdx) => ({
        questionId: targetExam.questionIds?.[0] || newId(),
        selectedOption: qIdx < correctQ ? "A" : "B",
        isCorrect: qIdx < correctQ
      }));
      attemptsCol.set(attId, {
        _id: attId,
        userId: adminId,
        examId: targetExam._id,
        stream: "social",
        status: "submitted",
        score: correctQ,
        percentage: pct,
        passed: pct >= 50,
        startedAt: new Date(submittedAt.getTime() - 45 * 60 * 1000),
        submittedAt,
        answers,
        createdAt: submittedAt,
        updatedAt: submittedAt
      });
    });
  }
}

function installInMemoryFallback() {
  if (fallbackInstalled) return;
  fallbackInstalled = true;

  const orig = {
    find: mongoose.Model.find,
    findOne: mongoose.Model.findOne,
    findById: mongoose.Model.findById,
    findByIdAndUpdate: mongoose.Model.findByIdAndUpdate,
    findOneAndUpdate: mongoose.Model.findOneAndUpdate,
    create: mongoose.Model.create,
    updateOne: mongoose.Model.updateOne,
    updateMany: mongoose.Model.updateMany,
    deleteOne: mongoose.Model.deleteOne,
    countDocuments: mongoose.Model.countDocuments,
    exists: mongoose.Model.exists,
    aggregate: mongoose.Model.aggregate
  };

  const isConnected = () => mongoose.connection.readyState === 1;

  mongoose.Model.find = function (filter = {}, ...args) {
    if (isConnected()) return orig.find.call(this, filter, ...args);
    const modelName = this.modelName;
    return createQueryChain(modelName, async () => {
      const col = getCollection(modelName);
      return Array.from(col.values()).filter((d) => matchesFilter(d, filter));
    });
  };

  mongoose.Model.findOne = function (filter = {}, ...args) {
    if (isConnected()) return orig.findOne.call(this, filter, ...args);
    const modelName = this.modelName;
    return createQueryChain(modelName, async () => {
      const col = getCollection(modelName);
      for (const doc of col.values()) {
        if (matchesFilter(doc, filter)) return doc;
      }
      return null;
    });
  };

  mongoose.Model.findById = function (id, ...args) {
    if (isConnected()) return orig.findById.call(this, id, ...args);
    const modelName = this.modelName;
    return createQueryChain(modelName, async () => {
      if (!id) return null;
      return getCollection(modelName).get(String(id)) || null;
    });
  };

  mongoose.Model.findByIdAndUpdate = function (id, update = {}, options = {}) {
    if (isConnected()) return orig.findByIdAndUpdate.call(this, id, update, options);
    const modelName = this.modelName;
    return createQueryChain(modelName, async () => {
      const col = getCollection(modelName);
      const existing = col.get(String(id));
      if (!existing) return null;
      const changes = update.$set ? { ...update.$set } : { ...update };
      delete changes.$set;
      delete changes.$unset;
      const updated = { ...existing, ...changes, updatedAt: new Date() };
      col.set(String(id), updated);
      return updated;
    });
  };

  mongoose.Model.findOneAndUpdate = function (filter = {}, update = {}, options = {}) {
    if (isConnected()) return orig.findOneAndUpdate.call(this, filter, update, options);
    const modelName = this.modelName;
    return createQueryChain(modelName, async () => {
      const col = getCollection(modelName);
      let existing = null;
      for (const doc of col.values()) {
        if (matchesFilter(doc, filter)) {
          existing = doc;
          break;
        }
      }
      if (!existing && !options?.upsert) return null;
      const id = existing ? String(existing._id) : String(filter._id || newId());
      const base = existing || { _id: id, ...filter, createdAt: new Date() };
      const changes = update.$set ? { ...update.$set } : { ...update };
      delete changes.$set;
      delete changes.$unset;
      const updated = { ...base, ...changes, _id: id, updatedAt: new Date() };
      col.set(id, updated);
      return updated;
    });
  };

  mongoose.Model.create = async function (docOrDocs, ...args) {
    if (isConnected()) return orig.create.call(this, docOrDocs, ...args);
    const modelName = this.modelName;
    const col = getCollection(modelName);
    const createSingle = (item) => {
      const id = item._id ? String(item._id) : newId();
      const now = new Date();
      const saved = {
        isActive: true,
        status: "active",
        ...item,
        _id: id,
        id,
        createdAt: item.createdAt || now,
        updatedAt: item.updatedAt || now
      };
      col.set(id, saved);
      return attachDocHelpers(modelName, saved);
    };
    return Array.isArray(docOrDocs) ? docOrDocs.map(createSingle) : createSingle(docOrDocs);
  };

  mongoose.Model.updateOne = async function (filter = {}, update = {}, ...args) {
    if (isConnected()) return orig.updateOne.call(this, filter, update, ...args);
    const col = getCollection(this.modelName);
    for (const [id, doc] of col.entries()) {
      if (matchesFilter(doc, filter)) {
        const changes = update.$set ? { ...update.$set } : { ...update };
        delete changes.$set;
        col.set(id, { ...doc, ...changes, updatedAt: new Date() });
        return { modifiedCount: 1 };
      }
    }
    return { modifiedCount: 0 };
  };

  mongoose.Model.updateMany = async function (filter = {}, update = {}, ...args) {
    if (isConnected()) return orig.updateMany.call(this, filter, update, ...args);
    const col = getCollection(this.modelName);
    let count = 0;
    for (const [id, doc] of col.entries()) {
      if (matchesFilter(doc, filter)) {
        const changes = update.$set ? { ...update.$set } : { ...update };
        delete changes.$set;
        col.set(id, { ...doc, ...changes, updatedAt: new Date() });
        count++;
      }
    }
    return { modifiedCount: count };
  };

  mongoose.Model.deleteOne = async function (filter = {}, ...args) {
    if (isConnected()) return orig.deleteOne.call(this, filter, ...args);
    const col = getCollection(this.modelName);
    for (const [id, doc] of col.entries()) {
      if (matchesFilter(doc, filter)) {
        col.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  };

  mongoose.Model.countDocuments = async function (filter = {}, ...args) {
    if (isConnected()) return orig.countDocuments.call(this, filter, ...args);
    const col = getCollection(this.modelName);
    return Array.from(col.values()).filter((d) => matchesFilter(d, filter)).length;
  };

  mongoose.Model.exists = async function (filter = {}, ...args) {
    if (isConnected()) return orig.exists.call(this, filter, ...args);
    const col = getCollection(this.modelName);
    for (const doc of col.values()) {
      if (matchesFilter(doc, filter)) return { _id: doc._id };
    }
    return null;
  };

  mongoose.Model.aggregate = async function (pipeline = [], ...args) {
    if (isConnected()) return orig.aggregate.call(this, pipeline, ...args);
    const col = getCollection(this.modelName);
    let docs = Array.from(col.values());
    for (const stage of pipeline) {
      if (stage.$match) {
        docs = docs.filter((d) => matchesFilter(d, stage.$match));
      } else if (stage.$group) {
        const groups = new Map();
        const idExpr = stage.$group._id;
        for (const d of docs) {
          const gKey = idExpr && typeof idExpr === "string" && idExpr.startsWith("$")
            ? String(d[idExpr.slice(1)] ?? "")
            : "null";
          if (!groups.has(gKey)) {
            groups.set(gKey, { _id: idExpr ? d[idExpr.slice(1)] : null, total: 0, count: 0 });
          }
          const g = groups.get(gKey);
          g.count += 1;
          if (stage.$group.total?.$sum && typeof stage.$group.total.$sum === "string") {
            const sumField = stage.$group.total.$sum.slice(1);
            g.total += Number(d[sumField] || 0);
          }
        }
        docs = Array.from(groups.values());
      }
    }
    return docs;
  };
}

function getEffectiveUri(uri) {
  if (uri && uri.startsWith("mongodb+srv://") && uri.includes("cluster1.t7t6gsx.mongodb.net")) {
    try {
      const url = new URL(uri);
      const auth = url.username
        ? encodeURIComponent(decodeURIComponent(url.username)) +
          ":" +
          encodeURIComponent(decodeURIComponent(url.password)) +
          "@"
        : "";
      const pathAndQuery = url.pathname + url.search + (url.search ? "&" : "?") + "ssl=true&replicaSet=atlas-a265l1-shard-0&authSource=admin";
      return (
        "mongodb://" +
        auth +
        "ac-xbrhs0f-shard-00-00.t7t6gsx.mongodb.net:27017," +
        "ac-xbrhs0f-shard-00-01.t7t6gsx.mongodb.net:27017," +
        "ac-xbrhs0f-shard-00-02.t7t6gsx.mongodb.net:27017" +
        pathAndQuery
      );
    } catch {
      return uri;
    }
  }
  return uri;
}

export async function connectDatabase() {
  installInMemoryFallback();
  await seedMemoryStore();

  mongoose.connection.on("connected", () => {
    console.info("MongoDB connected.");
  });

  mongoose.connection.on("error", (error) => {
    console.warn("MongoDB connection warning:", error.message);
  });

  if (!process.env.MONGODB_URI) {
    console.warn("[AI Studio] MONGODB_URI not set — running with pre-seeded in-memory database.");
    return;
  }

  const uriToUse = getEffectiveUri(env.mongodbUri);

  mongoose
    .connect(uriToUse, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      maxPoolSize: 10
    })
    .catch((err) => {
      console.warn("[AI Studio] MongoDB not connected — using pre-seeded in-memory fallback:", err.message);
    });
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect().catch(() => {});
  }
}
