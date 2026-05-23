import { QuickAddHours } from "@/components/Forms";
import Review from "@/components/review";
import SignInButton from "@/components/signin";
import reviews from "@/data/reviews.json";
export default function EmployeesPortal() {

  return (
    <main className="m-3 ">
      <h1 className="text-4xl font-bold mb-6">Employee Portal</h1>

      
      <QuickAddHours />
    </main>
  );
}
