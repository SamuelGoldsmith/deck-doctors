import type { Metadata } from "next";
import "@/styles/globals.css"; 
import Navbar from "@/components/employee/navbar";
import Footer from "@/components/employee/footer";
import { Roboto } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getSession } from "@/lib/serverUtils";
import { Sign } from "crypto";
import SignInButton from "@/components/signin";

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // customize as needed
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // optional
  display: "swap",
});


export const metadata: Metadata = {
  title: "Deck Doctors",
  description: "Deck Doctors Web Application",
};

export default async function EmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
        <div className="min-h-screen flex flex-col max-w-screen">
          <Navbar />
          <div className="pb-16 pt-8">
            {session ? children : 
            (
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="text-lg text-gray-600 mb-6">You must be signed in to view this page.</p>
                <SignInButton />
              </div>
            )}
          </div>
          <div className="fixed bottom-0 w-full z-50">
            <Footer />
          </div>
          <Analytics/>
        </div>
  );
}
