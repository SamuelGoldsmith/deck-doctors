import Link from "next/link";
import { getEmployeeById } from "@/lib/serverUtils";
import { Avatar, Detail, InfoSection } from "@/components/ui/portal-section";
import { DeleteButton } from "@/components/portal/DeleteButton";

export default async function EmployeeProfile({ params }: { params: Promise<{ eid: number }> }) {
  const p = await params;
  const employee = await getEmployeeById(String(p.eid));

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Avatar firstName={employee.first_name} lastName={employee.last_name} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
          <h1 className="font-display text-h2 font-bold text-primary">
            {employee.first_name} {employee.last_name}
          </h1>
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <InfoSection title="Role">
          <Detail label="Hourly Rate">${Number(employee.rate).toFixed(2)}/hr</Detail>
        </InfoSection>

        {employee.description && (
          <InfoSection title="Notes">
            <p className="text-sm leading-relaxed text-foreground">{employee.description}</p>
          </InfoSection>
        )}

        <InfoSection title="Contact Information">
          <Detail label="Email">
            <a href={`mailto:${employee.email}`} style={{ color: "var(--color-link)" }}>
              {employee.email}
            </a>
          </Detail>
          <Detail label="Phone">
            <a href={`tel:${employee.phone}`} style={{ color: "var(--color-link)" }}>
              {employee.phone}
            </a>
          </Detail>
        </InfoSection>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/employee-portal/employees/${employee.eid}/edit`}
          className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Edit Employee
        </Link>
        <DeleteButton
          label="Delete Employee"
          confirmMessage="Are you sure you want to delete this employee? This action cannot be undone."
          endpoint="/api/employees/delete"
          body={{ eid: employee.eid }}
          redirectTo="/employee-portal/employees"
        />
      </div>
    </div>
  );
}
