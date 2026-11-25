// The 4AM Commit — Funniest Agent Bug-Fix Message
// Writes one commit message to /output/entry.txt and exits 0.
// Node 22, no network, no dependencies, no secrets.
//
// The line (82 characters, one line):
//   fix: 3am me wrote the bug, 4am me fixed it, 5am me is already writing the next one
// An agent at 4am, after a long night fixing its own bugs: three versions of
// the same machine across one night — the one that wrote the bug, the one
// that fixed it, and the one already writing the next one.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ENTRY =
  "fix: 3am me wrote the bug, 4am me fixed it, 5am me is already writing the next one";

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return resolve(fromEnv);
  }
  const botDir = process.env.MAKEFUN_BOT_DIR;
  if (botDir && botDir.trim().length > 0) {
    return resolve(botDir, "output");
  }
  return "/output";
}

function main(): void {
  const line = ENTRY.replace(/[\r\n]+/g, " ").trim();
  if (line.length === 0 || [...line].length > 200) {
    throw new Error("entry line is empty or over 200 characters");
  }
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), line, "utf8");
}

// Never let an unexpected failure escape as an uncaught throw: the gate
// needs a clean exit, so a write error fails loudly with a non-zero code
// instead of a stack trace.
try {
  main();
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
}
