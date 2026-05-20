import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteDock } from "@/components/site-dock";
import { SiteSignature } from "@/components/site-signature";
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
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  keywords: [...siteConfig.keywords],
  category: "design",
  generator: "Next.js",
  openGraph: {
    title: `${siteConfig.author} — ${siteConfig.name}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    // Image intentionally omitted — Next.js auto-discovers
    // app/opengraph-image.tsx and injects it as the OG card. Setting an
    // explicit images array here would suppress that discovery.
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.author} — ${siteConfig.name}`,
    description: siteConfig.description,
    // Twitter image follows the OG image via file-based discovery too.
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Slot for Google Search Console / Bing Webmaster verification — pass via
    // env so deploys can wire it without code changes.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
};

// Person schema published in <head>. Tells search engines "this site, those
// off-site profiles, same human" — the `sameAs` array is the lever that
// makes the Knowledge Graph cluster correctly for "Andrzej Delgado".
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.author,
  url: siteConfig.url,
  image: `${siteConfig.url}/andrzejdelgado.webp`,
  jobTitle: siteConfig.jobTitle,
  description: siteConfig.bio,
  email: `mailto:${siteConfig.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Málaga",
    addressCountry: "ES",
  },
  knowsAbout: [
    "Design Systems",
    "Multi-brand Theming",
    "Design Engineering",
    "Product Design",
    "Progressive Design Model",
    "Design Tokens (W3C)",
    "Accessibility (APCA)",
    "Storybook",
    "Panda CSS",
    "Figma",
  ],
  sameAs: siteConfig.social
    .filter((s) => s.key !== "email")
    .map((s) => s.href),
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteConfig.url,
  name: `${siteConfig.author} — ${siteConfig.name}`,
  description: siteConfig.description,
  inLanguage: "en",
  publisher: {
    "@type": "Person",
    name: siteConfig.author,
    url: siteConfig.url,
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
      <head>
        <script
          type="application/ld+json"
          // JSON.stringify is safe here — values come from the typed
          // siteConfig and a derived `social` array, no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="bg-background text-foreground flex min-h-full flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="mx-auto w-full max-w-[60ch] flex-1 px-4 pb-32 sm:px-6">
            {children}
            <SiteSignature />
          </main>
          <SiteDock />
          <ChatModal />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
