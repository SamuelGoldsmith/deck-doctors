import { getSession, getHours, getJobs } from "@/lib/serverUtils";
import { hoursWorked } from "@/lib/utils";
import { ClockInOut, ChangePasswordForm } from "@/components/Forms";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table";

export default async function EmployeeGeneralPage() {
  const session = await getSession();
  const eid = session?.user?.eid;

  const [allHours, jobs] = await Promise.all([getHours(), getJobs()]);
  const myHours = allHours.filter((hour) => hour.eid === eid);
  const openEntry = myHours.find((hour) => hour.clock_in_at && !hour.clock_out_at) ?? null;
  const completedHours = myHours.filter((hour) => hour.clock_out_at);
  const totalAmount = completedHours.reduce((acc, hour) => acc + hoursWorked(hour) * hour.rate, 0);

  const formatTime = (value?: string | null) =>
    value ? new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "—";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
        <h1 className="font-display text-h2 font-bold text-primary">
          Welcome, {session?.user?.name}
        </h1>
        <p className="text-sm text-muted-foreground">Clock in and out, and manage your account below.</p>
      </div>

      <ClockInOut jobs={jobs} openEntry={openEntry} />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">My Hours</h2>
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedHours.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No hours logged yet.
                  </TableCell>
                </TableRow>
              ) : (
                completedHours.map((hour) => (
                  <TableRow key={`hour-${hour.hid}`}>
                    <TableCell>
                      {hour.date_worked ? new Date(hour.date_worked).toLocaleDateString() : "—"}
                      {hour.location_verified === false && (
                        <span title="Location not verified for this entry" className="ml-1">⚠</span>
                      )}
                    </TableCell>
                    <TableCell>{hour.address}</TableCell>
                    <TableCell>{formatTime(hour.clock_in_at)}</TableCell>
                    <TableCell>{formatTime(hour.clock_out_at)}</TableCell>
                    <TableCell>{hoursWorked(hour)}</TableCell>
                    <TableCell>${(hoursWorked(hour) * hour.rate).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableCaption>Total: ${totalAmount.toFixed(2)}</TableCaption>
          </Table>
        </div>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
