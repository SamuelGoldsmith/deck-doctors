import Link from "next/link";
import { getCustomerById, getJobs } from "@/lib/serverUtils";
import { Avatar, Detail, InfoSection } from "@/components/ui/portal-section";
import { DeleteButton } from "@/components/portal/DeleteButton";

export default async function CustomerProfile({ params }: { params: Promise<{ cid: number }> }) {
  const p = await params;
  const customer = await getCustomerById(String(p.cid));

  if (!customer) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-2">
        <h1 className="font-display text-h2 font-bold text-primary">Customer not found</h1>
        <Link href="/employee-portal/customers" className="text-sm text-primary hover:underline">
          ← Back to customers
        </Link>
      </div>
    );
  }

  const jobs = (await getJobs()).filter((job) => job.cid === customer.cid);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Avatar firstName={customer.first_name} lastName={customer.last_name} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
          <h1 className="font-display text-h2 font-bold text-primary">
            {customer.first_name} {customer.last_name}
          </h1>
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <InfoSection title="Contact Information">
          <Detail label="Email">
            <a href={`mailto:${customer.email}`} style={{ color: "var(--color-link)" }}>
              {customer.email}
            </a>
          </Detail>
          <Detail label="Phone">
            <a href={`tel:${customer.phone}`} style={{ color: "var(--color-link)" }}>
              {customer.phone}
            </a>
          </Detail>
        </InfoSection>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs for this customer yet.</p>
        ) : (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <Link
                key={job.jid}
                href={`/employee-portal/jobs/${job.jid}`}
                className="card flex items-center justify-between gap-4 px-4 py-3 transition-shadow hover:shadow-md"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {job.address}, {job.city}, {job.state_abr}
                  </p>
                  {job.quote_cost ? (
                    <p className="text-xs text-muted-foreground">${Number(job.quote_cost).toLocaleString()}</p>
                  ) : null}
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: job.completed ? "#dcfce7" : "#dbeafe",
                    color: job.completed ? "#166534" : "#1d6fa4",
                  }}
                >
                  {job.completed ? "Completed" : "Active"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/employee-portal/customers/${customer.cid}/edit`}
          className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Edit Customer
        </Link>
        <DeleteButton
          label="Delete Customer"
          confirmMessage="Are you sure you want to delete this customer? Associated jobs will also be deleted."
          endpoint="/api/customers/delete"
          body={{ cid: customer.cid }}
          redirectTo="/employee-portal/customers"
        />
      </div>
    </div>
  );
}
