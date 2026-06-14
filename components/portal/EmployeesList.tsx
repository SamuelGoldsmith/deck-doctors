'use client';

import { useState } from "react";
import Link from "next/link";
import { Employee } from "@/lib/utils";
import { Avatar } from "@/components/ui/portal-section";

export function EmployeesList({ employees }: { employees: Employee[] }) {
  const [search, setSearch] = useState("");

  const filtered = employees.filter((employee) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      employee.first_name.toLowerCase().includes(q) ||
      employee.last_name.toLowerCase().includes(q) ||
      employee.email.toLowerCase().includes(q) ||
      (employee.phone ?? "").toLowerCase().includes(q)
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
        <p className="py-10 text-center text-sm text-muted-foreground">No team members match your search.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((employee) => (
            <Link
              key={employee.eid}
              href={`/employee-portal/employees/${employee.eid}`}
              className="card flex items-center gap-4 px-4 py-3 transition-shadow hover:shadow-md"
            >
              <Avatar firstName={employee.first_name} lastName={employee.last_name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {employee.email}
                  {employee.phone ? ` · ${employee.phone}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium text-primary">${Number(employee.rate).toFixed(2)}/hr</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
