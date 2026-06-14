import { cn } from "@/lib/utils";

type Tone = "default" | "dark" | "tan";

const TONE_CLASS: Record<Tone, string> = {
  default: "bg-background text-foreground",
  dark: "surface-dark",
  tan: "bg-secondary text-secondary-foreground",
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
}

export function Section({ tone = "default", className, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-20 md:py-28 lg:py-36", TONE_CLASS[tone], className)} {...props}>
      {children}
    </section>
  );
}
