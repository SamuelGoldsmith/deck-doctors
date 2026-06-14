import Link from "next/link";
import { QuickAddHours } from "@/components/Forms";
import { getEmployees, getJobs, getCustomers, getHours } from "@/lib/serverUtils";
import { StatCard } from "@/components/ui/stat-card";

export default async function EmployeesPortal() {
  const [employees, jobs, customers, hours] = await Promise.all([
    getEmployees(),
    getJobs(),
    getCustomers(),
    getHours(),
  ]);

  const activeJobs = jobs.filter((job) => !job.completed).length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const hoursThisWeek = hours
    .filter((hour) => new Date(hour.date_worked) >= oneWeekAgo)
    .reduce((sum, hour) => sum + Number(hour.hours), 0);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Deck Doctors
        </p>
        <h1 className="font-display text-h2 font-bold text-primary">Employee Portal</h1>
        <p className="text-sm text-muted-foreground">
          A quick look at your jobs, team, and hours.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active Jobs" value={activeJobs} href="/employee-portal/jobs" />
        <StatCard label="Customers" value={customers.length} href="/employee-portal/customers" />
        <StatCard label="Team Members" value={employees.length} href="/employee-portal/employees" />
        <StatCard
          label="Hours This Week"
          value={hoursThisWeek.toFixed(1)}
          href="/employee-portal/hours"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/employee-portal/jobs/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            + New Job
          </Link>
          <Link
            href="/employee-portal/customers/new"
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            + New Customer
          </Link>
          <Link
            href="/employee-portal/employees/new"
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            + New Employee
          </Link>
          <Link
            href="/employee-portal/hours"
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            View Hours
          </Link>
        </div>
      </div>

      <QuickAddHours />
    </div>
  );
}
