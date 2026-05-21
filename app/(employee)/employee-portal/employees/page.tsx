import Review from "@/components/review";
import SignInButton from "@/components/signin";
import {EmployeeTable} from "@/components/table";
import reviews from "@/data/reviews.json";
import { getEmployees } from "@/lib/serverUtils";
import { get } from "http";
export default async function EmployeesPortal() {
  const employees = await getEmployees();
  return (
    <main className="m-3 ">
      <div className="p-5 lg:px-30">
      <EmployeeTable employees={employees} />
      </div>
    </main>
  );
}
