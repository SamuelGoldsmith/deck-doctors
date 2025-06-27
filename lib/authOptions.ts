import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) throw new Error("Email not found in profile");
            try {
                const existingUser = await sql`SELECT * FROM users WHERE email = ${profile.email}`;

                if (existingUser.length > 0) {
                    await sql`UPDATE users SET name = ${profile.name} WHERE email = ${profile.email}`;
                } else {
                    await sql`INSERT INTO users (email, name) VALUES (${profile.email}, ${profile.name})`;
                }

                return true;
            } catch (err) {
                console.error("Database error:", err);
                return false;
            }
        },
    },
};
