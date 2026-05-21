// app/api/employees/add/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Employee } from "@/lib/utils";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const employees = await request.json();
        console.log(employees);
        const values = employees.map((e: Employee) => [
            e.first_name,
            e.last_name,
            e.email,
            e.phone,
            Number(e.rate),
            e.description,
        ]);
        const result = await sql.query(
            `
        INSERT INTO employees (first_name, last_name, email, phone, rate, description)
        VALUES ${values.map((_:any, i:number) =>
                `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`
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
