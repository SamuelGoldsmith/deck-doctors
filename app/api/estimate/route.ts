import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { sendEstimateNotification } from "@/lib/email";

const sql = neon(process.env.DATABASE_URL!);

const VALID_SERVICE_TYPES = ["restoration", "new_build", "repair", "staining_sealing", "inspection"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      serviceType,
      message,
    } = body;

    if (!firstName || !lastName || !email || !phone || !address || !serviceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!VALID_SERVICE_TYPES.includes(serviceType)) {
      return NextResponse.json({ error: "Invalid service type" }, { status: 400 });
    }

    await sql`
      INSERT INTO estimate_requests (
        first_name,
        last_name,
        email,
        phone,
        address,
        service_type,
        message
      ) VALUES (
        ${firstName},
        ${lastName},
        ${email},
        ${phone},
        ${address},
        ${serviceType},
        ${message || null}
      )
    `;

    await sendEstimateNotification({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      service_type: serviceType,
      message: message || null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Estimate request submission failed:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
