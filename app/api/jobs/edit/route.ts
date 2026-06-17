// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Customer } from "@/lib/utils";
import { geocodeAddress } from "@/lib/geocode";

const sql = neon(process.env.DATABASE_URL!);

export async function POST( request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const job = await request.json();
        const coords = await geocodeAddress(job.address, job.city, job.state_abr);
        const result = await sql`UPDATE jobs SET cid = ${job.cid}, description = ${job.description}, quote_cost = ${job.quote_cost}, start_date = ${job.start_date}, end_date = ${job.end_date}, address = ${job.address}, city = ${job.city}, state_abr = ${job.state_abr}, completed = ${job.completed}, latitude = ${coords?.lat ?? null}, longitude = ${coords?.lng ?? null}, geocode_precision = ${coords?.precision ?? null} WHERE jid = ${job.jid} RETURNING *  ;`;
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}