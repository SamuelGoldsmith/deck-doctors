import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <div className="fixed bottom-0 w-full">
        <Footer />
        </div>
      </body>
    </html>
  );
}
