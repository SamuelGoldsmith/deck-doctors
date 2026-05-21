// app/api/jobs/add/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Job } from "@/lib/utils";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const jobs = await request.json();
        console.log(jobs);
        const values = jobs.map((j: Job) => [
            j.address,
            j.city,
            j.state_abr,
            Number(j.cid),
            j.quote_cost !== null ? Number(j.quote_cost) : null,
            j.start_date,
            j.end_date,
            j.completed || false,
            j.description,
        ]);
        const result = await sql.query(
            `
        INSERT INTO jobs (address, city, state_abr, cid, quote_cost, start_date, end_date, completed, description)
        VALUES ${values.map((_:any, i:number) =>
                `($${i * 9 + 1}, $${i * 9 + 2}, $${i * 9 + 3}, $${i * 9 + 4}, $${i * 9 + 5}, $${i * 9 + 6}, $${i * 9 + 7}, $${i * 9 + 8}, $${i * 9 + 9})`
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
