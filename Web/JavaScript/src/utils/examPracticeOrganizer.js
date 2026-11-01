export function extractExamYear(exam) {
  if (!exam) return 2017;
  if (exam.examYear || exam.year) return Number(exam.examYear || exam.year) || 2017;
  const match = String(exam.title || "").match(/\b(201[3-9]|202\d)\b/);
  return match ? Number(match[1]) : 2017;
}

export function classifyExamCategory(examOrTitle = "", fallbackYear = 2017) {
  const rawTitle =
    typeof examOrTitle === "string"
      ? examOrTitle
      : String(examOrTitle?.title || examOrTitle?.examType || "");
  const lower = rawTitle.toLowerCase();
  const yr =
    typeof examOrTitle === "object" && examOrTitle !== null
      ? extractExamYear(examOrTitle)
      : Number(fallbackYear) || 2017;

  if (lower.includes("model") || yr === 2018) {
    return {
      category: "model",
      typeLabel: "Regional Model Exam",
      shortBadge: "Model"
    };
  }
  if (lower.includes("past paper")) {
    return {
      category: "past_paper",
      typeLabel: "Official Past Paper",
      shortBadge: "Past Paper"
    };
  }
  return {
    category: "entrance",
    typeLabel: "Entrance Exam (ESSLCE)",
    shortBadge: "Entrance"
  };
}

function extractSubjectLabel(exam) {
  const subjObj = typeof exam?.subjectId === "object" && exam?.subjectId ? exam.subjectId : exam?.subject;
  if (subjObj?.name) {
    return String(subjObj.name).replace(/^Grade\s+\d+\s+/i, "").trim();
  }
  const raw = String(exam?.title || "")
    .replace(/\(\d{4}\s*E\.?C\.?\)/gi, "")
    .replace(/\b201[3-9]\s*E\.?C\.?/gi, "")
    .replace(/\b(Regional\s+Model\s+Exam|ESSLCE\s+Entrance\s+Exam|National\s+Entrance\s+Exam|Entrance\s+Exam|ESSLCE|EUEE)\b/gi, "")
    .replace(/[-—–:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return raw || "Subject";
}

function matchesCategoryFilter(itemCategory, examTitle = "", year = 2017, catFilter = "all") {
  if (!catFilter || catFilter === "all") return true;
  if (itemCategory === catFilter) return true;
  // Official 2013-2017 ESSLCE / Booklet exams are both Entrance Exams and Official Past Papers
  if (catFilter === "past_paper" && itemCategory === "entrance" && Number(year) <= 2017) {
    return true;
  }
  return false;
}

export function buildSubjectYearPracticeGroups(
  subjectExams = [],
  searchQuery = "",
  categoryFilter = "all"
) {
  const byYear = new Map();

  for (const ex of subjectExams) {
    const yr = extractExamYear(ex);
    if (!byYear.has(yr)) {
      byYear.set(yr, []);
    }
    byYear.get(yr).push(ex);
  }

  const years = Array.from(byYear.keys()).sort((a, b) => b - a);
  const q = String(searchQuery || "").trim().toLowerCase();
  const catFilter = String(categoryFilter || "all").toLowerCase();

  const groups = [];

  for (const year of years) {
    const examsInYear = (byYear.get(year) || [])
      .slice()
      .sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
    const primaryExam = examsInYear[0];
    if (!primaryExam) continue;

    const chapters = Array.isArray(primaryExam.chapterBreakdown) ? primaryExam.chapterBreakdown : [];

    // Map each actual database exam in this year with its exact question count and metadata
    const rawItems = examsInYear.map((examDoc) => {
      const totalQs = Array.isArray(examDoc.questionIds)
        ? examDoc.questionIds.length
        : Number(examDoc.totalQuestions) || 0;
      const dur = Number(examDoc.durationMinutes) || 180;
      const subjectLabel = extractSubjectLabel(examDoc);
      const exactTitle = String(examDoc.title || `${subjectLabel} Exam (${year} E.C.)`).trim();
      const catInfo = classifyExamCategory(examDoc, year);

      return {
        id: String(examDoc._id),
        examId: examDoc._id,
        year,
        category: catInfo.category,
        type: catInfo.typeLabel,
        title: exactTitle,
        fullTitle: exactTitle,
        durationMinutes: dur,
        scopeLabel: catInfo.typeLabel,
        subtitle: `${dur} Mins • ${totalQs} Qs • ${catInfo.typeLabel}`,
        questionCount: totalQs,
        chapterId: null,
        exam: examDoc
      };
    });

    const filteredItems = rawItems.filter((item) => {
      if (!matchesCategoryFilter(item.category, item.title, year, catFilter)) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.fullTitle.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        String(year).includes(q)
      );
    });

    if (filteredItems.length > 0) {
      groups.push({
        year,
        heading: `${year} E.C. Exams`,
        primaryExam,
        items: filteredItems,
        chapters
      });
    }
  }

  return groups;
}

export function buildAllExamsYearGroups(
  allExams = [],
  searchQuery = "",
  categoryFilter = "all"
) {
  const q = String(searchQuery || "").trim().toLowerCase();
  const catFilter = String(categoryFilter || "all").toLowerCase();

  const filtered = allExams.filter((ex) => {
    const yr = extractExamYear(ex);
    const info = classifyExamCategory(ex, yr);
    if (!matchesCategoryFilter(info.category, ex.title, yr, catFilter)) {
      return false;
    }
    if (!q) return true;
    const title = String(ex.title || "").toLowerCase();
    const subjName = String(
      typeof ex.subjectId === "object" ? ex.subjectId?.name || "" : ""
    ).toLowerCase();
    const typeLabel = info.typeLabel.toLowerCase();
    return (
      title.includes(q) ||
      subjName.includes(q) ||
      String(yr).includes(q) ||
      typeLabel.includes(q)
    );
  });

  const byYear = new Map();
  for (const ex of filtered) {
    const yr = extractExamYear(ex);
    if (!byYear.has(yr)) byYear.set(yr, []);
    byYear.get(yr).push(ex);
  }

  const years = Array.from(byYear.keys()).sort((a, b) => b - a);
  return years.map((year) => {
    const exams = (byYear.get(year) || [])
      .slice()
      .sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")))
      .map((ex) => {
        const info = classifyExamCategory(ex, year);
        const dur = ex.durationMinutes || 180;
        const qCount = ex.questionIds?.length || ex.totalQuestions || 60;
        return {
          ...ex,
          category: info.category,
          typeLabel: info.typeLabel,
          shortBadge: info.shortBadge,
          formattedSubtitle: `${dur} Mins • ${qCount} Qs • ${info.typeLabel}`
        };
      });
    return {
      year,
      heading: `${year} E.C. Exams`,
      exams
    };
  });
}
