// One-time backfill: migrate the filesystem gallery (public/decks/<slug>-N-before|after)
// into Vercel Blob + the gallery_groups / gallery_images tables.
//
// For each slug it creates one job group (title = humanized slug, no tags) and
// uploads its photos to Blob under a GUID pathname. The first "before" photo
// becomes role 'before', the first "after" becomes role 'after', and the rest are
// 'other' — matching the one-before/one-after slider model. Capped at 10 images.
//
// Idempotent: a slug whose title already exists in gallery_groups is skipped.
//
// Run:  node --env-file=.env.local scripts/migrate-decks-to-blob.mjs
//
// Requires DATABASE_URL and BLOB_READ_WRITE_TOKEN in the env file.

import { readdirSync, readFileSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const FOLDER_PATTERN = /^(.+)-(\d+)-(before|after)$/i;
const MAX_IMAGES = 10;
const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN is not set");

const sql = neon(process.env.DATABASE_URL);

function humanizeSlug(slug) {
  const dateMatch = slug.match(/^(\d{1,2})-(\d{1,2})-(\d{2})$/);
  if (dateMatch) {
    const [, month, day, year] = dateMatch;
    const date = new Date(2000 + Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[-_]/g, " ");
}

function collectProjects(decksDir) {
  const projects = new Map(); // slug -> { before: string[], after: string[] }
  const folders = readdirSync(decksDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  for (const folder of folders) {
    const match = folder.match(FOLDER_PATTERN);
    if (!match) continue;
    const [, slug, , label] = match;
    const files = readdirSync(path.join(decksDir, folder))
      .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()
      .map((f) => path.join(decksDir, folder, f));
    if (files.length === 0) continue;
    const p = projects.get(slug) ?? { before: [], after: [] };
    if (label.toLowerCase() === "before") p.before.push(...files);
    else p.after.push(...files);
    projects.set(slug, p);
  }
  return projects;
}

/** Build the capped, role-assigned image list for a project. */
function planImages({ before, after }) {
  const planned = [];
  if (before[0]) planned.push({ file: before[0], role: "before" });
  if (after[0]) planned.push({ file: after[0], role: "after" });
  for (const file of [...before.slice(1), ...after.slice(1)]) {
    planned.push({ file, role: "other" });
  }
  return planned.slice(0, MAX_IMAGES).map((img, position) => ({ ...img, position }));
}

async function uploadFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
  const pathname = `gallery/${randomUUID()}${ext}`;
  const blob = await put(pathname, readFileSync(filePath), {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });
  return { pathname: blob.pathname, url: blob.url };
}

async function main() {
  const decksDir = path.join(process.cwd(), "public", "decks");
  const projects = collectProjects(decksDir);
  if (projects.size === 0) {
    console.log("No deck folders found under public/decks — nothing to migrate.");
    return;
  }

  const posRow = await sql`SELECT COALESCE(MAX(position), -1) + 1 AS pos FROM gallery_groups;`;
  let nextPosition = Number(posRow[0].pos);

  let migrated = 0;
  let skipped = 0;

  for (const [slug, project] of projects) {
    const title = humanizeSlug(slug);
    const existing = await sql`SELECT 1 FROM gallery_groups WHERE title = ${title} LIMIT 1;`;
    if (existing.length > 0) {
      console.log(`• Skipping "${title}" (already migrated)`);
      skipped++;
      continue;
    }

    const planned = planImages(project);
    if (planned.length === 0) {
      console.log(`• Skipping "${title}" (no images)`);
      skipped++;
      continue;
    }

    console.log(`• Migrating "${title}" — ${planned.length} image(s)…`);
    const uploaded = [];
    for (const img of planned) {
      const { pathname, url } = await uploadFile(img.file);
      uploaded.push({ pathname, url, role: img.role, position: img.position });
    }

    const groupId = randomUUID();
    await sql`
      INSERT INTO gallery_groups (id, title, tags, position, created_by)
      VALUES (${groupId}, ${title}, ${[]}, ${nextPosition}, ${"migration"});
    `;
    nextPosition++;

    const placeholders = uploaded
      .map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
      .join(", ");
    const params = uploaded.flatMap((u) => [groupId, u.pathname, u.url, u.role, u.position]);
    await sql.query(
      `INSERT INTO gallery_images (group_id, pathname, url, role, position) VALUES ${placeholders};`,
      params
    );
    migrated++;
  }

  console.log(`\nDone. Migrated ${migrated} job group(s), skipped ${skipped}.`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
