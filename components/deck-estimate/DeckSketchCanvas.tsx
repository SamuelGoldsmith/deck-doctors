"use client";

import * as React from "react";
import {
  DeckSketch,
  SketchPoint,
  SketchSection,
  SketchStroke,
  SketchMarkerKind,
  MARKER_CONFIG,
  polygonAreaCells,
  sketchTotalSqFt,
} from "@/lib/utils";

type Mode = "area" | "draw" | "marker";

const SECTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

interface Drag {
  type: "vertex" | "section" | "stroke";
  sectionId?: string;
  index?: number;
  strokeId?: string;
  start: SketchPoint;
  orig: SketchPoint[];
}

/**
 * On-site deck sketch tool. Two layers in one SVG:
 *  - Area tool: tap grid corners to build closed polygons (any shape, multiple
 *    sections for L-shapes / multi-level decks); shoelace area → square footage.
 *  - Annotation: freehand pen strokes + labelled marker pins (rot, Bondo, etc.).
 * Coordinates are stored in grid-cell units; real-world size = feetPerCell.
 */
export function DeckSketchCanvas({
  value,
  onChange,
  readOnly = false,
}: {
  value: DeckSketch;
  onChange?: (s: DeckSketch) => void;
  readOnly?: boolean;
}) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [mode, setMode] = React.useState<Mode>("area");
  const [markerKind, setMarkerKind] = React.useState<SketchMarkerKind>("rotten");
  const [drag, setDrag] = React.useState<Drag | null>(null);
  const [rectW, setRectW] = React.useState("");
  const [rectH, setRectH] = React.useState("");

  const { cols, rows, feetPerCell, sections, strokes, markers } = value;
  const update = (patch: Partial<DeckSketch>) => onChange?.({ ...value, ...patch });
  const openSection = sections.find((s) => !s.closed);

  /* Map a pointer event to grid-cell coordinates inside the SVG viewBox. */
  const toCell = (e: React.PointerEvent): SketchPoint | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };
  const snap = (p: SketchPoint): SketchPoint => ({
    x: clamp(Math.round(p.x), 0, cols),
    y: clamp(Math.round(p.y), 0, rows),
  });

  /* ── Canvas pointer handlers ── */
  const onCanvasPointerDown = (e: React.PointerEvent) => {
    if (readOnly) return;
    const raw = toCell(e);
    if (!raw) return;

    if (mode === "area") {
      const p = snap(raw);
      if (openSection) {
        update({
          sections: sections.map((s) =>
            s.id === openSection.id ? { ...s, points: [...s.points, p] } : s
          ),
        });
      } else {
        const letter = SECTION_LETTERS[sections.length] ?? `${sections.length + 1}`;
        const next: SketchSection = { id: uid(), label: letter, points: [p], closed: false };
        update({ sections: [...sections, next] });
      }
    } else if (mode === "marker") {
      const p = snap(raw);
      update({ markers: [...markers, { id: uid(), x: p.x, y: p.y, kind: markerKind }] });
    } else if (mode === "draw") {
      const stroke: SketchStroke = { id: uid(), points: [raw] };
      update({ strokes: [...strokes, stroke] });
      setDrag({ type: "stroke", strokeId: stroke.id, start: raw, orig: [] });
      (e.target as Element).setPointerCapture?.(e.pointerId);
    }
  };

  const onCanvasPointerMove = (e: React.PointerEvent) => {
    if (readOnly || !drag) return;
    const raw = toCell(e);
    if (!raw) return;

    if (drag.type === "stroke" && drag.strokeId) {
      update({
        strokes: strokes.map((s) =>
          s.id === drag.strokeId ? { ...s, points: [...s.points, raw] } : s
        ),
      });
      return;
    }
    const p = snap(raw);
    const dx = p.x - drag.start.x;
    const dy = p.y - drag.start.y;

    if (drag.type === "vertex" && drag.sectionId != null && drag.index != null) {
      update({
        sections: sections.map((s) =>
          s.id === drag.sectionId
            ? { ...s, points: s.points.map((pt, i) => (i === drag.index ? p : pt)) }
            : s
        ),
      });
    } else if (drag.type === "section" && drag.sectionId != null) {
      update({
        sections: sections.map((s) =>
          s.id === drag.sectionId
            ? {
                ...s,
                points: drag.orig.map((pt) => ({
                  x: clamp(pt.x + dx, 0, cols),
                  y: clamp(pt.y + dy, 0, rows),
                })),
              }
            : s
        ),
      });
    }
  };

  const endDrag = () => setDrag(null);

  /* ── Toolbar actions ── */
  const finishSection = () => {
    if (!openSection) return;
    if (openSection.points.length < 3) {
      // Not enough points for an area — drop it.
      update({ sections: sections.filter((s) => s.id !== openSection.id) });
    } else {
      update({
        sections: sections.map((s) => (s.id === openSection.id ? { ...s, closed: true } : s)),
      });
    }
  };

  const undo = () => {
    if (openSection && openSection.points.length > 0) {
      const pts = openSection.points.slice(0, -1);
      update({
        sections:
          pts.length === 0
            ? sections.filter((s) => s.id !== openSection.id)
            : sections.map((s) => (s.id === openSection.id ? { ...s, points: pts } : s)),
      });
    } else if (strokes.length > 0) {
      update({ strokes: strokes.slice(0, -1) });
    } else if (sections.length > 0) {
      update({ sections: sections.slice(0, -1) });
    }
  };

  const clearAll = () => {
    if (confirm("Clear the entire sketch?")) {
      update({ sections: [], strokes: [], markers: [] });
    }
  };

  const addRectangle = () => {
    const w = Math.round(Number(rectW) / feetPerCell);
    const h = Math.round(Number(rectH) / feetPerCell);
    if (!w || !h || w < 1 || h < 1) return;
    const off = (sections.length % 4) + 1;
    const x0 = clamp(off, 0, Math.max(0, cols - w));
    const y0 = clamp(off, 0, Math.max(0, rows - h));
    const letter = SECTION_LETTERS[sections.length] ?? `${sections.length + 1}`;
    const rect: SketchSection = {
      id: uid(),
      label: letter,
      closed: true,
      points: [
        { x: x0, y: y0 },
        { x: x0 + w, y: y0 },
        { x: x0 + w, y: y0 + h },
        { x: x0, y: y0 + h },
      ],
    };
    update({ sections: [...sections, rect] });
    setRectW("");
    setRectH("");
  };

  const removeVertex = (sectionId: string, index: number) => {
    if (readOnly) return;
    update({
      sections: sections.map((s) =>
        s.id === sectionId ? { ...s, points: s.points.filter((_, i) => i !== index) } : s
      ),
    });
  };

  const removeMarker = (id: string) => {
    if (readOnly) return;
    update({ markers: markers.filter((m) => m.id !== id) });
  };

  const totalSqFt = sketchTotalSqFt(value);
  const vertexR = Math.max(cols, rows) / 70; // handle radius in cell units
  const strokeW = Math.max(cols, rows) / 220;

  const centroid = (pts: SketchPoint[]): SketchPoint => {
    const x = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const y = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    return { x, y };
  };

  return (
    <div className="space-y-2">
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-md border border-border text-xs font-medium">
            {(["area", "draw", "marker"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="px-3 py-1.5 transition-colors"
                style={{
                  backgroundColor: mode === m ? "var(--color-primary)" : "transparent",
                  color: mode === m ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                }}
              >
                {m === "area" ? "▦ Area" : m === "draw" ? "✎ Draw" : "⚑ Mark"}
              </button>
            ))}
          </div>

          {mode === "marker" && (
            <select
              value={markerKind}
              onChange={(e) => setMarkerKind(e.target.value as SketchMarkerKind)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
            >
              {(Object.keys(MARKER_CONFIG) as SketchMarkerKind[]).map((k) => (
                <option key={k} value={k}>
                  {MARKER_CONFIG[k].symbol} {MARKER_CONFIG[k].label}
                </option>
              ))}
            </select>
          )}

          {mode === "area" && (
            <>
              {openSection ? (
                <button
                  type="button"
                  onClick={finishSection}
                  className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary-foreground)]"
                >
                  ✓ Finish section {openSection.label}
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">Tap corners to outline a section</span>
              )}
              <span className="mx-1 h-5 w-px bg-border" />
              <input
                value={rectW}
                onChange={(e) => setRectW(e.target.value)}
                inputMode="decimal"
                placeholder="W ft"
                className="w-16 rounded-md border border-border bg-background px-2 py-1.5 text-xs"
              />
              <span className="text-xs text-muted-foreground">×</span>
              <input
                value={rectH}
                onChange={(e) => setRectH(e.target.value)}
                inputMode="decimal"
                placeholder="H ft"
                className="w-16 rounded-md border border-border bg-background px-2 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={addRectangle}
                className="rounded-md border border-border px-2 py-1.5 text-xs font-medium hover:bg-secondary"
              >
                + Rectangle
              </button>
            </>
          )}

          <span className="ml-auto flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Scale</label>
            <select
              value={feetPerCell}
              onChange={(e) => update({ feetPerCell: Number(e.target.value) })}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
            >
              {[1, 2, 5].map((f) => (
                <option key={f} value={f}>
                  1 sq = {f} ft
                </option>
              ))}
            </select>
            <button type="button" onClick={undo} className="rounded-md border border-border px-2 py-1.5 text-xs hover:bg-secondary">
              ↶ Undo
            </button>
            <button type="button" onClick={clearAll} className="rounded-md border border-border px-2 py-1.5 text-xs text-red-600 hover:bg-secondary">
              Clear
            </button>
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${cols} ${rows}`}
          className="block w-full select-none"
          style={{ aspectRatio: `${cols} / ${rows}`, touchAction: "none", cursor: readOnly ? "default" : "crosshair" }}
          onPointerDown={onCanvasPointerDown}
          onPointerMove={onCanvasPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          {/* Grid */}
          <g stroke="#e2e0db" strokeWidth={1} vectorEffect="non-scaling-stroke">
            {Array.from({ length: cols + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i} y1={0} x2={i} y2={rows} />
            ))}
            {Array.from({ length: rows + 1 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i} x2={cols} y2={i} />
            ))}
          </g>

          {/* Sections */}
          {sections.map((s) => {
            const d = s.points.map((p) => `${p.x},${p.y}`).join(" ");
            const area = s.closed ? polygonAreaCells(s.points) * feetPerCell * feetPerCell : 0;
            const c = s.points.length ? centroid(s.points) : { x: 0, y: 0 };
            return (
              <g key={s.id}>
                {s.closed ? (
                  <polygon
                    points={d}
                    fill="var(--color-accent)"
                    fillOpacity={0.18}
                    stroke="var(--color-primary)"
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                    style={{ cursor: readOnly ? "default" : "move" }}
                    onPointerDown={(e) => {
                      if (readOnly || mode !== "area") return;
                      e.stopPropagation();
                      const raw = toCell(e);
                      if (!raw) return;
                      setDrag({ type: "section", sectionId: s.id, start: snap(raw), orig: s.points });
                    }}
                  />
                ) : (
                  <polyline
                    points={d}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth={1.5}
                    strokeDasharray="3 2"
                    vectorEffect="non-scaling-stroke"
                  />
                )}

                {s.closed && s.points.length >= 3 && (
                  <text
                    x={c.x}
                    y={c.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.max(cols, rows) / 22}
                    fontWeight={700}
                    fill="var(--color-primary)"
                  >
                    {s.label} · {Math.round(area)} ft²
                  </text>
                )}

                {/* Vertices */}
                {!readOnly &&
                  s.points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={vertexR}
                      fill="#fff"
                      stroke="var(--color-primary)"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                      style={{ cursor: "grab" }}
                      onPointerDown={(e) => {
                        if (mode !== "area") return;
                        e.stopPropagation();
                        const raw = toCell(e);
                        if (!raw) return;
                        setDrag({ type: "vertex", sectionId: s.id, index: i, start: snap(raw), orig: s.points });
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        removeVertex(s.id, i);
                      }}
                    />
                  ))}
              </g>
            );
          })}

          {/* Freehand strokes */}
          {strokes.map((s) => (
            <polyline
              key={s.id}
              points={s.points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#1f2937"
              strokeWidth={Math.max(1.5, strokeW * 2)}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Markers */}
          {markers.map((m) => {
            const cfg = MARKER_CONFIG[m.kind];
            const r = Math.max(cols, rows) / 40;
            return (
              <g
                key={m.id}
                style={{ cursor: readOnly ? "default" : "pointer" }}
                onPointerDown={(e) => {
                  if (readOnly) return;
                  e.stopPropagation();
                  removeMarker(m.id);
                }}
              >
                <circle cx={m.x} cy={m.y} r={r} fill={cfg.color} stroke="#fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                <text x={m.x} y={m.y} textAnchor="middle" dominantBaseline="central" fontSize={r * 1.1} fill="#fff">
                  {cfg.symbol}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {markers.length > 0 && !readOnly ? "Tap a pin to remove · double-tap a corner to delete it · " : ""}
          {sections.filter((s) => s.closed).length} section(s)
        </span>
        <span className="text-sm font-semibold text-primary">Sketch area: {Math.round(totalSqFt)} sq ft</span>
      </div>
    </div>
  );
}
