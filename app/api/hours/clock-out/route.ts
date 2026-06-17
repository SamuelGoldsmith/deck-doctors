// app/api/hours/clock-out/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { evaluateLocation, isLocationVerified } from "@/lib/locationVerification";
import type { GeocodePrecision } from "@/lib/geocode";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "employee" || !session.user.eid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { latitude, longitude, accuracy } = await request.json();
        const eid = session.user.eid;

        const open = await sql`
            SELECT * FROM hours WHERE eid = ${eid} AND clock_out_at IS NULL ORDER BY clock_in_at DESC LIMIT 1;
        `;
        if (open.length === 0) {
            return NextResponse.json({ error: "Not clocked in" }, { status: 400 });
        }
        const entry = open[0];

        const jobs = await sql`SELECT latitude, longitude, geocode_precision FROM jobs WHERE jid = ${entry.jid};`;
        const job = jobs[0];

        // Neon returns NUMERIC columns as strings; normalize everything that
        // feeds the geofence math to numbers (or null) at the boundary.
        const num = (v: unknown): number | null => (v == null ? null : Number(v));

        const status = evaluateLocation(
            {
                latitude: num(job?.latitude),
                longitude: num(job?.longitude),
                precision: (job?.geocode_precision ?? null) as GeocodePrecision | null,
            },
            {
                latitude: num(entry.clock_in_latitude),
                longitude: num(entry.clock_in_longitude),
                accuracyM: num(entry.clock_in_accuracy_m),
            },
            { latitude: num(latitude), longitude: num(longitude), accuracyM: num(accuracy) }
        );
        const locationVerified = isLocationVerified(status);

        const result = await sql`
            UPDATE hours
            SET clock_out_at = now(),
                clock_out_latitude = ${latitude},
                clock_out_longitude = ${longitude},
                clock_out_accuracy_m = ${accuracy ?? null},
                location_verified = ${locationVerified},
                location_status = ${status}
            WHERE hid = ${entry.hid}
            RETURNING *;
        `;
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
