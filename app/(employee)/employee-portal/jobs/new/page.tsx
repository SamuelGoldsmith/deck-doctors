import { EditJob } from "@/components/Forms";
import { getCustomers, getCustomerById, getDeckEstimateById } from "@/lib/serverUtils";
import { Job, summarizeDeckEstimate } from "@/lib/utils";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ fromEstimate?: string }>;
}) {
  const customers = await getCustomers();
  const { fromEstimate } = await searchParams;

  let prefill: Partial<Job> | undefined;
  if (fromEstimate) {
    const est = await getDeckEstimateById(fromEstimate);
    if (est) {
      const customer = est.cid ? await getCustomerById(String(est.cid)) : undefined;
      prefill = {
        address: est.address ?? "",
        city: est.city ?? "",
        state_abr: est.state_abr ?? "",
        quote_cost: est.final_quote != null ? Number(est.final_quote) : null,
        description: summarizeDeckEstimate(est),
        cid: est.cid ?? 0,
        ...(customer ? { customer } : {}),
      };
    }
  }

  return <EditJob customers={customers} prefill={prefill} />;
}
