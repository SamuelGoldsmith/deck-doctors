
import { EditCustomer } from "@/components/Forms";
import { getCustomerById } from "@/lib/serverUtils";
import { Edit } from "lucide-react";


export default async function JobProfile({ params }: { params: { cid: number } }) { 
  const p = await params;
  const customer = await getCustomerById(String(p.cid));

  if (!customer) {
    return (
      <main className="m-3 ">
        <div className="p-5 px-30">
          <h1 className="text-4xl font-bold mb-6">Customer not found</h1>
        </div>
      </main>
    );
  }
  return (
    <main className="m-3 ">
      <EditCustomer customer={customer} />
    </main>
  );
}
