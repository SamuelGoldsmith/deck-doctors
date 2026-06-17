// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Customer } from "@/lib/utils";

const sql = neon(process.env.DATABASE_URL!);

const HOURS_COLUMNS = `
    hours.hid,
    hours.eid,
    hours.jid,
    hours.date_worked,
    hours.clock_in_at,
    hours.clock_out_at,
    hours.clock_in_latitude,
    hours.clock_in_longitude,
    hours.clock_out_latitude,
    hours.clock_out_longitude,
    hours.location_verified,
    employees.first_name,
    employees.last_name,
    employees.email,
    employees.phone,
    employees.rate,
    jobs.address,
    jobs.city,
    jobs.state_abr,
    jobs.cid,
    jobs.quote_cost,
    jobs.start_date,
    jobs.end_date,
    jobs.completed,
    jobs.description,
    jobs.latitude,
    jobs.longitude
`;

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const result = session.user.role === "employee"
            ? await sql.query(
                `SELECT ${HOURS_COLUMNS} FROM hours JOIN employees ON hours.eid = employees.eid JOIN jobs ON hours.jid = jobs.jid WHERE hours.eid = $1;`,
                [session.user.eid]
            )
            : await sql.query(
                `SELECT ${HOURS_COLUMNS} FROM hours JOIN employees ON hours.eid = employees.eid JOIN jobs ON hours.jid = jobs.jid;`
            );
        return NextResponse.json(result);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}