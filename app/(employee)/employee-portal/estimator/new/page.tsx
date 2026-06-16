import { DeckEstimateForm } from "@/components/deck-estimate/DeckEstimateForm";
import { getCustomers } from "@/lib/serverUtils";

export default async function NewEstimatePage() {
  const customers = await getCustomers();
  return <DeckEstimateForm customers={customers} />;
}
