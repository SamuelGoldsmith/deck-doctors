
'use client';
import { addCustomers, addEmployees, addExpenses, addJobs, Customer, deleteCustomer, deleteEmployee, deleteExpense, Employee, Expense, Job } from "@/lib/utils";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Pencil, Trash, Plus, Pen, Table2Icon, X, Link } from "lucide-react";
import { deleteJob } from "@/lib/utils";
import { useState } from "react";
import { add } from "date-fns";
export function EmployeeTable({ employees }: { employees: Employee[] }) {
    const [addEmployee, setAddEmployee] = useState([] as Employee[]);
    const updateEmployee = (eid: number, field: string, value: string | number) => {
        const employeeToUpdate = addEmployee.find(e => e.eid === eid);
        if (!employeeToUpdate) return;
        if (field === "first_name") {
            employeeToUpdate.first_name = String(value);
        } else if (field === "last_name") {
            employeeToUpdate.last_name = String(value);
        } else if (field === "email") {
            employeeToUpdate.email = String(value);
        } else if (field === "phone") {
            employeeToUpdate.phone = String(value);
        } else if (field === "rate") {
            employeeToUpdate.rate = Number(value);
        } else if (field === "description") {
            employeeToUpdate.description = String(value);
        }
        setAddEmployee([...addEmployee.filter(e => e.eid !== eid), employeeToUpdate]);
    }
    const saveEmployees = async () => {
        addEmployees(addEmployee);
        setAddEmployee([]);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    return (
        <div className="">
            <Table>
                <TableHeader>
                    <TableRow className="text-xl">
                        <TableHead className="">Name</TableHead>
                        <TableHead className="">Email</TableHead>
                        <TableHead>Phone</TableHead>
                        {/* <TableHead>Rate</TableHead> */}
                        <TableHead className="">Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee, i) => (
                        <TableRow key={`employee-${employee.eid}`} className={`${i % 2 == 0 ? 'bg-background hover:bg-secondary' : 'bg-secondary hover:bg-background'}`}>

                            <TableCell className="">
                                <a href={`/employee-portal/employees/${employee.eid}`} className="underline hover:underline">
                                    {employee.first_name} {employee.last_name}
                                </a>
                            </TableCell>
                            <TableCell className="">
                                <a href={`mailto:${employee.email}`} className="underline hover:underline">
                                    {employee.email}
                                </a>
                            </TableCell>
                            <TableCell className="">
                                <a href={`tel:${employee.phone}`} className="underline hover:underline">
                                    {employee.phone}
                                </a>
                            </TableCell>
                            {/* <TableCell className="">
                                {employee.rate}
                            </TableCell> */}
                            <TableCell className="">{employee.description}</TableCell>
                            <TableCell className="flex">
                                <button>
                                    <Pencil className="hover:text-primary mr-3" />
                                </button>
                                <button onClick={() => {
                                    deleteEmployee(employee.eid);
                                }}>
                                    <Trash className="hover:text-red-900" />
                                </button>
                            </TableCell>
                        </TableRow>))}
                    {addEmployee.map((employee) => (
                        <TableRow key={employee.eid + "new"} className={`${employees.length % 2 == 0 ? 'bg-background hover:bg-secondary' : 'bg-secondary hover:bg-background'}`}>
                            <TableCell className="">
                                <div className="flex gap-2">
                                    <input type="text" placeholder="First Name" className="w-1/2 bg-transparent focus:outline-none" defaultValue={employee.first_name ? employee.first_name : ""} onChange={(e) => updateEmployee(employee.eid, "first_name", e.target.value)} />
                                    <input type="text" placeholder="Last Name" className="w-1/2 bg-transparent focus:outline-none" defaultValue={employee.last_name ? employee.last_name : ""} onChange={(e) => updateEmployee(employee.eid, "last_name", e.target.value)} />
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <input type="text" placeholder="Email" className="w-full bg-transparent focus:outline-none" defaultValue={employee.email ? employee.email : ""} onChange={(e) => updateEmployee(employee.eid, "email", e.target.value)} />
                            </TableCell>
                            <TableCell className="">
                                <input type="text" placeholder="Phone" className="w-full bg-transparent focus:outline-none" defaultValue={employee.phone ? employee.phone : ""} onChange={(e) => updateEmployee(employee.eid, "phone", e.target.value)} />
                            </TableCell>
                            <TableCell className="">
                                <input type="number" placeholder="Rate" className="w-full bg-transparent focus:outline-none" step="0.01" defaultValue={employee.rate ? employee.rate : 0} onChange={(e) => updateEmployee(employee.eid, "rate", e.target.value)} />
                            </TableCell>
                            <TableCell className="">
                                <input type="text" placeholder="Description" className="w-full bg-transparent focus:outline-none" defaultValue={employee.description ? employee.description : ""} onChange={(e) => updateEmployee(employee.eid, "description", e.target.value)} />
                            </TableCell>
                            <X key={employee.eid + "remove"} className="cursor-pointer" onClick={() => setAddEmployee(addEmployee.filter((e) => e.eid !== employee.eid))} />
                        </TableRow>))}
                </TableBody>
                <div className="flex items-center mt-2" key="Modify">
                    <Plus className="" onClick={() => setAddEmployee([...addEmployee, { eid: Date.now(), first_name: "", last_name: "", email: "", phone: "", rate: 0, description: "" }])} />
                    {addEmployee.length > 0 && <button key="save" className="ml-3 bg-green-900 text-accent-foreground p-2 rounded-md hover:bg-green-700" onClick={() => { saveEmployees() }}>Save</button>}
                </div>
            </Table>
        </div>
    )
}

export function JobTable({ jobs, customers = [] }: { jobs: Job[]; customers?: Customer[] }) {
    const [addJob, setAddJob] = useState([] as Job[]);
    const updateJob = (jid: number, field: string, value: string | number) => {
        const jobToUpdate = addJob.find(j => j.jid === jid);
        if (!jobToUpdate) return;
        if (field === "address") {
            jobToUpdate.address = String(value);
        } else if (field === "city") {
            jobToUpdate.city = String(value);
        } else if (field === "state_abr") {
            jobToUpdate.state_abr = String(value);
        } else if (field === "cid") {
            jobToUpdate.cid = Number(value);
        } else if (field === "quote_cost") {
            jobToUpdate.quote_cost = Number(value);
        } else if (field === "description") {
            jobToUpdate.description = String(value);
        }
        setAddJob([...addJob.filter(j => j.jid !== jid), jobToUpdate]);
    }
    const saveJobs = async () => {
        addJobs(addJob);
        setAddJob([]);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    return (
        <div className="">
            <Table>
                <TableHeader>
                    <TableRow className="text-xl">
                        <TableHead className="">Job ID</TableHead>
                        <TableHead className="">Address</TableHead>
                        <TableHead className="">Customer</TableHead>
                        {/* <TableHead className="">Quote Cost</TableHead> */}
                        <TableHead>Description</TableHead>
                        {addJob.length > 0 && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {jobs.map((job, i) => (
                        <TableRow key={`job-${job.jid}`} className={`${i % 2 == 0 ? 'bg-background hover:bg-secondary' : 'bg-secondary hover:bg-background'}`}>
                            <TableCell className="">
                                <a href={`/employee-portal/jobs/${job.jid}`} className="underline hover:underline">
                                    {job.jid}
                                </a>
                            </TableCell>
                            <TableCell className="">
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${job.address}, ${job.city}, ${job.state_abr}`)}`} className="underline hover:underline">
                                    {job.address} {job.city}, {job.state_abr} [{job.jid}]
                                </a>
                            </TableCell>
                            <TableCell className="">
                                <a href={`/employee-portal/customers/${job.cid}`} className="underline hover:underline">
                                    {job.customer.first_name} {job.customer.last_name}
                                </a>
                            </TableCell>
                            {/* <TableCell className="">
                                ${job.quote_cost}
                            </TableCell> */}
                            <TableCell className="">{job.description}</TableCell>
                            <TableCell className="flex">
                                <a href={`/employee-portal/jobs/${job.jid}/edit`}>
                                    <Pencil className="hover:text-primary mr-3 " />
                                </a>
                                <button onClick={() => {
                                    deleteJob(job.jid);
                                }}>
                                    <Trash className="hover:text-red-900" />
                                </button>
                            </TableCell>
                        </TableRow>))}
                    {addJob.map((job) => (
                        <TableRow key={job.jid + "new"} className={`${jobs.length % 2 == 0 ? 'bg-background hover:bg-secondary' : 'bg-secondary hover:bg-background'}`}>
                            <TableCell className="">
                                <input type="text" placeholder="Auto-generated" className="w-full bg-transparent focus:outline-none" disabled />
                            </TableCell>
                            <TableCell className="">
                                <input type="text" placeholder="Address" className="w-1/4 bg-transparent focus:outline-none" defaultValue={job.address ? job.address : ""} onChange={(e) => updateJob(job.jid, "address", e.target.value)} />
                                <input type="text" placeholder="City" className="w-1/6 bg-transparent focus:outline-none" defaultValue={job.city ? job.city : ""} onChange={(e) => updateJob(job.jid, "city", e.target.value)} />
                                <input type="text" placeholder="ST" className="w-1/8 bg-transparent focus:outline-none" maxLength={2} defaultValue={job.state_abr ? job.state_abr : ""} onChange={(e) => updateJob(job.jid, "state_abr", e.target.value)} />
                            </TableCell>
                            <TableCell className="">
                                <div className="flex gap-2">

                                    <select className="bg-transparent focus:outline-none" value={job.cid} onChange={(e) => updateJob(job.jid, "cid", e.target.value)}>
                                        <option value="">Select Customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer.cid} value={customer.cid}>
                                                {customer.first_name} {customer.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <input type="number" placeholder="Quote Cost" className="w-full bg-transparent focus:outline-none" defaultValue={job.quote_cost ? job.quote_cost : 0} onChange={(e) => updateJob(job.jid, "quote_cost", e.target.value)} />
                            </TableCell>
                            <TableCell className="">
                                <input type="text" placeholder="Description" className="w-full bg-transparent focus:outline-none" defaultValue={job.description ? job.description : ""} onChange={(e) => updateJob(job.jid, "description", e.target.value)} />
                            </TableCell>
                            <X key={job.jid + "remove"} className="cursor-pointer" onClick={() => setAddJob(addJob.filter((j) => j.jid !== job.jid))} />
                        </TableRow>))}
                </TableBody>
                <div className="flex items-center mt-2" key="Modify">
                    <Plus className="" onClick={() => setAddJob([...addJob, { jid: Date.now(), address: "", city: "", state_abr: "", cid: 0, quote_cost: 0, start_date: null, end_date: null, completed: false, description: "", customer: {} as Customer }])} />
                    {addJob.length > 0 && <button key="save" className="ml-3 bg-green-900 text-accent-foreground p-2 rounded-md hover:bg-green-700" onClick={() => { saveJobs() }}>Save</button>}
                </div>
            </Table>
        </div>
    )
}

export function ExpenseTable({ expenses, job }: { expenses: Expense[]; job: Job }) {
    const [addExpense, setAddExpense] = useState([] as Expense[]);
    const totalCost = expenses.reduce((total, expense) => total + Number(expense.cost), 0);
    const updateExpense = (exid: number, field: string, value: string | number) => {
        const expenseToUpdate = addExpense.find(e => e.exid === exid);
        if (!expenseToUpdate) return;
        if (field === "description") {
            expenseToUpdate.description = String(value);
        } else if (field === "cost") {
            expenseToUpdate.cost = Number(value);
        }
        setAddExpense([...addExpense.filter(e => e.exid !== exid), expenseToUpdate]);
    }
    const saveExpenses = async () => {
        addExpenses(addExpense);
        setAddExpense([]);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    return (
        <div className="">
            <Table>
                <TableHeader>
                    <TableRow className="text-xl">
                        <TableHead className="">Description</TableHead>
                        <TableHead className="">Cost</TableHead>
                        {addExpense.length > 0 && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody className="w-10/11">
                    {expenses.map((expense, i) => (
                        <TableRow key={`expense-${expense.exid}`} className={`${i % 2 == 0 ? 'bg-background hover:bg-secondary' : 'bg-secondary hover:bg-background'}`}>
                            <TableCell className="">{expense.description}</TableCell>
                            <TableCell className="">${expense.cost}</TableCell>
                            <TableCell className=""> {!expense.description?.includes("Labor") && <Trash key={expense.exid + "delete"} onClick={() => deleteExpense(expense.exid)} />} </TableCell>
                        </TableRow>))}
                    {addExpense.map((expense) => (
                        <TableRow key={expense.exid + "new"} className={`${expenses.length % 2 == 0 ? 'bg-background hover:bg-secondary' : 'bg-secondary hover:bg-background'}`}>
                            <TableCell className="">
                                <input type="text" placeholder="Description" className="w-full bg-transparent focus:outline-none" defaultValue={expense.description ? expense.description : ""} onChange={(e) => updateExpense(expense.exid, "description", e.target.value)} />
                            </TableCell>
                            <TableCell className="">
                                <input type="number" placeholder="Cost" className="w-full bg-transparent focus:outline-none" defaultValue={expense.cost ? expense.cost : 0} onChange={(e) => updateExpense(expense.exid, "cost", e.target.value)} />
                            </TableCell>
                            <X key={expense.exid + "remove"} className="cursor-pointer" onClick={() => setAddExpense(addExpense.filter((e) => e.exid !== expense.exid))} />
                        </TableRow>),)}
                </TableBody>
                <div className="flex items-center mt-2" key="Modify">
                    <Plus className="" onClick={() => setAddExpense([...addExpense, { exid: Date.now(), jid: job.jid, cost: 0, description: "Enter description" }])} />
                    {addExpense.length > 0 && <button key="save" className="ml-3 bg-green-900 text-accent-foreground p-2 rounded-md hover:bg-green-700" onClick={() => { saveExpenses() }}>Save</button>}
                </div>
                <TableCaption>Total Expenses: ${totalCost.toFixed(2)}  Net: ${(Number(job.quote_cost) - totalCost).toFixed(2)}</TableCaption>
            </Table>

        </div>
    )
}

export function CustomerTable({ customers, jobs }: { customers: Customer[]; jobs: Job[] }) {
    const [addCustomer, setAddCustomer] = useState([] as Customer[]);
    const saveCustomers = async () => {
        addCustomers(addCustomer);
        setAddCustomer([]);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    return (
        <Table>
            <TableHeader>
                <TableRow className="text-xl">
                    <TableHead className="">Name</TableHead>
                    <TableHead className="">Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map((customer, i) => (
                    <TableRow key={`customer-${customer.cid}`} className={`${i % 2 == 0 ? 'bg-background hover:bg-secondary' : 'bg-secondary hover:bg-background'}`}>

                        <TableCell className="">
                            <a href={`/employee-portal/customers/${customer.cid}`} className="underline hover:underline">
                                {customer.first_name} {customer.last_name}
                            </a>
                        </TableCell>
                        <TableCell className="">
                            <a href={`mailto:${customer.email}`} className="underline hover:underline">
                                {customer.email}
                            </a>
                        </TableCell>
                        <TableCell className="">
                            <a href={`tel:${customer.phone}`} className="underline hover:underline">
                                {customer.phone}
                            </a>
                        </TableCell>
                        <TableCell className="">
                            {jobs.filter((job) => job.cid === customer.cid).map((job) => (
                                <a key={job.jid} href={`/employee-portal/jobs/${job.jid}`} className="underline hover:underline">
                                    [{job.jid}]
                                </a>
                            ))}
                        </TableCell>
                        <TableCell className="flex">
                            <Pencil className="hover:text-primary mr-3" onClick={() => {window.location.href = `/employee-portal/customers/${customer.cid}/edit`}} />
                            <Trash className="hover:text-red-900" onClick={() => { deleteCustomer(customer.cid) }} />
                        </TableCell>
                    </TableRow>))}
                {addCustomer.map((customer) => (
                    <TableRow key={customer.cid + "new"} className={`${customers.length % 2 == 0 ? 'bg-background hover:bg-secondary' : 'bg-secondary hover:bg-background'}`}>
                        <TableCell className="">
                            <input type="text" placeholder="First Name" className="bg-transparent focus:outline-none" defaultValue={customer.first_name ? customer.first_name : ""} onChange={(e) => setAddCustomer(addCustomer.map((c) => c.cid === customer.cid ? { ...c, first_name: e.target.value } : c))} />
                            <input type="text" placeholder="Last Name" className="bg-transparent focus:outline-none" defaultValue={customer.last_name ? customer.last_name : ""} onChange={(e) => setAddCustomer(addCustomer.map((c) => c.cid === customer.cid ? { ...c, last_name: e.target.value } : c))} />
                        </TableCell>
                        <TableCell className="">
                            <input type="text" placeholder="Email" className="w-full bg-transparent focus:outline-none" defaultValue={customer.email ? customer.email : ""} onChange={(e) => setAddCustomer(addCustomer.map((c) => c.cid === customer.cid ? { ...c, email: e.target.value } : c))} />
                        </TableCell>
                        <TableCell className="">
                            <input type="text" placeholder="Phone" className="w-full bg-transparent focus:outline-none" defaultValue={customer.phone ? customer.phone : ""} onChange={(e) => setAddCustomer(addCustomer.map((c) => c.cid === customer.cid ? { ...c, phone: e.target.value } : c))} />
                        </TableCell>
                        <TableCell className=""></TableCell>
                        <X key={customer.cid + "remove"} className="cursor-pointer" onClick={() => setAddCustomer(addCustomer.filter((c) => c.cid !== customer.cid))} />
                    </TableRow>),)}
            </TableBody>
            <div className="flex items-center mt-2" key="Modify">
                <Plus className="" onClick={() => setAddCustomer([...addCustomer, { cid: Date.now(), first_name: "", last_name: "", email: "", phone: "" }])} />
                {addCustomer.length > 0 && <button key="save" className="ml-3 bg-green-900 text-accent-foreground p-2 rounded-md hover:bg-green-700" onClick={() => { saveCustomers() }}>Save</button>}
            </div>
        </Table>
    )
}