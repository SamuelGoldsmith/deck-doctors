import HoursSearch from "@/components/hoursSearch";
import { getHours } from "@/lib/serverUtils";




export default async function HoursPage() {
  const hours = await getHours();
  return (
    <main className="m-3 ">
      <h1 className="text-4xl font-bold mb-6">Hours</h1>
      <HoursSearch hours={hours} />
    </main>
  );
}