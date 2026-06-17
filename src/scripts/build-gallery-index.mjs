#!/usr/bin/env node
// Build public/gallery/index.json from each public/gallery/<slug>/ folder
// (board.osdpi + meta.json). Runs via npm `prebuild` and `npm run gallery:index`.
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/gallery");

async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function build() {
  const examples = [];
  for (const slug of (await readdir(dir)).sort()) {
    const folder = path.join(dir, slug);
    if (!(await isDir(folder))) continue;
    if (!existsSync(path.join(folder, "meta.json"))) continue;
    if (!existsSync(path.join(folder, "board.osdpi"))) continue;
    const m = JSON.parse(await readFile(path.join(folder, "meta.json"), "utf8"));
    examples.push({
      slug,
      title: m.title || slug,
      description: m.description || "",
      tags: Array.isArray(m.tags) ? m.tags : [],
      author: m.author || "",
      official: m.official === true,
    });
  }
  await writeFile(path.join(dir, "index.json"), JSON.stringify(examples, null, 2) + "\n");
  console.log(`[gallery:index] wrote ${examples.length} example(s)`);
}

build().catch((e) => {
  console.error("[gallery:index] failed:", e);
  process.exit(1);
});
