"use client";

import {
  DeckEstimate,
  WORK_TYPE_LABELS,
  MATERIAL_LABELS,
  ELEVATION_LABELS,
  CONDITION_LABELS,
  MARKER_CONFIG,
  SketchMarkerKind,
  finalQuoteValue,
} from "@/lib/utils";
import { DeckSketchCanvas } from "./DeckSketchCanvas";

const money = (n: number | null | undefined) =>
  n == null ? "—" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span style={{ color: "var(--color-muted-foreground)" }}>{label}</span>
      <span className="text-right font-medium" style={{ color: "var(--color-foreground)" }}>
        {value}
      </span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card space-y-2 p-5 print:border print:shadow-none">
      <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-muted-foreground)" }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function DeckEstimateSummary({ estimate }: { estimate: DeckEstimate }) {
  const d = estimate.data;
  const markerCounts = (d.sketch?.markers ?? []).reduce((acc, m) => {
    acc[m.kind] = (acc[m.kind] ?? 0) + 1;
    return acc;
  }, {} as Record<SketchMarkerKind, number>);

  return (
    <div className="grid gap-4">
      <Block title="Customer & site">
        <Row label="Customer" value={estimate.customer_name} />
        <Row label="Phone" value={estimate.phone} />
        <Row label="Email" value={estimate.email} />
        <Row
          label="Address"
          value={[estimate.address, estimate.city, estimate.state_abr].filter(Boolean).join(", ")}
        />
      </Block>

      <Block title="Scope of work">
        <Row label="Work" value={d.workTypes?.map((w) => WORK_TYPE_LABELS[w]).join(", ")} />
        <Row label="Material" value={d.materials?.map((m) => MATERIAL_LABELS[m]).join(", ")} />
        <Row label="PT wood + restore" value={d.pressureTreatedRestore ? "Yes" : null} />
        <Row label="Elevation" value={d.elevation ? ELEVATION_LABELS[d.elevation] : null} />
        <Row label="Tiers / levels" value={d.tiers} />
      </Block>

      {d.sketch && (
        <Block title="Deck sketch">
          <DeckSketchCanvas value={d.sketch} readOnly />
          {Object.keys(markerCounts).length > 0 && (
            <div className="flex flex-wrap gap-3 pt-1 text-xs">
              {(Object.keys(markerCounts) as SketchMarkerKind[]).map((k) => (
                <span key={k} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-white"
                    style={{ backgroundColor: MARKER_CONFIG[k].color }}
                  >
                    {MARKER_CONFIG[k].symbol}
                  </span>
                  {MARKER_CONFIG[k].label} × {markerCounts[k]}
                </span>
              ))}
            </div>
          )}
        </Block>
      )}

      <Block title="Measurements & repairs">
        <Row label="Total area" value={d.totalSqFt != null ? `${Math.round(d.totalSqFt)} sq ft` : null} />
        <Row label="Boards to replace" value={d.boardReplacementCount} />
        <Row label="Bondo spots" value={d.bondoSpotCount} />
        <Row label="Railing" value={d.railingLinearFt != null ? `${d.railingLinearFt} lin ft` : null} />
        <Row label="Railing condition" value={d.railingCondition ? CONDITION_LABELS[d.railingCondition] : null} />
        <Row label="Popped fasteners" value={d.fastenersPopped} />
      </Block>

      <Block title="Stairs">
        <Row label="Steps" value={d.stepCount} />
        <Row label="Stringers" value={d.stringerCount} />
        <Row label="Condition" value={d.stairCondition ? CONDITION_LABELS[d.stairCondition] : null} />
        <Row label="Rise" value={d.riseIn != null ? `${d.riseIn} in` : null} />
        <Row label="Run" value={d.runIn != null ? `${d.runIn} in` : null} />
      </Block>

      {(d.structuralConcerns || d.siteAccessNotes || d.additionalNotes) && (
        <Block title="Notes">
          {d.structuralConcerns && (
            <p className="text-sm">
              <span className="font-medium">Structural: </span>
              {d.structuralConcerns}
            </p>
          )}
          {d.siteAccessNotes && (
            <p className="text-sm">
              <span className="font-medium">Site access: </span>
              {d.siteAccessNotes}
            </p>
          )}
          {d.additionalNotes && (
            <p className="text-sm">
              <span className="font-medium">Additional: </span>
              {d.additionalNotes}
            </p>
          )}
        </Block>
      )}

      <Block title="Quote">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: "var(--color-muted-foreground)" }} className="text-left text-xs uppercase tracking-wide">
              <th className="py-1 font-medium">Item</th>
              <th className="py-1 text-right font-medium">Qty</th>
              <th className="py-1 text-right font-medium">Rate</th>
              <th className="py-1 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {(d.lineItems ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} className="py-2 text-muted-foreground">
                  No priced line items.
                </td>
              </tr>
            ) : (
              d.lineItems.map((li) => (
                <tr key={li.key} className="border-t border-border">
                  <td className="py-1.5">{li.label}</td>
                  <td className="py-1.5 text-right">
                    {li.qty} {li.unit}
                  </td>
                  <td className="py-1.5 text-right">{money(li.rate)}</td>
                  <td className="py-1.5 text-right font-medium">{money(li.total)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-border">
              <td colSpan={3} className="py-1.5 text-right text-muted-foreground">
                Suggested
              </td>
              <td className="py-1.5 text-right">{money(d.suggestedTotal)}</td>
            </tr>
            {d.overrideTotal != null && (
              <tr>
                <td colSpan={3} className="py-1.5 text-right text-muted-foreground">
                  Adjusted
                </td>
                <td className="py-1.5 text-right">{money(d.overrideTotal)}</td>
              </tr>
            )}
            <tr className="border-t-2 border-border">
              <td colSpan={3} className="py-2 text-right font-bold text-primary">
                Quote
              </td>
              <td className="py-2 text-right text-lg font-bold text-primary">{money(finalQuoteValue(d))}</td>
            </tr>
          </tfoot>
        </table>
      </Block>
    </div>
  );
}
