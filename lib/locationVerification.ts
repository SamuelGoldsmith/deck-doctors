import { haversineMeters } from "./geo";
import type { GeocodePrecision } from "./geocode";

/**
 * Outcome of checking an hours entry's clock-in/out GPS against the job site.
 * Replaces the old boolean (true/false/null), which collapsed several very
 * different situations — "confidently off-site", "GPS too coarse to tell", and
 * "we never had a reference point" — into a single ambiguous `false`/`null`.
 */
export type LocationStatus =
  | "verified"         // both readings land confidently inside the geofence
  | "failed"           // a reading is confidently outside the geofence
  | "low_accuracy"     // reading(s) too imprecise (or straddling the edge) to decide
  | "no_reading"       // GPS was unavailable at clock-in or clock-out
  | "no_job_location"; // job isn't geocoded, or only to an area-level centroid

export interface GpsReading {
  latitude: number | null;
  longitude: number | null;
  accuracyM: number | null; // device-reported accuracy radius, in meters
}

export interface JobLocation {
  latitude: number | null;
  longitude: number | null;
  precision: GeocodePrecision | null;
}

// On-site geofence radius. 1 mile preserves the prior business behavior; it is
// a named knob so it can be tightened once coordinate quality is trusted.
export const GEOFENCE_RADIUS_METERS = 1609.34;

// A fix whose accuracy radius exceeds this is too coarse to place someone
// inside the fence — recorded as `low_accuracy` rather than silently passing.
// Phone GPS outdoors is typically 5–65 m; cell/Wi-Fi-only fixes are often
// hundreds to thousands of meters and get rejected here.
export const MAX_ACCURACY_METERS = 250;

type ReadingVerdict = "inside" | "outside" | "inconclusive" | "missing";

/**
 * Judge a single GPS reading against the job site, accounting for the reading's
 * own uncertainty: it only counts as inside/outside when the whole accuracy
 * circle is on one side of the fence, otherwise the result is inconclusive.
 */
function evaluateReading(job: JobLocation, reading: GpsReading): ReadingVerdict {
  if (reading.latitude == null || reading.longitude == null) return "missing";
  if (reading.accuracyM != null && reading.accuracyM > MAX_ACCURACY_METERS) return "inconclusive";

  const distance = haversineMeters(
    Number(job.latitude),
    Number(job.longitude),
    Number(reading.latitude),
    Number(reading.longitude)
  );
  const acc = reading.accuracyM != null && reading.accuracyM > 0 ? reading.accuracyM : 0;

  if (distance + acc <= GEOFENCE_RADIUS_METERS) return "inside";
  if (distance - acc > GEOFENCE_RADIUS_METERS) return "outside";
  return "inconclusive"; // the uncertainty band straddles the fence boundary
}

/** Combine the job reference point and both readings into a single status. */
export function evaluateLocation(
  job: JobLocation,
  clockIn: GpsReading,
  clockOut: GpsReading
): LocationStatus {
  // The reference point must be trustworthy, or the geofence is meaningless.
  if (job.latitude == null || job.longitude == null) return "no_job_location";
  if (job.precision === "area") return "no_job_location";

  const a = evaluateReading(job, clockIn);
  const b = evaluateReading(job, clockOut);

  if (a === "missing" || b === "missing") return "no_reading";
  if (a === "outside" || b === "outside") return "failed";
  if (a === "inconclusive" || b === "inconclusive") return "low_accuracy";
  return "verified";
}

export function isLocationVerified(status: LocationStatus): boolean {
  return status === "verified";
}

/**
 * Resolve the status to display for an entry. New entries carry an explicit
 * `location_status`; legacy rows only have the old boolean, so fall back to it.
 */
export function resolveLocationStatus(h: {
  location_status?: LocationStatus | null;
  location_verified?: boolean | null;
}): LocationStatus | null {
  if (h.location_status) return h.location_status;
  if (h.location_verified === true) return "verified";
  if (h.location_verified === false) return "failed";
  return null;
}

type Tone = "ok" | "warn" | "bad" | "muted";

const STATUS_PRESENTATION: Record<LocationStatus, { icon: string; label: string; tone: Tone }> = {
  verified:        { icon: "✓", label: "Location verified within the job-site geofence", tone: "ok" },
  failed:          { icon: "✕", label: "Recorded outside the job-site geofence",          tone: "bad" },
  low_accuracy:    { icon: "⚠", label: "GPS was too imprecise to verify location",        tone: "warn" },
  no_reading:      { icon: "⚠", label: "No GPS reading was captured",                      tone: "warn" },
  no_job_location: { icon: "—", label: "Job has no precise geocoded location to check",    tone: "muted" },
};

export function locationStatusPresentation(status: LocationStatus) {
  return STATUS_PRESENTATION[status];
}
