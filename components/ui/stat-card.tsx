import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string | number;
  href?: string;
}

export function StatCard({ label, value, href }: StatCardProps) {
  const content = (
    <div className="card flex flex-col gap-1 p-5 h-full transition-shadow hover:shadow-md">
      <span className="text-3xl font-bold text-primary">{value}</span>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
