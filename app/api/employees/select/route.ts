// app/api/employees/route.ts
import { NextResponse, NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const eid = searchParams.get('eid');
        const lastName = searchParams.get('lastName');
        const email = searchParams.get('email');

        const result = await 
        sql`SELECT * FROM employees WHERE eid = ${eid} OR last_name = ${lastName} OR email = ${email};`;
        return NextResponse.json(result);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}