import Link from "next/link";
import { DeckEstimateForm } from "@/components/deck-estimate/DeckEstimateForm";
import { getCustomers, getDeckEstimateById } from "@/lib/serverUtils";

export default async function EstimateEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [estimate, customers] = await Promise.all([getDeckEstimateById(id), getCustomers()]);

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

  return <DeckEstimateForm estimate={estimate} customers={customers} />;
}
