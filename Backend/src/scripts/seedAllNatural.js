import { execSync } from "child_process";

const scripts = [
  "src/scripts/seedMathNotes9_10.js",
  "src/scripts/seedMath11Notes.js",
  "src/scripts/seedMathematicsNotes.js",
  "src/scripts/seedPhysicsNotes.js",
  "src/scripts/seedChemistryNotes.js",
  "src/scripts/seedBiologyNotes9_11.js",
  "src/scripts/seedBiologyNotes.js"
];

console.log("=================================================================");
console.log("ETHIOPREP: SEEDING ALL NATURAL SCIENCE SUBJECTS (GRADES 9-12)...");
console.log("=================================================================\n");

for (const s of scripts) {
  console.log(`>>> RUNNING: node ${s}...`);
  try {
    execSync(`node ${s}`, { stdio: "inherit" });
    console.log(`>>> FINISHED: ${s}\n`);
  } catch (err) {
    console.error(`FAILED running ${s}:`, err.message);
  }
}

console.log("=================================================================");
console.log("ALL NATURAL SCIENCE SUBJECTS (GRADES 9-12) FULLY SEEDED!");
console.log("=================================================================");
