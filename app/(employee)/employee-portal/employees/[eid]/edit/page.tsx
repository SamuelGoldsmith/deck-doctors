import { EditEmployee } from "@/components/Forms";
import { getEmployeeById } from "@/lib/serverUtils";

export default async function EmployeeEditPage({ params }: { params: Promise<{ eid: number }> }) {
  const p = await params;
  const employee = await getEmployeeById(String(p.eid));
  return <EditEmployee employee={employee} />;
}
