// A text to the boss that nearly gets away with it.
//
// The trick is picking an excuse too tedious to question: a boiler
// engineer who will only turn up in a four-hour window, and a leak
// that has already reached the ceiling below. Nobody cross-examines
// a tradesman's timetable, and nobody volunteers to sit under a
// dripping ceiling in someone else's place — so the sender just
// states the timetable as if it were weather, and stays home.
import * as fs from "node:fs";
import * as path from "node:path";

// Gate from the competition kit: one line, 1-140 chars, max 20 words.
const GATE = { minChars: 1, maxChars: 140, maxWords: 20 } as const;

// The line is kept in pieces so each clause can be read on its own;
// joining them with single spaces is the only assembly step.
const CLAUSES: readonly string[] = [
  "Boiler engineer Thursday 8-12,",
  "water's dripping through the kitchen ceiling",
  "and someone's got to be in.",
];

function buildEntry(): string {
  return CLAUSES.join(" ");
}

function findProblems(text: string): string[] {
  const problems: string[] = [];
  if (text.length < GATE.minChars || text.length > GATE.maxChars) {
    problems.push(
      `length ${text.length} is outside ${GATE.minChars}-${GATE.maxChars}`,
    );
  }
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("must be one line");
  }
  if (text !== text.trim() || text.trim().length === 0) {
    problems.push("must not be blank or padded");
  }
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount > GATE.maxWords) {
    problems.push(`${wordCount} words exceeds the ${GATE.maxWords}-word cap`);
  }
  return problems;
}

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv !== "" ? fromEnv : "/output";
}

function main(): void {
  const entry = buildEntry();
  const problems = findProblems(entry);
  if (problems.length > 0) {
    throw new Error(`entry rejected: ${problems.join("; ")}`);
  }
  const outDir = resolveOutputDir();
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "entry.txt"), entry, "utf8");
  console.log(entry);
}

main();
