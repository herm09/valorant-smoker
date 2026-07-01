import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import AuthNav from "../components/auth-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valorant Team Builder",
  description: "Build and visualize optimal Valorant team compositions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ?? null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="flex items-center gap-6 border-b border-gray-800 px-8 py-3">
          <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Maps
          </Link>
          <Link href="/compositions" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Compositions
          </Link>
          <Link href="/community" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Community
          </Link>
          <div className="ml-auto">
            <AuthNav userEmail={userEmail} />
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
