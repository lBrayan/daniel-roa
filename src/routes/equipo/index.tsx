import { createFileRoute } from "@tanstack/react-router";
import { TeamPage, TEAM_COPY } from "@/pages/TeamPages";
import { breadcrumbSchema, organizationSchema, pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

const L = "es" as const;

export const Route = createFileRoute("/equipo/")({
    head: () =>
        pageHead({
            title: `${TEAM_COPY[L].title} | ${BRAND}`,
            description: TEAM_COPY[L].description,
            path: PATHS.team[L],
            locale: L,
            alternates: { es: PATHS.team.es, en: PATHS.team.en },
            schemas: [
                organizationSchema(L),
                breadcrumbSchema([
                    { name: "Inicio", path: PATHS.home[L] },
                    { name: "Equipo", path: PATHS.team[L] },
                ]),
            ],
        }),
    component: () => <TeamPage locale={L} />,
});
