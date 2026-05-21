import CustomerCard from "@/components/customerCard";
import { ExpenseTable } from "@/components/table";
import { getEmployeeById, getEmployees, getExpensesByJobId, getHoursByJob, getJobById } from "@/lib/serverUtils";
import { Employee, Expense, Hour } from "@/lib/utils";
import { Pencil } from "lucide-react";

export default async function JobProfile({ params }: { params: { jid: number } }) {
  const p = await params;
  const job = await getJobById(String(p.jid));
  var expenses = await getExpensesByJobId(String(p.jid));
  const hours = await getHoursByJob(String(p.jid));
  const employees = await getEmployees();
  const getRate = (eid: number) => {return employees.find((e) => e.eid === eid)?.rate || 0 };
 //groups expenses by date summing costs
  const groupedHourlyExpense = [] as Expense[];
  hours.forEach(hour => {
    const existing = groupedHourlyExpense.find(e => e.description === "Labor" + hour.date_worked);
    if (existing) {
      existing.cost += hour.hours * getRate(hour.eid);
    } else {
      groupedHourlyExpense.push({"exid": hour.eid + Math.random(), "jid": hour.jid, "cost": hour.hours * getRate(hour.eid), "description": "Labor" + " " + new Date(hour.date_worked).toLocaleDateString()} as Expense);
    }
  });

  expenses = [...expenses, ...groupedHourlyExpense];
  if (!job) {
    return (
      <main className="m-3 ">
        <div className="p-5 px-30">
          <h1 className="text-4xl font-bold mb-6">Job not found</h1>
        </div>
      </main>
    );
  }
  return (
    <main className="m-3 ">
      <div className="p-5 px-30">
        <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold mb-6">{job.address} {job.city} {job.state_abr} [{job.jid}]</h1>
        <a href={`/employee-portal/jobs/${job.jid}/edit`}>
          <Pencil className="cursor-pointer" />
        </a>
        </div>
        <p className="text-lg mb-4">{job.description}</p>
        <CustomerCard customer={job.customer} />
        <p className="text-lg mt-4">Quote Cost: ${job.quote_cost}</p>
        <p className="text-lg mt-2">Start Date: {job.start_date ? new Date(job.start_date).toLocaleDateString() : "N/A"}</p>
        <p className="text-lg mt-2">End Date: {job.end_date ? new Date(job.end_date).toLocaleDateString() : "N/A"}</p>
        <p className="text-lg mt-2">Status: {job.completed ? "Completed" : "In Progress"}</p>
        
        <ExpenseTable expenses={expenses} job={job} /> 
      </div>
    </main>
  );
}
