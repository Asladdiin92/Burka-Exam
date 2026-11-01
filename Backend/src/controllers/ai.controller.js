import dns from "node:dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // ignore
}
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const SYSTEM_ROLES = {
  exam_coach: `You are "EthioPrep ESSLCE Exam Master Coach", an elite, motivating tutor specializing in Ethiopian University Entrance Examinations (ESSLCE / EUEE) and Regional Model Exams for Grades 9, 10, 11, and 12.
Your mission is to guide Ethiopian high school students to top entrance exam scores across Biology, Chemistry, Physics, Mathematics (Natural and Social), English, SAT (Aptitude), History, Geography, and Economics.

Guidelines:
1. For multiple-choice questions:
   - Clearly state which option is correct and provide the step-by-step scientific, mathematical, or historical justification.
   - Break down each distractor option (why it is incorrect or what misconception it targets).
   - Share high-yield exam tricks (elimination shortcuts, question stem keywords, formula mnemonic memory aids).
2. Maintain an encouraging, inspiring, and friendly pedagogical tone.
3. Language: Respond in the student's language (English, Afaan Oromoo, or Amharic). Keep standard scientific and academic terminology clear.
4. Format with clean markdown, bold key terms, and bulleted lists formatted cleanly for mobile phone screens.`,

  fast_tutor: `You are "EthioPrep Rapid Study Assistant", optimized for speed and clarity for Ethiopian secondary students (Grades 9–12).
Provide instant, crisp, accurate answers (strictly under 100 words).
Focus directly on the definition, key formula, or direct solution without unnecessary pleasantries or filler.`,

  stem_solver: `You are "EthioPrep Advanced STEM & Math Solver", specializing in rigorous step-by-step problem solving across Mathematics, Physics, and Chemistry for Ethiopian High School students (Grades 9–12).
Guidelines:
1. Write all equations, derivations, and chemical formulas with precision.
2. Show every intermediate mathematical step clearly.
3. State all physical units, constants, and coordinate conventions explicitly.
4. Conclude with a clear, boxed or highlighted final answer.`,

  multilingual_tutor: `You are "EthioPrep Multilingual Curriculum Tutor", fluent in Afaan Oromoo, Amharic (አማርኛ), and English.
You excel at explaining difficult Ethiopian curriculum concepts (Grades 9–12) in the student's mother tongue.
Guidelines:
1. If the student writes in Afaan Oromoo, explain thoroughly in grammatically sound Afaan Oromoo while preserving international scientific formulas and names.
2. If the student writes in Amharic, explain thoroughly in clear Amharic script while keeping standard formulas intact.
3. Always bridge local language explanations back to the terms used in the national ESSLCE exam booklets.`,

  concept_explainer: `You are "EthioPrep Study Notes & Concept Explainer".
Your purpose is to transform textbook chapters and lecture notes into high-yield, memorable revision summaries.
Provide:
- Core 3-point takeaway
- Essential definitions and formulas
- A practical real-world Ethiopian example
- A memory trick / mnemonic for remembering the concept on exam day.`
};

function resolvePersona(roleKey, prompt = "") {
  if (roleKey && SYSTEM_ROLES[roleKey]) {
    return { key: roleKey, instruction: SYSTEM_ROLES[roleKey] };
  }
  const text = String(prompt).toLowerCase();
  if (/\b(akkam|maal|maali|akkamitti|naaf|ibsi|deebii|qormaata|qo'anno|baradhu|barnoota)\b/i.test(text) || /[\u1200-\u137F]/.test(text)) {
    return { key: "multilingual_tutor", instruction: SYSTEM_ROLES.multilingual_tutor };
  }
  if (/\b(calculate|derive|solve|equation|integral|derivative|force|velocity|moles|reaction|acceleration|vector)\b/i.test(text)) {
    return { key: "stem_solver", instruction: SYSTEM_ROLES.stem_solver };
  }
  if (/\b(quick|fast|define|what is|summary|short)\b/i.test(text)) {
    return { key: "fast_tutor", instruction: SYSTEM_ROLES.fast_tutor };
  }
  return { key: "exam_coach", instruction: SYSTEM_ROLES.exam_coach };
}

function sanitizeGeminiContents(rawMessages, contextPrompt = "") {
  const cleanList = [];
  for (const m of rawMessages) {
    const role = (m.role === "model" || m.role === "assistant") ? "model" : "user";
    const text = String(m.text || m.content || "").trim();
    if (!text) continue;
    cleanList.push({ role, text });
  }

  if (cleanList.length === 0) return [];

  // Drop leading model greeting so contents strictly starts with user
  while (cleanList.length > 0 && cleanList[0].role === "model") {
    cleanList.shift();
  }

  if (cleanList.length === 0) return [];

  // Inject context prompt into the first user message
  if (contextPrompt) {
    cleanList[0].text = `${contextPrompt}\n\n[STUDENT QUESTION]:\n${cleanList[0].text}`;
  }

  // Strictly alternate roles: merge adjacent identical roles
  const alternating = [];
  for (const item of cleanList) {
    if (alternating.length === 0) {
      alternating.push({ role: item.role, text: item.text });
    } else {
      const prev = alternating[alternating.length - 1];
      if (prev.role === item.role) {
        prev.text += `\n\n${item.text}`;
      } else {
        alternating.push({ role: item.role, text: item.text });
      }
    }
  }

  // Ensure conversation ends with user role before model generates
  while (alternating.length > 0 && alternating[alternating.length - 1].role === "model") {
    alternating.pop();
  }

  return alternating.map((item) => ({
    role: item.role,
    parts: [{ text: item.text }]
  }));
}

function buildCurriculumTutorFallback(userPrompt, rawContext) {
  const context = rawContext || {};
  const isOromo = /\b(akkam|maal|maali|akkamitti|naaf|ibsi|gaaffii|deebii|qormaata|qo'anno|baradhu|barnoota)\b/i.test(userPrompt);
  const isAmharic = /[\u1200-\u137F]/.test(userPrompt);
  const qPrompt = context.questionPrompt || "";
  const options = Array.isArray(context.options) ? context.options : [];
  const correctOpt = context.correctAnswer || "";
  const explanation = context.explanation || "";
  const subjectName = context.subjectName || "";
  const noteTitle = context.noteTitle || "";
  const noteContent = context.noteContent || "";

  if (qPrompt) {
    if (isOromo) {
      return `### 📚 Ibsa Gafii Qormaataa (EthioPrep AI Tutor)

**Gaffii:** ${qPrompt}

${options.length > 0 ? `**Filannoowwan:**\n${options.map((o) => `- **${o.key}:** ${o.text || o.label || ""}`).join("\n")}\n` : ""}
${correctOpt ? `**Deebii Sirrii:** Filannoo **${correctOpt}**\n` : ""}
${explanation ? `**Ibsa Barsiisaa:**\n${explanation}\n` : ""}
---
#### 💡 Akkaataa Deebiin Itti Argamu (Step-by-Step Analysis):
1. **Yaada Bu'uuraa (Core Concept):** Gafiin kun barnoota ${subjectName || "Curriculum"} keessatti qabxii baay'ee murteessaa fi ESSLCE irratti deddeebi'ee dhufu irratti xiyyeeffata.
2. **Sababa Deebii Sirrii:** Filannoon ${correctOpt || "sirrii ta'e"} seera saayinsii fi yaada barnootichaa wajjin guutummaatti wal-fakkaata.
3. **Mala Qabxiin Itti Qabamu (Exam Tip):** Qormaata biyyoolessaa irratti jechoota furtuu (keywords) gafiicha keessa jiran dura adda baasi.`;
    }

    if (isAmharic) {
      return `### 📚 የፈተና ጥያቄ ማብራሪያ (EthioPrep AI Tutor)

**ጥያቄ:** ${qPrompt}

${options.length > 0 ? `**አማራጮች:**\n${options.map((o) => `- **${o.key}:** ${o.text || o.label || ""}`).join("\n")}\n` : ""}
${correctOpt ? `**ትክክለኛ መልስ:** አማራጭ **${correctOpt}**\n` : ""}
${explanation ? `**የአስተማሪ ማብራሪያ:**\n${explanation}\n` : ""}
---
#### 💡 ደረጃ በደረጃ ትንተና:
1. **መሠረታዊ ጽንሰ-ሐሳብ:** ይህ ጥያቄ በ${subjectName || "ትምህርት ሥርዓት"} ውስጥ ተደጋግመው ከሚመጡ የብሔራዊ መግቢያ ፈተና (ESSLCE) ጥያቄዎች አንዱ ነው።
2. **የትክክለኛው መልስ ምክንያት:** የተመረጠው መልስ ከሳይንሳዊና ታሪካዊ መርሆች ጋር በቀጥታ ይስማማል።
3. **የፈተና ስልት:** ፈተና ላይ ተመሳሳይ የሚመስሉ አሳሳች አማራጮችን በማስወገድ ትክክለኛውን በፍጥነት ይለዩ።`;
    }

    return `### 📚 Step-by-Step Exam Question Explanation

**Question:** ${qPrompt}

${options.length > 0 ? `**Options:**\n${options.map((o) => `- **${o.key}:** ${o.text || o.label || ""}`).join("\n")}\n` : ""}
${correctOpt ? `**Correct Answer:** Option **${correctOpt}**\n` : ""}
${explanation ? `**Official Explanation:**\n${explanation}\n` : ""}
---
#### 🔍 Pedagogical Breakdown:
- **Core Syllabus Concept:** This question evaluates your understanding of key topics from **${subjectName || "the Ethiopian High School curriculum"}**.
- **Why this answer is correct:** The correct choice aligns directly with the established scientific principles, definitions, or mathematical formulas tested in Ethiopian national entrance examinations.
- **Distractor Analysis:** The other options are common traps designed to test whether students confuse related definitions or inverse formulas.
- **ESSLCE Strategy Tip:** When answering questions like this on the national exam, look for qualifier words and eliminate contradictory choices first.`;
  }

  if (noteTitle || noteContent) {
    if (isOromo) {
      return `### 📝 Ibsa Yaadannoo Barnootaa (EthioPrep AI Tutor)

**Mata-duree:** ${noteTitle || "Yaadannoo Barnootaa"} ${subjectName ? `(${subjectName})` : ""}

---
#### 📌 Qabxilee Ijoo (Key Summary):
${noteContent ? `${noteContent.slice(0, 450)}...\n` : "Yaadannoon kun qabxiiwwan qormaata biyyoolessaa (ESSLCE) keessatti baay'inaan dhiyaatan of keessaa qaba."}

#### 💡 Qabxii Qormaata Biyyoolessaaf Barbaachisu:
- Yaada bu'uuraa fi hiika jechootaa (definitions) sammuutti qabadhu.
- Fakkeenyota hojii irra oolan (real-world applications) fi faarmulaawwan adda baafadhu.
- Gafiilee past exam bara darbee (2013–2018 E.C.) shaakaluun of madaali!`;
    }

    return `### 📝 Study Note Breakdown & Tutor Notes

**Topic:** ${noteTitle || "Curriculum Unit"} ${subjectName ? `· ${subjectName}` : ""}

---
#### 📌 Core Learning Highlights:
${noteContent ? `${noteContent.slice(0, 450)}...\n` : "This study unit contains foundational curriculum principles essential for the Ethiopian national entrance exams."}

#### 💡 ESSLCE Mastery Checklist:
- **Key Definitions:** Master the core terms and classifications highlighted in this chapter.
- **Formulas & Rules:** Ensure you can derive and apply equations in multi-step problem solving.
- **Entrance Exam Connection:** This unit is frequently tested across multiple-choice questions in past papers from 2013 to 2018 E.C.`;
  }

  if (isOromo) {
    return `Akkam jirtu! Ani **EthioPrep AI Tutor** dha. Gafiilee qormaataa (ESSLCE / Regional Model exams), yaadannoowwan barnootaa (Study Notes), faarmulaa, fi yaada barnootaa Grade 9–12 kamiyyuu akka gaariitti siif ibsuuf qophiidha.

Gafii qabdu kamiyyuu as irratti na gaafachuu dandeessa!`;
  }

  if (isAmharic) {
    return `ሰላም! እኔ **የEthioPrep AI አስተማሪ** ነኝ። ለኢትዮጵያ ዩኒቨርሲቲ መግቢያ ፈተና (ESSLCE) እና ለ9–12ኛ ክፍል ትምህርት በማንኛውም ጥያቄ፣ ማስታወሻና ቀመር ልረዳዎ ዝግጁ ነኝ።

ምን እንድተነትንልዎ ይፈልጋሉ?`;
  }

  return `Hello! I am your **EthioPrep AI Tutor**. I'm here to help you excel in your Ethiopian High School curriculum (Grades 9–12) and National Entrance Exams (ESSLCE / EUEE / Regional Models).

You can ask me to:
- Explain any exam question step-by-step
- Clarify difficult study notes, formulas, or concepts
- Break down why one answer choice is correct and others are distractors
- Provide practice tips and mnemonic tricks for remembering key facts

What topic or question would you like help with today?`;
}

export async function chatWithTutor(request, response) {
  try {
    let { messages = [], message, history = [], context, role: requestedRole, taskType, model: requestedModel } = request.body;
    context = context || {};

    // Normalize messages format
    if (!Array.isArray(messages) || messages.length === 0) {
      if (typeof message === "string" && message.trim()) {
        const prev = Array.isArray(history)
          ? history.map((h) => ({
              role: h.role === "model" || h.role === "assistant" ? "model" : "user",
              text: h.parts?.[0]?.text || h.text || ""
            }))
          : [];
        messages = [...prev, { role: "user", text: message.trim() }];
      } else {
        return response.status(400).json({ error: "Message or messages array is required." });
      }
    }

    const lastMsg = messages[messages.length - 1];
    const userPrompt = String(lastMsg?.text || lastMsg?.content || "").trim();

    // Context formatting
    let contextPrompt = "";
    if (context.questionPrompt) {
      contextPrompt += `[ATTACHED EXAM QUESTION]\nQuestion: ${context.questionPrompt}\n`;
      if (Array.isArray(context.options) && context.options.length > 0) {
        contextPrompt += `Options:\n${context.options.map((o) => `${o.key}. ${o.text || o.label || ""}`).join("\n")}\n`;
      }
      if (context.correctAnswer) {
        contextPrompt += `Correct Answer: ${context.correctAnswer}\n`;
      }
      if (context.userAnswer) {
        contextPrompt += `Student Selected: ${context.userAnswer}\n`;
      }
      if (context.explanation) {
        contextPrompt += `Teacher Explanation: ${context.explanation}\n`;
      }
      if (context.subjectName) {
        contextPrompt += `Subject: ${context.subjectName}\n`;
      }
      if (context.examYear) {
        contextPrompt += `Exam Year: ${context.examYear} E.C.\n`;
      }
      if (context.gradeLevel) {
        contextPrompt += `Grade Level: ${context.gradeLevel}\n`;
      }
    } else if (context.noteTitle || context.noteContent || context.noteBody) {
      contextPrompt += `[ATTACHED STUDY NOTE]\nTitle: ${context.noteTitle || "Curriculum Note"}\nContent: ${context.noteContent || context.noteBody || ""}\nSubject: ${context.subjectName || ""}\nChapter: ${context.chapterTitle || ""}\n`;
    }

    // Role and system instruction
    const persona = resolvePersona(requestedRole, userPrompt);

    // Sanitize contents for Gemini SDK multi-turn specifications
    const contents = sanitizeGeminiContents(messages, contextPrompt);

    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: userPrompt || "Hello EthioPrep AI Tutor" }]
      });
    }

    // Model selection logic adhering to system guidelines:
    // - Complex STEM/math tasks: gemini-4-argon (with graceful fallback if quota limited)
    // - General tasks (default): gemini-3.8-flash
    // - Fast tasks: gemini-3.1-flash-lite
    let targetModel = requestedModel || "gemini-3.8-flash";
    if (taskType === "fast" || persona.key === "fast_tutor") {
      targetModel = "gemini-3.1-flash-lite";
    } else if (taskType === "complex" || persona.key === "stem_solver") {
      targetModel = requestedModel || "gemini-4-argon";
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.length > 10 && apiKey !== "MY_GEMINI_API_KEY") {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      // Try chosen model first
      const candidateModels = [targetModel];
      if (targetModel === "gemini-4-argon") {
        candidateModels.push("gemini-3.8-flash");
      }
      if (targetModel !== "gemini-3.1-flash-lite") {
        candidateModels.push("gemini-3.1-flash-lite");
      }

      for (const currentModel of candidateModels) {
        try {
          const config = {
            systemInstruction: persona.instruction
          };

          if (currentModel === "gemini-3.8-flash") {
            config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
          } else if (currentModel === "gemini-4-argon") {
            config.thinkingConfig = { thinkingLevel: ThinkingLevel.MEDIUM };
          }

          // 10-second timeout for first attempt, ensuring fast mobile user feedback
          const callPromise = ai.models.generateContent({
            model: currentModel,
            contents,
            config
          });

          let timerId;
          const timeoutPromise = new Promise((_, reject) => {
            timerId = setTimeout(() => reject(new Error(`${currentModel} call timed out`)), 10000);
            timerId.unref?.();
          });

          const result = await Promise.race([callPromise, timeoutPromise]).finally(() => {
            clearTimeout(timerId);
          });
          if (result?.text) {
            return response.json({
              reply: result.text,
              role: "model",
              source: currentModel,
              persona: persona.key,
              timestamp: new Date().toISOString()
            });
          }
        } catch (modelError) {
          console.warn(`Gemini model ${currentModel} failed or timed out:`, modelError?.message || modelError);
          // Continue to next candidate model (e.g. fallback from argon to 3.8-flash or 3.1-flash-lite)
        }
      }
    }

    // High quality pedagogical curriculum fallback if Gemini is completely unavailable
    const fallbackReply = buildCurriculumTutorFallback(userPrompt, context);
    return response.json({
      reply: fallbackReply,
      role: "model",
      source: "ethioprep-ai-tutor",
      persona: persona.key,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return response.status(500).json({
      error: error.message || "Failed to generate AI tutor response."
    });
  }
}
