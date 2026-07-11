import type { Metadata } from "next";
import { Space_Grotesk, Inter, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiChatbot from "@/components/AiChatbot";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

import { COMPANY_INFO } from "@/data/company";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY_INFO.name,
  url: COMPANY_INFO.website,
  description: 'Premium digital agency delivering enterprise software, AI solutions, and cloud architecture.',
  sameAs: [
    COMPANY_INFO.socials.github,
    COMPANY_INFO.socials.linkedin,
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: COMPANY_INFO.email,
  },
};

export const metadata: Metadata = {
  title: `${COMPANY_INFO.name} | Custom Software Development & AI Solutions`,
  description: `Building Digital. Elevating Businesses. ${COMPANY_INFO.name} is a premium digital agency delivering enterprise-grade custom software, UI/UX design, cloud architecture, and AI solutions.`,
  metadataBase: new URL(COMPANY_INFO.website),
  openGraph: {
    title: `${COMPANY_INFO.name} | Custom Software Development & AI Solutions`,
    description: "Enterprise-grade software engineering, custom cloud architecture, and cutting-edge AI solutions for modern businesses.",
    url: COMPANY_INFO.website,
    siteName: COMPANY_INFO.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY_INFO.name} | Custom Software Development & AI Solutions`,
    description: "Enterprise-grade software engineering, custom cloud architecture, and cutting-edge AI solutions for modern businesses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plusJakartaSans.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          suppressHydrationWarning
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#070B16] text-[#F8FAFC]">
        <Navbar />
        <main className="flex-grow pt-[80px]">
          {children}
        </main>
        <Footer />
        <AiChatbot />
      </body>
    </html>
  );
}
