import type { Metadata } from "next";
import Navbar from "@/components/employee/navbar";
import Footer from "@/components/employee/footer";
import { getSession } from "@/lib/serverUtils";
import LoginScreen from "@/components/employee/login-screen";

// Internal, gated area — keep it out of search results (also disallowed in robots.ts).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {session ? children : <LoginScreen />}
      </main>
      <Footer />
    </div>
  );
}
