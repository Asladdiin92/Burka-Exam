import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { User } from "../models/User.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";
import { Question } from "../models/Question.js";
import { Exam } from "../models/Exam.js";
import { Note } from "../models/Note.js";

async function runSeed() {
  console.log("Connecting to database...");
  await connectDatabase();

  console.log("Seeding initial administrative users...");
  const usersToSeed = [
    {
      email: "admin@ethioprep.com",
      displayName: "System Administrator",
      role: "admin",
      password: "adminPassword123"
    },
    {
      email: "content@ethioprep.com",
      displayName: "Content Lead Manager",
      role: "content_manager",
      password: "contentPassword123"
    },
    {
      email: "cashier@ethioprep.com",
      displayName: "Cash & Finance Officer",
      role: "cash_manager",
      password: "cashierPassword123"
    },
    {
      email: "student@ethioprep.com",
      displayName: "Abebe Kebede",
      role: "student",
      password: "studentPassword123"
    }
  ];

  for (const u of usersToSeed) {
    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      const passwordHash = await User.hashPassword(u.password);
      await User.create({
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        passwordHash,
        status: "active",
        emailVerified: true
      });
      console.log(`Created user: ${u.email} (${u.role}) - Verified`);
    } else {
      existing.status = "active";
      existing.emailVerified = true;
      await existing.save();
      console.log(`User already exists, set to active & verified: ${u.email}`);
    }
  }

  console.log("Seeding Ethiopian Entrance Exam Subjects...");
  const subjectsData = [
    // Natural Science
    {
      name: "Mathematics (Natural)",
      code: "MATH_NAT",
      gradeLevel: "grade-12",
      stream: "natural",
      description: "Calculus, Vectors, Matrices, Complex Numbers and Coordinate Geometry for Natural Sciences."
    },
    {
      name: "Physics",
      code: "PHYS",
      gradeLevel: "grade-12",
      stream: "natural",
      description: "Mechanics, Electromagnetism, Thermodynamics, Wave Motion and Modern Physics."
    },
    {
      name: "Chemistry",
      code: "CHEM",
      gradeLevel: "grade-12",
      stream: "natural",
      description: "Physical, Inorganic, Organic Chemistry and Environmental Chemistry."
    },
    {
      name: "Biology",
      code: "BIO",
      gradeLevel: "grade-12",
      stream: "natural",
      description: "Cell Biology, Genetics, Human Physiology, Ecology and Evolution."
    },
    // Social Science
    {
      name: "Mathematics (Social)",
      code: "MATH_SOC",
      gradeLevel: "grade-12",
      stream: "social",
      description: "Algebra, Statistics, Probability, Financial Mathematics and Business Calculus."
    },
    {
      name: "Economics",
      code: "ECON",
      gradeLevel: "grade-12",
      stream: "social",
      description: "Microeconomics, Macroeconomics, Ethiopian Economic Development, and Global Trade."
    },
    {
      name: "Geography",
      code: "GEOG",
      gradeLevel: "grade-12",
      stream: "social",
      description: "Physical Geography, Human Geography, Map Reading, and Ethiopian Geographic Systems."
    },
    {
      name: "History",
      code: "HIST",
      gradeLevel: "grade-12",
      stream: "social",
      description: "Ethiopian History, African Pan-Africanism, World Civilization, and Contemporary Global Affairs."
    },
    // Both Streams
    {
      name: "English",
      code: "ENG",
      gradeLevel: "grade-12",
      stream: "both",
      description: "Grammar, Reading Comprehension, Vocabulary, Paragraph Organization and Communicative Activities."
    },
    {
      name: "Aptitude",
      code: "APTITUDE",
      gradeLevel: "grade-12",
      stream: "both",
      description: "Verbal reasoning, quantitative analysis, spatial aptitude and logical reasoning."
    }
  ];

  const seededSubjects = [];
  for (const sub of subjectsData) {
    let subject = await Subject.findOne({ code: sub.code });
    if (!subject) {
      subject = await Subject.create({ ...sub, isActive: true });
      console.log(`Created subject: ${sub.name}`);
    } else {
      subject.stream = sub.stream;
      await subject.save();
    }
    seededSubjects.push(subject);
  }

  console.log("Seeding Sample EUEE Questions...");
  const mathSub = seededSubjects.find((s) => s.code === "MATH_NAT");
  const physSub = seededSubjects.find((s) => s.code === "PHYS");

  let mathChapter = null;
  if (mathSub) {
    mathChapter = await Chapter.findOne({ subjectId: mathSub._id });
    if (!mathChapter) {
      mathChapter = await Chapter.create({
        subjectId: mathSub._id,
        title: "Calculus & Limits",
        order: 1,
        isActive: true
      });
    }
  }

  const sampleQuestions = [
    {
      subjectId: mathSub._id,
      chapterId: mathChapter?._id,
      prompt: "What is the derivative of f(x) = 3x^4 - 5x^2 + 7 with respect to x?",
      difficulty: "medium",
      options: [
        "12x^3 - 10x",
        "12x^3 - 10x + 7",
        "7x^3 - 5x",
        "3x^3 - 10x"
      ],
      correctAnswer: "A",
      explanation: "Using the power rule d/dx(x^n) = n*x^(n-1): d/dx(3x^4) = 12x^3, d/dx(-5x^2) = -10x, and d/dx(7) = 0. Therefore f'(x) = 12x^3 - 10x.",
      isActive: true
    },
    {
      subjectId: mathSub._id,
      chapterId: mathChapter?._id,
      prompt: "Evaluate the limit: lim (x -> 0) of (sin 3x) / x.",
      difficulty: "easy",
      options: [
        "0",
        "1",
        "3",
        "Does not exist"
      ],
      correctAnswer: "C",
      explanation: "Using the standard trigonometric limit lim(u -> 0) (sin u)/u = 1. Multiply numerator and denominator by 3: 3 * (sin 3x)/(3x) -> 3 * 1 = 3.",
      isActive: true
    },
    {
      subjectId: physSub?._id || mathSub._id,
      chapterId: mathChapter?._id,
      prompt: "A car accelerates uniformly from rest to a speed of 20 m/s in 5 seconds. What is the distance covered?",
      difficulty: "medium",
      options: [
        "50 m",
        "100 m",
        "40 m",
        "25 m"
      ],
      correctAnswer: "A",
      explanation: "Average velocity = (u + v)/2 = (0 + 20)/2 = 10 m/s. Distance s = v_avg * t = 10 * 5 = 50 meters.",
      isActive: true
    }
  ];

  const seededQuestionIds = [];
  for (const q of sampleQuestions) {
    let existing = await Question.findOne({ prompt: q.prompt });
    if (!existing) {
      existing = await Question.create(q);
      console.log(`Created question: ${q.prompt.substring(0, 40)}...`);
    } else {
      console.log(`Question already exists: ${q.prompt.substring(0, 40)}...`);
    }
    seededQuestionIds.push(existing._id);
  }

  console.log("Seeding Natural Science Mock Exam...");
  if (mathSub && seededQuestionIds.length > 0) {
    const existingExam = await Exam.findOne({ title: "EUEE Mathematics Natural Model Exam 2024" });
    if (!existingExam) {
      await Exam.create({
        title: "EUEE Mathematics Natural Model Exam 2024",
        description: "Official model exam adhering to the Ethiopian Ministry of Education entrance exam blueprint.",
        type: "mock_exam",
        subjectId: mathSub._id,
        examYear: 2024,
        questionIds: seededQuestionIds,
        durationMinutes: 60,
        passingScore: 60,
        accessLevel: "free",
        status: "published",
        randomizeQuestions: true,
        randomizeOptions: true
      });
      console.log("Created practice exam: EUEE Mathematics Natural Model Exam 2024");
    }
  }

  console.log("Seeding Social Science Sample Questions & Mock Exam...");
  const histSub = seededSubjects.find((s) => s.code === "HIST");
  const econSub = seededSubjects.find((s) => s.code === "ECON");

  const socialQuestions = [
    {
      subjectId: histSub?._id,
      prompt: "The historic Battle of Adwa, which secured Ethiopian sovereignty against colonial forces, took place in which year?",
      difficulty: "easy",
      options: ["1896", "1889", "1936", "1875"],
      correctAnswer: "A",
      explanation: "The Battle of Adwa was fought on March 1, 1896 between the Ethiopian Empire and the Kingdom of Italy, leading to a decisive Ethiopian victory.",
      isActive: true
    },
    {
      subjectId: econSub?._id,
      prompt: "In economics, the value of the next best alternative given up when making a decision is known as:",
      difficulty: "easy",
      options: ["Opportunity Cost", "Sunk Cost", "Marginal Revenue", "Inflationary Gap"],
      correctAnswer: "A",
      explanation: "Opportunity cost represents the potential benefits an individual, investor, or business misses out on when choosing one alternative over another.",
      isActive: true
    }
  ];

  const socialQIds = [];
  for (const sq of socialQuestions) {
    if (sq.subjectId) {
      let existing = await Question.findOne({ prompt: sq.prompt });
      if (!existing) {
        existing = await Question.create(sq);
        console.log(`Created social question: ${sq.prompt.substring(0, 40)}...`);
      }
      socialQIds.push(existing._id);
    }
  }

  if (histSub && socialQIds.length > 0) {
    const existingSocialExam = await Exam.findOne({ title: "EUEE Social Science Model Exam 2024" });
    if (!existingSocialExam) {
      await Exam.create({
        title: "EUEE Social Science Model Exam 2024",
        description: "Comprehensive national mock exam for Ethiopian Social Science university entrance prep.",
        type: "mock_exam",
        subjectId: histSub._id,
        examYear: 2024,
        questionIds: socialQIds,
        durationMinutes: 60,
        passingScore: 60,
        accessLevel: "free",
        status: "published",
        randomizeQuestions: true,
        randomizeOptions: true
      });
      console.log("Created practice exam: EUEE Social Science Model Exam 2024");
    }
  }

  console.log("Seeding Educational Notes (PDF / PPT / DOCX)...");
  await Note.collection.dropIndex("userId_1_localId_1").catch(() => {});
  const adminUser = await User.findOne({ role: "admin" });
  const sampleNotes = [
    {
      title: "Algebra & Calculus Key Formulas Summary",
      subjectId: mathSub?._id,
      fileType: "pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      body: "Comprehensive summary of polynomial equations, matrices, determinants, and integration by parts for Ethiopian grade 12 entrance.",
      isPublic: true,
      uploadedBy: adminUser?._id
    },
    {
      title: "Newton's Laws and Rotational Dynamics Slide Deck",
      subjectId: seededSubjects.find(s => s.code === "PHYS")?._id,
      fileType: "ppt",
      fileUrl: "https://file-examples.com/wp-content/storage/2017/08/file_example_PPT_250kB.ppt",
      body: "Essential presentation slides covering kinematics, circular motion, Newton's 3 laws, and work-energy theorem.",
      isPublic: true,
      uploadedBy: adminUser?._id
    },
    {
      title: "Organic Chemistry Reactions & Mechanisms Handout",
      subjectId: seededSubjects.find(s => s.code === "CHEM")?._id,
      fileType: "docx",
      fileUrl: "https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.docx",
      body: "Detailed reaction pathways for alkanes, alkenes, alcohols, and carboxylic acids required by the national curriculum.",
      isPublic: true,
      uploadedBy: adminUser?._id
    },
    {
      title: "Battle of Adwa & Modern Ethiopian History Study Guide",
      subjectId: histSub?._id,
      fileType: "pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      body: "Complete chronicle of late 19th-century diplomacy, Treaty of Wuchale, and the military strategies of Emperor Menelik II.",
      isPublic: true,
      uploadedBy: adminUser?._id
    }
  ];

  for (const n of sampleNotes) {
    if (n.subjectId) {
      const existing = await Note.findOne({ title: n.title });
      if (!existing) {
        await Note.create({ ...n, userId: adminUser?._id });
        console.log(`Created educational note: ${n.title} (${n.fileType.toUpperCase()})`);
      }
    }
  }

  console.log("Database seed completed successfully!");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
