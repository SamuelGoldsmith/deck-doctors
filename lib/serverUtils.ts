import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";
import { Customer, Employee, Expense, Hour, Job } from "./utils";
import { cookies } from "next/headers";

export async function getSession() {
    const session = await getServerSession(authOptions)
    return session
}

export async function getEmployees() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const employees = await fetch(`${process.env.NEXTAUTH_URL}/api/employees/list`, {
        headers: {
            Cookie: cookieHeader,
        },
    }).then((res) => res.json());
    return employees as Employee[];
}

export async function getEmployeeById(eid: string) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const employee = await fetch(`${process.env.NEXTAUTH_URL}/api/employees/select?eid=${eid}`, {
        headers: {
            Cookie: cookieHeader,
        },
    }).then((res) => res.json());
    return employee[0] as Employee;
}

export async function getEmployeeByLastName(lastName: string) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const employee = await fetch(`${process.env.NEXTAUTH_URL}/api/employees/select?lastName=${lastName}`, {
        headers: {
            Cookie: cookieHeader,
        },
    }).then((res) => res.json());
    return employee[0] as Employee;
}

export async function getEmployeeByEmail(email: string) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }
    const employee = await fetch(`${process.env.NEXTAUTH_URL}/api/employees/select?email=${email}`, {
        headers: {
            Cookie: cookieHeader,
        },
    }).then((res) => res.json());
    return employee[0] as Employee;
}

export async function getJobs() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const jobs = await fetch(`${process.env.NEXTAUTH_URL}/api/jobs/list`, {
        headers: {
            Cookie: cookieHeader,
        },
    }).then((res) => res.json());
    return jobs as Job[];
}

export async function deleteJob(jid: number) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    await fetch(`${process.env.NEXTAUTH_URL}/api/jobs/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeader,
        },
        body: JSON.stringify({ jid }),
    });
}

export async function getJobById(jid: string) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const job = await fetch(`${process.env.NEXTAUTH_URL}/api/jobs/select?jid=${jid}`, {
        headers: {
            Cookie: cookieHeader,
        },
    }).then((res) => res.json());
    return job as Job;
}

export async function getCustomers() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const customers = await fetch(`${process.env.NEXTAUTH_URL}/api/customers/list`, {
        headers: {
            Cookie: cookieHeader,
        },  
    }).then((res) => res.json());
    return customers as Customer[];
}

export async function getExpensesByJobId(jid: string) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const expenses = await fetch(`${process.env.NEXTAUTH_URL}/api/expenses/select?jid=${jid}`, {
        headers: {
            Cookie: cookieHeader,
        },  
    }).then((res) => res.json());
    return expenses as Expense[];
}

export async function getHoursByJob(jid: string) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const hours = await fetch(`${process.env.NEXTAUTH_URL}/api/hours/select/job?jid=${jid}`, {
        headers: {
            Cookie: cookieHeader,
        },
    }).then((res) => res.json());
    return hours as Hour[];
}

export async function getCustomerById(cid: string) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const customer = await fetch(`${process.env.NEXTAUTH_URL}/api/customers/select?cids=${cid}`, {
        headers: {
            Cookie: cookieHeader,
        },
    }).then((res) => res.json());
    return customer[0] as Customer;
}