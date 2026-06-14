'use client'
import {
  addCustomers,
  addEmployees,
  addHours,
  addJobs,
  Customer,
  editCustomer,
  editEmployee,
  editJob,
  Employee,
  getEmployees,
  getJobs,
  Job,
} from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { DatePicker } from "./datePicker";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
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

export function EditJob({ job, customers }: { job?: Job; customers: Customer[] }) {
  const isNew = !job;
  const [obj, setObj] = useState<Job>(job ?? emptyJob);
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

export function EditEmployee({ employee }: { employee?: Employee }) {
  const isNew = !employee;
  const [obj, setObj] = useState<Employee>(employee ?? emptyEmployee);
  const [errors, setErrors] = useState<{ first_name?: string; last_name?: string; email?: string }>({});

  const saveChanges = async () => {
    const newErrors: typeof errors = {};
    if (!obj.first_name.trim()) newErrors.first_name = "First name is required";
    if (!obj.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!obj.email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const success = isNew ? await addEmployees([obj]) : await editEmployee(obj);
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
  const [hours, setHours] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dateWorked, setDateWorked] = useState<string>("");
  const [errors, setErrors] = useState<{ employee?: string; job?: string; hours?: string; date?: string }>({});
  const [saved, setSaved] = useState(false);

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
    if (!hours) newErrors.hours = "Enter hours worked";
    if (!dateWorked) newErrors.date = "Select a date";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const success = await addHours({
      hid: Date.now(),
      eid: selectedEmployee!.eid,
      jid: selectedJob!.jid,
      hours,
      date_worked: dateWorked,
    });

    if (success) {
      setHours(0);
      setSelectedEmployee(null);
      setSelectedJob(null);
      setDateWorked("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setErrors({ hours: "Failed to save. Please try again." });
    }
  };

  return (
    <div className="card space-y-4 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Add Hours</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <Field label="Hours" error={errors.hours} required>
          <input
            type="number"
            placeholder="0"
            value={hours || ""}
            onChange={(e) => setHours(e.target.value ? Number(e.target.value) : 0)}
            className={inputClass(!!errors.hours)}
          />
        </Field>

        <Field label="Date" error={errors.date} required>
          <input
            type="date"
            value={dateWorked}
            onChange={(e) => setDateWorked(e.target.value)}
            className={inputClass(!!errors.date)}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="primary rounded-md px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-90">
          Save Hours
        </button>
        {saved && <span className="text-sm font-medium text-green-700">Hours added ✓</span>}
      </div>
    </div>
  );
}
