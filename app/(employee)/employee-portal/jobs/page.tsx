
import { JobTable } from "@/components/table";
import { getEmployees, getJobs, getCustomers } from "@/lib/serverUtils";
import { Job, Customer } from "@/lib/utils";
import { get } from "http";
export default async function JobsPortal() {
  const jobs = await getJobs() as Job[];
  const customers = await getCustomers() as Customer[];
  return (
    <main className="m-3 ">
      <div className="p-5 lg:px-30">
        <JobTable jobs={jobs} customers={customers} />
      </div>
    </main>
  );
}
