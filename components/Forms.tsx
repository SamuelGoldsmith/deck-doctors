'use client'
import { Customer, editCustomer, editEmployee, Employee, Job } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { DatePicker } from "./datePicker";
import { Label } from "./ui/label";
import { useState } from "react";
import { CustomerSelect } from "./customerSelect";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { Save } from "lucide-react";


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
                window.location.href = "/employee-portal/jobs/" + data.jid;
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
