import Link from "next/link";
import { EditCustomer } from "@/components/Forms";
import { getCustomerById } from "@/lib/serverUtils";

export default async function CustomerEditPage({ params }: { params: Promise<{ cid: number }> }) {
  const p = await params;
  const customer = await getCustomerById(String(p.cid));

  if (!customer) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-2">
        <h1 className="font-display text-h2 font-bold text-primary">Customer not found</h1>
        <Link href="/employee-portal/customers" className="text-sm text-primary hover:underline">
          ← Back to customers
        </Link>
      </div>
    );
  }

  return <EditCustomer customer={customer} />;
}
