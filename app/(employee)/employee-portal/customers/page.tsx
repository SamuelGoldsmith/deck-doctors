
import { CustomerTable, JobTable } from "@/components/table";
import { getCustomers, getEmployees, getJobs } from "@/lib/serverUtils";
import { Customer, Job } from "@/lib/utils";
import { get } from "http";
export default async function JobsPortal() {
  const customers = await getCustomers() as Customer[];
  const jobs = await getJobs() as Job[];
  return (
    <main className="m-3 ">
      <div className="p-5 lg:px-30">
        <CustomerTable customers={customers} jobs={jobs} />
      </div>
    </main>
  );
}
