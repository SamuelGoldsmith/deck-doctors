import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Session } from "next-auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Employee {
  eid: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  rate: number;
  description: string | null;
}

export interface Customer {
  cid: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
}

export interface Job {
  jid: number;
  address: string;
  city: string;
  state_abr: string; // Two-letter state abbreviation (e.g. "CT")
  cid: number; // Foreign key to Customer.cid
  quote_cost: number | null;
  start_date: string | null; // ISO date string: YYYY-MM-DD
  end_date: string | null;   // ISO date string: YYYY-MM-DD
  completed: boolean;
  description: string | null;
  customer: Customer; // Embedded customer details for easier access
}

export interface Hour {
  hid: number;
  eid: number; // Foreign key to Employee.eid
  jid: number; // Foreign key to Job.jid
  hours: number;
  date_worked: string; // ISO date string: YYYY-MM-DD
}
export interface hoursWithEmployeeAndJob extends Hour {
  jid: number;
  address: string;
  city: string;
  state_abr: string; 
  cid: number;
  quote_cost: number | null;
  start_date: string | null;
  end_date: string | null;   
  completed: boolean;
  description: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  eid: number;
  rate: number;
}

export interface Expense {
  exid: number;
  jid: number; // Foreign key to Job.jid
  description: string | null;
  cost: number;
}

export async function addJobs(jobs: Job[]) {
    const res = await fetch("/api/jobs/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobs),
    })
    return res.ok;
  }

  export async function deleteJob(jid: number) {
    if (
      confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      const res = await fetch("/api/jobs/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jid: jid }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete job.");
      }
    }
  }

  export async function addExpenses(expenses: Expense[]) {
    const res = await fetch("/api/expenses/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenses),
    })
    return res.ok;
  }

  export async function deleteExpense(exid: number) {
    const res = await fetch("/api/expenses/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exid }),
    });
    return res.ok;
  }

  export async function addEmployees(employees: Employee[]) {
    const res = await fetch("/api/employees/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employees),
    })
    return res.ok;
  }

  export async function deleteEmployee(eid: number) {
    if (
      confirm(
        "Are you sure you want to delete this employee? This action cannot be undone."
      )
    ) {
      const res = await fetch("/api/employees/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eid }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete employee.");
      }
    }
  }

  export async function addCustomers(customers: Customer[]) {
    const res = await fetch("/api/customers/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customers),
    })
    return res.ok;
  }

  export async function deleteCustomer(cid: number) {
        if (
      confirm(
        "Are you sure you want to delete this customer? Associated jobs will also be deleted."
      )
    ) { 
    const res = await fetch("/api/customers/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cid }),
    });
    return res.ok;
  }
}

export async function editEmployee(employee: Employee) {
    const res = await fetch("/api/employees/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    })
    return res.ok;
  }

export async function editCustomer(customer: Customer) {
    const res = await fetch("/api/customers/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })
    return res.ok;
  }

export async function editJob(job: Job) {
    const res = await fetch("/api/jobs/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    })
    return res.ok;
  }

  export async function addHours(hours: Hour) {
    const res = await fetch("/api/hours/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hours),
    })
    return res.ok;
  }

  export async function getEmployees(): Promise<Employee[]> {
    const res = await fetch("/api/employees/list");
    if (!res.ok) {
      throw new Error("Failed to fetch employees");
    }
    return res.json();
  }

  export async function getJobs(): Promise<Job[]> {
    const res = await fetch("/api/jobs/list");
    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return res.json();
  }

export type ApplicationStatus = "new" | "reviewing" | "interview" | "hired" | "rejected";
export type ApplicationPosition = "laborer" | "carpenter" | "painter";

export interface JobApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: ApplicationPosition;
  experience: string;
  availability: string;
  has_driving_license: boolean;
  message: string | null;
  status: ApplicationStatus;
  notes: string | null;
  submitted_at: string;
}

export interface JobApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: ApplicationPosition | "";
  experience: string;
  availability: string;
  hasDrivingLicense: string;
  message: string;
}

export async function submitApplication(application: JobApplicationInput) {
  const res = await fetch("/api/apply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  })
  return res.ok;
}

export async function getApplications(): Promise<JobApplication[]> {
  const res = await fetch("/api/applications");
  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }
  return res.json();
}

export async function updateApplicationStatus(id: number, status: ApplicationStatus) {
  const res = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
  return res.ok;
}

export async function updateApplicationNotes(id: number, notes: string) {
  const res = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  })
  return res.ok;
}

export type ServiceType = "restoration" | "new_build" | "repair" | "staining_sealing" | "inspection";
export type EstimateStatus = "new" | "reviewing" | "quoted" | "scheduled" | "won" | "lost";

export interface EstimateRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  service_type: ServiceType;
  message: string | null;
  status: EstimateStatus;
  notes: string | null;
  submitted_at: string;
}

export interface EstimateRequestInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  serviceType: ServiceType | "";
  message: string;
}

export async function submitEstimateRequest(estimate: EstimateRequestInput) {
  const res = await fetch("/api/estimate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(estimate),
  })
  return res.ok;
}

export async function getEstimateRequests(): Promise<EstimateRequest[]> {
  const res = await fetch("/api/estimates");
  if (!res.ok) {
    throw new Error("Failed to fetch estimate requests");
  }
  return res.json();
}

export async function updateEstimateStatus(id: number, status: EstimateStatus) {
  const res = await fetch(`/api/estimates/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
  return res.ok;
}

export async function updateEstimateNotes(id: number, notes: string) {
  const res = await fetch(`/api/estimates/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  })
  return res.ok;
}