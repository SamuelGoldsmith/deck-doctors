"use client";

import * as React from "react";
import Link from "next/link";
import {
  DeckEstimate,
  DeckEstimateStatus,
  DeckEstimateInput,
  patchDeckEstimate,
  updateDeckEstimate,
  deleteDeckEstimate,
} from "@/lib/utils";
import { formatDate } from "@/components/ui/portal-section";
import { DeckEstimateSummary } from "./DeckEstimateSummary";

const STATUS_OPTIONS: { value: DeckEstimateStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
  { value: "quoted", label: "Quoted" },
  { value: "converted", label: "Converted" },
  { value: "archived", label: "Archived" },
];

export function EstimateDetail({ estimate }: { estimate: DeckEstimate }) {
  const [status, setStatus] = React.useState<DeckEstimateStatus>(estimate.status);
  const [notes, setNotes] = React.useState(estimate.data?.internalNotes ?? "");
  const [savingNotes, setSavingNotes] = React.useState(false);

  // Auto-print when arriving from "Save & print".
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("print") === "1") {
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, []);

  const changeStatus = async (s: DeckEstimateStatus) => {
    const prev = status;
    setStatus(s);
    if (!(await patchDeckEstimate(estimate.id, { status: s }))) setStatus(prev);
  };

  const baseInput = (dataOverride: Partial<DeckEstimate["data"]>): DeckEstimateInput => ({
    id: estimate.id,
    cid: estimate.cid,
    customer_name: estimate.customer_name,
    phone: estimate.phone ?? "",
    email: estimate.email ?? "",
    address: estimate.address,
    city: estimate.city ?? "",
    state_abr: estimate.state_abr ?? "",
    status,
    data: { ...estimate.data, ...dataOverride },
  });

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateDeckEstimate(baseInput({ internalNotes: notes }));
    } finally {
      setSavingNotes(false);
    }
  };

  const remove = async () => {
    if (await deleteDeckEstimate(estimate.id)) {
      window.location.href = "/employee-portal/estimator";
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      {/* Header */}
      <div className="no-print flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/employee-portal/estimator" className="text-xs text-muted-foreground hover:underline">
            ← All estimates
          </Link>
          <h1 className="font-display text-h2 font-bold text-primary">{estimate.customer_name}</h1>
          <p className="text-sm text-muted-foreground">
            {[estimate.address, estimate.city, estimate.state_abr].filter(Boolean).join(", ")} · created {formatDate(estimate.created_at)}
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => changeStatus(e.target.value as DeckEstimateStatus)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="no-print flex flex-wrap gap-2">
        <Link
          href={`/employee-portal/estimator/${estimate.id}/edit`}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          ✎ Edit
        </Link>
        <button onClick={() => window.print()} className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
          🖨 Print / PDF
        </button>
        <Link
          href={`/employee-portal/jobs/new?fromEstimate=${estimate.id}`}
          className="primary rounded-md px-4 py-2 text-sm font-semibold hover:opacity-90"
        >
          → Create job from estimate
        </Link>
        <button onClick={remove} className="ml-auto rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
          Delete
        </button>
      </div>

      {estimate.jid && (
        <div className="no-print rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
          Linked to{" "}
          <Link href={`/employee-portal/jobs/${estimate.jid}`} className="font-semibold underline">
            job #{estimate.jid}
          </Link>
          .
        </div>
      )}

      {/* Print header (only visible on paper) */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">Deck Doctors — Estimate</h1>
        <p className="text-sm">
          {estimate.customer_name} · {[estimate.address, estimate.city, estimate.state_abr].filter(Boolean).join(", ")}
        </p>
      </div>

      <DeckEstimateSummary estimate={estimate} />

      {/* Internal notes */}
      <section className="no-print card space-y-2 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Internal notes</h3>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Team-only notes — not shown on the printed summary."
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={saveNotes}
          disabled={savingNotes || notes === (estimate.data?.internalNotes ?? "")}
          className="primary rounded-md px-4 py-1.5 text-sm font-medium hover:opacity-80 disabled:opacity-40"
        >
          {savingNotes ? "Saving…" : "Save notes"}
        </button>
      </section>
    </div>
  );
}
