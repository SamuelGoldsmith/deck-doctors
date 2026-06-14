
'use client';
import { addExpenses, deleteExpense, Expense, Job } from "@/lib/utils";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Plus, Trash, X } from "lucide-react";
import { useState } from "react";

export function ExpenseTable({ expenses, job }: { expenses: Expense[]; job: Job }) {
    const [addExpense, setAddExpense] = useState([] as Expense[]);
    const totalCost = expenses.reduce((total, expense) => total + Number(expense.cost), 0);
    const updateExpense = (exid: number, field: string, value: string | number) => {
        const expenseToUpdate = addExpense.find(e => e.exid === exid);
        if (!expenseToUpdate) return;
        if (field === "description") {
            expenseToUpdate.description = String(value);
        } else if (field === "cost") {
            expenseToUpdate.cost = Number(value);
        }
        setAddExpense([...addExpense.filter(e => e.exid !== exid), expenseToUpdate]);
    }
    const saveExpenses = async () => {
        addExpenses(addExpense);
        setAddExpense([]);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    return (
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Cost</TableHead>
                        {addExpense.length > 0 && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={`expense-${expense.exid}`}>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>${Number(expense.cost).toFixed(2)}</TableCell>
                            <TableCell>
                                {!expense.description?.includes("Labor") && (
                                    <button onClick={() => deleteExpense(expense.exid)} aria-label="Delete expense">
                                        <Trash className="h-4 w-4 hover:text-red-700" />
                                    </button>
                                )}
                            </TableCell>
                        </TableRow>))}
                    {addExpense.map((expense) => (
                        <TableRow key={expense.exid + "new"}>
                            <TableCell>
                                <input type="text" placeholder="Description" className="w-full bg-transparent focus:outline-none" defaultValue={expense.description ? expense.description : ""} onChange={(e) => updateExpense(expense.exid, "description", e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <input type="number" placeholder="Cost" className="w-full bg-transparent focus:outline-none" defaultValue={expense.cost ? expense.cost : 0} onChange={(e) => updateExpense(expense.exid, "cost", e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <button onClick={() => setAddExpense(addExpense.filter((e) => e.exid !== expense.exid))} aria-label="Remove">
                                    <X className="h-4 w-4" />
                                </button>
                            </TableCell>
                        </TableRow>),)}
                </TableBody>
                <TableCaption>
                    <div className="flex items-center justify-between px-2 pb-2">
                        <button
                            onClick={() => setAddExpense([...addExpense, { exid: Date.now(), jid: job.jid, cost: 0, description: "Enter description" }])}
                            className="flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add Expense
                        </button>
                        {addExpense.length > 0 && (
                            <button onClick={() => saveExpenses()} className="primary rounded-md px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-90">
                                Save
                            </button>
                        )}
                    </div>
                    Total Expenses: ${totalCost.toFixed(2)} &middot; Net: ${(Number(job.quote_cost) - totalCost).toFixed(2)}
                </TableCaption>
            </Table>
        </div>
    )
}
