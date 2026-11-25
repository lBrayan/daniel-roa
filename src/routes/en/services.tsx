import { createFileRoute } from "@tanstack/react-router";
import { ServicesEnPage, SERVICES_EN } from "@/pages/ServicesEnPage";
import { breadcrumbSchema, organizationSchema, pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/en/services")({
    head: () =>
        pageHead({
            title: `${SERVICES_EN.title} | ${BRAND}`,
            description: SERVICES_EN.description,
            path: PATHS.services.en,
            locale: "en",
            alternates: { es: PATHS.services.es, en: PATHS.services.en },
            schemas: [
                organizationSchema("en"),
                breadcrumbSchema([
                    { name: "Home", path: PATHS.home.en },
                    { name: "Services", path: PATHS.services.en },
                ]),
            ],
        }),
    component: ServicesEnPage,
});
