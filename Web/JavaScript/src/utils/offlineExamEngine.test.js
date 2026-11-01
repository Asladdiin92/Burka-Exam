import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  classifyRequestForSwCache,
  buildExamStartCacheKey,
  synthesizeOfflineExamStart,
  gradeOfflineExamAttempt,
  resolveQuestionFeedback
} from "./offlineExamEngine.js";

describe("offlineExamEngine", () => {
  it("classifies static precache, static assets, API GETs, and exam POSTs accurately", () => {
    assert.equal(classifyRequestForSwCache("GET", "/"), "static-precache");
    assert.equal(classifyRequestForSwCache("GET", "/manifest.webmanifest"), "static-precache");
    assert.equal(classifyRequestForSwCache("GET", "/assets/index-abc123.js"), "static-asset");
    assert.equal(classifyRequestForSwCache("GET", "/css2", "fonts.googleapis.com"), "static-asset");
    assert.equal(classifyRequestForSwCache("GET", "/api/exams"), "api-get");
    assert.equal(classifyRequestForSwCache("GET", "/api/question-bank/subjects/123/chapters"), "api-get");
    assert.equal(classifyRequestForSwCache("POST", "/api/exams/65f123/start"), "exam-start-post");
    assert.equal(classifyRequestForSwCache("POST", "/api/exams/attempts/att_1/submit"), "exam-submit-post");
    assert.equal(classifyRequestForSwCache("POST", "/api/auth/login"), "auth-post");
    assert.equal(classifyRequestForSwCache("DELETE", "/api/notes/123"), "bypass");
  });

  it("builds deterministic synthetic cache keys for exam start sessions", () => {
    assert.equal(buildExamStartCacheKey("exam_101"), "/__sw_exam_start__/exam_101");
    assert.equal(
      buildExamStartCacheKey("exam_101", { chapterId: "ch_5", allYears: true }),
      "/__sw_exam_start__/exam_101?chapterId=ch_5&allYears=true"
    );
  });

  it("synthesizes an offline exam session from cached bundle data", () => {
    const bundle = {
      exams: [
        {
          _id: "ex_math_2017",
          title: "Mathematics 2017 E.C. Entrance Exam",
          examYear: 2017,
          passingScore: 50,
          subjectId: { _id: "sub_math", name: "Mathematics" },
          questionIds: ["q1", "q2"]
        }
      ],
      chapters: [{ _id: "ch_calc", title: "Unit 2: Calculus", order: 2 }],
      questions: [
        {
          _id: "q1",
          examId: "ex_math_2017",
          subjectId: "sub_math",
          chapterId: "ch_calc",
          prompt: "What is d/dx (x^2)?",
          correctAnswer: "B",
          options: [
            { key: "A", text: "x" },
            { key: "B", text: "2x" }
          ]
        },
        {
          _id: "q2",
          examId: "ex_math_2017",
          subjectId: "sub_math",
          chapterId: "ch_calc",
          prompt: "What is integral of 2x dx?",
          correctAnswer: "A",
          options: [
            { key: "A", text: "x^2 + C" },
            { key: "B", text: "2x^2 + C" }
          ]
        }
      ]
    };

    const fullSession = synthesizeOfflineExamStart(bundle, "ex_math_2017");
    assert.ok(fullSession);
    assert.equal(fullSession.attempt.offline, true);
    assert.equal(fullSession.exam.questions.length, 2);
    assert.equal(fullSession.exam.questions[0].prompt, "What is d/dx (x^2)?");

    const chapterSession = synthesizeOfflineExamStart(bundle, "ex_math_2017", {
      chapterId: "ch_calc",
      allYears: true
    });
    assert.equal(chapterSession.exam.title, "Unit 2: Calculus (All Years)");
    assert.equal(chapterSession.exam.questions.length, 2);
  });

  it("grades offline exam attempts and computes questionResults with explanations", () => {
    const questions = [
      {
        _id: "q1",
        correctAnswer: "B",
        explanation: "Power rule: d/dx(x^2) = 2x",
        options: [
          { key: "A", text: "x" },
          { key: "B", text: "2x" }
        ]
      },
      {
        _id: "q2",
        correctAnswer: "A",
        explanation: "Antiderivative of 2x is x^2 + C",
        options: [
          { key: "A", text: "x^2 + C" },
          { key: "B", text: "2x^2 + C" }
        ]
      }
    ];

    const result = gradeOfflineExamAttempt(
      questions,
      [
        { questionId: "q1", selectedOptionKeys: ["B"], response: "B" },
        { questionId: "q2", selectedOptionKeys: ["B"], response: "B" }
      ],
      50
    );

    assert.equal(result.score, 1);
    assert.equal(result.totalMarks, 2);
    assert.equal(result.percentage, 50);
    assert.equal(result.passed, true);
    assert.equal(result.questionResults.length, 2);
    assert.equal(result.questionResults[0].isCorrect, true);
    assert.equal(result.questionResults[0].selectedAnswerText, "2x");
    assert.equal(result.questionResults[1].isCorrect, false);
    assert.equal(result.questionResults[1].correctAnswerText, "x^2 + C");
  });

  it("preserves question imageUrl, explanationImageUrl, and option imageUrls when synthesizing offline exams", () => {
    const bundle = {
      exams: [
        {
          _id: "ex_phys_2014",
          title: "Physics 2014 E.C. Entrance Exam",
          examYear: 2014,
          passingScore: 50,
          subjectId: { _id: "sub_phys", name: "Physics" },
          questionIds: ["q_diag_1"]
        }
      ],
      chapters: [],
      questions: [
        {
          _id: "q_diag_1",
          examId: "ex_phys_2014",
          subjectId: "sub_phys",
          prompt: "Refer to the circuit diagram below.",
          imageUrl: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=",
          explanationImageUrl: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=",
          optionImages: { A: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=" },
          options: [
            { key: "A", text: "Graph A" },
            { key: "B", text: "Graph B", imageUrl: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=" }
          ]
        }
      ]
    };

    const session = synthesizeOfflineExamStart(bundle, "ex_phys_2014");
    assert.ok(session);
    const q = session.exam.questions[0];
    assert.equal(q.imageUrl, "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=");
    assert.equal(q.explanationImageUrl, "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=");
    assert.equal(q.options[0].imageUrl, "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=");
    assert.equal(q.options[1].imageUrl, "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=");
  });

  it("resolves answer feedback according to after_finishing vs right_away modes", () => {
    const question = {
      _id: "q_bio_1",
      correctAnswer: "C",
      explanation: "Mitochondria are the site of aerobic cellular respiration.",
      options: [
        { key: "A", text: "Ribosome" },
        { key: "B", text: "Golgi apparatus" },
        { key: "C", text: "Mitochondrion" },
        { key: "D", text: "Lysosome" }
      ]
    };

    // In "after_finishing" mode before exam submission, selecting an answer does NOT reveal correctness
    const beforeFinish = resolveQuestionFeedback({
      question,
      selectedKey: "A",
      examResult: null,
      showAnswerMode: "after_finishing"
    });
    assert.equal(beforeFinish.showFeedback, false);
    assert.equal(beforeFinish.review, null);

    // In "right_away" mode, before selecting an option, feedback is hidden
    const rightAwayUnanswered = resolveQuestionFeedback({
      question,
      selectedKey: "",
      examResult: null,
      showAnswerMode: "right_away"
    });
    assert.equal(rightAwayUnanswered.showFeedback, false);

    // In "right_away" mode, selecting a wrong option immediately reveals correct answer and explanation
    const rightAwayWrong = resolveQuestionFeedback({
      question,
      selectedKey: "A",
      examResult: null,
      showAnswerMode: "right_away"
    });
    assert.equal(rightAwayWrong.showFeedback, true);
    assert.equal(rightAwayWrong.isCorrect, false);
    assert.equal(rightAwayWrong.correctKey, "C");
    assert.equal(rightAwayWrong.selectedAnswerText, "A. Ribosome");
    assert.equal(rightAwayWrong.correctAnswerText, "C. Mitochondrion");
    assert.equal(rightAwayWrong.explanation, "Mitochondria are the site of aerobic cellular respiration.");

    // In "right_away" mode, selecting the correct option immediately marks it correct
    const rightAwayCorrect = resolveQuestionFeedback({
      question,
      selectedKey: "C",
      examResult: null,
      showAnswerMode: "right_away"
    });
    assert.equal(rightAwayCorrect.showFeedback, true);
    assert.equal(rightAwayCorrect.isCorrect, true);
    assert.equal(rightAwayCorrect.correctKey, "C");
  });
});


