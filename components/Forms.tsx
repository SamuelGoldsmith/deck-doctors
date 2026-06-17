'use client'
import {
  addCustomers,
  addEmployees,
  addHours,
  addJobs,
  changePassword,
  clockIn,
  clockOut,
  Customer,
  editCustomer,
  editEmployee,
  editJob,
  Employee,
  getEmployees,
  getJobs,
  hoursWithEmployeeAndJob,
  hoursWorked,
  Job,
} from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { DatePicker } from "./datePicker";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomerSelect } from "./customerSelect";
import Link from "next/link";
import { Field, inputClass } from "./ui/form-field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const emptyCustomer: Customer = { cid: 0, first_name: "", last_name: "", email: "", phone: "" };
const emptyJob: Job = {
  jid: 0,
  address: "",
  city: "",
  state_abr: "",
  cid: 0,
  quote_cost: null,
  start_date: null,
  end_date: null,
  completed: false,
  description: "",
  customer: emptyCustomer,
};
const emptyEmployee: Employee = { eid: 0, first_name: "", last_name: "", email: "", phone: "", rate: 0, description: "" };

export function EditJob({ job, customers, prefill }: { job?: Job; customers: Customer[]; prefill?: Partial<Job> }) {
  const isNew = !job;
  const [obj, setObj] = useState<Job>(job ?? { ...emptyJob, ...prefill });
  const [errors, setErrors] = useState<{ address?: string; cid?: string }>({});

  const setDate = (type: "start_date" | "end_date", date: Date | undefined) => {
    setObj((prev) => ({ ...prev, [type]: date ? date.toISOString().slice(0, 10) : null }));
  };

  const saveChanges = async () => {
    const newErrors: typeof errors = {};
    if (!obj.address.trim()) newErrors.address = "Address is required";
    if (!obj.cid) newErrors.cid = "Please select a customer";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const success = isNew ? await addJobs([obj]) : await editJob(obj);
    if (success) {
      window.location.href = isNew ? "/employee-portal/jobs" : "/employee-portal/jobs/" + obj.jid;
    } else {
      alert(isNew ? "Failed to add job." : "Failed to save changes.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
        <h1 className="font-display text-h2 font-bold text-primary">{isNew ? "Add Job" : "Edit Job"}</h1>
      </div>

      <div className="card space-y-4 p-6">
        <Field label="Customer" error={errors.cid} required>
          <CustomerSelect
            customers={customers}
            initial={obj.cid ? obj.customer : undefined}
            onChange={(customer) => setObj((prev) => ({ ...prev, customer, cid: customer.cid }))}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_1fr]">
          <Field label="Address" error={errors.address} required>
            <input
              className={inputClass(!!errors.address)}
              value={obj.address}
              onChange={(e) => setObj((prev) => ({ ...prev, address: e.target.value }))}
            />
          </Field>
          <Field label="City">
            <input
              className={inputClass(false)}
              value={obj.city}
              onChange={(e) => setObj((prev) => ({ ...prev, city: e.target.value }))}
            />
          </Field>
          <Field label="State">
            <input
              className={inputClass(false)}
              value={obj.state_abr}
              onChange={(e) => setObj((prev) => ({ ...prev, state_abr: e.target.value }))}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            rows={3}
            className={inputClass(false, "resize-none")}
            value={obj.description ?? ""}
            onChange={(e) => setObj((prev) => ({ ...prev, description: e.target.value }))}
          />
        </Field>

        <Field label="Quote Cost">
          <input
            type="number"
            className={inputClass(false)}
            value={obj.quote_cost ?? ""}
            onChange={(e) => setObj((prev) => ({ ...prev, quote_cost: e.target.value ? Number(e.target.value) : null }))}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Start Date">
            <DatePicker dateInit={obj.start_date ? new Date(obj.start_date) : null} type="start_date" objSet={setDate} />
          </Field>
          <Field label="End Date (Optional)">
            <DatePicker dateInit={obj.end_date ? new Date(obj.end_date) : null} type="end_date" objSet={setDate} />
          </Field>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="job-completed"
            checked={obj.completed}
            onCheckedChange={(checked) => setObj((prev) => ({ ...prev, completed: checked === true }))}
          />
          <Label htmlFor="job-completed" className="text-sm font-medium">
            Mark job as completed
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={saveChanges} className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90">
          Save Changes
        </button>
        <Link
          href={isNew ? "/employee-portal/jobs" : `/employee-portal/jobs/${job.jid}`}
          className="rounded-md border border-border px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

export function EditEmployee({ employee, isAdmin = false }: { employee?: Employee; isAdmin?: boolean }) {
  const isNew = !employee;
  const [obj, setObj] = useState<Employee>(employee ?? emptyEmployee);
  const [password, setPassword] = useState("");
  const [sendOnboarding, setSendOnboarding] = useState(false);
  const [errors, setErrors] = useState<{ first_name?: string; last_name?: string; email?: string; onboarding?: string }>({});

  const saveChanges = async () => {
    const newErrors: typeof errors = {};
    if (!obj.first_name.trim()) newErrors.first_name = "First name is required";
    if (!obj.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!obj.email.trim()) newErrors.email = "Email is required";
    if (sendOnboarding && (!obj.username?.trim() || !password.trim())) {
      newErrors.onboarding = "Username and a new password are required to send the onboarding email";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = isAdmin
      ? { ...obj, password, sendOnboarding }
      : { ...obj, sendOnboarding: false };
    const success = isNew ? await addEmployees([payload]) : await editEmployee(payload);
    if (success) {
      window.location.href = isNew ? "/employee-portal/employees" : "/employee-portal/employees/" + obj.eid;
    } else {
      alert(isNew ? "Failed to add employee." : "Failed to save changes.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
        <h1 className="font-display text-h2 font-bold text-primary">{isNew ? "Add Employee" : "Edit Employee"}</h1>
      </div>

      <div className="card space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First Name" error={errors.first_name} required>
            <input
              className={inputClass(!!errors.first_name)}
              value={obj.first_name}
              onChange={(e) => setObj((prev) => ({ ...prev, first_name: e.target.value }))}
            />
          </Field>
          <Field label="Last Name" error={errors.last_name} required>
            <input
              className={inputClass(!!errors.last_name)}
              value={obj.last_name}
              onChange={(e) => setObj((prev) => ({ ...prev, last_name: e.target.value }))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" error={errors.email} required>
            <input
              type="email"
              className={inputClass(!!errors.email)}
              value={obj.email}
              onChange={(e) => setObj((prev) => ({ ...prev, email: e.target.value }))}
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              className={inputClass(false)}
              value={obj.phone ?? ""}
              onChange={(e) => setObj((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </Field>
        </div>

        <Field label="Hourly Rate ($)">
          <input
            type="number"
            className={inputClass(false)}
            value={obj.rate || ""}
            onChange={(e) => setObj((prev) => ({ ...prev, rate: e.target.value ? Number(e.target.value) : 0 }))}
          />
        </Field>

        <Field label="Role / Notes">
          <textarea
            rows={3}
            className={inputClass(false, "resize-none")}
            value={obj.description ?? ""}
            onChange={(e) => setObj((prev) => ({ ...prev, description: e.target.value }))}
          />
        </Field>

        {isAdmin && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Username">
                <input
                  className={inputClass(false)}
                  value={obj.username ?? ""}
                  onChange={(e) => setObj((prev) => ({ ...prev, username: e.target.value }))}
                  autoComplete="off"
                />
              </Field>
              <Field label="New Password">
                <input
                  type="password"
                  className={inputClass(false)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  autoComplete="new-password"
                />
              </Field>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="send-onboarding"
                checked={sendOnboarding}
                onCheckedChange={(checked) => setSendOnboarding(checked === true)}
              />
              <Label htmlFor="send-onboarding" className="text-sm font-medium">
                Send onboarding email
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Emails the employee their portal login info (username and password). Requires a username and a new password to be set above.
            </p>
            {errors.onboarding && (
              <p className="text-xs text-red-500">{errors.onboarding}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={saveChanges} className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90">
          Save Changes
        </button>
        <Link
          href={isNew ? "/employee-portal/employees" : `/employee-portal/employees/${employee.eid}`}
          className="rounded-md border border-border px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

export function EditCustomer({ customer }: { customer?: Customer }) {
  const isNew = !customer;
  const [obj, setObj] = useState<Customer>(customer ?? emptyCustomer);
  const [errors, setErrors] = useState<{ first_name?: string; last_name?: string }>({});

  const saveChanges = async () => {
    const newErrors: typeof errors = {};
    if (!obj.first_name.trim()) newErrors.first_name = "First name is required";
    if (!obj.last_name.trim()) newErrors.last_name = "Last name is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const success = isNew ? await addCustomers([obj]) : await editCustomer(obj);
    if (success) {
      window.location.href = isNew ? "/employee-portal/customers" : "/employee-portal/customers/" + obj.cid;
    } else {
      alert(isNew ? "Failed to add customer." : "Failed to save changes.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
        <h1 className="font-display text-h2 font-bold text-primary">{isNew ? "Add Customer" : "Edit Customer"}</h1>
      </div>

      <div className="card space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First Name" error={errors.first_name} required>
            <input
              className={inputClass(!!errors.first_name)}
              value={obj.first_name}
              onChange={(e) => setObj((prev) => ({ ...prev, first_name: e.target.value }))}
            />
          </Field>
          <Field label="Last Name" error={errors.last_name} required>
            <input
              className={inputClass(!!errors.last_name)}
              value={obj.last_name}
              onChange={(e) => setObj((prev) => ({ ...prev, last_name: e.target.value }))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email">
            <input
              type="email"
              className={inputClass(false)}
              value={obj.email ?? ""}
              onChange={(e) => setObj((prev) => ({ ...prev, email: e.target.value }))}
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              className={inputClass(false)}
              value={obj.phone ?? ""}
              onChange={(e) => setObj((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </Field>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={saveChanges} className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90">
          Save Changes
        </button>
        <Link
          href={isNew ? "/employee-portal/customers" : `/employee-portal/customers/${customer.cid}`}
          className="rounded-md border border-border px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

export function QuickAddHours() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dateWorked, setDateWorked] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [errors, setErrors] = useState<{ employee?: string; job?: string; date?: string; start?: string; end?: string }>({});
  const [saved, setSaved] = useState(false);

  // Live preview of the duration that will be saved (hours are derived from
  // start/end, never entered or stored directly).
  const previewHours =
    dateWorked && startTime && endTime
      ? hoursWorked({
          clock_in_at: new Date(`${dateWorked}T${startTime}`).toISOString(),
          clock_out_at: new Date(`${dateWorked}T${endTime}`).toISOString(),
        })
      : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, jobRes] = await Promise.all([getEmployees(), getJobs()]);
        setEmployees(empRes);
        setJobs(jobRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const employeeToString = (employee: Employee) => `${employee.first_name} ${employee.last_name}`;
  const jobToString = (job: Job) => `${job.address}, ${job.city}, ${job.state_abr}`;

  const handleSave = async () => {
    const newErrors: typeof errors = {};
    if (!selectedEmployee) newErrors.employee = "Select an employee";
    if (!selectedJob) newErrors.job = "Select a job";
    if (!dateWorked) newErrors.date = "Select a date";
    if (!startTime) newErrors.start = "Enter a start time";
    if (!endTime) newErrors.end = "Enter an end time";
    if (dateWorked && startTime && endTime) {
      const start = new Date(`${dateWorked}T${startTime}`);
      const end = new Date(`${dateWorked}T${endTime}`);
      if (end <= start) newErrors.end = "End must be after start";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const success = await addHours({
      eid: selectedEmployee!.eid,
      jid: selectedJob!.jid,
      date_worked: dateWorked,
      clock_in_at: new Date(`${dateWorked}T${startTime}`).toISOString(),
      clock_out_at: new Date(`${dateWorked}T${endTime}`).toISOString(),
    });

    if (success) {
      setSelectedEmployee(null);
      setSelectedJob(null);
      setDateWorked("");
      setStartTime("");
      setEndTime("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setErrors({ end: "Failed to save. Please try again." });
    }
  };

  return (
    <div className="card space-y-4 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Add Hours</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Employee" error={errors.employee} required>
          <Combobox
            items={employees}
            itemToStringValue={employeeToString}
            onValueChange={(value: any) => {
              if (value) {
                const employee = employees.find((e) => employeeToString(e) === value);
                setSelectedEmployee(employee || null);
              }
            }}
          >
            <ComboboxInput
              placeholder="Select employee"
              value={selectedEmployee ? employeeToString(selectedEmployee) : ""}
              className="w-full"
            />
            <ComboboxContent>
              <ComboboxEmpty>No employees found.</ComboboxEmpty>
              <ComboboxList>
                {(employee: Employee) => (
                  <ComboboxItem key={employee.eid} value={employeeToString(employee)}>
                    {employeeToString(employee)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        <Field label="Job" error={errors.job} required>
          <Combobox
            items={jobs}
            itemToStringValue={jobToString}
            onValueChange={(value: any) => {
              if (value) {
                const job = jobs.find((j) => jobToString(j) === value);
                setSelectedJob(job || null);
              }
            }}
          >
            <ComboboxInput
              placeholder="Select job"
              value={selectedJob ? jobToString(selectedJob) : ""}
              className="w-full"
            />
            <ComboboxContent>
              <ComboboxEmpty>No jobs found.</ComboboxEmpty>
              <ComboboxList>
                {(job: Job) => (
                  <ComboboxItem key={job.jid} value={jobToString(job)}>
                    {jobToString(job)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        <Field label="Date" error={errors.date} required>
          <input
            type="date"
            value={dateWorked}
            onChange={(e) => setDateWorked(e.target.value)}
            className={inputClass(!!errors.date)}
          />
        </Field>

        <Field label="Start Time" error={errors.start} required>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass(!!errors.start)}
          />
        </Field>

        <Field label="End Time" error={errors.end} required>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClass(!!errors.end)}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90">
          Save Hours
        </button>
        {previewHours > 0 && (
          <span className="text-sm text-muted-foreground">= {previewHours} {previewHours === 1 ? "hour" : "hours"}</span>
        )}
        {saved && <span className="text-sm font-medium text-green-700">Hours added ✓</span>}
      </div>
    </div>
  );
}

export function ClockInOut({ jobs, openEntry }: { jobs: Job[]; openEntry: hoursWithEmployeeAndJob | null }) {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const jobToString = (job: Job) => `${job.address}, ${job.city}, ${job.state_abr}`;

  const ACCURACY_THRESHOLD_METERS = 100;

  const getPosition = (timeoutMs: number): Promise<{ latitude: number | null; longitude: number | null; accuracy: number | null }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null, accuracy: null });
        return;
      }
      const timeout = setTimeout(() => resolve({ latitude: null, longitude: null, accuracy: null }), timeoutMs);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeout);
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy });
        },
        () => {
          clearTimeout(timeout);
          resolve({ latitude: null, longitude: null, accuracy: null });
        },
        { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 }
      );
    });
  };

  // GPS can be "cold" on the first request and only return a coarse
  // network-based fix. If the first reading is low-accuracy, wait briefly
  // for the GPS chip to warm up and try once more, keeping the better fix.
  const getLocation = async (): Promise<{ latitude: number | null; longitude: number | null; accuracy: number | null }> => {
    const first = await getPosition(15000);
    if (first.accuracy != null && first.accuracy <= ACCURACY_THRESHOLD_METERS) {
      return first;
    }

    await new Promise((r) => setTimeout(r, 3000));
    const second = await getPosition(10000);

    if (second.accuracy == null) return first;
    if (first.accuracy == null) return second;
    return second.accuracy <= first.accuracy ? second : first;
  };

  const handleClockIn = async () => {
    if (!selectedJob) {
      setError("Select a job");
      return;
    }
    setError("");
    setLoading(true);
    const { latitude, longitude } = await getLocation();
    const success = await clockIn({ jid: selectedJob.jid, latitude, longitude });
    setLoading(false);
    if (success) {
      router.refresh();
    } else {
      setError("Failed to clock in. Please try again.");
    }
  };

  const handleClockOut = async () => {
    setError("");
    setLoading(true);
    const { latitude, longitude } = await getLocation();
    const success = await clockOut({ latitude, longitude });
    setLoading(false);
    if (success) {
      router.refresh();
    } else {
      setError("Failed to clock out. Please try again.");
    }
  };

  if (openEntry) {
    const since = openEntry.clock_in_at
      ? new Date(openEntry.clock_in_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : "";

    return (
      <div className="card space-y-4 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Clock In / Out</h2>
        <p className="text-sm text-foreground">
          Clocked in at <span className="font-semibold">{openEntry.address}, {openEntry.city}, {openEntry.state_abr}</span> since {since}.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClockOut}
            disabled={loading}
            className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Clocking out…" : "Clock Out"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Clocking out shares your location with Deck Doctors to confirm you're at the job site.
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-4 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Clock In / Out</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Job" error={error || undefined} required>
          <Combobox
            items={jobs}
            itemToStringValue={jobToString}
            onValueChange={(value: any) => {
              if (value) {
                const job = jobs.find((j) => jobToString(j) === value);
                setSelectedJob(job || null);
              }
            }}
          >
            <ComboboxInput
              placeholder="Select job"
              value={selectedJob ? jobToString(selectedJob) : ""}
              className="w-full"
            />
            <ComboboxContent>
              <ComboboxEmpty>No jobs found.</ComboboxEmpty>
              <ComboboxList>
                {(job: Job) => (
                  <ComboboxItem key={job.jid} value={jobToString(job)}>
                    {jobToString(job)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleClockIn}
          disabled={loading}
          className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Clocking in…" : "Clock In"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Clocking in shares your location with Deck Doctors to confirm you're at the job site.
      </p>
    </div>
  );
}

export function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const ok = await changePassword(newPassword);
    setLoading(false);

    if (ok) {
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="card space-y-4 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="New Password" required>
            <input
              type="password"
              className={inputClass(!!error)}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm Password" error={error || undefined} required>
            <input
              type="password"
              className={inputClass(!!error)}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Update Password"}
          </button>
          {success && <span className="text-sm font-medium text-green-700">Password updated ✓</span>}
        </div>
      </form>
    </div>
  );
}
