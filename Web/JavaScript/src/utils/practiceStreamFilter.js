/**
 * Pure utilities for Practice Mode stream filtering and exam selection.
 */

export function extractOptionKeyAndText(opt, oIdx = 0) {
  let key = String.fromCharCode(65 + oIdx);
  let text = "";

  if (typeof opt === "object" && opt !== null) {
    key = opt.key || opt.letter || key;
    text = opt.text || opt.label || opt.content || opt.value || "";
  } else if (typeof opt === "string") {
    const match = opt.match(/^([A-Da-d])[\.\)\:\-]\s*(.*)$/);
    if (match) {
      key = match[1].toUpperCase();
      text = match[2];
    } else {
      text = opt;
    }
  }

  return { key: String(key).toUpperCase(), text: String(text).trim() };
}

export function getSubjectDiscipline(subj) {
  if (!subj) return "";
  const code = String(subj.code || "").toUpperCase();
  const name = String(subj.name || "").toLowerCase();

  if (code.includes("BIO") || name.includes("bio")) return "BIO";
  if (code.includes("CHEM") || name.includes("chem")) return "CHEM";
  if (code.includes("PHYS") || name.includes("phys")) return "PHYS";
  if (code.includes("MATH") || name.includes("math")) return "MATH";
  if (code.includes("ENG") || name.includes("eng")) return "ENG";
  if (code.includes("GEOG") || name.includes("geog")) return "GEOG";
  if (code.includes("HIST") || name.includes("hist")) return "HIST";
  if (code.includes("ECON") || name.includes("econ")) return "ECON";
  if (code.includes("APTITUDE") || code.includes("SAT") || name.includes("aptitude") || name.includes("sat")) return "APTITUDE";

  return code.split("_")[0] || code;
}

export function isSubjectInStream(subject, studentStream = "natural") {
  if (!subject) return false;
  if (!studentStream || studentStream === "both" || studentStream === "all") return true;

  const sStream = String(subject.stream || "").toLowerCase();
  const target = String(studentStream).toLowerCase();
  const code = String(subject.code || "").toUpperCase();
  const name = String(subject.name || "").toLowerCase();

  if (target === "natural") {
    // Social Science subjects must NEVER be visible to Natural Science students
    if (sStream === "social") return false;
    if (["HIST", "GEOG", "ECON", "MATH_SOC"].some((k) => code.includes(k))) return false;
    if (name.includes("history") || name.includes("geography") || name.includes("economics") || name.includes("social studies")) return false;
    if (sStream === "natural" || sStream === "both" || sStream === "common") return true;
    if (["BIO", "CHEM", "PHYS", "MATH", "ENG", "APTITUDE", "SAT"].some((k) => code.includes(k))) return true;
    return false;
  }

  if (target === "social") {
    // Natural Science subjects must NEVER be visible to Social Science students
    if (sStream === "natural") return false;
    if (["BIO", "CHEM", "PHYS", "MATH_NAT"].some((k) => code.includes(k))) return false;
    if (name.includes("biology") || name.includes("chemistry") || name.includes("physics")) return false;
    if (sStream === "social" || sStream === "both" || sStream === "common") return true;
    if (["HIST", "GEOG", "ECON", "MATH", "ENG", "APTITUDE", "SAT"].some((k) => code.includes(k))) return true;
    return false;
  }

  return sStream === "both" || sStream === target;
}

export function filterSubjectsForPractice(subjects = [], studentStream = "natural", gradeLevel = "all") {
  return (subjects || []).filter((sub) => {
    // 1. Stream filter: must match student's stream or "both"
    if (!isSubjectInStream(sub, studentStream)) {
      return false;
    }

    // 2. Grade filter
    if (gradeLevel && gradeLevel !== "all") {
      const gStr = String(gradeLevel).replace(/^grade-?/i, "");
      const expected = `grade-${gStr}`;
      if (sub.gradeLevel && sub.gradeLevel !== expected) {
        return false;
      }
    }

    return true;
  });
}

export function getExamQuestionCountForGrade(exam, subject = null, gradeLevel = "all") {
  if (!exam || !Array.isArray(exam.chapterBreakdown)) return 0;
  const gradeStr = gradeLevel && gradeLevel !== "all"
    ? String(gradeLevel).replace(/^grade-?/i, "")
    : (subject?.gradeLevel && subject.gradeLevel !== "all" ? String(subject.gradeLevel).replace(/^grade-?/i, "") : null);

  const subCode = subject?.code ? String(subject.code).toUpperCase() : "";

  return exam.chapterBreakdown.reduce((sum, item) => {
    if (!item) return sum;
    if (gradeStr) {
      const cGrade = String(item.gradeLevel || "").toLowerCase().replace(/^grade-?/i, "");
      const cCode = String(item.subjectCode || "").toUpperCase();
      const title = String(item.title || "").toLowerCase();
      const matchesGrade = cGrade === gradeStr ||
        (subCode && cCode === subCode) ||
        cCode.endsWith(`_${gradeStr}`) ||
        title.includes(`grade ${gradeStr}`) ||
        title.includes(`g${gradeStr}`);

      if (!matchesGrade) return sum;
    }
    return sum + (Number(item.questionCount) || 0);
  }, 0);
}

export function findMatchingExamsForSubject(exams = [], subject, preferredGrade = null) {
  if (!subject || !Array.isArray(exams) || exams.length === 0) return [];

  const subId = String(subject._id || subject.id || "");
  const discipline = getSubjectDiscipline(subject);

  const matched = exams.filter((e) => {
    const eSubjId = String(e.subjectId?._id || e.subjectId || "");
    if (eSubjId && eSubjId === subId) return true;

    if (discipline) {
      const eDiscipline = getSubjectDiscipline(e.subjectId);
      if (eDiscipline && eDiscipline === discipline) return true;

      const eCode = String(e.subjectId?.code || e.code || "").toUpperCase();
      const eName = String(e.subjectId?.name || e.title || "").toLowerCase();
      const eTitle = String(e.title || "").toLowerCase();

      if (eCode.includes(discipline)) return true;
      if (discipline === "BIO" && (eName.includes("bio") || eTitle.includes("bio"))) return true;
      if (discipline === "CHEM" && (eName.includes("chem") || eTitle.includes("chem"))) return true;
      if (discipline === "PHYS" && (eName.includes("phys") || eTitle.includes("phys"))) return true;
      if (discipline === "MATH" && (eName.includes("math") || eTitle.includes("math"))) return true;
      if (discipline === "ENG" && (eName.includes("eng") || eTitle.includes("eng"))) return true;
      if (discipline === "GEOG" && (eName.includes("geog") || eTitle.includes("geog"))) return true;
      if (discipline === "HIST" && (eName.includes("hist") || eTitle.includes("hist"))) return true;
      if (discipline === "ECON" && (eName.includes("econ") || eTitle.includes("econ"))) return true;
      if (discipline === "APTITUDE" && (eName.includes("aptitude") || eTitle.includes("aptitude") || eName.includes("sat") || eTitle.includes("sat"))) return true;
    }

    return false;
  });

  // Sort by examYear descending. If preferredGrade is given, prioritize exams with questions for that grade first.
  return matched.sort((a, b) => {
    if (preferredGrade && preferredGrade !== "all") {
      const countA = getExamQuestionCountForGrade(a, subject, preferredGrade);
      const countB = getExamQuestionCountForGrade(b, subject, preferredGrade);
      const hasA = countA > 0 ? 1 : 0;
      const hasB = countB > 0 ? 1 : 0;
      if (hasA !== hasB) return hasB - hasA;
    }
    return Number(b.examYear || 0) - Number(a.examYear || 0);
  });
}

export function findMatchingExamForSubject(exams = [], subject, preferredExamYear = null, preferredGrade = null) {
  const matches = findMatchingExamsForSubject(exams, subject, preferredGrade);
  if (matches.length === 0) return null;

  if (preferredExamYear && preferredExamYear !== "all") {
    const yearMatch = matches.find((e) => String(e.examYear) === String(preferredExamYear));
    if (yearMatch) return yearMatch;
  }

  if (preferredGrade && preferredGrade !== "all") {
    const withQuestions = matches.find((e) => getExamQuestionCountForGrade(e, subject, preferredGrade) > 0);
    if (withQuestions) return withQuestions;
  }

  return matches[0] || null;
}

export function filterExamQuestionsByGradeAndSubject(questions = [], subject = null, gradeLevel = "all") {
  if (!Array.isArray(questions) || questions.length === 0) return [];

  const targetDiscipline = subject ? getSubjectDiscipline(subject) : "";
  const targetSubId = String(subject?._id || subject?.id || "");
  const normalizedGrade = gradeLevel && gradeLevel !== "all"
    ? (String(gradeLevel).startsWith("grade-") ? String(gradeLevel).toLowerCase() : `grade-${String(gradeLevel).toLowerCase()}`)
    : null;

  return questions.filter((q) => {
    // 1. Subject discipline match
    if (targetDiscipline) {
      const qCode = String(q.subjectCode || q.code || "").toUpperCase();
      const qSubName = String(q.subjectName || "").toLowerCase();
      const qDiscipline = getSubjectDiscipline({ code: qCode, name: qSubName });
      if (qDiscipline && qDiscipline !== targetDiscipline) {
        return false;
      }
    }

    // 2. Grade level match
    if (normalizedGrade) {
      const gradeNum = normalizedGrade.replace(/^grade-?/i, "");
      const qGrade = String(q.gradeLevel || "").toLowerCase();

      // Check explicit gradeLevel field
      const isGradeLevelMatch = qGrade === normalizedGrade || qGrade === gradeNum;

      // Check chapter title or topic string (e.g., "Unit 1: Cell Biology (Grade 9)")
      const chTitle = String(q.chapterTitle || q.topic || "").toLowerCase();
      const hasGradeInTitle = chTitle.includes(`grade ${gradeNum}`) ||
                             chTitle.includes(`grade-${gradeNum}`) ||
                             chTitle.includes(`g${gradeNum}`);

      // Check subject code suffix (e.g., "BIO_9")
      const sCode = String(q.subjectCode || "").toUpperCase();
      const hasGradeInCode = sCode.endsWith(`_${gradeNum}`) || sCode.includes(`_${gradeNum}_`);

      // Match direct subjectId if question has matching subjectId
      const isDirectSubMatch = targetSubId && String(q.subjectId?._id || q.subjectId || "") === targetSubId;

      // Reject if explicitly belongs to another grade and has no match to current grade
      const otherGrades = ["9", "10", "11", "12"].filter((g) => g !== gradeNum);
      const isExplicitOtherGrade = otherGrades.some((og) =>
        qGrade === `grade-${og}` ||
        qGrade === og ||
        (sCode.endsWith(`_${og}`) && !sCode.endsWith(`_${gradeNum}`))
      );

      if (isExplicitOtherGrade && !isGradeLevelMatch && !isDirectSubMatch) {
        return false;
      }

      if (!isGradeLevelMatch && !hasGradeInTitle && !hasGradeInCode && !isDirectSubMatch) {
        return false;
      }
    }

    return true;
  });
}

