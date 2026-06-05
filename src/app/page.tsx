// src/app/page.tsx
import type { Metadata } from "next";
import { PortfolioClient } from "@/components/PortfolioClient";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Brayan Daniel Roa | Desarrollador Fullstack Senior & IA",
  description:
    "Portfolio de Brayan Daniel Roa Rodriguez — Desarrollador Senior Fullstack con 8+ años de experiencia en React, Next.js, AWS, IA Generativa, RAG y Prompt Engineering. Bogotá, Colombia.",
  keywords: [
    "desarrollador fullstack senior",
    "React Next.js TypeScript",
    "AWS serverless Lambda",
    "Inteligencia Artificial generativa",
    "RAG Prompt Engineering",
    "Claude API LLMs",
    "portafolio desarrollador colombia",
    "Brayan Daniel Roa",
    "Topaz developer",
    "TensorFlow.js",
  ],
  authors: [{ name: "Brayan Daniel Roa Rodriguez", url: "https://github.com/lBrayan" }],
  creator: "Brayan Daniel Roa Rodriguez",
  openGraph: {
    type: "website",
    locale: "es_CO",
    title: "Brayan Daniel Roa | Fullstack & IA",
    description:
      "8+ años construyendo soluciones escalables con React, AWS, agentes IA y arquitecturas RAG. Bogotá, Colombia.",
    siteName: "Daniel Roa Portfolio",
    images: [
      {
        url: "/og-image.png", // Place a 1200x630 image in /public
        width: 1200,
        height: 630,
        alt: "Daniel Roa – Desarrollador Fullstack Senior",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brayan Daniel Roa | Fullstack & IA",
    description: "8+ años construyendo soluciones escalables con React, AWS y IA Generativa.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://danielroa.dev", // update with real domain
  },
};

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Brayan Daniel Roa Rodriguez",
  url: "https://danielroa.dev",
  jobTitle: "Senior Fullstack Developer & AI Engineer",
  description:
    "Desarrollador Senior Fullstack con más de 8 años de experiencia en React, Next.js, AWS y IA Generativa.",
  address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
  email: "lbrayan.roa@gmail.com",
  sameAs: [
    "https://github.com/lBrayan",
    "https://www.linkedin.com/in/bdanielroar",
  ],
  knowsAbout: [
    "React", "Next.js", "TypeScript", "Node.js", "AWS", "AI", "RAG",
    "Prompt Engineering", "Docker", "TensorFlow.js",
  ],
};

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioClient />
    </>
  );
}