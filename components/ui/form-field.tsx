import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function inputClass(hasError: boolean, extra?: string) {
  return cn(
    "w-full px-3 py-2 rounded-md text-sm outline-none transition-colors border",
    hasError
      ? "border-red-400 bg-red-50"
      : "border-[var(--color-border)] bg-[var(--color-background)]",
    "focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
    extra
  );
}
