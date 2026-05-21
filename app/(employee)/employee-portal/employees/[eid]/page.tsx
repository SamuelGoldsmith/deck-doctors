import { getEmployeeById } from "@/lib/serverUtils";
import { deleteEmployee } from "@/lib/utils";
import { Pencil, Trash } from "lucide-react";
export default async function EmployeeProfile({ params }: { params: Promise<{ eid: string }> }) {
  const p = await params;
  const employee = await getEmployeeById(p.eid);
  return (
    <main className="m-3 ">
      <div className="p-5 px-30">
        <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold mb-6">{employee.first_name} {employee.last_name}</h1>
        <a href={`/employee-portal/employees/${employee.eid}/edit`} className=" hover:underline">
          <Pencil className="cursor-pointer" />
          
        </a>
        {/* <Trash className="cursor-pointer" onClick={() => deleteEmployee(employee.eid)}/> */}
        </div>
        <p className="text-lg mb-4">{employee.description} - Rate: ${employee.rate}/hr</p>
        <div className="rounded-lg p-4 bg-secondary w-min min-w-1/4">
            <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
            <p>Email: {employee.email}</p>
            <p>Phone: {employee.phone}</p>
        </div>
      </div>
    </main>
  );
}
