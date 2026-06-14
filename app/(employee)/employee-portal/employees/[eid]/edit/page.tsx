import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAIL } from "@/lib/authOptions";
import { EditEmployee } from "@/components/Forms";
import { getEmployeeById } from "@/lib/serverUtils";

export default async function EmployeeEditPage({ params }: { params: Promise<{ eid: number }> }) {
  const p = await params;
  const employee = await getEmployeeById(String(p.eid));
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  return <EditEmployee employee={employee} isAdmin={isAdmin} />;
}
