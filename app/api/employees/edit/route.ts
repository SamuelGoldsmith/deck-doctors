// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { eid, first_name, last_name, email, phone, rate, description } = await request.json();
    try {
        const result = await sql`UPDATE employees SET first_name = ${first_name}, last_name = ${last_name}, email = ${email}, phone = ${phone}, rate = ${rate}, description = ${description} WHERE eid = ${eid} RETURNING *;`;
        return NextResponse.json(result);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}