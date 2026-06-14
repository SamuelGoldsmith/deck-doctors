"use client";

import { useEffect, useState } from "react";
import {
  getApplications,
  updateApplicationStatus,
  updateApplicationNotes,
  JobApplication as Application,
  ApplicationStatus as Status,
  ApplicationPosition as Position,
} from "@/lib/utils";
import { InfoSection, Detail, Avatar, formatDate } from "@/components/ui/portal-section";

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "#1d6fa4", bg: "#dbeafe" },
  reviewing: { label: "Reviewing", color: "#92400e", bg: "#fef3c7" },
  interview: { label: "Interview", color: "#5b21b6", bg: "#ede9fe" },
  hired:     { label: "Hired",     color: "#166534", bg: "#dcfce7" },
  rejected:  { label: "Rejected",  color: "#991b1b", bg: "#fee2e2" },
};

const POSITION_LABELS: Record<Position, string> = {
  laborer:   "General Laborer",
  carpenter: "Carpenter",
  painter:   "Painter",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  "0-1":  "< 1 year",
  "1-3":  "1–3 yrs",
  "3-5":  "3–5 yrs",
  "5-10": "5–10 yrs",
  "10+":  "10+ yrs",
};

const AVAILABILITY_LABELS: Record<string, string> = {
  immediately: "Immediately",
  "1-week":    "Within 1 week",
  "2-weeks":   "2 weeks notice",
  "1-month":   "1 month",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterPosition, setFilterPosition] = useState<Position | "all">("all");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");

  // Detail drawer
  const [selected, setSelected] = useState<Application | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const data = await getApplications();
      setApplications(data);
    } catch {
      setError("Could not load applications. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: Status) {
    const prev = applications;
    setApplications((a) => a.map((x) => (x.id === id ? { ...x, status } : x)));
    if (selected?.id === id) setSelected((s) => s && { ...s, status });
    const ok = await updateApplicationStatus(id, status);
    if (!ok) setApplications(prev);
  }

  async function saveNotes(id: number) {
    setSaving(true);
    try {
      await updateApplicationNotes(id, editNotes);
      setApplications((a) => a.map((x) => (x.id === id ? { ...x, notes: editNotes } : x)));
      setSelected((s) => s && { ...s, notes: editNotes });
    } finally {
      setSaving(false);
    }
  }

  const filtered = applications.filter((a) => {
    if (filterPosition !== "all" && a.position !== filterPosition) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !a.first_name.toLowerCase().includes(q) &&
        !a.last_name.toLowerCase().includes(q) &&
        !a.email.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  // Counts for the top stat bar
  const counts = (Object.keys(STATUS_CONFIG) as Status[]).reduce(
    (acc, s) => ({ ...acc, [s]: applications.filter((a) => a.status === s).length }),
    {} as Record<Status, number>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      {/* Top bar */}
      <header
        className="px-6 py-4 flex items-center justify-between border-b"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--color-accent)" }}>
            Deck Doctors
          </p>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--color-primary)" }}>
            Applications
          </h1>
        </div>
        <button
          onClick={fetchApplications}
          className="text-xs px-3 py-1.5 rounded-md border font-medium transition-opacity hover:opacity-70"
          style={{ borderColor: "var(--color-border)", color: "var(--color-muted-foreground)" }}
        >
          ↻ Refresh
        </button>
      </header>

      {/* Stat pills */}
      <div className="px-6 py-4 flex flex-wrap gap-2">
        {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([s, cfg]) => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: filterStatus === s ? cfg.color : cfg.bg,
              color: filterStatus === s ? "#fff" : cfg.color,
              outline: filterStatus === s ? `2px solid ${cfg.color}` : "none",
            }}
          >
            <span>{cfg.label}</span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: filterStatus === s ? "rgba(255,255,255,0.25)" : cfg.color,
                color: "#fff",
              }}
            >
              {counts[s]}
            </span>
          </button>
        ))}
        <span className="ml-auto text-xs self-center" style={{ color: "var(--color-muted-foreground)" }}>
          {applications.length} total
        </span>
      </div>

      {/* Search + position filter */}
      <div className="px-6 pb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] px-3 py-2 text-sm rounded-md border"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-card)",
            color: "var(--color-foreground)",
          }}
        />
        <select
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value as Position | "all")}
          className="px-3 py-2 text-sm rounded-md border"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-card)",
            color: "var(--color-foreground)",
          }}
        >
          <option value="all">All Positions</option>
          <option value="laborer">General Laborer</option>
          <option value="carpenter">Carpenter</option>
          <option value="painter">Painter</option>
        </select>
      </div>

      {/* Main content */}
      <div className="px-6 pb-10">
        {loading ? (
          <div className="text-center py-20 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            Loading applications…
          </div>
        ) : error ? (
          <div className="text-center py-20 text-sm text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            No applications match your filters.
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((app) => (
              <ApplicationRow
                key={app.id}
                app={app}
                onSelect={() => {
                  setSelected(app);
                  setEditNotes(app.notes ?? "");
                }}
                onStatusChange={(s) => updateStatus(app.id, s)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setSelected(null)}
          />
          {/* Panel */}
          <aside
            className="w-full max-w-md overflow-y-auto shadow-2xl"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-extrabold" style={{ color: "var(--color-primary)" }}>
                    {selected.first_name} {selected.last_name}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                    Applied {formatDate(selected.submitted_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-lg leading-none"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  ✕
                </button>
              </div>

              {/* Contact */}
              <InfoSection title="Contact">
                <Detail label="Email">
                  <a href={`mailto:${selected.email}`} style={{ color: "var(--color-link)" }}>
                    {selected.email}
                  </a>
                </Detail>
                <Detail label="Phone">
                  <a href={`tel:${selected.phone}`} style={{ color: "var(--color-link)" }}>
                    {selected.phone}
                  </a>
                </Detail>
              </InfoSection>

              {/* Role */}
              <InfoSection title="Role">
                <Detail label="Position">{POSITION_LABELS[selected.position]}</Detail>
                <Detail label="Experience">{EXPERIENCE_LABELS[selected.experience] ?? selected.experience}</Detail>
                <Detail label="Available">{AVAILABILITY_LABELS[selected.availability] ?? selected.availability}</Detail>
                <Detail label="Driver's License">{selected.has_driving_license ? "Yes ✓" : "No"}</Detail>
              </InfoSection>

              {/* Message */}
              {selected.message && (
                <InfoSection title="Additional Info">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-foreground)" }}>
                    {selected.message}
                  </p>
                </InfoSection>
              )}

              {/* Status */}
              <InfoSection title="Status">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const active = selected.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: active ? cfg.color : cfg.bg,
                          color: active ? "#fff" : cfg.color,
                          outline: active ? `2px solid ${cfg.color}` : "none",
                        }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </InfoSection>

              {/* Notes */}
              <InfoSection title="Internal Notes">
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes visible only to your team…"
                  className="w-full px-3 py-2 text-sm rounded-md border resize-none"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-foreground)",
                  }}
                />
                <button
                  onClick={() => saveNotes(selected.id)}
                  disabled={saving || editNotes === (selected.notes ?? "")}
                  className="mt-2 px-4 py-1.5 rounded-md text-sm font-medium primary transition-opacity hover:opacity-80 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save Notes"}
                </button>
              </InfoSection>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function ApplicationRow({
  app,
  onSelect,
  onStatusChange,
}: {
  app: Application;
  onSelect: () => void;
  onStatusChange: (s: Status) => void;
}) {
  const cfg = STATUS_CONFIG[app.status];
  return (
    <div
      className="card flex items-center gap-4 px-4 py-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onSelect}
    >
      {/* Avatar */}
      <Avatar firstName={app.first_name} lastName={app.last_name} />

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: "var(--color-foreground)" }}>
          {app.first_name} {app.last_name}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>
          {app.email} · {POSITION_LABELS[app.position]} · {EXPERIENCE_LABELS[app.experience] ?? app.experience}
        </p>
      </div>

      {/* Date */}
      <p className="text-xs hidden sm:block shrink-0" style={{ color: "var(--color-muted-foreground)" }}>
        {formatDate(app.submitted_at)}
      </p>

      {/* Status badge + quick-change */}
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        <select
          value={app.status}
          onChange={(e) => onStatusChange(e.target.value as Status)}
          className="text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer"
          style={{ backgroundColor: cfg.bg, color: cfg.color }}
        >
          {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

