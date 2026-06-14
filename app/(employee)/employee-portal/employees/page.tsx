import Link from "next/link";
import { EmployeesList } from "@/components/portal/EmployeesList";
import { getEmployees } from "@/lib/serverUtils";

export default async function EmployeesPortal() {
  const employees = await getEmployees();
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
          <h1 className="font-display text-h2 font-bold text-primary">Team Members</h1>
        </div>
        <Link
          href="/employee-portal/employees/new"
          className="primary rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          + Add Employee
        </Link>
      </div>
      <EmployeesList employees={employees} />
    </div>
  );
}
