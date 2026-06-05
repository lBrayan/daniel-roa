// src/app/layout.tsx
import type { Metadata } from "next";
import { PremiumCanvas } from "@/components/PremiumCanvas";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { PageLoader } from "@/components/PageLoader";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import { LanguageProvider } from "@/i18n/LanguageContext"; // ← NUEVO

export const metadata: Metadata = {
  metadataBase: new URL("https://danielroa.dev"),
  title: {
    default: "Brayan Daniel Roa | Senior Fullstack Developer & AI Engineer",
    template: "%s | Daniel Roa",
  },
  description:
    "Interactive portfolio of Brayan Daniel Roa Rodriguez — Senior Fullstack Developer with 8+ years in React, Next.js, AWS, Generative AI and RAG. Bogotá, Colombia.",
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang se actualiza dinámicamente desde LanguageProvider vía document.documentElement.lang
    <html lang="es" className={spaceGrotesk.className}>
      <body className="bg-[#020818] text-white selection:bg-[#00d3f3]/30 selection:text-white relative antialiased">
        <a href="#main-content" className="skip-to-content">
          Ir al contenido principal
        </a>

        {/* LanguageProvider DEBE envolver todo — AccessibilityPanel también usa t() */}
        <LanguageProvider>
          <AccessibilityProvider>
            <PageLoader />
            <CustomCursor />
            <PremiumCanvas />

            <main id="main-content" className="relative z-40">
              {children}
            </main>

            <AccessibilityPanel />
          </AccessibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}