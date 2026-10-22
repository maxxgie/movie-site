import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/providers/theme-provider";
import { WatchlistProvider } from "@/providers/watchlist-provider";

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
  title: {
    default: "CineVault - Watch movies anywhere",
    template: "%s | CineVault",
  },
  description:
    "Your personal movie streaming site. Browse, search, keep a watchlist, review what you watch - and play it back on any device.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('movie-site:theme');var d=(t==='light')?'light':'dark';var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(d);e.style.colorScheme=d;}catch(err){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-ink-950 text-ink-100">
        <ThemeProvider>
          <WatchlistProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </WatchlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
