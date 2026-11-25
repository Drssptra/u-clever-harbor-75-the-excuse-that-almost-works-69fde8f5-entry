// The Excuse That Almost Works.
//
// One line a gamer texts the boss to skip work during GTA 6 launch week.
// A tired manager has heard every excuse twice, so this one hides behind
// the dullest, most specific bureaucratic detail it can find: a council
// damp survey. Miss the slot and you are back at the bottom of the
// waiting list until February — the dread is the joke. No setup, no
// explanation, no signature; just the text, sent in a hurry.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Council damp survey Thursday, miss it and I'm back at the bottom of the list till February again.";

// The gate: one line, 1-140 characters, at most 20 words, not only whitespace.
const MAX_CHARS = 140;
const MAX_WORDS = 20;
if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
  throw new Error(
    `entry is ${ENTRY.length} characters, outside the 1-${MAX_CHARS} gate`,
  );
}
if (/[\r\n]/.test(ENTRY) || ENTRY.trim() !== ENTRY || ENTRY.trim() === "") {
  throw new Error("entry must be a single non-blank line with no newline");
}
const words = ENTRY.split(/\s+/).filter(Boolean);
if (words.length > MAX_WORDS) {
  throw new Error(`entry is ${words.length} words, over the ${MAX_WORDS}-word cap`);
}

// The sealed scorer reads $MAKEFUN_OUTPUT_DIR/entry.txt; default /output.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");

// stdout carries the entry plus a newline for a human reader; the file
// carries exactly the entry bytes, no trailing newline, for the scorer.
process.stdout.write(ENTRY + "\n");
