import Link from "next/link";
import CustomerCard from "@/components/customerCard";
import { ExpenseTable } from "@/components/table";
import { getEmployees, getExpensesByJobId, getHoursByJob, getJobById } from "@/lib/serverUtils";
import { Expense } from "@/lib/utils";
import { Detail, InfoSection, formatDate } from "@/components/ui/portal-section";
import { DeleteButton } from "@/components/portal/DeleteButton";

export default async function JobProfile({ params }: { params: Promise<{ jid: number }> }) {
  const p = await params;
  const job = await getJobById(String(p.jid));

  if (!job) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-2">
        <h1 className="font-display text-h2 font-bold text-primary">Job not found</h1>
        <Link href="/employee-portal/jobs" className="text-sm text-primary hover:underline">
          ← Back to jobs
        </Link>
      </div>
    );
  }

  let expenses = await getExpensesByJobId(String(p.jid));
  const hours = await getHoursByJob(String(p.jid));
  const employees = await getEmployees();
  const getRate = (eid: number) => employees.find((e) => e.eid === eid)?.rate || 0;

  // groups expenses by date summing costs
  const groupedHourlyExpense = [] as Expense[];
  hours.forEach((hour) => {
    const existing = groupedHourlyExpense.find((e) => e.description === "Labor" + hour.date_worked);
    if (existing) {
      existing.cost += hour.hours * getRate(hour.eid);
    } else {
      groupedHourlyExpense.push({
        exid: hour.eid + Math.random(),
        jid: hour.jid,
        cost: hour.hours * getRate(hour.eid),
        description: "Labor" + " " + new Date(hour.date_worked).toLocaleDateString(),
      } as Expense);
    }
  });

  expenses = [...expenses, ...groupedHourlyExpense];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
        <h1 className="font-display text-h2 font-bold text-primary">{job.address}</h1>
        <p className="text-sm text-muted-foreground">
          {job.city}, {job.state_abr}
        </p>
      </div>

      <div className="card space-y-4 p-6">
        {job.description && (
          <InfoSection title="Description">
            <p className="text-sm leading-relaxed text-foreground">{job.description}</p>
          </InfoSection>
        )}

        <InfoSection title="Job Details">
          <Detail label="Quote Cost">{job.quote_cost ? `$${Number(job.quote_cost).toLocaleString()}` : "—"}</Detail>
          <Detail label="Start Date">{job.start_date ? formatDate(job.start_date) : "N/A"}</Detail>
          <Detail label="End Date">{job.end_date ? formatDate(job.end_date) : "N/A"}</Detail>
          <Detail label="Status">
            <span
              className="rounded-full px-2 py-1 text-xs font-semibold"
              style={{
                backgroundColor: job.completed ? "#dcfce7" : "#dbeafe",
                color: job.completed ? "#166534" : "#1d6fa4",
              }}
            >
              {job.completed ? "Completed" : "In Progress"}
            </span>
          </Detail>
        </InfoSection>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Customer</h2>
        <CustomerCard customer={job.customer} />
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Expenses</h2>
        <ExpenseTable expenses={expenses} job={job} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/employee-portal/jobs/${job.jid}/edit`}
          className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Edit Job
        </Link>
        <DeleteButton
          label="Delete Job"
          confirmMessage="Are you sure you want to delete this job? This action cannot be undone."
          endpoint="/api/jobs/delete"
          body={{ jid: job.jid }}
          redirectTo="/employee-portal/jobs"
        />
      </div>
    </div>
  );
}
