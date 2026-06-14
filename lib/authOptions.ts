import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

// Only this account can manage employee usernames/passwords.
export const ADMIN_EMAIL = "samuelg@deckdocne.com";

// Used to keep authorize() timing constant whether or not the username exists,
// avoiding username-enumeration via response time.
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing-safety", 12);

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/employee-portal/login",
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Employee Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const rows = await sql`SELECT * FROM employees WHERE username = ${credentials.username}`;
                const employee = rows[0];

                const hash = employee?.password ?? DUMMY_HASH;
                const valid = await bcrypt.compare(credentials.password, hash);

                if (!employee || !employee.password || !valid) return null;

                return {
                    id: String(employee.eid),
                    name: `${employee.first_name} ${employee.last_name}`,
                    email: employee.email,
                    role: "employee",
                    eid: employee.eid,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider !== "google") return true;

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
        async jwt({ token, user, account }) {
            if (account?.provider === "google") {
                token.role = "owner";
            } else if (account?.provider === "credentials" && user) {
                token.role = "employee";
                token.eid = user.eid;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            if (token.eid !== undefined) session.user.eid = token.eid;
            return session;
        },
    },
};
