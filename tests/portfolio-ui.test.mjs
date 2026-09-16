import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appPath = new URL("../src/App.jsx", import.meta.url);
const stylesPath = new URL("../src/styles.css", import.meta.url);

test("the hero is led by real portfolio work", async () => {
  const source = await readFile(appPath, "utf8");
  assert.match(source, /className="hero-showcase"/);
  assert.match(source, /\/works\/detail-01\.webp/);
  assert.match(source, /\/works\/daily-01\.webp/);
  assert.doesNotMatch(source, /className="scroll-hint"/);
});

test("selected work appears before the personal profile", async () => {
  const source = await readFile(appPath, "utf8");
  const appReturn = source.slice(source.indexOf("export function App"));
  assert.ok(appReturn.indexOf("<Works") < appReturn.indexOf("<About"));
});

test("the visual system uses the approved cold blue palette", async () => {
  const source = await readFile(stylesPath, "utf8");
  assert.match(source, /--accent:#0a6dd9/);
  assert.match(source, /\.hero-showcase/);
  assert.match(source, /\.works\{[^}]*background:#f6f9fc/);
});

test("each hero headline phrase stays on one line", async () => {
  const source = await readFile(stylesPath, "utf8");
  assert.match(source, /\.hero-work-led \.blur-text\{[^}]*white-space:nowrap/);
  assert.match(source, /\.hero-work-led \.blur-text\{[^}]*flex-wrap:nowrap/);
});
