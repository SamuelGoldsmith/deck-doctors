import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Session } from "next-auth";
import type { LocationStatus } from "./locationVerification";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Employee {
  eid: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  rate: number;
  description: string | null;
  username?: string | null;
}

export interface EmployeeAdminFields {
  username?: string | null;
  password?: string;
  sendOnboarding?: boolean;
}

export interface Customer {
  cid: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
}

export interface Job {
  jid: number;
  address: string;
  city: string;
  state_abr: string; // Two-letter state abbreviation (e.g. "CT")
  cid: number; // Foreign key to Customer.cid
  quote_cost: number | null;
  start_date: string | null; // ISO date string: YYYY-MM-DD
  end_date: string | null;   // ISO date string: YYYY-MM-DD
  completed: boolean;
  description: string | null;
  customer: Customer; // Embedded customer details for easier access
  latitude?: number | null;
  longitude?: number | null;
}

export interface Hour {
  hid: number;
  eid: number; // Foreign key to Employee.eid
  jid: number; // Foreign key to Job.jid
  date_worked: string; // ISO date string: YYYY-MM-DD
  clock_in_at?: string | null;  // start of the shift (ISO timestamp)
  clock_out_at?: string | null; // end of the shift (ISO timestamp)
  clock_in_latitude?: number | null;
  clock_in_longitude?: number | null;
  clock_in_accuracy_m?: number | null;  // GPS accuracy radius (m) at clock-in
  clock_out_latitude?: number | null;
  clock_out_longitude?: number | null;
  clock_out_accuracy_m?: number | null; // GPS accuracy radius (m) at clock-out
  location_verified?: boolean | null;   // legacy boolean; derived from location_status
  location_status?: LocationStatus | null;
}

/**
 * Hours worked for an entry, derived from the start (clock_in_at) and end
 * (clock_out_at) timestamps. The single source of truth for hours — the value
 * is never stored, only computed at runtime. Returns 0 for an open entry (not
 * yet clocked out) or when a timestamp is missing/invalid.
 */
export function hoursWorked(h: { clock_in_at?: string | null; clock_out_at?: string | null }): number {
  if (!h.clock_in_at || !h.clock_out_at) return 0;
  const start = new Date(h.clock_in_at).getTime();
  const end = new Date(h.clock_out_at).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
  return Math.round(((end - start) / 3_600_000) * 100) / 100;
}
export interface hoursWithEmployeeAndJob extends Hour {
  jid: number;
  address: string;
  city: string;
  state_abr: string;
  cid: number;
  quote_cost: number | null;
  start_date: string | null;
  end_date: string | null;
  completed: boolean;
  description: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  eid: number;
  rate: number;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Expense {
  exid: number;
  jid: number; // Foreign key to Job.jid
  description: string | null;
  cost: number;
}

export async function addJobs(jobs: Job[]) {
    const res = await fetch("/api/jobs/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobs),
    })
    return res.ok;
  }

  export async function deleteJob(jid: number) {
    if (
      confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      const res = await fetch("/api/jobs/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jid: jid }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete job.");
      }
    }
  }

  export async function addExpenses(expenses: Expense[]) {
    const res = await fetch("/api/expenses/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenses),
    })
    return res.ok;
  }

  export async function deleteExpense(exid: number) {
    const res = await fetch("/api/expenses/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exid }),
    });
    return res.ok;
  }

  export async function addEmployees(employees: (Employee & Partial<EmployeeAdminFields>)[]) {
    const res = await fetch("/api/employees/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employees),
    })
    return res.ok;
  }

  export async function deleteEmployee(eid: number) {
    if (
      confirm(
        "Are you sure you want to delete this employee? This action cannot be undone."
      )
    ) {
      const res = await fetch("/api/employees/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eid }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete employee.");
      }
    }
  }

  export async function addCustomers(customers: Customer[]) {
    const res = await fetch("/api/customers/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customers),
    })
    return res.ok;
  }

  export async function deleteCustomer(cid: number) {
        if (
      confirm(
        "Are you sure you want to delete this customer? Associated jobs will also be deleted."
      )
    ) { 
    const res = await fetch("/api/customers/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cid }),
    });
    return res.ok;
  }
}

export async function editEmployee(employee: Employee & Partial<EmployeeAdminFields>) {
    const res = await fetch("/api/employees/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    })
    return res.ok;
  }

export async function changePassword(newPassword: string) {
    const res = await fetch("/api/employees/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword }),
    })
    return res.ok;
  }

export async function editCustomer(customer: Customer) {
    const res = await fetch("/api/customers/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })
    return res.ok;
  }

export async function editJob(job: Job) {
    const res = await fetch("/api/jobs/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    })
    return res.ok;
  }

  export interface AddHoursInput {
    eid: number;
    jid: number;
    date_worked: string;  // YYYY-MM-DD
    clock_in_at: string;  // ISO timestamp (start)
    clock_out_at: string; // ISO timestamp (end)
  }

  export async function addHours(input: AddHoursInput) {
    const res = await fetch("/api/hours/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })
    return res.ok;
  }

  export async function clockIn(payload: { jid: number; latitude: number | null; longitude: number | null; accuracy: number | null }) {
    const res = await fetch("/api/hours/clock-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    return res.ok;
  }

  export async function clockOut(payload: { latitude: number | null; longitude: number | null; accuracy: number | null }) {
    const res = await fetch("/api/hours/clock-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    return res.ok;
  }

  export async function getEmployees(): Promise<Employee[]> {
    const res = await fetch("/api/employees/list");
    if (!res.ok) {
      throw new Error("Failed to fetch employees");
    }
    return res.json();
  }

  export async function getJobs(): Promise<Job[]> {
    const res = await fetch("/api/jobs/list");
    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return res.json();
  }

export type ApplicationStatus = "new" | "reviewing" | "interview" | "hired" | "rejected";
export type ApplicationPosition = "laborer" | "carpenter" | "painter";

export interface JobApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: ApplicationPosition;
  experience: string;
  availability: string;
  has_driving_license: boolean;
  message: string | null;
  status: ApplicationStatus;
  notes: string | null;
  submitted_at: string;
}

export interface JobApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: ApplicationPosition | "";
  experience: string;
  availability: string;
  hasDrivingLicense: string;
  message: string;
}

export async function submitApplication(application: JobApplicationInput) {
  const res = await fetch("/api/apply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  })
  return res.ok;
}

export async function getApplications(): Promise<JobApplication[]> {
  const res = await fetch("/api/applications");
  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }
  return res.json();
}

export async function updateApplicationStatus(id: number, status: ApplicationStatus) {
  const res = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
  return res.ok;
}

export async function updateApplicationNotes(id: number, notes: string) {
  const res = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  })
  return res.ok;
}

export type ServiceType = "restoration" | "new_build" | "repair" | "staining_sealing" | "inspection";
export type EstimateStatus = "new" | "reviewing" | "quoted" | "scheduled" | "won" | "lost";

export interface EstimateRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  service_type: ServiceType;
  message: string | null;
  status: EstimateStatus;
  notes: string | null;
  submitted_at: string;
}

export interface EstimateRequestInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  serviceType: ServiceType | "";
  message: string;
}

export async function submitEstimateRequest(estimate: EstimateRequestInput) {
  const res = await fetch("/api/estimate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(estimate),
  })
  return res.ok;
}

export async function getEstimateRequests(): Promise<EstimateRequest[]> {
  const res = await fetch("/api/estimates");
  if (!res.ok) {
    throw new Error("Failed to fetch estimate requests");
  }
  return res.json();
}

export async function updateEstimateStatus(id: number, status: EstimateStatus) {
  const res = await fetch(`/api/estimates/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
  return res.ok;
}

export async function updateEstimateNotes(id: number, notes: string) {
  const res = await fetch(`/api/estimates/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  })
  return res.ok;
}

/* ============================================================
 * On-site Deck Estimator
 * ========================================================== */

export type DeckEstimateStatus = "draft" | "ready" | "quoted" | "converted" | "archived";
export type DeckWorkType = "restoration" | "resurface" | "under_resurface";
export type DeckMaterial = "pressure_treated" | "trex";
export type DeckElevation = "ground" | "raised" | "second_story" | "multi_story" | "";
export type Condition = "good" | "fair" | "poor" | "replace" | "";

export const WORK_TYPE_LABELS: Record<DeckWorkType, string> = {
  restoration: "Restoration",
  resurface: "Resurface",
  under_resurface: "Under-resurface",
};
export const MATERIAL_LABELS: Record<DeckMaterial, string> = {
  pressure_treated: "Pressure-treated wood",
  trex: "Trex / composite",
};
export const ELEVATION_LABELS: Record<Exclude<DeckElevation, "">, string> = {
  ground: "Ground level",
  raised: "Raised",
  second_story: "Second story",
  multi_story: "Multi-story",
};
export const CONDITION_LABELS: Record<Exclude<Condition, "">, string> = {
  good: "Good",
  fair: "Fair",
  poor: "Poor",
  replace: "Needs replacement",
};

/* ── Sketch geometry (coordinates are in grid-cell units) ── */
export interface SketchPoint { x: number; y: number }
export interface SketchSection { id: string; label: string; points: SketchPoint[]; closed: boolean }
export interface SketchStroke { id: string; points: SketchPoint[] }
export type SketchMarkerKind = "rotten" | "bondo" | "railing" | "obstruction" | "note";
export interface SketchMarker { id: string; x: number; y: number; kind: SketchMarkerKind; note?: string }

export interface DeckSketch {
  feetPerCell: number; // real-world feet represented by one grid cell
  cols: number;        // grid width in cells
  rows: number;        // grid height in cells
  sections: SketchSection[];
  strokes: SketchStroke[];
  markers: SketchMarker[];
}

export const MARKER_CONFIG: Record<SketchMarkerKind, { label: string; color: string; symbol: string }> = {
  rotten:      { label: "Rotten board",  color: "#b91c1c", symbol: "✕" },
  bondo:       { label: "Bondo spot",    color: "#b45309", symbol: "◆" },
  railing:     { label: "Railing",       color: "#1d4ed8", symbol: "▮" },
  obstruction: { label: "Obstruction",   color: "#6d28d9", symbol: "⬡" },
  note:        { label: "Note",          color: "#0f766e", symbol: "✎" },
};

/* ── Pricing ── */
export interface QuoteRates {
  resurfaceSqFt: number;
  restorationSqFt: number;
  boardReplacement: number; // per board
  bondoSpot: number;        // per spot
  stepStringer: number;     // per step/stringer unit
  railingLinearFt: number;  // per linear ft
  laborHour: number;        // per hour
}

export const DEFAULT_QUOTE_RATES: QuoteRates = {
  resurfaceSqFt: 8.5,
  restorationSqFt: 6,
  boardReplacement: 22,
  bondoSpot: 15,
  stepStringer: 45,
  railingLinearFt: 18,
  laborHour: 65,
};

export interface QuoteLineItem {
  key: string;
  label: string;
  qty: number;
  unit: string;
  rate: number;
  total: number;
}

export interface DeckEstimateData {
  // Scope of work
  workTypes: DeckWorkType[];
  materials: DeckMaterial[];
  pressureTreatedRestore: boolean; // PT wood that is also being restored
  elevation: DeckElevation;
  tiers: number | null;            // number of levels / tiers
  // Size
  totalSqFt: number | null;
  sqFtIsOverride: boolean;         // true when the estimator overrode the sketch's auto value
  // Repairs
  boardReplacementCount: number | null;
  bondoSpotCount: number | null;
  railingLinearFt: number | null;
  railingCondition: Condition;
  fastenersPopped: number | null;
  // Stairs
  stepCount: number | null;
  stringerCount: number | null;
  stairCondition: Condition;
  riseIn: number | null;
  runIn: number | null;
  // Structural / extras / free-text
  structuralConcerns: string;
  siteAccessNotes: string;
  additionalNotes: string;
  internalNotes: string;
  // Sketch
  sketch: DeckSketch;
  // Pricing
  rates: QuoteRates;
  laborHours: number | null;
  lineItems: QuoteLineItem[];
  suggestedTotal: number;
  overrideTotal: number | null;
}

export interface DeckEstimate {
  id: number;
  created_by: string | null;
  cid: number | null;
  jid: number | null;
  customer_name: string;
  phone: string | null;
  email: string | null;
  address: string;
  city: string | null;
  state_abr: string | null;
  total_sq_ft: number | null;
  suggested_total: number | null;
  final_quote: number | null;
  status: DeckEstimateStatus;
  data: DeckEstimateData;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface DeckEstimateInput {
  id?: number;
  cid: number | null;
  jid?: number | null;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state_abr: string;
  status: DeckEstimateStatus;
  data: DeckEstimateData;
}

export function emptyDeckSketch(): DeckSketch {
  return { feetPerCell: 1, cols: 24, rows: 18, sections: [], strokes: [], markers: [] };
}

export function emptyDeckEstimateData(): DeckEstimateData {
  return {
    workTypes: [],
    materials: [],
    pressureTreatedRestore: false,
    elevation: "",
    tiers: null,
    totalSqFt: null,
    sqFtIsOverride: false,
    boardReplacementCount: null,
    bondoSpotCount: null,
    railingLinearFt: null,
    railingCondition: "",
    fastenersPopped: null,
    stepCount: null,
    stringerCount: null,
    stairCondition: "",
    riseIn: null,
    runIn: null,
    structuralConcerns: "",
    siteAccessNotes: "",
    additionalNotes: "",
    internalNotes: "",
    sketch: emptyDeckSketch(),
    rates: { ...DEFAULT_QUOTE_RATES },
    laborHours: null,
    lineItems: [],
    suggestedTotal: 0,
    overrideTotal: null,
  };
}

/** Shoelace area of a polygon, in grid-cell² units. */
export function polygonAreaCells(points: SketchPoint[]): number {
  if (points.length < 3) return 0;
  let acc = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const q = points[(i + 1) % points.length];
    acc += p.x * q.y - q.x * p.y;
  }
  return Math.abs(acc) / 2;
}

/** Total square footage of all closed sections in a sketch. */
export function sketchTotalSqFt(sketch: DeckSketch): number {
  const f = sketch.feetPerCell || 1;
  return sketch.sections
    .filter((s) => s.closed && s.points.length >= 3)
    .reduce((sum, s) => sum + polygonAreaCells(s.points) * f * f, 0);
}

/** Build the suggested quote from the captured assessment + unit rates. */
export function computeQuote(
  data: DeckEstimateData,
  rates: QuoteRates
): { lineItems: QuoteLineItem[]; suggestedTotal: number } {
  const sqFt = Number(data.totalSqFt) || 0;
  const items: QuoteLineItem[] = [];
  const push = (key: string, label: string, qty: number, unit: string, rate: number) => {
    const q = Number(qty) || 0;
    const r = Number(rate) || 0;
    if (q > 0 && r > 0) items.push({ key, label, qty: q, unit, rate: r, total: q * r });
  };

  const resurfacing = data.workTypes.includes("resurface") || data.workTypes.includes("under_resurface");
  if (resurfacing) push("resurface", "Resurface decking", sqFt, "sq ft", rates.resurfaceSqFt);
  if (data.workTypes.includes("restoration")) push("restoration", "Restoration", sqFt, "sq ft", rates.restorationSqFt);

  push("boards", "Board replacement", data.boardReplacementCount ?? 0, "boards", rates.boardReplacement);
  push("bondo", "Bondo filler", data.bondoSpotCount ?? 0, "spots", rates.bondoSpot);
  push("stairs", "Steps & stringers", (Number(data.stepCount) || 0) + (Number(data.stringerCount) || 0), "units", rates.stepStringer);
  push("railing", "Railing", data.railingLinearFt ?? 0, "lin ft", rates.railingLinearFt);
  push("labor", "Labor", data.laborHours ?? 0, "hrs", rates.laborHour);

  const suggestedTotal = items.reduce((s, i) => s + i.total, 0);
  return { lineItems: items, suggestedTotal };
}

/** The number the business should quote: an explicit override, else the computed total. */
export function finalQuoteValue(data: DeckEstimateData): number {
  return data.overrideTotal != null && !Number.isNaN(data.overrideTotal)
    ? Number(data.overrideTotal)
    : Number(data.suggestedTotal) || 0;
}

export async function addDeckEstimate(input: DeckEstimateInput): Promise<{ ok: boolean; id?: number }> {
  const res = await fetch("/api/deck-estimates/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) return { ok: false };
  const row = await res.json().catch(() => null);
  return { ok: true, id: row?.id };
}

export async function updateDeckEstimate(input: DeckEstimateInput): Promise<boolean> {
  const res = await fetch("/api/deck-estimates/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.ok;
}

export async function patchDeckEstimate(
  id: number,
  patch: { status?: DeckEstimateStatus; final_quote?: number | null; jid?: number | null }
): Promise<boolean> {
  const res = await fetch(`/api/deck-estimates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return res.ok;
}

export async function deleteDeckEstimate(id: number): Promise<boolean> {
  if (!confirm("Delete this estimate? This action cannot be undone.")) return false;
  const res = await fetch("/api/deck-estimates/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

export async function getDeckEstimates(): Promise<DeckEstimate[]> {
  const res = await fetch("/api/deck-estimates/list");
  if (!res.ok) throw new Error("Failed to fetch deck estimates");
  return res.json();
}

/** Human-readable scope summary, used to prefill a Job's description on conversion. */
export function summarizeDeckEstimate(e: DeckEstimate): string {
  const d = e.data ?? emptyDeckEstimateData();
  const lines: string[] = [];

  const head: string[] = [];
  if (d.workTypes?.length) head.push(d.workTypes.map((w) => WORK_TYPE_LABELS[w]).join(" + "));
  if (d.materials?.length) head.push(d.materials.map((m) => MATERIAL_LABELS[m]).join(" / "));
  if (head.length) lines.push(head.join(" — "));

  if (d.totalSqFt) lines.push(`~${Math.round(d.totalSqFt)} sq ft`);

  const repairs: string[] = [];
  if (d.boardReplacementCount) repairs.push(`${d.boardReplacementCount} boards`);
  if (d.bondoSpotCount) repairs.push(`${d.bondoSpotCount} Bondo spots`);
  if (d.stepCount || d.stringerCount) repairs.push(`${d.stepCount ?? 0} steps / ${d.stringerCount ?? 0} stringers`);
  if (d.railingLinearFt) repairs.push(`${d.railingLinearFt} lf railing`);
  if (repairs.length) lines.push(repairs.join(", "));

  if (d.additionalNotes) lines.push(d.additionalNotes);
  lines.push(`(From on-site estimate #${e.id})`);
  return lines.join("\n");
}

/* ============================================================
 * Public Gallery (Vercel Blob uploads)
 * Photos are grouped into "jobs"; each job carries optional tags and shows a
 * before/after comparison slider (single before + single after image) plus
 * any number of extra "other" thumbnails. See lib/tables.sql (gallery_groups,
 * gallery_images) and lib/gallery.ts (server fetch).
 * ========================================================== */

export type GalleryTag = "trex" | "new_build" | "restoration";

export const GALLERY_TAGS: GalleryTag[] = ["trex", "new_build", "restoration"];

export const GALLERY_TAG_LABELS: Record<GalleryTag, string> = {
  trex: "Trex",
  new_build: "New Build",
  restoration: "Restoration",
};

export type GalleryImageRole = "before" | "after" | "other";

/** Max photos allowed per job group (1 before + 1 after + up to 8 others). */
export const MAX_GALLERY_IMAGES = 10;

export interface GalleryImage {
  id: number;
  group_id: string;
  pathname: string; // blob pathname, e.g. gallery/<uuid>.jpg
  url: string;      // blob public URL
  role: GalleryImageRole;
  position: number; // display order within the group
}

export interface GalleryGroup {
  id: string;
  title: string | null;
  tags: GalleryTag[];
  position: number; // display order of the job on the gallery page
  created_by: string | null;
  created_at: string;
  updated_at: string;
  images: GalleryImage[];
}

/** A single image being saved (already uploaded to Blob client-side). */
export interface GalleryImageInput {
  pathname: string;
  url: string;
  role: GalleryImageRole;
  position: number;
}

/** Payload for creating or updating a job group. */
export interface GalleryGroupInput {
  id?: string; // present when editing an existing group
  title: string | null;
  tags: GalleryTag[];
  images: GalleryImageInput[];
}

export async function addGalleryGroup(
  input: GalleryGroupInput
): Promise<{ ok: boolean; id?: string }> {
  const res = await fetch("/api/gallery/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) return { ok: false };
  const row = await res.json().catch(() => null);
  return { ok: true, id: row?.id };
}

export async function updateGalleryGroup(input: GalleryGroupInput): Promise<boolean> {
  const res = await fetch("/api/gallery/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.ok;
}

export async function deleteGalleryGroup(id: string): Promise<boolean> {
  if (!confirm("Delete this gallery job and all its photos? This cannot be undone.")) {
    return false;
  }
  const res = await fetch("/api/gallery/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

/** Persist a new page order for the job groups (array of group ids, top first). */
export async function reorderGalleryGroups(order: string[]): Promise<boolean> {
  const res = await fetch("/api/gallery/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  });
  return res.ok;
}

export async function getGalleryGroupsClient(): Promise<GalleryGroup[]> {
  const res = await fetch("/api/gallery/list");
  if (!res.ok) throw new Error("Failed to fetch gallery groups");
  return res.json();
}