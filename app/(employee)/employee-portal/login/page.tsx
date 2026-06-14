import { redirect } from "next/navigation";
import { getSession } from "@/lib/serverUtils";

export default async function EmployeeLoginPage() {
  const session = await getSession();

  if (session) {
    redirect(session.user.role === "employee" ? "/employee-portal/general" : "/employee-portal");
  }

  // Unauthenticated visitors are shown the login form by the portal layout.
  return null;
}
