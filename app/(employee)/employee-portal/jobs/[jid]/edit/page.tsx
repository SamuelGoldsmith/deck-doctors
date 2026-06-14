import Link from "next/link";
import { EditJob } from "@/components/Forms";
import { getCustomers, getJobById } from "@/lib/serverUtils";

export default async function JobEditPage({ params }: { params: Promise<{ jid: number }> }) {
  const p = await params;
  const job = await getJobById(String(p.jid));
  const customers = await getCustomers();

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

  return <EditJob job={job} customers={customers} />;
}
