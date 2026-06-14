import type { Metadata } from "next";
import { Fraunces, Roboto, Roboto_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
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
      <body className={`${fraunces.variable} ${roboto.variable} ${robotoMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
