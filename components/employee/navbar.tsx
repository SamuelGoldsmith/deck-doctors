import { getSession } from "@/lib/serverUtils";
import EmployeeNavbarClient from "@/components/employee/navbar-client";

export default async function Navbar() {
  const session = await getSession();

  return <EmployeeNavbarClient authenticated={!!session} role={session?.user?.role} />;
}
