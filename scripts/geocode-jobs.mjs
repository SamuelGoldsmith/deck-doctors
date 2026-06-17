// One-time backfill: geocode existing jobs that have no latitude/longitude.
// New jobs are geocoded automatically by app/api/jobs/add and jobs/edit,
// but jobs created before that feature existed are still missing coordinates,
// which means location_verified can never be computed for their hours entries.
//
// Usage:
//   node --env-file=.env.local scripts/geocode-jobs.mjs

import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/geocode-jobs.mjs");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const EARTH_RADIUS_METERS = 6_371_000;
function haversineMeters(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Mirror of classifyPrecision in lib/geocode.ts (kept in sync by hand — this
// script is standalone and can't import the TS module).
function classifyPrecision(boundingbox) {
  if (!Array.isArray(boundingbox) || boundingbox.length !== 4) return "approximate";
  const [south, north, west, east] = boundingbox.map(Number);
  if ([south, north, west, east].some((n) => Number.isNaN(n))) return "approximate";
  const diagonalM = haversineMeters(south, west, north, east);
  if (diagonalM <= 2000) return "precise";
  if (diagonalM <= 8000) return "approximate";
  return "area";
}

async function geocodeAddress(address, city, stateAbr) {
  try {
    const query = `${address}, ${city}, ${stateAbr}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      headers: {
        "User-Agent": "DeckDoctorsApp/1.0 (employee-portal job geocoding)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const { lat, lon, boundingbox } = results[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

    return { lat: latitude, lng: longitude, precision: classifyPrecision(boundingbox) };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}

const jobs = await sql`SELECT jid, address, city, state_abr FROM jobs WHERE latitude IS NULL OR longitude IS NULL;`;

console.log(`${jobs.length} job(s) missing coordinates.`);

let updated = 0;
let skipped = 0;

for (const job of jobs) {
  const coords = await geocodeAddress(job.address, job.city, job.state_abr);

  if (!coords) {
    console.log(`- jid ${job.jid}: no match for "${job.address}, ${job.city}, ${job.state_abr}", skipped`);
    skipped++;
  } else {
    await sql`UPDATE jobs SET latitude = ${coords.lat}, longitude = ${coords.lng}, geocode_precision = ${coords.precision} WHERE jid = ${job.jid};`;
    console.log(`✓ jid ${job.jid}: ${job.address}, ${job.city}, ${job.state_abr} -> ${coords.lat}, ${coords.lng} (${coords.precision})`);
    updated++;
  }

  // Nominatim usage policy: max 1 request per second.
  await new Promise((r) => setTimeout(r, 1100));
}

console.log(`\nDone. ${updated} updated, ${skipped} skipped (no geocode match), ${jobs.length - updated - skipped} remaining.`);
