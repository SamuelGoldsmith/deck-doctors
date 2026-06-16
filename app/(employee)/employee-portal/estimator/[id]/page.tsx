import Link from "next/link";
import { getDeckEstimateById } from "@/lib/serverUtils";
import { EstimateDetail } from "@/components/deck-estimate/EstimateDetail";

export default async function EstimateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const estimate = await getDeckEstimateById(id);

  if (!estimate) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-2">
        <h1 className="font-display text-h2 font-bold text-primary">Estimate not found</h1>
        <Link href="/employee-portal/estimator" className="text-sm text-primary hover:underline">
          ← Back to estimates
        </Link>
      </div>
    );
  }

  return <EstimateDetail estimate={estimate} />;
}
