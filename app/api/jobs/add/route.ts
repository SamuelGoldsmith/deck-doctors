// app/api/jobs/add/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Job } from "@/lib/utils";
import { geocodeAddress } from "@/lib/geocode";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const jobs = await request.json();
        console.log(jobs);
        const values = await Promise.all(jobs.map(async (j: Job) => {
            const coords = await geocodeAddress(j.address, j.city, j.state_abr);
            return [
                j.address,
                j.city,
                j.state_abr,
                Number(j.cid),
                j.quote_cost !== null ? Number(j.quote_cost) : null,
                j.start_date,
                j.end_date,
                j.completed || false,
                j.description,
                coords?.lat ?? null,
                coords?.lng ?? null,
            ];
        }));
        const result = await sql.query(
            `
        INSERT INTO jobs (address, city, state_abr, cid, quote_cost, start_date, end_date, completed, description, latitude, longitude)
        VALUES ${values.map((_:any, i:number) =>
                `($${i * 11 + 1}, $${i * 11 + 2}, $${i * 11 + 3}, $${i * 11 + 4}, $${i * 11 + 5}, $${i * 11 + 6}, $${i * 11 + 7}, $${i * 11 + 8}, $${i * 11 + 9}, $${i * 11 + 10}, $${i * 11 + 11})`
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
