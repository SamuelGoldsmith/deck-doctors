// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAIL } from "@/lib/authOptions";
import { sendOnboardingEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { eid, first_name, last_name, email, phone, rate, description, username, password, sendOnboarding } = await request.json();
    const isAdmin = session.user.email === ADMIN_EMAIL;

    try {
        let result;
        if (isAdmin) {
            const newUsername = typeof username === "string" ? (username.trim() || null) : null;
            const hashedPassword = password ? await bcrypt.hash(password, 12) : null;
            result = await sql`
                UPDATE employees SET
                    first_name = ${first_name}, last_name = ${last_name}, email = ${email},
                    phone = ${phone}, rate = ${rate}, description = ${description},
                    username = ${newUsername},
                    password = COALESCE(${hashedPassword}, password)
                WHERE eid = ${eid} RETURNING *;`;
        } else {
            result = await sql`
                UPDATE employees SET
                    first_name = ${first_name}, last_name = ${last_name}, email = ${email},
                    phone = ${phone}, rate = ${rate}, description = ${description}
                WHERE eid = ${eid} RETURNING *;`;
        }

        const safe = result.map(({ password: _pw, ...rest }) => rest);

        try {
            if (isAdmin && sendOnboarding && username && password) {
                await sendOnboardingEmail({ to: email, first_name, username, password });
            }
        } catch (error) {
            console.error("Failed to send onboarding email:", error);
        }

        return NextResponse.json(safe);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
