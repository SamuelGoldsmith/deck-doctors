"use client";

import { useEffect, useState } from "react";
import {
  getEstimateRequests,
  updateEstimateStatus,
  updateEstimateNotes,
  EstimateRequest as Estimate,
  EstimateStatus as Status,
  ServiceType,
} from "@/lib/utils";
import { InfoSection, Detail, Avatar, formatDate } from "@/components/ui/portal-section";

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "#1d6fa4", bg: "#dbeafe" },
  reviewing: { label: "Reviewing", color: "#92400e", bg: "#fef3c7" },
  quoted:    { label: "Quoted",    color: "#5b21b6", bg: "#ede9fe" },
  scheduled: { label: "Scheduled", color: "#0e7490", bg: "#cffafe" },
  won:       { label: "Won",       color: "#166534", bg: "#dcfce7" },
  lost:      { label: "Lost",      color: "#991b1b", bg: "#fee2e2" },
};

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  restoration: "Restoration",
  new_build: "New Build",
  repair: "Repair",
  staining_sealing: "Staining & Sealing",
  inspection: "Inspection",
};

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterServiceType, setFilterServiceType] = useState<ServiceType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");

  // Detail drawer
  const [selected, setSelected] = useState<Estimate | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEstimates();
  }, []);

  async function fetchEstimates() {
    setLoading(true);
    try {
      const data = await getEstimateRequests();
      setEstimates(data);
    } catch {
      setError("Could not load estimate requests. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: Status) {
    const prev = estimates;
    setEstimates((a) => a.map((x) => (x.id === id ? { ...x, status } : x)));
    if (selected?.id === id) setSelected((s) => s && { ...s, status });
    const ok = await updateEstimateStatus(id, status);
    if (!ok) setEstimates(prev);
  }

  async function saveNotes(id: number) {
    setSaving(true);
    try {
      await updateEstimateNotes(id, editNotes);
      setEstimates((a) => a.map((x) => (x.id === id ? { ...x, notes: editNotes } : x)));
      setSelected((s) => s && { ...s, notes: editNotes });
    } finally {
      setSaving(false);
    }
  }

  const filtered = estimates.filter((e) => {
    if (filterServiceType !== "all" && e.service_type !== filterServiceType) return false;
    if (filterStatus !== "all" && e.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !e.first_name.toLowerCase().includes(q) &&
        !e.last_name.toLowerCase().includes(q) &&
        !e.email.toLowerCase().includes(q) &&
        !e.address.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  // Counts for the top stat bar
  const counts = (Object.keys(STATUS_CONFIG) as Status[]).reduce(
    (acc, s) => ({ ...acc, [s]: estimates.filter((e) => e.status === s).length }),
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
            Estimate Requests
          </h1>
        </div>
        <button
          onClick={fetchEstimates}
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
          {estimates.length} total
        </span>
      </div>

      {/* Search + service type filter */}
      <div className="px-6 pb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name, email, or address…"
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
          value={filterServiceType}
          onChange={(e) => setFilterServiceType(e.target.value as ServiceType | "all")}
          className="px-3 py-2 text-sm rounded-md border"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-card)",
            color: "var(--color-foreground)",
          }}
        >
          <option value="all">All Services</option>
          {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map((s) => (
            <option key={s} value={s}>
              {SERVICE_TYPE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Main content */}
      <div className="px-6 pb-10">
        {loading ? (
          <div className="text-center py-20 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            Loading estimate requests…
          </div>
        ) : error ? (
          <div className="text-center py-20 text-sm text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            No estimate requests match your filters.
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((est) => (
              <EstimateRow
                key={est.id}
                estimate={est}
                onSelect={() => {
                  setSelected(est);
                  setEditNotes(est.notes ?? "");
                }}
                onStatusChange={(s) => updateStatus(est.id, s)}
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
                    Requested {formatDate(selected.submitted_at)}
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
                <Detail label="Address">{selected.address}</Detail>
              </InfoSection>

              {/* Project */}
              <InfoSection title="Project">
                <Detail label="Service">{SERVICE_TYPE_LABELS[selected.service_type]}</Detail>
              </InfoSection>

              {/* Message */}
              {selected.message && (
                <InfoSection title="Project Details">
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
                  placeholder="Add notes visible only to your team — e.g. when this lead was contacted…"
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

function EstimateRow({
  estimate,
  onSelect,
  onStatusChange,
}: {
  estimate: Estimate;
  onSelect: () => void;
  onStatusChange: (s: Status) => void;
}) {
  const cfg = STATUS_CONFIG[estimate.status];
  return (
    <div
      className="card flex items-center gap-4 px-4 py-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onSelect}
    >
      {/* Avatar */}
      <Avatar firstName={estimate.first_name} lastName={estimate.last_name} />

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: "var(--color-foreground)" }}>
          {estimate.first_name} {estimate.last_name}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>
          {estimate.email} · {SERVICE_TYPE_LABELS[estimate.service_type]} · {estimate.address}
        </p>
      </div>

      {/* Date */}
      <p className="text-xs hidden sm:block shrink-0" style={{ color: "var(--color-muted-foreground)" }}>
        {formatDate(estimate.submitted_at)}
      </p>

      {/* Status badge + quick-change */}
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        <select
          value={estimate.status}
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

