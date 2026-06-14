import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const EMPLOYEE_HOME = "/employee-portal/general";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token?.role === "employee" && pathname !== EMPLOYEE_HOME && !pathname.startsWith(`${EMPLOYEE_HOME}/`)) {
        return NextResponse.redirect(new URL(EMPLOYEE_HOME, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/employee-portal/:path*"],
};
