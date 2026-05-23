import CustomerCard from "@/components/customerCard";
import { ExpenseTable } from "@/components/table";
import { getCustomerById, getEmployeeById, getEmployees, getExpensesByJobId, getHoursByJob, getJobById } from "@/lib/serverUtils";
import { Employee, Expense, Hour } from "@/lib/utils";
import { Pencil } from "lucide-react";

export default async function CustomerProfile({ params }: { params: Promise<{ cid: number }> }) {
  const p = await params;
  const customer = await getCustomerById(String(p.cid));
  
 
  if (!customer) {
    return (
      <main className="m-3 ">
        <div className="p-5 lg:px-30">
          <h1 className="text-4xl font-bold mb-6">Customer not found</h1>
        </div>
      </main>
    );
  }
  return (
    <main className="m-3 ">
      <CustomerCard customer={customer} />
    </main>
  );
}
