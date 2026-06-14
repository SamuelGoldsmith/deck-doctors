'use client';

import { useState } from "react";
import Link from "next/link";
import { Customer, Job } from "@/lib/utils";
import { Avatar } from "@/components/ui/portal-section";

export function CustomersList({ customers, jobs }: { customers: Customer[]; jobs: Job[] }) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((customer) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(q) ||
      customer.last_name.toLowerCase().includes(q) ||
      (customer.email ?? "").toLowerCase().includes(q) ||
      (customer.phone ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search by name, email, or phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground"
      />

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No customers match your search.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((customer) => {
            const jobCount = jobs.filter((job) => job.cid === customer.cid).length;
            return (
              <Link
                key={customer.cid}
                href={`/employee-portal/customers/${customer.cid}`}
                className="card flex items-center gap-4 px-4 py-3 transition-shadow hover:shadow-md"
              >
                <Avatar firstName={customer.first_name} lastName={customer.last_name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {customer.first_name} {customer.last_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {customer.email}
                    {customer.phone ? ` · ${customer.phone}` : ""}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {jobCount} {jobCount === 1 ? "job" : "jobs"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
