import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css"; 
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Roboto } from "next/font/google";
import { Roboto_Mono } from "next/font/google";

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

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="min-h-screen flex flex-col max-w-screen">
          <Navbar />
          <div className="w-full h-[53vh] md:h-[33vh] lg:h-[28vh] overflow-hidden">
            <img
              src="/banner.jpg"
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pb-16">
            {children}
          </div>
          <div className="fixed bottom-0 w-full z-50">
            <Footer />
          </div>
        </div>
  );
}
