"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDeckEstimates,
  DeckEstimate,
  DeckEstimateStatus,
  finalQuoteValue,
} from "@/lib/utils";
import { formatDate } from "@/components/ui/portal-section";

const STATUS_CONFIG: Record<DeckEstimateStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: "Draft",     color: "#374151", bg: "#e5e7eb" },
  ready:     { label: "Ready",     color: "#1d6fa4", bg: "#dbeafe" },
  quoted:    { label: "Quoted",    color: "#5b21b6", bg: "#ede9fe" },
  converted: { label: "Converted", color: "#166534", bg: "#dcfce7" },
  archived:  { label: "Archived",  color: "#991b1b", bg: "#fee2e2" },
};

const money = (n: number | null | undefined) =>
  n == null ? "—" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function EstimatorPage() {
  const [estimates, setEstimates] = useState<DeckEstimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<DeckEstimateStatus | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setEstimates(await getDeckEstimates());
      } catch {
        setError("Could not load estimates. Check your connection.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = estimates.filter((e) => {
    if (filterStatus !== "all" && e.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.customer_name.toLowerCase().includes(q) && !(e.address ?? "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = (Object.keys(STATUS_CONFIG) as DeckEstimateStatus[]).reduce(
    (acc, s) => ({ ...acc, [s]: estimates.filter((e) => e.status === s).length }),
    {} as Record<DeckEstimateStatus, number>
  );

  const pipeline = estimates
    .filter((e) => e.status === "ready" || e.status === "quoted")
    .reduce((sum, e) => sum + (Number(e.final_quote) || 0), 0);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
          <h1 className="font-display text-h2 font-bold text-primary">Deck Estimates</h1>
        </div>
        <Link href="/employee-portal/estimator/new" className="primary rounded-md px-5 py-2.5 text-sm font-semibold hover:opacity-90">
          + New estimate
        </Link>
      </div>

      {/* Pipeline value */}
      <div className="card flex flex-wrap items-center gap-x-8 gap-y-2 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Open pipeline (ready + quoted)</p>
          <p className="text-2xl font-bold text-primary">{money(pipeline)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total estimates</p>
          <p className="text-2xl font-bold text-primary">{estimates.length}</p>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(STATUS_CONFIG) as [DeckEstimateStatus, typeof STATUS_CONFIG[DeckEstimateStatus]][]).map(([s, cfg]) => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all"
            style={{
              backgroundColor: filterStatus === s ? cfg.color : cfg.bg,
              color: filterStatus === s ? "#fff" : cfg.color,
              outline: filterStatus === s ? `2px solid ${cfg.color}` : "none",
            }}
          >
            {cfg.label}
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundColor: filterStatus === s ? "rgba(255,255,255,0.25)" : cfg.color }}
            >
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Search customer or address…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
      />

      {loading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Loading estimates…</p>
      ) : error ? (
        <p className="py-16 text-center text-sm text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-muted-foreground">No estimates yet.</p>
          <Link href="/employee-portal/estimator/new" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            Create your first on-site estimate →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((e) => {
            const cfg = STATUS_CONFIG[e.status];
            return (
              <Link
                key={e.id}
                href={`/employee-portal/estimator/${e.id}`}
                className="card flex items-center gap-4 px-4 py-3 transition-shadow hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{e.customer_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[e.address, e.city].filter(Boolean).join(", ")}
                  </p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-xs text-muted-foreground">{e.total_sq_ft ? `${Math.round(Number(e.total_sq_ft))} sq ft` : "—"}</p>
                  <p className="text-sm font-semibold text-primary">{money(Number(e.final_quote))}</p>
                </div>
                <p className="hidden shrink-0 text-xs text-muted-foreground md:block">{formatDate(e.created_at)}</p>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
