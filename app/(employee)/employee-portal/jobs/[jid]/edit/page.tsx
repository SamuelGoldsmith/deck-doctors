import CustomerCard from "@/components/customerCard";
import { CustomerSelect } from "@/components/customerSelect";
import { DatePicker } from "@/components/datePicker";
import { EditJob } from "@/components/Forms";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCustomers, getEmployeeById, getJobById } from "@/lib/serverUtils";
import { Label } from "@radix-ui/react-label";
import { get } from "http";
import { Check, Edit } from "lucide-react";


export default async function JobProfile({ params }: { params: { jid: number } }) { 
  const p = await params;
  const job = await getJobById(String(p.jid));
  const customers = await getCustomers();

  console.log(job);
  if (!job) {
    return (
      <main className="m-3 ">
        <div className="p-5 px-30">
          <h1 className="text-4xl font-bold mb-6">Job not found</h1>
        </div>
      </main>
    );
  }
  return (
    <main className="m-3 ">
      <EditJob job={job} customers={customers} />
      
    </main>
  );
}
