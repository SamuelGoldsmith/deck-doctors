// app/api/employees/add/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_EMAIL } from "@/lib/authOptions";
import { sendOnboardingEmail } from "@/lib/email";
import { Employee, EmployeeAdminFields } from "@/lib/utils";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const isAdmin = session.user.email === ADMIN_EMAIL;
    try {
        const employees: (Employee & Partial<EmployeeAdminFields>)[] = await request.json();
        const values = employees.map((e) => [
            e.first_name,
            e.last_name,
            e.email,
            e.phone,
            Number(e.rate),
            e.description,
        ]);
        const result = await sql.query(
            `
        INSERT INTO employees (first_name, last_name, email, phone, rate, description)
        VALUES ${values.map((_:any, i:number) =>
                `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`
            ).join(", ")}
        RETURNING *;
        `,
            values.flat()
        );

        const safeResult = [];
        for (let i = 0; i < employees.length; i++) {
            const e = employees[i];
            let row = result[i];
            const newUsername = typeof e.username === "string" ? (e.username.trim() || null) : null;

            if (isAdmin && (newUsername || e.password)) {
                const hashedPassword = e.password ? await bcrypt.hash(e.password, 12) : null;
                const updated = await sql`
                    UPDATE employees SET
                        username = COALESCE(${newUsername}, username),
                        password = COALESCE(${hashedPassword}, password)
                    WHERE eid = ${row.eid} RETURNING *;`;
                row = updated[0];
            }

            try {
                if (isAdmin && e.sendOnboarding && newUsername && e.password) {
                    await sendOnboardingEmail({
                        to: row.email,
                        first_name: row.first_name,
                        username: newUsername,
                        password: e.password,
                    });
                }
            } catch (error) {
                console.error("Failed to send onboarding email:", error);
            }

            const { password: _pw, ...rest } = row;
            safeResult.push(rest);
        }
        return NextResponse.json(safeResult);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
