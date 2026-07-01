import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { ThemeProvider } from "../components/theme-provider";
import SessionProvider from "../components/session-provider";
import ThemeToggle from "../components/theme-toggle";
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

const NAV_LINKS = [
  { href: "/",               label: "Maps"         },
  { href: "/compositions",   label: "Compositions" },
  { href: "/smoke-layouts",  label: "My Layouts"   },
  { href: "/community",      label: "Community"    },
];

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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-white light:bg-white light:text-gray-900">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark", "light"]}
          disableTransitionOnChange
        >
          <SessionProvider>

            <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm light:border-gray-200 light:bg-white/90">
              <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-3">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                  <span className="text-lg font-black tracking-tight text-white light:text-gray-900">
                    VALORANT
                  </span>
                  <span className="rounded bg-cyan-500 px-1.5 py-0.5 text-xs font-bold text-black">
                    TB
                  </span>
                </Link>

                {/* Nav links */}
                <nav className="flex flex-1 items-center justify-center gap-1">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white light:text-gray-600 light:hover:bg-gray-100 light:hover:text-gray-900"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                {/* Right: toggle + auth */}
                <div className="flex shrink-0 items-center gap-2">
                  <ThemeToggle />
                  <AuthNav userEmail={userEmail} />
                </div>
              </div>
            </header>

            {children}

          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
