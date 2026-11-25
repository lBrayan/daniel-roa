import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";
import { organizationSchema, pageHead, websiteSchema } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/")({
    head: () =>
        pageHead({
            title: `${BRAND} — Diseño de marca, páginas web y software a la medida en Bogotá`,
            description:
                "Estudio de diseño y tecnología en Bogotá: branding, empaques, diseño UX/UI, páginas web, tiendas online, apps y chatbots con IA. Diseño y desarrollo en un solo equipo.",
            path: PATHS.home.es,
            locale: "es",
            alternates: { es: PATHS.home.es, en: PATHS.home.en },
            schemas: [organizationSchema("es"), websiteSchema()],
        }),
    component: () => <HomePage locale="es" />,
});
