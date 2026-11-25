import { SiteLayout } from "@/components/site/SiteLayout";
import { Avatar, Breadcrumbs, Container, Kicker, MemberCard, ProjectGrid } from "@/components/site/Blocks";
import { PATHS, TEAM, UI, memberPath, projectsBy, type Locale, type Member } from "@/lib/site";

export const TEAM_COPY = {
    es: {
        title: "Equipo: diseñadores y desarrolladores en Bogotá",
        description:
            "Conoce al equipo: diseño de marca y UI/UX, arquitectura de software y desarrollo full stack. Un estudio pequeño donde hablas con quien hace el trabajo.",
        h1: "Equipo",
        lead: "Un estudio pequeño a propósito: diseño y tecnología en la misma mesa, sin intermediarios. Cada proyecto lo lidera alguien que lo diseña o lo construye con sus manos.",
    },
    en: {
        title: "Team: designers and developers in Colombia",
        description:
            "Meet the team: brand and UX/UI design, software architecture and full-stack development. A small studio where you talk to the people doing the work.",
        h1: "Team",
        lead: "Small on purpose: design and technology at the same table, no middlemen. Every project is led by someone who designs or builds it hands-on.",
    },
};

export function TeamPage({ locale }: { locale: Locale }) {
    const t = UI[locale];
    const c = TEAM_COPY[locale];
    return (
        <SiteLayout locale={locale} alternate={PATHS.team[locale === "es" ? "en" : "es"]}>
            <Container className="pt-14 pb-24">
                <Breadcrumbs
                    locale={locale}
                    items={[
                        { name: t.breadcrumbHome, path: PATHS.home[locale] },
                        { name: c.h1, path: PATHS.team[locale] },
                    ]}
                />
                <div className="mt-10 mb-16 max-w-3xl">
                    <Kicker>{t.tagline}</Kicker>
                    <h1 className="mt-5 text-6xl font-bold sm:text-8xl">{c.h1}</h1>
                    <p className="mt-6 text-xl leading-relaxed text-soft">{c.lead}</p>
                </div>
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {TEAM.map((m) => (
                        <MemberCard key={m.slug} member={m} locale={locale} />
                    ))}
                </div>
            </Container>
        </SiteLayout>
    );
}

export function MemberPage({ member, locale }: { member: Member; locale: Locale }) {
    const t = UI[locale];
    const other: Locale = locale === "es" ? "en" : "es";
    const work = projectsBy(member.slug);
    return (
        <SiteLayout locale={locale} alternate={memberPath(member.slug, other)}>
            <Container className="pt-14">
                <Breadcrumbs
                    locale={locale}
                    items={[
                        { name: t.breadcrumbHome, path: PATHS.home[locale] },
                        { name: t.nav.team, path: PATHS.team[locale] },
                        { name: member.name, path: memberPath(member.slug, locale) },
                    ]}
                />
                <div className="mt-12 grid items-start gap-12 lg:grid-cols-[2fr_1fr]">
                    <div>
                        <Kicker>{t.disciplines[member.discipline]}</Kicker>
                        <h1 className="mt-5 text-6xl font-bold sm:text-8xl">{member.name}</h1>
                        <p className="mt-4 text-2xl text-brand">{member.role[locale]}</p>
                        <div className="mt-8 flex max-w-3xl flex-col gap-5 text-xl leading-relaxed text-soft">
                            {member.bio[locale].map((p) => (
                                <p key={p}>{p}</p>
                            ))}
                        </div>
                        {member.skills.length > 0 && (
                            <div className="mt-10">
                                <h2 className="font-mono text-xs tracking-widest text-dim uppercase">{t.skills}</h2>
                                <ul className="mt-4 flex flex-wrap gap-2">
                                    {member.skills.map((s) => (
                                        <li key={s} className="rounded-full border border-line px-4 py-2 text-sm">
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="mt-8 flex flex-wrap gap-6">
                            {member.links.map((l) => (
                                <a
                                    key={l.url}
                                    href={l.url}
                                    target="_blank"
                                    rel="noopener me"
                                    className="inline-flex min-h-11 items-center font-semibold text-brand hover:underline"
                                >
                                    {l.label} ↗
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="mx-auto w-full max-w-sm">
                        <Avatar member={member} size="xl" />
                    </div>
                </div>
            </Container>
            {work.length > 0 && (
                <Container className="py-24">
                    <h2 className="mb-10 text-4xl font-bold">
                        {t.projectsOf} {member.name.split(" ")[0]}
                    </h2>
                    <ProjectGrid projects={work} locale={locale} />
                </Container>
            )}
        </SiteLayout>
    );
}
