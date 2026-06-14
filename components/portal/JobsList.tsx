'use client';

import { useState } from "react";
import Link from "next/link";
import { Job } from "@/lib/utils";

export function JobsList({ jobs }: { jobs: Job[] }) {
  const [filter, setFilter] = useState<"active" | "completed" | "all">("active");
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((job) => {
    if (filter === "active" && job.completed) return false;
    if (filter === "completed" && !job.completed) return false;
    if (search) {
      const q = search.toLowerCase();
      const customerName = `${job.customer?.first_name ?? ""} ${job.customer?.last_name ?? ""}`;
      if (
        !job.address.toLowerCase().includes(q) &&
        !job.city.toLowerCase().includes(q) &&
        !customerName.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const counts = {
    active: jobs.filter((j) => !j.completed).length,
    completed: jobs.filter((j) => j.completed).length,
    all: jobs.length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["active", "completed", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
            style={{
              backgroundColor: filter === f ? "var(--color-primary)" : "var(--color-secondary)",
              color: filter === f ? "var(--color-primary-foreground)" : "var(--color-foreground)",
            }}
          >
            {f === "active" ? "Active" : f === "completed" ? "Completed" : "All"}
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: filter === f ? "rgba(255,255,255,0.25)" : "var(--color-card)",
              }}
            >
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Search by address, city, or customer…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground"
      />

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No jobs match your filters.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((job) => (
            <Link
              key={job.jid}
              href={`/employee-portal/jobs/${job.jid}`}
              className="card flex items-center gap-4 px-4 py-3 transition-shadow hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {job.address}, {job.city}, {job.state_abr}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {job.customer?.first_name} {job.customer?.last_name}
                  {job.quote_cost ? ` · $${Number(job.quote_cost).toLocaleString()}` : ""}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: job.completed ? "#dcfce7" : "#dbeafe",
                  color: job.completed ? "#166534" : "#1d6fa4",
                }}
              >
                {job.completed ? "Completed" : "Active"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
