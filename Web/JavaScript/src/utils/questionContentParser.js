/**
 * Pure parser and formatter for EthioPrep exam questions, scientific/math notation,
 * structured tables, and diagram metadata.
 * Shared across Web Mobile Simulator, Web Question Bank, and Unit Tests.
 */

const SUPERSCRIPTS = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",
  "n": "ⁿ",
  "x": "ˣ"
};

const SUBSCRIPTS = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "+": "₊",
  "-": "₋",
  "=": "₌",
  "(": "₍",
  ")": "₎"
};

/**
 * Formats LaTeX and scientific expressions into readable Unicode math text.
 * @param {string} value
 * @returns {string}
 */
export function formatMathText(value = "") {
  if (!value) return "";
  return String(value)
    .replace(/\\sqrt\{([^{}]+)\}/g, "√($1)")
    .replace(/\^\{([^{}]+)\}/g, (_match, power) =>
      [...power].map((ch) => SUPERSCRIPTS[ch] || ch).join("")
    )
    .replace(/_\{([^{}]+)\}/g, (_match, sub) =>
      [...sub].map((ch) => SUBSCRIPTS[ch] || ch).join("")
    )
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
    .replace(/\\int_\{?([^{}]+)\}?\^\{?([^{}]+)\}?/g, "∫_$1^$2")
    .replace(
      /\\(pi|theta|alpha|beta|gamma|delta|lambda|mu|sigma|omega|times|div|cdot|leq|geq|neq|rightarrow)/g,
      (_match, symbol) =>
        ({
          pi: "π",
          theta: "θ",
          alpha: "α",
          beta: "β",
          gamma: "γ",
          delta: "δ",
          lambda: "λ",
          mu: "μ",
          sigma: "σ",
          omega: "ω",
          times: "×",
          div: "÷",
          cdot: "·",
          leq: "≤",
          geq: "≥",
          neq: "≠",
          rightarrow: "→"
        })[symbol] || symbol
    )
    .replace(/\^([0-9nx+\-()=])/g, (_match, power) => SUPERSCRIPTS[power] || power)
    .replace(/\$/g, "");
}

function isSeparatorRow(cells) {
  return (
    cells.length > 0 &&
    cells.every((c) => /^:?-{2,}:?$/.test(c.trim()))
  );
}

function splitPipeRow(line) {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

/**
 * Pre-normalizes flattened single-line markdown tables and inline tables
 * into clean multi-line markdown pipe tables before line-by-line parsing.
 * @param {string} raw
 * @returns {string}
 */
function normalizeEmbeddedTables(raw) {
  let text = String(raw || "");

  // 1. Matrix determinant pattern: | 1/2 1 3/2 | | 2 5/2 3 | | 7/2 4 9/2 |
  text = text.replace(
    /\|\s*([^\n|]+?)\s*\|\s*\|\s*([^\n|]+?)\s*\|\s*\|\s*([^\n|]+?)\s*\|/g,
    (match, r1, r2, r3) => {
      const c1 = r1.trim().split(/\s+/);
      const c2 = r2.trim().split(/\s+/);
      const c3 = r3.trim().split(/\s+/);
      if (c1.length === 3 && c2.length === 3 && c3.length === 3) {
        return `\n| Col 1 | Col 2 | Col 3 |\n| --- | --- | --- |\n| ${c1.join(" | ")} |\n| ${c2.join(" | ")} |\n| ${c3.join(" | ")} |\n`;
      }
      return match;
    }
  );

  // 2. Flattened markdown pipe tables where rows are joined by "||"
  if (text.includes("||") && (text.match(/\|/g) || []).length >= 6) {
    // Separate intro text right before the first pipe if attached (e.g. "respectively:| Biome |")
    text = text.replace(/([^\n|]):\s*\|/g, "$1:\n|");
    text = text.replace(/(\])\s*\|/g, "$1\n|");
    // Replace || with newline + |
    text = text.replace(/\|\s*\|/g, "|\n|");
    // Separate trailing question stem attached after the last pipe of a row
    // e.g. "| 7860 |Based on..." or "| 280 |Question 56:"
    text = text.replace(/\|([A-Z][a-z]+(?:\s+\d+)?:?\s+[A-Za-z])/g, "|\n$1");
  }

  // 3. Inline year/interval colon-comma tables:
  // e.g. "2019: 3500, 2020: 2750, 2021: 2850, 2022: 3500, 2023: 3650"
  text = text.replace(
    /((?:\b\d{4}\s*:\s*\d+(?:\.\d+)?(?:\s*,\s*)?){3,})/g,
    (match) => {
      const pairs = match
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((p) => p.split(":").map((x) => x.trim()));
      if (pairs.length >= 3 && pairs.every((p) => p.length === 2)) {
        const headers = ["Year", ...pairs.map((p) => p[0])];
        const values = ["Value", ...pairs.map((p) => p[1])];
        return `\n| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n| ${values.join(" | ")} |\n`;
      }
      return match;
    }
  );

  // 4. Inline class-interval frequency tables:
  // e.g. "31-40: 10, 41-50: 9, 51-60: 15, 61-70: 12, 71-80: 10, 81-90: 4, 91-100: 2."
  text = text.replace(
    /((?:\b\d+\s*[-–]\s*\d+\s*:\s*\d+(?:\s*,\s*)?){3,})\.?/g,
    (match) => {
      const clean = match.replace(/\.$/, "");
      const pairs = clean
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((p) => p.split(":").map((x) => x.trim()));
      if (pairs.length >= 3 && pairs.every((p) => p.length === 2)) {
        const headers = ["Score / Interval", ...pairs.map((p) => p[0])];
        const values = ["Frequency (f)", ...pairs.map((p) => p[1])];
        return `\n| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n| ${values.join(" | ")} |\n`;
      }
      return match;
    }
  );

  // 5. Inline age interval with (f = N):
  // e.g. "Age interval: 2-4 (f = 4), 5-7 (f = 1), 8-10 (f = 2), 11-13 (f = 3)."
  text = text.replace(
    /Age interval:\s*((?:\d+\s*[-–]\s*\d+\s*\(f\s*=\s*\d+\)(?:\s*,\s*)?){2,})\.?/i,
    (match, listPart) => {
      const items = [...listPart.matchAll(/(\d+\s*[-–]\s*\d+)\s*\(f\s*=\s*(\d+)\)/g)];
      if (items.length >= 2) {
        const headers = ["Age Interval (Years)", ...items.map((m) => m[1])];
        const freqs = ["Frequency (f)", ...items.map((m) => m[2])];
        return `\n| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n| ${freqs.join(" | ")} |\n`;
      }
      return match;
    }
  );

  // 6. [Table Data — ...] blocks (e.g. Geography climatic station tables or semicolon key=value tables)
  text = text.replace(/\[Table Data\s*[—–-]\s*([^\]]+)\]/gi, (match, inner) => {
    const cleanInner = inner.trim();
    // 6a. Multi-series climatic data separated by | (e.g. "Temp (°C): J=31, F=32... | Rainfall (mm): J=2, F=1...")
    if (cleanInner.includes("|") && cleanInner.includes(":")) {
      const seriesParts = cleanInner.split("|").map((s) => s.trim()).filter(Boolean);
      const parsedSeries = seriesParts.map((part) => {
        const colonIdx = part.indexOf(":");
        if (colonIdx === -1) return null;
        const label = part.slice(0, colonIdx).trim();
        const pairs = part
          .slice(colonIdx + 1)
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => p.split("=").map((x) => x.trim()));
        if (pairs.length < 2 || !pairs.every((p) => p.length === 2)) return null;
        return { label, keys: pairs.map((p) => p[0]), vals: pairs.map((p) => p[1]) };
      });
      if (parsedSeries.every(Boolean) && parsedSeries.length >= 1) {
        const colHeaders = ["Metric", ...parsedSeries[0].keys];
        const rows = parsedSeries.map((s) => `| ${[s.label, ...s.vals].join(" | ")} |`);
        return `\n| ${colHeaders.join(" | ")} |\n| ${colHeaders.map(() => "---").join(" | ")} |\n${rows.join("\n")}\n`;
      }
    }
    // 6b. Semicolon-separated Key = Value pairs (e.g. "Total Population = 67,400,000; Live Births = 2,300,000; ...")
    if (cleanInner.includes(";") && cleanInner.includes("=")) {
      const pairs = cleanInner
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((p) => p.split("=").map((x) => x.trim()));
      if (pairs.length >= 2 && pairs.every((p) => p.length === 2)) {
        const rows = pairs.map((p) => `| ${p[0]} | ${p[1]} |`);
        return `\n| Indicator / Parameter | Value |\n| --- | --- |\n${rows.join("\n")}\n`;
      }
    }
    return `\n${cleanInner}\n`;
  });

  return text;
}

/**
 * Removes any synthetic or embedded exam title, grade, or chapter metadata prefix
 * from a question prompt while preserving legitimate reading passages and table headers.
 * @param {string} rawText
 * @returns {string}
 */
export function stripQuestionMetadataPrefix(rawText = "") {
  let text = String(rawText || "").trim();
  text = text.replace(
    /^\[(?!(?:Reading|Table|Reference|Diagram|Passage|stimulus)\b)[^\]]*(?:Model Exam|ESSLCE|EUEE|Entrance Exam|\b201\d\s*E\.?C\.?|\bQ\d+\b|\bGrade\s*\d+|\bChapter\s*\d+|\bUnit\s*\d+)[^\]]*\]\s*[-–—:·]?\s*/i,
    ""
  );
  text = text.replace(
    /^In the context of\s+[^,(]+\((?:Unit|Chapter|Grade)[^)]+\)\s*,\s*/i,
    ""
  );
  if (text.length > 0 && /^[a-z]/.test(text)) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text.trim();
}

/**
 * Separates an embedded [Reading Passage ...] block from "Question N: ..." when both
 * are concatenated inside a single prompt string.
 * @param {string} rawPrompt
 * @param {string} existingPassage
 * @returns {{ prompt: string, passage: string }}
 */
export function splitPassageAndQuestion(rawPrompt = "", existingPassage = "") {
  const fullText = stripQuestionMetadataPrefix(rawPrompt);
  let passage = String(existingPassage || "").trim();
  let cleanPrompt = fullText;

  const splitMatch = fullText.match(/\n+(?:Question(?:\s+\d+)?\s*:\s*\n*(?:\d+\.\s*)?)/i);
  if (splitMatch && splitMatch.index !== undefined && splitMatch.index > 0) {
    const extractedPassage = fullText.slice(0, splitMatch.index).trim();
    const extractedStem = fullText.slice(splitMatch.index + splitMatch[0].length).trim();
    if (extractedStem) {
      if (!passage) {
        passage = extractedPassage;
      }
      cleanPrompt = stripQuestionMetadataPrefix(extractedStem);
    }
  }

  return {
    prompt: cleanPrompt,
    passage
  };
}

/**
 * Parses a question prompt into an ordered array of text and structured table segments.
 * Ensures mathematical absolute values (e.g. |3 - x| < 5) and set builder notation ({x | x <= 2})
 * are preserved as text and never misclassified as tables.
 *
 * @param {string} rawPrompt
 * @returns {Array<{ type: "text", content: string } | { type: "table", title?: string, headers: string[], rows: string[][] }>}
 */
export function parseQuestionSegments(rawPrompt = "") {
  if (!rawPrompt) return [];

  const normalized = normalizeEmbeddedTables(stripQuestionMetadataPrefix(rawPrompt));
  const rawLines = normalized.split(/\r?\n/);

  const segments = [];
  let textBuffer = [];

  const flushText = () => {
    if (textBuffer.length > 0) {
      const joined = textBuffer.join("\n").trim();
      if (joined) {
        segments.push({ type: "text", content: joined });
      }
      textBuffer = [];
    }
  };

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i].trim();

    // Case A: Standard Markdown pipe row starting and ending with | (with at least 2 pipes)
    if (line.startsWith("|") && line.endsWith("|") && (line.match(/\|/g) || []).length >= 3) {
      let title = undefined;
      if (
        textBuffer.length > 0 &&
        /^\[.*(?:Table|Data|Results).*\]$/i.test(textBuffer[textBuffer.length - 1].trim())
      ) {
        title = textBuffer.pop().trim().replace(/^\[|\]$/g, "");
      }
      flushText();

      const tableLines = [];
      while (
        i < rawLines.length &&
        rawLines[i].trim().startsWith("|") &&
        rawLines[i].trim().endsWith("|")
      ) {
        tableLines.push(rawLines[i].trim());
        i++;
      }

      const parsedRows = tableLines
        .map(splitPipeRow)
        .filter((cells) => !isSeparatorRow(cells));

      if (parsedRows.length >= 2) {
        segments.push({
          type: "table",
          ...(title ? { title } : {}),
          headers: parsedRows[0],
          rows: parsedRows.slice(1)
        });
      } else if (parsedRows.length === 1) {
        segments.push({
          type: "table",
          ...(title ? { title } : {}),
          headers: parsedRows[0],
          rows: []
        });
      }
      continue;
    }

    // Case B: Horizontal Key: val1 | val2 | val3 rows (e.g. Class (X): 0-9 | 10-19 \n Freq (f): 4 | 3)
    const colonPipeMatch = line.match(/^([^:|•]+):\s*([^|]+\|.+)$/);
    if (
      colonPipeMatch &&
      i + 1 < rawLines.length &&
      /^([^:|•]+):\s*([^|]+\|.+)$/.test(rawLines[i + 1].trim())
    ) {
      flushText();
      const matrixRows = [];
      while (i < rawLines.length) {
        const m = rawLines[i].trim().match(/^([^:|•]+):\s*([^|]+\|.+)$/);
        if (!m) break;
        const label = m[1].trim();
        const vals = m[2].split("|").map((v) => v.trim());
        matrixRows.push([label, ...vals]);
        i++;
      }
      if (matrixRows.length >= 2) {
        segments.push({
          type: "table",
          headers: matrixRows[0],
          rows: matrixRows.slice(1)
        });
        continue;
      }
    }

    // Case C: Bullet Key-Value Pipe rows (e.g. "• Exp 1: [NO2] = 0.01 M | [CO] = 0.01 M | Initial Rate = 0.005 M/s"
    // or "• Freshman (1st Year): Male = 1,000 | Female = 800 | Total = 1,800")
    if (/^[•*-]\s*[^:]+:\s*[^|]+=[^|]+\|/.test(line)) {
      let title = undefined;
      if (
        textBuffer.length > 0 &&
        /^Table\s*\d*\s*:/i.test(textBuffer[textBuffer.length - 1].trim())
      ) {
        title = textBuffer.pop().trim();
      }
      flushText();

      const kvRows = [];
      let inferredHeaders = null;
      while (i < rawLines.length && /^[•*-]\s*[^:]+:\s*[^|]+=[^|]+\|/.test(rawLines[i].trim())) {
        const rowLine = rawLines[i].trim().replace(/^[•*-]\s*/, "");
        const colonIdx = rowLine.indexOf(":");
        const rowLabel = rowLine.slice(0, colonIdx).trim();
        const rest = rowLine.slice(colonIdx + 1).trim();
        const pairs = rest.split("|").map((p) => p.trim());
        const keys = [];
        const vals = [];
        pairs.forEach((p) => {
          const eqIdx = p.indexOf("=");
          if (eqIdx > -1) {
            keys.push(p.slice(0, eqIdx).trim());
            vals.push(p.slice(eqIdx + 1).trim());
          } else {
            keys.push("Value");
            vals.push(p);
          }
        });
        if (!inferredHeaders) {
          inferredHeaders = ["Category / Group", ...keys];
        }
        kvRows.push([rowLabel, ...vals]);
        i++;
      }
      if (kvRows.length >= 1 && inferredHeaders) {
        segments.push({
          type: "table",
          ...(title ? { title } : {}),
          headers: inferredHeaders,
          rows: kvRows
        });
        continue;
      }
    }

    // Case D: Single-line summary percent pipe row (e.g. "• Social Science = 30% | Natural Science = 50% | Other Science = 20%")
    if (/^[•*-]\s*[^|=]+=[^|]+\|[^|=]+=/.test(line)) {
      let title = undefined;
      if (
        textBuffer.length > 0 &&
        /^Table\s*\d*\s*:/i.test(textBuffer[textBuffer.length - 1].trim())
      ) {
        title = textBuffer.pop().trim();
      }
      flushText();
      const cleanLine = line.replace(/^[•*-]\s*/, "");
      const pairs = cleanLine.split("|").map((p) => p.trim());
      const headers = [];
      const row = [];
      pairs.forEach((p) => {
        const [k, v] = p.split("=").map((s) => s.trim());
        headers.push(k || "Field");
        row.push(v || "");
      });
      segments.push({
        type: "table",
        ...(title ? { title } : {}),
        headers,
        rows: [row]
      });
      i++;
      continue;
    }

    // Case E: Unbordered multi-line pipe table (e.g. "Feature | Prokaryotes | Eukaryotes\nDNA | X | Linear")
    const isUnborderedPipeLine = (str) => {
      if (!str || !str.includes("|")) return false;
      if (/[{}]/.test(str)) return false; // exclude set builder {x | ...}
      const parts = str.split("|").map((s) => s.trim());
      if (parts.length < 2) return false;
      // Ensure it is not an absolute value inequality like |3 - x| < 5
      if (/[<>≤≥]/.test(str) && parts.length === 3) return false;
      return parts.every((p) => p.length > 0 && p.length < 60);
    };

    if (isUnborderedPipeLine(line) && i + 1 < rawLines.length && isUnborderedPipeLine(rawLines[i + 1].trim())) {
      const firstCols = line.split("|").length;
      const secondCols = rawLines[i + 1].trim().split("|").length;
      if (firstCols === secondCols) {
        flushText();
        const rows = [];
        while (i < rawLines.length && isUnborderedPipeLine(rawLines[i].trim())) {
          const cols = rawLines[i].trim().split("|").map((c) => c.trim());
          if (cols.length !== firstCols) break;
          rows.push(cols);
          i++;
        }
        if (rows.length >= 2) {
          segments.push({
            type: "table",
            headers: rows[0],
            rows: rows.slice(1)
          });
          continue;
        }
      }
    }

    // Case F: "Row 1: ... \n Row 2: ..." list tables (e.g. Biology 2015 Q45)
    if (/^Row\s+\d+\s*:/i.test(line) && i + 1 < rawLines.length && /^Row\s+\d+\s*:/i.test(rawLines[i + 1].trim())) {
      flushText();
      const rows = [];
      while (i < rawLines.length && /^Row\s+\d+\s*:/i.test(rawLines[i].trim())) {
        const m = rawLines[i].trim().match(/^(Row\s+\d+)\s*:\s*(.*)$/i);
        if (!m) break;
        rows.push([m[1], m[2]]);
        i++;
      }
      segments.push({
        type: "table",
        headers: ["Row", "Molecules / Items"],
        rows
      });
      continue;
    }

    // Case G: Bullet colon rows (e.g. "• 2 hours: 10 days \n • 4 hours: 7 days")
    if (
      /^[•*-]\s*\d+\s*hours\s*:\s*\d+\s*days/i.test(line) &&
      i + 1 < rawLines.length &&
      /^[•*-]\s*\d+\s*hours\s*:\s*\d+\s*days/i.test(rawLines[i + 1].trim())
    ) {
      flushText();
      const rows = [];
      while (
        i < rawLines.length &&
        /^[•*-]\s*\d+\s*hours\s*:\s*\d+\s*days/i.test(rawLines[i].trim())
      ) {
        const clean = rawLines[i].trim().replace(/^[•*-]\s*/, "");
        const [k, v] = clean.split(":").map((s) => s.trim());
        rows.push([k, v]);
        i++;
      }
      segments.push({
        type: "table",
        headers: ["Daily Study Time", "Number of Days"],
        rows
      });
      continue;
    }

    textBuffer.push(rawLines[i]);
    i++;
  }

  flushText();
  return segments;
}

/**
 * Parses an option text string to detect embedded frequency tables
 * (e.g. "V: [12, 13, 14, 15, 16, 17] | f: [2, 1, 1, 0, 2, 1]").
 * @param {string} optionText
 * @returns {{ type: "text", content: string } | { type: "table", headers: string[], rows: string[][], note?: string }}
 */
export function parseOptionContent(optionText = "") {
  const raw = String(optionText || "").trim();
  const freqMatch = raw.match(
    /^([A-Za-z]+)\s*:\s*\[([^\]]+)\]\s*\|\s*([A-Za-z]+)\s*:\s*\[([^\]]+)\](.*)$/
  );
  if (freqMatch) {
    const label1 = freqMatch[1].trim();
    const vals1 = freqMatch[2].split(",").map((s) => s.trim());
    const label2 = freqMatch[3].trim();
    const vals2 = freqMatch[4].split(",").map((s) => s.trim());
    const note = freqMatch[5] ? freqMatch[5].trim() : "";
    if (vals1.length === vals2.length && vals1.length >= 2) {
      return {
        type: "table",
        headers: [label1, ...vals1],
        rows: [[label2, ...vals2]],
        ...(note ? { note } : {})
      };
    }
  }
  return { type: "text", content: raw };
}

/**
 * Determines whether a question contains a visual diagram or structured table.
 * @param {object} question
 * @returns {{ hasDiagram: boolean, hasTable: boolean, isVisualOrTable: boolean }}
 */
export function inspectQuestionVisuals(question) {
  if (!question) {
    return { hasDiagram: false, hasTable: false, isVisualOrTable: false };
  }
  const hasDiagram = Boolean(
    question.imageUrl ||
      question.explanationImageUrl ||
      (question.options || []).some((o) => typeof o === "object" && o?.imageUrl)
  );
  const segments = parseQuestionSegments(question.prompt || question.stem || "");
  const hasOptionTable = (question.options || []).some((o) => {
    const txt = typeof o === "object" ? o?.text || o?.label || "" : String(o || "");
    return parseOptionContent(txt).type === "table";
  });
  const hasTable = segments.some((s) => s.type === "table") || hasOptionTable;

  return {
    hasDiagram,
    hasTable,
    isVisualOrTable: hasDiagram || hasTable
  };
}
