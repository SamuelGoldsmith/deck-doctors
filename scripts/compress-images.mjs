import sharp from "sharp";
import { readdir, stat, rename, writeFile } from "fs/promises";
import { join, extname, basename } from "path";
import { tmpdir } from "os";

const PUBLIC_DIR = "./public";
const QUALITY = 75;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let saved = 0;
let count = 0;

for await (const file of walk(PUBLIC_DIR)) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg"].includes(ext)) continue;

  const before = (await stat(file)).size;
  const compressed = await sharp(file).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();

  if (compressed.length < before) {
    const tmp = join(tmpdir(), basename(file));
    await writeFile(tmp, compressed);
    await rename(tmp, file);
    const after = compressed.length;
    saved += before - after;
    console.log(`✓ ${file}  ${kb(before)} → ${kb(after)} KB`);
  } else {
    console.log(`– ${file}  already optimal, skipped`);
  }
  count++;
}

console.log(`\nDone. ${count} files checked, ${kb(saved)} KB saved total.`);
function kb(b) { return (b / 1024).toFixed(1); }