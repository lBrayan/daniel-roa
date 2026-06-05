// src/app/layout.tsx
import type { Metadata } from "next";
import { PremiumCanvas } from "@/components/PremiumCanvas";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { PageLoader } from "@/components/PageLoader";

export const metadata: Metadata = {
  metadataBase: new URL("https://danielroa.dev"), // update with real domain
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

        <PageLoader />

        {/* El Cursor Premium Global */}
        <CustomCursor />

        {/* El motor de físicas y atmósfera de fondo */}
        <PremiumCanvas />

        {/* El contenido de tu aplicación (debe tener un z-index para estar por encima de la luz pero por debajo del grano) */}
        <main className="relative z-40">
          {children}
        </main>

      </body>
    </html>
  );
}