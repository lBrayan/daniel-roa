// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#020818" />
      </head>
      <body className="min-h-dvh overflow-x-hidden">{children}</body>
    </html>
  );
}