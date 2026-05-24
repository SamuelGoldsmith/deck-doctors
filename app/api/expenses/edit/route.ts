// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Customer, Expense } from "@/lib/utils";

const sql = neon(process.env.DATABASE_URL!);

export async function POST( request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const expense  = await request.json()as Expense;
        const result = await sql`UPDATE expenses SET cost = ${expense.cost}, description = ${expense.description} WHERE exid = ${expense.exid} RETURNING *  ;`;
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}