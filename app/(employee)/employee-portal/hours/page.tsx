import HoursSearch from "@/components/hoursSearch";
import { getHours } from "@/lib/serverUtils";

export default async function HoursPage() {
  const hours = await getHours();
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
        <h1 className="font-display text-h2 font-bold text-primary">Hours</h1>
      </div>
      <HoursSearch hours={hours} />
    </div>
  );
}
