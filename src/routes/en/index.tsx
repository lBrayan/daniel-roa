import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";
import { organizationSchema, pageHead, websiteSchema } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/en/")({
    head: () =>
        pageHead({
            title: `${BRAND} — Branding, web design & custom software studio in Colombia`,
            description:
                "Nearshore design and technology studio in Colombia: brand identity, packaging, UX/UI, websites, online stores, custom apps and AI chatbots. Design and development in one team.",
            path: PATHS.home.en,
            locale: "en",
            alternates: { es: PATHS.home.es, en: PATHS.home.en },
            schemas: [organizationSchema("en"), websiteSchema()],
        }),
    component: () => <HomePage locale="en" />,
});
