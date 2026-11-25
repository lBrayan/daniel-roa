import { createFileRoute } from "@tanstack/react-router";
import { TeamPage, TEAM_COPY } from "@/pages/TeamPages";
import { breadcrumbSchema, organizationSchema, pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

const L = "en" as const;

export const Route = createFileRoute("/en/team/")({
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
                    { name: "Home", path: PATHS.home[L] },
                    { name: "Team", path: PATHS.team[L] },
                ]),
            ],
        }),
    component: () => <TeamPage locale={L} />,
});
