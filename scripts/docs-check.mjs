#!/usr/bin/env node
// docs:check — documentation gate. Two checks:
//   1. TSDoc syntax (eslint-plugin-tsdoc) on every .ts/.tsx file under src/
//   2. TSDoc presence on every exported symbol under src/
// Ported from cwan-lawn-games minus the Drizzle schema-comment check.

import { ESLint } from "eslint";
import nextTs from "eslint-config-next/typescript";
import nextVitals from "eslint-config-next/core-web-vitals";
import tsdoc from "eslint-plugin-tsdoc";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { globSync } from "tinyglobby";

const results = [];
let overallOk = true;

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  if (!ok) overallOk = false;
}

async function checkTsdocSyntax() {
  // Pull only the parser/`languageOptions` block out of `eslint-config-next`
  // (the same config `npm run lint` uses). Without a TS parser the default
  // espree parser fails on every TS-only token before the tsdoc rule ever
  // runs. We skip the rest of nextTs to avoid noisy non-tsdoc rule output.
  const tsBase = nextTs.find((c) => c.languageOptions?.parser);
  if (!tsBase) {
    throw new Error(
      "docs:check could not locate a TS parser in eslint-config-next/typescript",
    );
  }
  // Register the plugins `npm run lint` knows about — without turning their
  // rules on — so inline `eslint-disable-next-line` directives that
  // reference real-but-not-enabled rules don't get reported as
  // "Definition for rule X was not found." The tsdoc check stays the only
  // active rule.
  const knownPlugins = {};
  for (const c of nextVitals) {
    if (c.plugins) Object.assign(knownPlugins, c.plugins);
  }
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      tsBase,
      {
        files: ["src/**/*.ts", "src/**/*.tsx"],
        plugins: { ...knownPlugins, tsdoc },
        rules: { "tsdoc/syntax": "error" },
        linterOptions: { reportUnusedDisableDirectives: "off" },
      },
    ],
  });
  const runs = await eslint.lintFiles(["src/**/*.ts", "src/**/*.tsx"]);
  const violations = runs.flatMap((r) =>
    r.messages.map(
      (m) => `${r.filePath}:${m.line} ${m.ruleId ?? ""} ${m.message}`,
    ),
  );
  if (violations.length === 0) {
    record("TSDoc syntax", true);
  } else {
    record("TSDoc syntax", false, violations.join("\n    "));
  }
}

function checkTsdocPresence() {
  const files = globSync(["src/**/*.ts", "src/**/*.tsx"], {
    ignore: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "src/**/*.d.ts",
    ],
  });

  const missing = [];
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const sf = ts.createSourceFile(
      file,
      src,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    ts.forEachChild(sf, (node) => visit(node, sf, file, missing));
  }

  if (missing.length === 0) {
    record("TSDoc presence on exports", true);
  } else {
    record("TSDoc presence on exports", false, missing.join("\n    "));
  }
}

function visit(node, sf, file, missing) {
  if (!isExportedDeclaration(node)) return;
  const name = getDeclarationName(node) ?? "(anonymous)";
  if (!hasTsdocBlock(node, sf)) {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    missing.push(`${file}:${line + 1} exported \`${name}\` has no TSDoc block`);
  }
}

function isExportedDeclaration(node) {
  const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  const hasExportModifier = mods?.some(
    (m) => m.kind === ts.SyntaxKind.ExportKeyword,
  );
  if (!hasExportModifier) return false;
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node) ||
    ts.isVariableStatement(node)
  );
}

function getDeclarationName(node) {
  if (ts.isVariableStatement(node)) {
    return node.declarationList.declarations
      .map((d) => (ts.isIdentifier(d.name) ? d.name.text : ""))
      .filter(Boolean)
      .join(",");
  }
  if (
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node)
  ) {
    return node.name?.text;
  }
  return undefined;
}

function hasTsdocBlock(node, sf) {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.getFullStart()) ?? [];
  return ranges.some((r) => {
    if (r.kind !== ts.SyntaxKind.MultiLineCommentTrivia) return false;
    return sf.text.slice(r.pos, r.pos + 3) === "/**";
  });
}

function printSummary() {
  console.log("\n=== docs:check ===");
  for (const r of results) {
    const tag = r.ok ? "PASS" : "FAIL";
    console.log(`${tag}  ${r.name}`);
    if (!r.ok && r.detail) console.log(`    ${r.detail}`);
  }
  console.log("");
}

await checkTsdocSyntax();
checkTsdocPresence();
printSummary();
process.exit(overallOk ? 0 : 1);
