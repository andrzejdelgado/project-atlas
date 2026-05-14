import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteDock } from "@/components/site-dock";
import { SiteSignature } from "@/components/site-signature";
import { CommandPalette } from "@/components/command-palette";
import { ChatModal } from "@/components/chat-modal";
import { siteConfig } from "@/lib/site";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.author} — ${siteConfig.name}`,
    template: `%s — ${siteConfig.author}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.author} — ${siteConfig.name}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.author} — ${siteConfig.name}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AmbientBackdrop />
          <main className="mx-auto w-full max-w-[828px] flex-1 px-4 pb-32 sm:px-6">
            {children}
            <SiteSignature />
          </main>
          <SiteDock />
          <CommandPalette />
          <ChatModal />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
