import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
 
const sql = neon(process.env.DATABASE_URL!);
 
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      experience,
      availability,
      hasDrivingLicense,
      message,
    } = body;
 
    // Basic server-side validation
    if (!firstName || !lastName || !email || !phone || !position || !experience || !availability || !hasDrivingLicense) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
 
    await sql`
      INSERT INTO job_applications (
        first_name,
        last_name,
        email,
        phone,
        position,
        experience,
        availability,
        has_driving_license,
        message
      ) VALUES (
        ${firstName},
        ${lastName},
        ${email},
        ${phone},
        ${position},
        ${experience},
        ${availability},
        ${hasDrivingLicense === "yes"},
        ${message || null}
      )
    `;
 
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Application submission failed:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}