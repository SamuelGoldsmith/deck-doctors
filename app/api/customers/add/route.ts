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
        const customers = await request.json();
        console.log(customers);
        const values = customers.map((c: Customer) => [
            c.first_name,
            c.last_name,
            c.email,
            c.phone,
        ]);
        const result = await sql.query(
            `
        INSERT INTO customers (first_name, last_name, email, phone)
        VALUES ${values.map((_:any, i:number) =>
                `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
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