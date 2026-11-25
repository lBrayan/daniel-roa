import { createFileRoute, notFound } from "@tanstack/react-router";
import { MemberPage } from "@/pages/TeamPages";
import { breadcrumbSchema, pageHead, personSchema } from "@/lib/seo";
import { BRAND, PATHS, getMember, memberPath } from "@/lib/site";

const L = "en" as const;

export const Route = createFileRoute("/en/team/$slug")({
    loader: ({ params }) => {
        const member = getMember(params.slug);
        if (!member) throw notFound();
        return member;
    },
    head: ({ loaderData: m }) => {
        if (!m) return {};
        const path = memberPath(m.slug, L);
        return pageHead({
            title: `${m.name} — ${m.role[L]} | ${BRAND}`,
            description: `${m.short[L]} ${m.bio[L][0] ?? ""}`.slice(0, 160),
            path,
            locale: L,
            type: "profile",
            ...(m.photo ? { image: m.photo.src } : {}),
            alternates: { es: memberPath(m.slug, "es"), en: memberPath(m.slug, "en") },
            schemas: [
                { "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: personSchema(m, L) },
                breadcrumbSchema([
                    { name: "Home", path: PATHS.home[L] },
                    { name: "Team", path: PATHS.team[L] },
                    { name: m.name, path },
                ]),
            ],
        });
    },
    component: Page,
});

function Page() {
    const member = Route.useLoaderData();
    return <MemberPage member={member} locale={L} />;
}
