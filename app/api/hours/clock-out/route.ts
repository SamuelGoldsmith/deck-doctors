// app/api/hours/clock-out/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { haversineMiles } from "@/lib/geo";

const sql = neon(process.env.DATABASE_URL!);

const MAX_DISTANCE_MILES = 1;

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "employee" || !session.user.eid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { latitude, longitude } = await request.json();
        const eid = session.user.eid;

        const open = await sql`
            SELECT * FROM hours WHERE eid = ${eid} AND clock_out_at IS NULL ORDER BY clock_in_at DESC LIMIT 1;
        `;
        if (open.length === 0) {
            return NextResponse.json({ error: "Not clocked in" }, { status: 400 });
        }
        const entry = open[0];

        const jobs = await sql`SELECT latitude, longitude FROM jobs WHERE jid = ${entry.jid};`;
        const job = jobs[0];

        let locationVerified: boolean | null = null;
        if (job?.latitude != null && job?.longitude != null) {
            const jobLat = Number(job.latitude);
            const jobLng = Number(job.longitude);

            const clockInOk =
                entry.clock_in_latitude != null &&
                entry.clock_in_longitude != null &&
                haversineMiles(jobLat, jobLng, Number(entry.clock_in_latitude), Number(entry.clock_in_longitude)) <= MAX_DISTANCE_MILES;

            const clockOutOk =
                latitude != null &&
                longitude != null &&
                haversineMiles(jobLat, jobLng, latitude, longitude) <= MAX_DISTANCE_MILES;

            locationVerified = clockInOk && clockOutOk;
        }

        const result = await sql`
            UPDATE hours
            SET clock_out_at = now(),
                clock_out_latitude = ${latitude},
                clock_out_longitude = ${longitude},
                location_verified = ${locationVerified},
                hours = ROUND(EXTRACT(EPOCH FROM (now() - clock_in_at)) / 3600, 2)
            WHERE hid = ${entry.hid}
            RETURNING *;
        `;
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
