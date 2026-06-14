import Link from "next/link";
import { CustomersList } from "@/components/portal/CustomersList";
import { getCustomers, getJobs } from "@/lib/serverUtils";

export default async function CustomersPortal() {
  const [customers, jobs] = await Promise.all([getCustomers(), getJobs()]);
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
          <h1 className="font-display text-h2 font-bold text-primary">Customers</h1>
        </div>
        <Link
          href="/employee-portal/customers/new"
          className="primary rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          + Add Customer
        </Link>
      </div>
      <CustomersList customers={customers} jobs={jobs} />
    </div>
  );
}
