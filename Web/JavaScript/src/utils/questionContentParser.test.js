import test from "node:test";
import assert from "node:assert/strict";
import {
  formatMathText,
  parseQuestionSegments,
  parseOptionContent,
  inspectQuestionVisuals,
  splitPassageAndQuestion
} from "./questionContentParser.js";

test("formatMathText converts LaTeX fractions, roots, Greek letters, and exponents", () => {
  const input = "\\frac{x^2 + 1}{\\sqrt{2\\pi}} \\leq \\theta_{0}";
  const output = formatMathText(input);
  assert.equal(output, "(x² + 1)/(√(2π)) ≤ θ₀");
});

test("parseQuestionSegments parses flattened single-line || markdown tables and separates intro/outro text", () => {
  const prompt =
    "This item is based on the table below. Select the correct representatives for L, M, N and O, respectively:| Biome | Soil | Animals || :--- | :--- | :--- || Desert (hot) | L | M || Tropical montane forest | N | O |";
  const segments = parseQuestionSegments(prompt);
  assert.equal(segments.length, 2);
  assert.equal(segments[0].type, "text");
  assert.match(segments[0].content, /This item is based on the table below/);
  assert.equal(segments[1].type, "table");
  assert.deepEqual(segments[1].headers, ["Biome", "Soil", "Animals"]);
  assert.deepEqual(segments[1].rows, [
    ["Desert (hot)", "L", "M"],
    ["Tropical montane forest", "N", "O"]
  ]);
});

test("parseQuestionSegments parses multi-line pipe tables without outer pipes (Biology 2014 Q86/Q90)", () => {
  const prompt =
    "Consider the following table which shows a result of an experiment:\nSolutions | Changes observed on RBCs\nX | Shrink\nY | Burst\nZ | No change\nThe three different solutions were";
  const segments = parseQuestionSegments(prompt);
  const tableSeg = segments.find((s) => s.type === "table");
  assert.ok(tableSeg, "Expected a table segment");
  assert.deepEqual(tableSeg.headers, ["Solutions", "Changes observed on RBCs"]);
  assert.equal(tableSeg.rows.length, 3);
  assert.deepEqual(tableSeg.rows[0], ["X", "Shrink"]);
});

test("parseQuestionSegments parses bullet key-value pipe rows (Chemistry 2014 Q43 & SAT 2015 Q37)", () => {
  const prompt =
    "Table 1: Distribution of Enrollment by Class and Gender\n• Freshman (1st Year): Male = 1,000 | Female = 800 | Total = 1,800\n• Sophomore (2nd Year): Male = 750 | Female = 450 | Total = 1,200\nQuestion 37: What is the ratio?";
  const segments = parseQuestionSegments(prompt);
  const tableSeg = segments.find((s) => s.type === "table");
  assert.ok(tableSeg);
  assert.equal(tableSeg.title, "Table 1: Distribution of Enrollment by Class and Gender");
  assert.deepEqual(tableSeg.headers, ["Category / Group", "Male", "Female", "Total"]);
  assert.deepEqual(tableSeg.rows[0], ["Freshman (1st Year)", "1,000", "800", "1,800"]);
});

test("parseQuestionSegments parses inline colon/frequency distributions and 3x3 determinant matrices", () => {
  const freqPrompt =
    "Given frequency distribution table of scores: 31-40: 10, 41-50: 9, 51-60: 15, 61-70: 12. What is the median?";
  const freqSegs = parseQuestionSegments(freqPrompt);
  const freqTable = freqSegs.find((s) => s.type === "table");
  assert.ok(freqTable);
  assert.deepEqual(freqTable.headers, ["Score / Interval", "31-40", "41-50", "51-60", "61-70"]);
  assert.deepEqual(freqTable.rows[0], ["Frequency (f)", "10", "9", "15", "12"]);

  const detPrompt =
    "What is the determinant of the matrix: | 1/2 1 3/2 | | 2 5/2 3 | | 7/2 4 9/2 | ?";
  const detSegs = parseQuestionSegments(detPrompt);
  const detTable = detSegs.find((s) => s.type === "table");
  assert.ok(detTable);
  assert.equal(detTable.rows.length, 3);
  assert.deepEqual(detTable.rows[1], ["2", "5/2", "3"]);
});

test("parseQuestionSegments does NOT misclassify absolute value inequalities or set-builder notation as tables", () => {
  const absPrompt = "Which one of the following intervals is the solution set of |3 - (1/2)x| < 5?";
  const absSegs = parseQuestionSegments(absPrompt);
  assert.equal(absSegs.length, 1);
  assert.equal(absSegs[0].type, "text");

  const setPrompt =
    "Let A = {x | 1 ≤ x ≤ 10} and B = {x | -1 ≤ x ≤ 10} be two sets of real numbers.";
  const setSegs = parseQuestionSegments(setPrompt);
  assert.equal(setSegs.length, 1);
  assert.equal(setSegs[0].type, "text");
});

test("parseOptionContent parses compact frequency distribution options into structured tables", () => {
  const opt = "V: [12, 13, 14, 15, 16, 17] | f: [2, 1, 1, 0, 2, 1]";
  const parsed = parseOptionContent(opt);
  assert.equal(parsed.type, "table");
  assert.deepEqual(parsed.headers, ["V", "12", "13", "14", "15", "16", "17"]);
  assert.deepEqual(parsed.rows, [["f", "2", "1", "1", "0", "2", "1"]]);
});

test("inspectQuestionVisuals accurately detects diagram and table questions", () => {
  const qWithImg = {
    prompt: "Find the angle in the figure.",
    imageUrl: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=",
    options: ["30°", "60°"]
  };
  assert.deepEqual(inspectQuestionVisuals(qWithImg), {
    hasDiagram: true,
    hasTable: false,
    isVisualOrTable: true
  });

  const qWithTable = {
    prompt: "Consider the table:\n| X | Y |\n|---|---|\n| 1 | 2 |",
    options: ["A", "B"]
  };
  assert.deepEqual(inspectQuestionVisuals(qWithTable), {
    hasDiagram: false,
    hasTable: true,
    isVisualOrTable: true
  });
});

test("parseQuestionSegments parses [Table Data — ...] blocks and splitPassageAndQuestion separates reading passages", () => {
  const geoPrompt =
    "[Based on Demographic Data Table] What is the Net Migration Rate (NMR) of the region?[Table Data — Total Population = 67,400,000; Live Births = 2,300,000; Deaths below age 1 = 78,000]";
  const geoSegs = parseQuestionSegments(geoPrompt);
  const tableSeg = geoSegs.find((s) => s.type === "table");
  assert.ok(tableSeg);
  assert.deepEqual(tableSeg.headers, ["Indicator / Parameter", "Value"]);
  assert.deepEqual(tableSeg.rows[0], ["Total Population", "67,400,000"]);

  const readingPrompt =
    "[Reading Passage I — Climate Change]\n\n1. Ethiopia has been affected by climate change.\n\nQuestion 68: What is the priority?";
  const split = splitPassageAndQuestion(readingPrompt, "");
  assert.match(split.passage, /Reading Passage I/);
  assert.equal(split.prompt, "What is the priority?");
});

