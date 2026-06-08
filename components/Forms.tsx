'use client'
import { Customer, editCustomer, editEmployee, Employee, Job } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { DatePicker } from "./datePicker";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import { CustomerSelect } from "./customerSelect";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { Save } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { getEmployees, getJobs } from "@/lib/utils";


export function EditJob({ job, customers }: { job: Job, customers: Customer[] }) {
    const [obj, setObj] = useState(job);
    const setDate = (type: string, date: Date | undefined) => {
        setObj(prevObj => ({ ...prevObj, [type]: date }));
    }
    const saveChanges = () => {
        fetch("/api/jobs/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(obj),
        }).then(res => res.json())
            .then(data => {
                window.location.href = "/employee-portal/jobs/" + job.jid;
            }).catch(error => {
                console.error("Error saving changes:", error)
            });
    }
    return (
        <div className="p-5 px-30 w-200">
            <Label className="text-lg font-semibold mb-2">Customer</Label>
            <CustomerSelect customers={customers} initial={job.customer} onChange={(customer) => { setObj({ ...obj, customer: customer, cid: customer.cid }) }} />
            <Label className="text-lg font-semibold mb-2">Address</Label>
            <div className="flex mb-3" >
                <Input className="border-r-0 rounded-r-none" defaultValue={job.address} onChange={(e) => { setObj({ ...obj, address: e.target.value }) }} />
                <Input className="w-full border-x-0 rounded-none" defaultValue={job.city} onChange={(e) => { setObj({ ...obj, city: e.target.value }) }} />
                <Input className="w-full border-l-0 rounded-l-none" defaultValue={job.state_abr} onChange={(e) => { setObj({ ...obj, state_abr: e.target.value }) }} />

            </div>
            <Label className="text-lg font-semibold mb-2">Description</Label>
            <Input defaultValue={job.description ? job.description : ""} onChange={(e) => { setObj({ ...obj, description: e.target.value }) }} />
            <Label className="text-lg font-semibold mb-2">Quote Cost</Label>
            <Input defaultValue={job.quote_cost ? job.quote_cost : ""} type="number" onChange={(e) => { setObj({ ...obj, quote_cost: Number(e.target.value) }) }} />
            <Label className="text-lg font-semibold mb-2">Start Date</Label>
            <DatePicker dateInit={job.start_date ? new Date(job.start_date) : null} type="start_date" objSet={setDate} />
            <Label className="text-lg font-semibold mb-2">End Date (Optional)</Label>
            <DatePicker dateInit={job.end_date ? new Date(job.end_date) : null} type="end_date" objSet={setDate} />
            <input className="mt-4" type="checkbox" defaultChecked={obj.completed} onChange={(checked) => { setObj({ ...obj, completed: checked.target.checked }) }} /> <span className="ml-2">Mark job as completed</span>
            <br className="mb-3" />
            <button className="bg-green-900 text-accent-foreground p-2 rounded-md mr-3 hover:bg-green-700" onClick={() => saveChanges()}>
                Save Changes
            </button>
            <button className="bg-gray-300 text-primary p-2 rounded-md hover:bg-gray-400" onClick={() => console.log(obj)}>
                Cancel
            </button>
        </div>
    )
}

export function EditEmployee({ employee }: { employee: Employee }) {
    const [obj, setObj] = useState(employee);
    return (
        <div className="p-5 px-30 w-200">
            <Label className="text-lg font-semibold mb-2">First Name</Label>
            <Input defaultValue={employee.first_name} onChange={(e) => setObj({ ...obj, first_name: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Last Name</Label>
            <Input defaultValue={employee.last_name} onChange={(e) => setObj({ ...obj, last_name: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Email</Label>
            <Input defaultValue={employee.email} onChange={(e) => setObj({ ...obj, email: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Phone</Label>
            <Input defaultValue={employee.phone ?? ""} onChange={(e) => setObj({ ...obj, phone: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Rate</Label>
            <Input defaultValue={employee.rate ? String(employee.rate) : ""} type="number" onChange={(e) => setObj({ ...obj, rate: Number(e.target.value) })} />
            <Label className="text-lg font-semibold mb-2">Description</Label>
            <Input defaultValue={employee.description ? employee.description : ""} onChange={(e) => setObj({ ...obj, description: e.target.value })} />
            <Button className="mt-4" onClick={() => editEmployee(obj).then(success => {
                if (success) {
                    window.location.href = "/employee-portal/employees/" + obj.eid;
                } else {
                    alert("Failed to save changes");
                }})}>
                Save Changes
            </Button>
            <Link className="mt-4 ml-3" href={`/employee-portal/employees/${employee.eid}`}>
                Cancel
            </Link>
        </div>
    )
}

export function EditCustomer({ customer }: { customer: Customer }) {
    const [obj, setObj] = useState(customer);
    return (
        <div className="p-5 px-30 w-200">
            <Label className="text-lg font-semibold mb-2">First Name</Label>
            <Input defaultValue={customer.first_name} onChange={(e) => setObj({ ...obj, first_name: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Last Name</Label>
            <Input defaultValue={customer.last_name} onChange={(e) => setObj({ ...obj, last_name: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Email</Label>
            <Input defaultValue={customer.email ?? ""} onChange={(e) => setObj({ ...obj, email: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Phone</Label> 
            <Input defaultValue={customer.phone ?? ""} onChange={(e) => setObj({ ...obj, phone: e.target.value })} />
            <Button className="mt-4" onClick={() => {
                editCustomer(obj).then(success => {
                    if (success) {
                        window.location.href = "/employee-portal/customers/" + obj.cid;
                    } else {
                        alert("Failed to save changes");
                    }
                });
            }}>
                Save Changes
            </Button>
            <Link className="mt-4 ml-3" href={`/employee-portal/customers/${customer.cid}`}>
                Cancel
            </Link>
        </div>
    )
}

export function QuickAddHours() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [hours, setHours] = useState<number>(0);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [dateWorked, setDateWorked] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, jobRes] = await Promise.all([
                    getEmployees(),
                    getJobs()
                ]);
                setEmployees(empRes);
                setJobs(jobRes);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        if (!selectedEmployee || !selectedJob || !hours || !dateWorked) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const res = await fetch("/api/hours/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ employee_id: selectedEmployee.eid, job_id: selectedJob.jid, hours: hours, date_worked: dateWorked }),
            });

            if (res.ok) {
                setHours(0);
                setSelectedEmployee(null);
                setSelectedJob(null);
                setDateWorked("");
            } else {
                alert("Failed to add hours");
            }
        } catch (error) {
            console.error("Error saving hours:", error);
            alert("Error saving hours");
        }
    };

    const employeeToString = (employee: Employee) => `${employee.first_name} ${employee.last_name}`;
    const jobToString = (job: Job) => `${job.address}, ${job.city}, ${job.state_abr}`;

    return (
        <div className="bg-amber-900 p-5 rounded-lg shadow-md w-min border border-brown-500">
            <h2 className="text-2xl font-bold mb-6 text-accent-foreground">Quick Add Hours</h2>
            <div className="lg:flex items-end gap-2 ">
                <div>
                    <Label className="text-xs font-semibold text-white mb-1">Employee</Label>
                                        <div className="bg-amber-50 h-min w-min rounded-md">
                    <Combobox
                        items={employees}
                        itemToStringValue={employeeToString}
                        onValueChange={(value: any) => {
                            if (value) {
                                const employee = employees.find(e => employeeToString(e) === value);
                                setSelectedEmployee(employee || null);
                            }
                        }}
                    >
                        <ComboboxInput placeholder="Select employee" value={selectedEmployee ? employeeToString(selectedEmployee) : ""} className="bg-amber-50 text-black w-80" />
                        <ComboboxContent>
                            <ComboboxEmpty>No employees found.</ComboboxEmpty>
                            <ComboboxList>
                                {(employee: Employee) => (
                                    <ComboboxItem
                                        key={employee.eid}
                                        value={employeeToString(employee)}
                                    >
                                        {employeeToString(employee)}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                    </div>
                </div>

                <div className="">
                    <Label className="text-xs font-semibold text-white mb-1">Job</Label>
                    <div className="bg-amber-50 h-min w-min rounded-md">
                    <Combobox
                        items={jobs}
                        itemToStringValue={jobToString}
                        onValueChange={(value: any) => {
                            if (value) {
                                const job = jobs.find(j => jobToString(j) === value);
                                setSelectedJob(job || null);
                            }
                        }}
                    >
                        <ComboboxInput placeholder="Select job" value={selectedJob ? jobToString(selectedJob) : ""} className="bg-amber-50 text-black w-80" />
                        <ComboboxContent className="bg-amber-50 text-black w-80">
                            <ComboboxEmpty>No jobs found.</ComboboxEmpty>
                            <ComboboxList>
                                {(job: Job) => (
                                    <ComboboxItem
                                        key={job.jid}
                                        value={jobToString(job)}
                                    >
                                        {jobToString(job)}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                    </div>
                </div>
                                  <Label className="text-xs font-semibold text-white mb-1">Hours</Label>
                <input 
                    type="number" 
                    placeholder="Hours" 
                    value={hours || ""} 
                    onChange={(e) => setHours(e.target.value ? Number(e.target.value) : 0)}
                    className="border rounded-md p-2 mr-2 bg-amber-50 text-black" 
                />
                  <Label className="text-xs font-semibold text-white mb-1">Date</Label>
                <input 
                    type="date" 
                    value={dateWorked}
                    onChange={(e) => setDateWorked(e.target.value)}
                    className="border rounded-md p-2 mr-2 bg-amber-50 text-black" 
                />
                <button 
                    onClick={handleSave}
                    className="bg-green-900 text-accent-foreground p-2 rounded-md mr-3 hover:bg-green-700"
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export function EditEmployeeForm({ employee }: { employee: Employee }) {
    const [obj, setObj] = useState(employee);
    return (
        <div className="p-5 px-30 w-200">
            <Label className="text-lg font-semibold mb-2">First Name</Label>
            <Input defaultValue={employee.first_name} onChange={(e) => setObj({ ...obj, first_name: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Last Name</Label>
            <Input defaultValue={employee.last_name} onChange={(e) => setObj({ ...obj, last_name: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Email</Label>
            <Input defaultValue={employee.email} onChange={(e) => setObj({ ...obj, email: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Phone</Label>
            <Input defaultValue={employee.phone ?? ""} onChange={(e) => setObj({ ...obj, phone: e.target.value })} />
            <Label className="text-lg font-semibold mb-2">Rate</Label>
            <Input defaultValue={employee.rate ? String(employee.rate) : ""} type="number" onChange={(e) => setObj({ ...obj, rate: Number(e.target.value) })} />
            <Label className="text-lg font-semibold mb-2">Description</Label>
            <Input defaultValue={employee.description ? employee.description : ""} onChange={(e) => setObj({ ...obj, description: e.target.value })} />
            <Button className="mt-4" onClick={() => editEmployee(obj).then(success => {
                if (success) {
                    window.location.href = "/employee-portal/employees/" + obj.eid;
                } else {
                    alert("Failed to save changes");
                }})}>
                Save Changes
            </Button>
            <Link className="mt-4 ml-3" href={`/employee-portal/employees/${employee.eid}`}>
                Cancel
            </Link>
        </div>
    )
}