// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Customer, Expense } from "@/lib/utils";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const expenses = await request.json();
        console.log(expenses);
        const values = expenses.map((e: Expense) => [
            Number(e.jid),
            e.description,
            Number(e.cost),
        ]);
        const result = await sql.query(
            `
        INSERT INTO expenses (jid, description, cost)
        VALUES ${values.map((_:any, i:number) =>
                `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`
            ).join(", ")}
        RETURNING *;
        `,
            values.flat()
        );
        return NextResponse.json(result);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}