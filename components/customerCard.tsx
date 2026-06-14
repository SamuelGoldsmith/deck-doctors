import Link from "next/link";
import { Customer } from "@/lib/utils";
import { Detail } from "@/components/ui/portal-section";

export default function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="card space-y-2 p-4">
      <Link href={`/employee-portal/customers/${customer.cid}`} className="text-sm font-semibold text-primary hover:underline">
        {customer.first_name} {customer.last_name}
      </Link>
      <Detail label="Email">
        <a href={`mailto:${customer.email}`} style={{ color: "var(--color-link)" }}>
          {customer.email}
        </a>
      </Detail>
      <Detail label="Phone">
        <a href={`tel:${customer.phone}`} style={{ color: "var(--color-link)" }}>
          {customer.phone}
        </a>
      </Detail>
    </div>
  );
}
