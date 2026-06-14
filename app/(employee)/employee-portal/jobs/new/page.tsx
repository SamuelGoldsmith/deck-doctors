import { EditJob } from "@/components/Forms";
import { getCustomers } from "@/lib/serverUtils";

export default async function NewJobPage() {
  const customers = await getCustomers();
  return <EditJob customers={customers} />;
}
