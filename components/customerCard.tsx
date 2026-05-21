import { Customer } from "@/lib/utils";

export default function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="rounded-lg p-4 bg-secondary w-min min-w-1/4">
      <h2 className="text-2xl font-semibold mb-2">{customer.first_name} {customer.last_name}</h2>
      <p>Email: {customer.email}</p>
      <p>Phone: {customer.phone}</p>
    </div>
  );
}