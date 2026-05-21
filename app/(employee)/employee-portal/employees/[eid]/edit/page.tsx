import { EditEmployee } from "@/components/Forms";
import { getEmployeeById } from "@/lib/serverUtils";
import { Pencil } from "lucide-react";
export default async function EmployeeProfile({ params }: { params: { eid: number } }) {
  const p = await params;
  const employee = await getEmployeeById(String(p.eid));
  return (
    <main className="m-3 ">
      <div className="p-5">
        <EditEmployee employee={employee} />
      </div>
    </main>
  );
}
