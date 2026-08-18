/**
 * Preflight check — run this before pushing/opening a PR.
 *
 * Catches the two failure classes that have actually broken this repo's CI:
 * 1. An npm script (test/lint/build/etc.) references a binary that isn't
 *    actually installed as a dependency — `npm install` succeeds, the script
 *    just fails at runtime. (This happened with `tsx`, `eslint`, and the
 *    `@testing-library/*` packages jest.setup.ts needed.)
 * 2. The local branch has drifted from `origin/main` — someone pushed
 *    directly to main (or another PR merged) while this branch was in
 *    progress, so a clean build here doesn't guarantee a clean merge.
 *
 * Then it runs the same lint -> typecheck -> test -> test:jest -> build
 * pipeline CI runs, in the same order, so a failure surfaces here instead of
 * in a CI log.
 *
 * Usage: npm run preflight
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");

let hardFailures = 0;
const warnings: string[] = [];

function section(title: string) {
  console.log(`\n${"=".repeat(60)}\n${title}\n${"=".repeat(60)}`);
}

function run(cmd: string, opts: { allowFailure?: boolean } = {}): { ok: boolean; output: string } {
  try {
    const output = execSync(cmd, { cwd: ROOT, encoding: "utf-8", stdio: "pipe" });
    return { ok: true, output };
  } catch (e: any) {
    if (!opts.allowFailure) {
      console.error(e.stdout || e.message);
    }
    return { ok: false, output: e.stdout || e.message || "" };
  }
}

// ---------------------------------------------------------------------------
// 1. Every npm script's binary is actually installed
// ---------------------------------------------------------------------------
section("1. Checking npm scripts reference installed binaries");

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
const scripts: Record<string, string> = pkg.scripts || {};
const missingBins = new Set<string>();

for (const [name, command] of Object.entries(scripts)) {
  const segments = command.split("&&").map((s) => s.trim());
  for (const segment of segments) {
    const bin = segment.split(/\s+/)[0];
    if (!bin || bin === "next") continue; // next's bin check below via node_modules
    const binPath = join(ROOT, "node_modules", ".bin", bin);
    const binPathWin = binPath + ".cmd";
    if (!existsSync(binPath) && !existsSync(binPathWin)) {
      missingBins.add(`"${bin}" (used by \`npm run ${name}\`)`);
    }
  }
}

// Special-case: `next` isn't invoked via a bare shell token when chained (e.g. "next dev -p 3000")
if (!existsSync(join(ROOT, "node_modules", ".bin", "next"))) {
  missingBins.add('"next" (used by dev/build/start/lint)');
}

if (missingBins.size > 0) {
  console.error("FAIL: the following commands are referenced by package.json scripts but have no installed binary:");
  for (const b of missingBins) console.error(`  - ${b}`);
  console.error("Fix: add the missing package to dependencies/devDependencies and run npm install.");
  hardFailures++;
} else {
  console.log("PASS: every npm script's binary resolves in node_modules/.bin.");
}

// ---------------------------------------------------------------------------
// 2. Lockfile in sync with package.json
// ---------------------------------------------------------------------------
section("2. Checking package-lock.json is in sync with package.json");

const lockCheck = run("npm ci --dry-run", { allowFailure: true });
if (!lockCheck.ok) {
  console.error("FAIL: `npm ci --dry-run` failed — package.json and package-lock.json are out of sync.");
  console.error(lockCheck.output);
  hardFailures++;
} else {
  console.log("PASS: lockfile matches package.json.");
}

// ---------------------------------------------------------------------------
// 3. Outdated packages / audit — informational only, never blocks
// ---------------------------------------------------------------------------
section("3. Outdated packages (informational)");
const outdated = run("npm outdated", { allowFailure: true });
console.log(outdated.output.trim() || "All dependencies are at their allowed latest version.");

section("4. Security audit (informational — see CLAUDE.md for known, intentionally-unpatched advisories)");
const audit = run("npm audit --audit-level=high", { allowFailure: true });
const auditSummaryLine = audit.output.split("\n").find((l) => /^\d+ .*vulnerabilit/.test(l.trim()));
console.log(auditSummaryLine?.trim() || "No high-severity vulnerabilities found.");
if (auditSummaryLine && !/^0 /.test(auditSummaryLine.trim())) {
  warnings.push("npm audit reports open advisories — check they're still the known/expected ones documented in CLAUDE.md, not new ones.");
}

// ---------------------------------------------------------------------------
// 5. Git: has origin/main moved since this branch's base?
// ---------------------------------------------------------------------------
section("5. Checking for drift against origin/main");

const branch = run("git rev-parse --abbrev-ref HEAD", { allowFailure: true }).output.trim();
run("git fetch origin main", { allowFailure: true });
const behind = run(`git rev-list --count HEAD..origin/main`, { allowFailure: true });
const behindCount = parseInt(behind.output.trim() || "0", 10);

if (branch === "main") {
  console.log("On main — skipping drift check.");
} else if (!behind.ok || Number.isNaN(behindCount)) {
  warnings.push("Could not compare against origin/main (offline, or main not fetchable).");
} else if (behindCount > 0) {
  console.warn(`WARNING: this branch is ${behindCount} commit(s) behind origin/main.`);
  console.warn("Someone else has pushed to main since this branch started. Merge origin/main");
  console.warn("in and re-run preflight before opening/updating a PR — a clean local build");
  console.warn("does not guarantee a clean merge (this is exactly what broke CI last time).");
  warnings.push(`Branch is ${behindCount} commit(s) behind origin/main — merge before pushing.`);
} else {
  console.log("PASS: branch is up to date with origin/main.");
}

// ---------------------------------------------------------------------------
// 6. The same pipeline CI runs, in the same order
// ---------------------------------------------------------------------------
const pipeline: Array<[string, string]> = [
  ["Typecheck", "npx tsc --noEmit"],
  ["Lint", "npm run lint"],
  ["Unit tests", "npm run test"],
  ["Jest suite", "npm run test:jest"],
  ["Build", "npm run build"],
];

for (const [label, cmd] of pipeline) {
  section(`6. ${label} (\`${cmd}\`)`);
  const result = run(cmd, { allowFailure: true });
  if (result.ok) {
    console.log(`PASS: ${label}`);
  } else {
    console.error(`FAIL: ${label}`);
    hardFailures++;
  }
}

// ---------------------------------------------------------------------------
section("SUMMARY");
if (warnings.length > 0) {
  console.log("Warnings:");
  for (const w of warnings) console.log(`  - ${w}`);
}
if (hardFailures > 0) {
  console.error(`\n${hardFailures} check(s) failed. Fix these before pushing.`);
  process.exit(1);
} else {
  console.log("\nAll required checks passed.");
  process.exit(0);
}
