/* Shared building blocks for employee-portal detail views (drawers, cards). */

export function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p
        className="text-xs uppercase tracking-widest font-semibold"
        style={{ color: "var(--color-muted-foreground)" }}
      >
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span style={{ color: "var(--color-muted-foreground)" }}>{label}</span>
      <span className="font-medium text-right" style={{ color: "var(--color-foreground)" }}>
        {children}
      </span>
    </div>
  );
}

export function Avatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
      style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-primary)" }}
    >
      {firstName[0]}
      {lastName[0]}
    </div>
  );
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
