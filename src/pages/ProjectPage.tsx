import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, Container, Kicker, ProjectCover, ProjectGrid, ResponsiveImg, TeamNames } from "@/components/site/Blocks";
import { PATHS, PROJECTS, UI, projectPath, whatsappLink, type Locale, type Project } from "@/lib/site";

export function ProjectPage({ project, locale }: { project: Project; locale: Locale }) {
    const t = UI[locale];
    const other: Locale = locale === "es" ? "en" : "es";
    const more = PROJECTS.filter(
        (p) => p.slug !== project.slug && (p.discipline === project.discipline || p.discipline === "both" || project.discipline === "both"),
    ).slice(0, 2);
    const facts: { label: string; value: ReactNode }[] = [
        { label: t.client, value: project.client },
        ...(project.year ? [{ label: t.year, value: String(project.year) }] : []),
        { label: t.teamOnProject, value: <TeamNames slugs={project.team} locale={locale} /> },
        { label: t.services, value: project.services[locale].join(" · ") },
        ...(project.stack.length ? [{ label: t.stack, value: project.stack.join(" · ") }] : []),
    ];

    return (
        <SiteLayout locale={locale} alternate={projectPath(project.slug, other)}>
            <article>
                <Container className="pt-14">
                    <Breadcrumbs
                        locale={locale}
                        items={[
                            { name: t.breadcrumbHome, path: PATHS.home[locale] },
                            { name: t.nav.work, path: PATHS.work[locale] },
                            { name: project.title, path: projectPath(project.slug, locale) },
                        ]}
                    />
                    <Kicker className="mt-10">{t.disciplines[project.discipline]}</Kicker>
                    <h1 className="mt-4 text-6xl font-bold sm:text-8xl">{project.title}</h1>
                    <p className="mt-6 max-w-3xl text-2xl leading-snug text-soft">{project.summary[locale]}</p>
                </Container>

                <Container className="mt-12">
                    <div className="overflow-hidden rounded-3xl bg-ink-2">
                        <div className={project.cover && project.cover.height > project.cover.width ? "mx-auto max-w-md" : "aspect-[16/9]"}>
                            <ProjectCover project={project} locale={locale} eager />
                        </div>
                    </div>
                </Container>

                <Container className="mt-16 grid gap-12 lg:grid-cols-[1fr_2fr]">
                    <dl className="flex flex-col gap-6 self-start">
                        {facts.map((f) => (
                            <div key={f.label} className="border-t border-line pt-4">
                                <dt className="font-mono text-xs tracking-widest text-dim uppercase">{f.label}</dt>
                                <dd className="mt-2 text-lg">{f.value}</dd>
                            </div>
                        ))}
                        {project.links.map((l) => (
                            <a
                                key={l.url}
                                href={l.url}
                                target="_blank"
                                rel="noopener"
                                className="inline-flex min-h-11 items-center font-semibold text-brand hover:underline"
                            >
                                {t.visit} {l.label} ↗
                            </a>
                        ))}
                    </dl>
                    <div className="flex flex-col gap-10 text-xl leading-relaxed text-soft">
                        {project.challenge && (
                            <section>
                                <h2 className="mb-4 text-3xl font-bold text-paper">{t.challenge}</h2>
                                <p>{project.challenge[locale]}</p>
                            </section>
                        )}
                        {project.solution && (
                            <section>
                                <h2 className="mb-4 text-3xl font-bold text-paper">{t.solution}</h2>
                                <p>{project.solution[locale]}</p>
                            </section>
                        )}
                        <a
                            href={whatsappLink(t.waProject(project.title))}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex min-h-12 items-center self-start rounded-full bg-brand px-7 text-base font-semibold text-ink hover:opacity-90"
                        >
                            {t.cta} ↗
                        </a>
                    </div>
                </Container>

                {project.gallery.length > 0 && (
                    <Container className="mt-20 grid gap-6">
                        {project.gallery.map((img) => (
                            <div key={img.src} className="overflow-hidden rounded-3xl bg-ink-2">
                                <ResponsiveImg
                                    img={img}
                                    locale={locale}
                                    className={img.height > img.width ? "mx-auto max-h-[80vh] w-auto" : "w-full"}
                                />
                            </div>
                        ))}
                    </Container>
                )}
            </article>

            {more.length > 0 && (
                <Container className="py-24">
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                        <h2 className="text-4xl font-bold">{t.moreWork}</h2>
                        <Link to={PATHS.work[locale] as never} className="inline-flex min-h-11 items-center font-semibold hover:text-brand">
                            {t.viewAll} →
                        </Link>
                    </div>
                    <ProjectGrid projects={more} locale={locale} />
                </Container>
            )}
        </SiteLayout>
    );
}
