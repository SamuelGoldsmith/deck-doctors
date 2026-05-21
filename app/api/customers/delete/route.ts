// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Customer } from "@/lib/utils";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const {cid} = await request.json();
        const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const result = await sql`DELETE FROM customers WHERE cid = ${cid};`;
        return NextResponse.json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}