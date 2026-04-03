import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Bookie | The Intelligent Book Sanctuary",
  description: "An AI-powered sanctuary for discovering, rating, and reflecting on your favorite literature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} font-dm-sans antialiased bg-bg-primary text-text-primary selection:bg-accent selection:text-bg-primary`} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
