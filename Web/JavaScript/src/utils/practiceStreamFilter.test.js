import test from "node:test";
import assert from "node:assert/strict";
import {
  extractOptionKeyAndText,
  filterExamQuestionsByGradeAndSubject,
  filterSubjectsForPractice,
  findMatchingExamForSubject,
  findMatchingExamsForSubject,
  getSubjectDiscipline,
  isSubjectInStream
} from "./practiceStreamFilter.js";

const sampleSubjects = [
  { _id: "sub_bio_9", code: "BIO_9", name: "Biology (Grade 9)", gradeLevel: "grade-9", stream: "natural" },
  { _id: "sub_bio_12", code: "BIO_12", name: "Biology (Grade 12)", gradeLevel: "grade-12", stream: "natural" },
  { _id: "sub_chem_10", code: "CHEM_10", name: "Chemistry (Grade 10)", gradeLevel: "grade-10", stream: "natural" },
  { _id: "sub_hist_9", code: "HIST_9", name: "History (Grade 9)", gradeLevel: "grade-9", stream: "social" },
  { _id: "sub_geog_12", code: "GEOG_12", name: "Geography (Grade 12)", gradeLevel: "grade-12", stream: "social" },
  { _id: "sub_eng_9", code: "ENG_9", name: "English (Grade 9)", gradeLevel: "grade-9", stream: "both" },
  { _id: "sub_apt_12", code: "APTITUDE", name: "Scholastic Aptitude Test (SAT)", gradeLevel: "grade-12", stream: "both" }
];

const sampleExams = [
  {
    _id: "exam_bio_2017",
    title: "ESSLCE Biology (2017 E.C.)",
    examYear: 2017,
    subjectId: { _id: "sub_bio_12", code: "BIO_12", name: "Biology" },
    questionIds: ["q1", "q2"]
  },
  {
    _id: "exam_bio_2016",
    title: "ESSLCE Biology (2016 E.C.)",
    examYear: 2016,
    subjectId: { _id: "sub_bio_12", code: "BIO_12", name: "Biology" },
    questionIds: ["q3", "q4"]
  },
  {
    _id: "exam_hist_2016",
    title: "ESSLCE History (2016 E.C.)",
    examYear: 2016,
    subjectId: { _id: "sub_hist_12", code: "HIST_12", name: "History" },
    questionIds: ["q5", "q6"]
  }
];

const sampleExamQuestions = [
  {
    _id: "q_bio_9_1",
    prompt: "Which organelle is known as the powerhouse of the cell?",
    subjectCode: "BIO_9",
    subjectName: "Grade 9 Biology",
    gradeLevel: "grade-9",
    chapterTitle: "Unit 2: Cell Biology (Grade 9)"
  },
  {
    _id: "q_bio_10_1",
    prompt: "During genetics, Mendel formulated the law of segregation based on...",
    subjectCode: "BIO_10",
    subjectName: "Grade 10 Biology",
    gradeLevel: "grade-10",
    chapterTitle: "Unit 3: Heredity (Grade 10)"
  },
  {
    _id: "q_bio_12_1",
    prompt: "Which evolutionary mechanism causes changes in allele frequencies due to chance?",
    subjectCode: "BIO_12",
    subjectName: "Grade 12 Biology",
    gradeLevel: "grade-12",
    chapterTitle: "Unit 4: Evolution"
  },
  {
    _id: "q_hist_9_1",
    prompt: "The ancient civilization of Punt was documented by...",
    subjectCode: "HIST_9",
    subjectName: "Grade 9 History",
    gradeLevel: "grade-9",
    chapterTitle: "Unit 1: Early Civilizations (Grade 9)"
  }
];

test("isSubjectInStream properly handles natural, social, and common subjects", () => {
  assert.equal(isSubjectInStream(sampleSubjects[0], "natural"), true);
  assert.equal(isSubjectInStream(sampleSubjects[3], "natural"), false); // History in Natural stream
  assert.equal(isSubjectInStream(sampleSubjects[3], "social"), true); // History in Social stream
  assert.equal(isSubjectInStream(sampleSubjects[0], "social"), false); // Biology in Social stream
  assert.equal(isSubjectInStream(sampleSubjects[5], "natural"), true); // English ("both") in Natural
  assert.equal(isSubjectInStream(sampleSubjects[5], "social"), true); // English ("both") in Social
});

test("filterSubjectsForPractice restricts subjects to student stream", () => {
  const naturalSubs = filterSubjectsForPractice(sampleSubjects, "natural", "all");
  assert.equal(naturalSubs.length, 5); // 2 bio + 1 chem + 1 eng + 1 apt
  assert.ok(naturalSubs.every((s) => s.stream === "natural" || s.stream === "both"));
  assert.ok(!naturalSubs.some((s) => s.code.includes("HIST")));

  const socialSubs = filterSubjectsForPractice(sampleSubjects, "social", "all");
  assert.equal(socialSubs.length, 4); // 1 hist + 1 geog + 1 eng + 1 apt
  assert.ok(socialSubs.every((s) => s.stream === "social" || s.stream === "both"));
  assert.ok(!socialSubs.some((s) => s.code.includes("BIO")));
});

test("filterSubjectsForPractice supports combined stream and grade filtering", () => {
  const naturalG9 = filterSubjectsForPractice(sampleSubjects, "natural", "9");
  assert.equal(naturalG9.length, 2); // BIO_9 and ENG_9
  assert.ok(naturalG9.some((s) => s.code === "BIO_9"));
  assert.ok(naturalG9.some((s) => s.code === "ENG_9"));
});

test("findMatchingExamsForSubject returns all matching exams sorted by year descending", () => {
  const bioExams = findMatchingExamsForSubject(sampleExams, sampleSubjects[0]);
  assert.equal(bioExams.length, 2);
  assert.equal(bioExams[0]._id, "exam_bio_2017"); // 2017 before 2016
  assert.equal(bioExams[1]._id, "exam_bio_2016");

  // Specific year lookup
  const exam2016 = findMatchingExamForSubject(sampleExams, sampleSubjects[0], 2016);
  assert.equal(exam2016._id, "exam_bio_2016");
});

test("filterExamQuestionsByGradeAndSubject filters questions by selected grade and subject", () => {
  const bioSub = sampleSubjects[0]; // Grade 9 Biology

  // Filter by Grade 9: should strictly return Grade 9 Biology question, never Grade 10 or 12 or History
  const g9Qs = filterExamQuestionsByGradeAndSubject(sampleExamQuestions, bioSub, "9");
  assert.equal(g9Qs.length, 1);
  assert.equal(g9Qs[0]._id, "q_bio_9_1");

  // Filter by Grade 12: should return only Grade 12 Biology question
  const g12Qs = filterExamQuestionsByGradeAndSubject(sampleExamQuestions, bioSub, "12");
  assert.equal(g12Qs.length, 1);
  assert.equal(g12Qs[0]._id, "q_bio_12_1");

  // Filter with "all" grades: should return all Biology questions (grades 9, 10, 12), excluding History
  const allBioQs = filterExamQuestionsByGradeAndSubject(sampleExamQuestions, bioSub, "all");
  assert.equal(allBioQs.length, 3);
  assert.ok(!allBioQs.some((q) => q._id === "q_hist_9_1"));
});

test("extractOptionKeyAndText handles strings and objects correctly", () => {
  const objOpt = extractOptionKeyAndText({ key: "B", text: "Photosynthesis" }, 1);
  assert.equal(objOpt.key, "B");
  assert.equal(objOpt.text, "Photosynthesis");

  const strOpt = extractOptionKeyAndText("C. Cellular Respiration", 2);
  assert.equal(strOpt.key, "C");
  assert.equal(strOpt.text, "Cellular Respiration");

  const plainStrOpt = extractOptionKeyAndText("Mitochondria", 0);
  assert.equal(plainStrOpt.key, "A");
  assert.equal(plainStrOpt.text, "Mitochondria");
});

test("getExamQuestionCountForGrade accurately calculates question totals per grade", async () => {
  const { getExamQuestionCountForGrade } = await import("./practiceStreamFilter.js");
  const testExam = {
    _id: "ex1",
    examYear: 2017,
    chapterBreakdown: [
      { gradeLevel: "grade-9", questionCount: 17, subjectCode: "BIO_9" },
      { gradeLevel: "grade-10", questionCount: 8, subjectCode: "BIO_10" },
      { gradeLevel: "grade-11", questionCount: 38, subjectCode: "BIO_11" },
      { gradeLevel: "grade-12", questionCount: 37, subjectCode: "BIO_12" }
    ]
  };

  const g10Bio = { code: "BIO_10", gradeLevel: "grade-10" };
  assert.equal(getExamQuestionCountForGrade(testExam, g10Bio, "10"), 8);
  assert.equal(getExamQuestionCountForGrade(testExam, g10Bio, "all"), 8); // inferred from g10Bio.gradeLevel
  assert.equal(getExamQuestionCountForGrade(testExam, null, "11"), 38);
});


