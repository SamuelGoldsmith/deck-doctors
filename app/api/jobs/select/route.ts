// app/api/employees/route.ts
import { NextResponse, NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    try {
        const searchParams = request.nextUrl.searchParams;
        const jid = searchParams.get('jid');

        const result = await sql`SELECT * FROM jobs WHERE jid = ${jid};`;
        const customer = await sql`SELECT * FROM customers WHERE cid = (SELECT cid FROM jobs WHERE jid = ${jid});`;

        return NextResponse.json({ ...result[0], customer: { ...customer[0] } });
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}