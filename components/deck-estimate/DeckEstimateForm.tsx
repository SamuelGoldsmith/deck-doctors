"use client";

import * as React from "react";
import Link from "next/link";
import { Field, inputClass } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CustomerSelect } from "@/components/customerSelect";
import { DeckSketchCanvas } from "./DeckSketchCanvas";
import {
  Customer,
  DeckEstimate,
  DeckEstimateData,
  DeckEstimateInput,
  DeckEstimateStatus,
  DeckMaterial,
  DeckWorkType,
  DeckElevation,
  Condition,
  QuoteRates,
  WORK_TYPE_LABELS,
  MATERIAL_LABELS,
  ELEVATION_LABELS,
  CONDITION_LABELS,
  emptyDeckEstimateData,
  emptyDeckSketch,
  computeQuote,
  sketchTotalSqFt,
  finalQuoteValue,
  addDeckEstimate,
  updateDeckEstimate,
} from "@/lib/utils";

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const numOrNull = (v: string): number | null => (v === "" ? null : Number(v));

const RATE_FIELDS: { key: keyof QuoteRates; label: string; unit: string }[] = [
  { key: "resurfaceSqFt", label: "Resurface", unit: "/ sq ft" },
  { key: "restorationSqFt", label: "Restoration", unit: "/ sq ft" },
  { key: "boardReplacement", label: "Board replacement", unit: "/ board" },
  { key: "bondoSpot", label: "Bondo spot", unit: "/ spot" },
  { key: "stepStringer", label: "Step / stringer", unit: "/ unit" },
  { key: "railingLinearFt", label: "Railing", unit: "/ lin ft" },
  { key: "laborHour", label: "Labor", unit: "/ hr" },
];

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="card space-y-4 p-6">
      <div>
        <h2 className="font-display text-h3 font-semibold text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
      style={{
        backgroundColor: active ? "var(--color-primary)" : "transparent",
        color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)",
        borderColor: active ? "var(--color-primary)" : "var(--color-border)",
      }}
    >
      {children}
    </button>
  );
}

export function DeckEstimateForm({ estimate, customers }: { estimate?: DeckEstimate; customers: Customer[] }) {
  const isNew = !estimate;

  const [customerName, setCustomerName] = React.useState(estimate?.customer_name ?? "");
  const [cid, setCid] = React.useState<number | null>(estimate?.cid ?? null);
  const [phone, setPhone] = React.useState(estimate?.phone ?? "");
  const [email, setEmail] = React.useState(estimate?.email ?? "");
  const [address, setAddress] = React.useState(estimate?.address ?? "");
  const [city, setCity] = React.useState(estimate?.city ?? "");
  const [state, setState] = React.useState(estimate?.state_abr ?? "");
  const [status, setStatus] = React.useState<DeckEstimateStatus>(estimate?.status ?? "draft");

  const [data, setData] = React.useState<DeckEstimateData>(() => ({
    ...emptyDeckEstimateData(),
    ...(estimate?.data ?? {}),
    sketch: estimate?.data?.sketch ?? emptyDeckSketch(),
    rates: { ...emptyDeckEstimateData().rates, ...(estimate?.data?.rates ?? {}) },
  }));

  const [errors, setErrors] = React.useState<{ customer?: string; address?: string }>({});
  const [saving, setSaving] = React.useState(false);

  const patch = (p: Partial<DeckEstimateData>) => setData((prev) => ({ ...prev, ...p }));
  const setRate = (key: keyof QuoteRates, v: string) =>
    setData((prev) => ({ ...prev, rates: { ...prev.rates, [key]: Number(v) || 0 } }));

  const toggleWork = (w: DeckWorkType) =>
    patch({ workTypes: data.workTypes.includes(w) ? data.workTypes.filter((x) => x !== w) : [...data.workTypes, w] });
  const toggleMaterial = (m: DeckMaterial) =>
    patch({ materials: data.materials.includes(m) ? data.materials.filter((x) => x !== m) : [...data.materials, m] });

  const onSketchChange = (sketch: DeckEstimateData["sketch"]) => {
    setData((prev) => {
      const auto = sketchTotalSqFt(sketch);
      return { ...prev, sketch, totalSqFt: prev.sqFtIsOverride ? prev.totalSqFt : Math.round(auto) };
    });
  };

  const quote = React.useMemo(() => computeQuote(data, data.rates), [data]);
  const finalQuote = finalQuoteValue({ ...data, suggestedTotal: quote.suggestedTotal });

  const ptRestore = data.materials.includes("pressure_treated") && data.workTypes.includes("restoration");

  const save = async (autoPrint: boolean) => {
    const e: typeof errors = {};
    if (!customerName.trim()) e.customer = "Customer name is required";
    if (!address.trim()) e.address = "Address is required";
    setErrors(e);
    if (Object.keys(e).length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const finalData: DeckEstimateData = {
      ...data,
      lineItems: quote.lineItems,
      suggestedTotal: quote.suggestedTotal,
    };
    const input: DeckEstimateInput = {
      id: estimate?.id,
      cid,
      customer_name: customerName.trim(),
      phone,
      email,
      address: address.trim(),
      city,
      state_abr: state,
      status,
      data: finalData,
    };

    setSaving(true);
    try {
      if (isNew) {
        const { ok, id } = await addDeckEstimate(input);
        if (!ok || !id) {
          alert("Failed to save estimate.");
          return;
        }
        window.location.href = `/employee-portal/estimator/${id}${autoPrint ? "?print=1" : ""}`;
      } else {
        const ok = await updateDeckEstimate(input);
        if (!ok) {
          alert("Failed to save changes.");
          return;
        }
        window.location.href = `/employee-portal/estimator/${estimate!.id}${autoPrint ? "?print=1" : ""}`;
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 pb-24">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors · On-site estimate</p>
        <h1 className="font-display text-h2 font-bold text-primary">{isNew ? "New Deck Estimate" : "Edit Estimate"}</h1>
        <p className="text-sm text-muted-foreground">
          Capture the full picture of the deck and the work needed — every field feeds the quote.
        </p>
      </div>

      {/* Customer & site */}
      <Section title="Customer & site" subtitle="Link an existing contact or type a new one.">
        <Field label="Link existing customer (optional)">
          <CustomerSelect
            customers={customers}
            onChange={(c) => {
              setCid(c.cid);
              setCustomerName(`${c.first_name} ${c.last_name}`.trim());
              if (c.phone) setPhone(c.phone);
              if (c.email) setEmail(c.email);
            }}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Customer name" error={errors.customer} required>
            <input className={inputClass(!!errors.customer)} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={inputClass(false)} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
        </div>
        <Field label="Email">
          <input className={inputClass(false)} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_0.6fr]">
          <Field label="Address" error={errors.address} required>
            <input className={inputClass(!!errors.address)} value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>
          <Field label="City">
            <input className={inputClass(false)} value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
          <Field label="State">
            <input className={inputClass(false)} maxLength={2} value={state} onChange={(e) => setState(e.target.value.toUpperCase())} />
          </Field>
        </div>
      </Section>

      {/* Scope */}
      <Section title="Scope of work">
        <Field label="Type of work">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(WORK_TYPE_LABELS) as DeckWorkType[]).map((w) => (
              <Chip key={w} active={data.workTypes.includes(w)} onClick={() => toggleWork(w)}>
                {WORK_TYPE_LABELS[w]}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Decking material">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MATERIAL_LABELS) as DeckMaterial[]).map((m) => (
              <Chip key={m} active={data.materials.includes(m)} onClick={() => toggleMaterial(m)}>
                {MATERIAL_LABELS[m]}
              </Chip>
            ))}
          </div>
        </Field>

        {ptRestore && (
          <div className="flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 p-3">
            <Checkbox
              id="pt-restore"
              checked={data.pressureTreatedRestore}
              onCheckedChange={(c) => patch({ pressureTreatedRestore: c === true })}
            />
            <Label htmlFor="pt-restore" className="text-sm font-medium">
              Pressure-treated wood is being restored (confirm prep/sanding scope)
            </Label>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Deck elevation">
            <select
              className={inputClass(false)}
              value={data.elevation}
              onChange={(e) => patch({ elevation: e.target.value as DeckElevation })}
            >
              <option value="">Select…</option>
              {(Object.keys(ELEVATION_LABELS) as Exclude<DeckElevation, "">[]).map((k) => (
                <option key={k} value={k}>
                  {ELEVATION_LABELS[k]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Number of levels / tiers">
            <input
              type="number"
              min={1}
              className={inputClass(false)}
              value={data.tiers ?? ""}
              onChange={(e) => patch({ tiers: numOrNull(e.target.value) })}
            />
          </Field>
        </div>
      </Section>

      {/* Sketch */}
      <Section
        title="Deck sketch & size"
        subtitle="Tap corners to outline each section (works for L-shapes & multi-level decks). Switch to Draw or Mark to note damage. Area is computed automatically."
      >
        <DeckSketchCanvas value={data.sketch} onChange={onSketchChange} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Total deck size (sq ft)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={inputClass(false)}
                value={data.totalSqFt ?? ""}
                onChange={(e) => patch({ totalSqFt: numOrNull(e.target.value), sqFtIsOverride: true })}
              />
              {data.sqFtIsOverride && (
                <button
                  type="button"
                  onClick={() => patch({ totalSqFt: Math.round(sketchTotalSqFt(data.sketch)), sqFtIsOverride: false })}
                  className="whitespace-nowrap rounded-md border border-border px-2 py-2 text-xs hover:bg-secondary"
                >
                  ↺ Use sketch
                </button>
              )}
            </div>
          </Field>
        </div>
      </Section>

      {/* Repairs */}
      <Section title="Repairs & components">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Boards to replace">
            <input type="number" min={0} className={inputClass(false)} value={data.boardReplacementCount ?? ""} onChange={(e) => patch({ boardReplacementCount: numOrNull(e.target.value) })} />
          </Field>
          <Field label="Bondo filler spots">
            <input type="number" min={0} className={inputClass(false)} value={data.bondoSpotCount ?? ""} onChange={(e) => patch({ bondoSpotCount: numOrNull(e.target.value) })} />
          </Field>
          <Field label="Popped fasteners">
            <input type="number" min={0} className={inputClass(false)} value={data.fastenersPopped ?? ""} onChange={(e) => patch({ fastenersPopped: numOrNull(e.target.value) })} />
          </Field>
          <Field label="Railing (linear ft)">
            <input type="number" min={0} className={inputClass(false)} value={data.railingLinearFt ?? ""} onChange={(e) => patch({ railingLinearFt: numOrNull(e.target.value) })} />
          </Field>
          <Field label="Railing condition">
            <select className={inputClass(false)} value={data.railingCondition} onChange={(e) => patch({ railingCondition: e.target.value as Condition })}>
              <option value="">—</option>
              {(Object.keys(CONDITION_LABELS) as Exclude<Condition, "">[]).map((k) => (
                <option key={k} value={k}>
                  {CONDITION_LABELS[k]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* Stairs */}
      <Section title="Stairs">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Steps">
            <input type="number" min={0} className={inputClass(false)} value={data.stepCount ?? ""} onChange={(e) => patch({ stepCount: numOrNull(e.target.value) })} />
          </Field>
          <Field label="Stringers">
            <input type="number" min={0} className={inputClass(false)} value={data.stringerCount ?? ""} onChange={(e) => patch({ stringerCount: numOrNull(e.target.value) })} />
          </Field>
          <Field label="Condition">
            <select className={inputClass(false)} value={data.stairCondition} onChange={(e) => patch({ stairCondition: e.target.value as Condition })}>
              <option value="">—</option>
              {(Object.keys(CONDITION_LABELS) as Exclude<Condition, "">[]).map((k) => (
                <option key={k} value={k}>
                  {CONDITION_LABELS[k]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Rise (in)">
            <input type="number" min={0} step="0.25" className={inputClass(false)} value={data.riseIn ?? ""} onChange={(e) => patch({ riseIn: numOrNull(e.target.value) })} />
          </Field>
          <Field label="Run (in)">
            <input type="number" min={0} step="0.25" className={inputClass(false)} value={data.runIn ?? ""} onChange={(e) => patch({ runIn: numOrNull(e.target.value) })} />
          </Field>
        </div>
      </Section>

      {/* Notes */}
      <Section title="Other observations" subtitle="Anything else worth capturing while you're on site.">
        <Field label="Structural concerns (joists, ledger, footings…)">
          <textarea rows={2} className={inputClass(false, "resize-none")} value={data.structuralConcerns} onChange={(e) => patch({ structuralConcerns: e.target.value })} />
        </Field>
        <Field label="Site access notes (gates, slope, power, pets…)">
          <textarea rows={2} className={inputClass(false, "resize-none")} value={data.siteAccessNotes} onChange={(e) => patch({ siteAccessNotes: e.target.value })} />
        </Field>
        <Field label="Anything else">
          <textarea rows={3} className={inputClass(false, "resize-none")} value={data.additionalNotes} onChange={(e) => patch({ additionalNotes: e.target.value })} />
        </Field>
      </Section>

      {/* Quote estimator */}
      <Section title="Quote estimator" subtitle="Tune the unit rates — the suggested quote updates live. Override the total if you need to.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {RATE_FIELDS.map((r) => (
            <Field key={r.key} label={`${r.label} ${r.unit}`}>
              <input type="number" min={0} step="0.5" className={inputClass(false)} value={data.rates[r.key]} onChange={(e) => setRate(r.key, e.target.value)} />
            </Field>
          ))}
          <Field label="Labor hours">
            <input type="number" min={0} step="0.5" className={inputClass(false)} value={data.laborHours ?? ""} onChange={(e) => patch({ laborHours: numOrNull(e.target.value) })} />
          </Field>
        </div>

        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Line item</th>
                <th className="px-3 py-2 text-right font-medium">Qty</th>
                <th className="px-3 py-2 text-right font-medium">Rate</th>
                <th className="px-3 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.lineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-3 text-muted-foreground">
                    Fill in scope, measurements and rates to build the quote.
                  </td>
                </tr>
              ) : (
                quote.lineItems.map((li) => (
                  <tr key={li.key} className="border-t border-border">
                    <td className="px-3 py-2">{li.label}</td>
                    <td className="px-3 py-2 text-right">
                      {li.qty} {li.unit}
                    </td>
                    <td className="px-3 py-2 text-right">{money(li.rate)}</td>
                    <td className="px-3 py-2 text-right font-medium">{money(li.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex w-full max-w-xs items-center justify-between text-sm">
            <span className="text-muted-foreground">Suggested quote</span>
            <span className="font-semibold">{money(quote.suggestedTotal)}</span>
          </div>
          <div className="flex w-full max-w-xs items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Override total</span>
            <input
              type="number"
              min={0}
              placeholder="—"
              className={inputClass(false, "max-w-[8rem] text-right")}
              value={data.overrideTotal ?? ""}
              onChange={(e) => patch({ overrideTotal: numOrNull(e.target.value) })}
            />
          </div>
          <div className="flex w-full max-w-xs items-center justify-between border-t border-border pt-2">
            <span className="font-semibold text-primary">Quote</span>
            <span className="text-xl font-bold text-primary">{money(finalQuote)}</span>
          </div>
        </div>
      </Section>

      {/* Save bar */}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-4">
        <Field label="Status">
          <select className={inputClass(false)} value={status} onChange={(e) => setStatus(e.target.value as DeckEstimateStatus)}>
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="quoted">Quoted</option>
          </select>
        </Field>
        <div className="ml-auto flex gap-3">
          <Link
            href={isNew ? "/employee-portal/estimator" : `/employee-portal/estimator/${estimate!.id}`}
            className="rounded-md border border-border px-5 py-2 text-sm font-medium hover:bg-secondary"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => save(true)}
            className="rounded-md border border-primary px-5 py-2 text-sm font-medium text-primary hover:bg-secondary disabled:opacity-50"
          >
            Save &amp; print
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save(false)}
            className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save estimate"}
          </button>
        </div>
      </div>
    </div>
  );
}
