import Link from "next/link";
import { JobsList } from "@/components/portal/JobsList";
import { getJobs } from "@/lib/serverUtils";

export default async function JobsPortal() {
  const jobs = await getJobs();
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
          <h1 className="font-display text-h2 font-bold text-primary">Jobs</h1>
        </div>
        <Link
          href="/employee-portal/jobs/new"
          className="primary rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          + Add Job
        </Link>
      </div>
      <JobsList jobs={jobs} />
    </div>
  );
}
