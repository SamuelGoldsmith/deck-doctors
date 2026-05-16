import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next"

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
        <div className="min-h-screen flex flex-col max-w-screen">
          <Navbar />
          <div className="">
            {children}
          </div>
          <div className="fixed bottom-0 w-full z-50">
          </div>
        </div>
      </body>
    <Analytics/>
    </html>
  );
}