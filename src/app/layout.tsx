// src/app/layout.tsx
import type { Metadata } from "next";
import { PremiumCanvas } from "@/components/PremiumCanvas";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { PageLoader } from "@/components/PageLoader";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";

export const metadata: Metadata = {
  metadataBase: new URL("https://danielroa.dev"),
  title: {
    default: "Brayan Daniel Roa | Desarrollador Fullstack Senior & IA",
    template: "%s | Daniel Roa",
  },
  description:
    "Portfolio interactivo de Brayan Daniel Roa Rodriguez — Desarrollador Senior Fullstack con 8+ años en React, Next.js, AWS, IA Generativa y RAG. Bogotá, Colombia.",
  icons: {
    icon: "/favicon.ico",
  },
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={spaceGrotesk.className}>
      <body className="bg-[#020818] text-white selection:bg-[#00d3f3]/30 selection:text-white relative antialiased">

        {/* Skip navigation — primer elemento tabulable */}
        <a href="#main-content" className="skip-to-content">
          Ir al contenido principal
        </a>

        {/*
          AccessibilityProvider debe envolver todo para:
          1. Poder aplicar clases en <html>
          2. Exponer useA11y() a AccessibilityPanel
        */}
        <AccessibilityProvider>
          <PageLoader />
          <CustomCursor />
          <PremiumCanvas />

          <main id="main-content" className="relative z-40">
            {children}
          </main>

          {/*
            AccessibilityPanel va DENTRO del provider (necesita el contexto)
            y FUERA de main (es un widget de UI global, no contenido de la página)
            z-index 9000 para estar sobre todo excepto overlays críticos
          */}
          <AccessibilityPanel />
        </AccessibilityProvider>

      </body>
    </html>
  );
}