import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";

const SITE_URL = "https://hlmodels.vercel.app";
const SITE_NAME = "HL Models";
const SITE_DESCRIPTION =
  "Agência de modelos profissional em São Paulo. Casting de modelos masculinos, femininos, não-binários, baby, kids e teens para moda, publicidade e editorial.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HL Models - Agência de Modelos em São Paulo",
    template: "%s | HL Models",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "agência de modelos",
    "agência de modelos São Paulo",
    "modelos SP",
    "casting de modelos",
    "modelos masculinos",
    "modelos femininos",
    "modelos não binários",
    "modelos infantis",
    "modelos teens",
    "moda",
    "editorial",
    "publicidade",
    "HL Models",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "HL Models - Agência de Modelos em São Paulo",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "HL Models - Agência de Modelos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HL Models - Agência de Modelos em São Paulo",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "fashion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    sameAs: ["https://instagram.com/hlmodels"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-11-99999-9999",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
