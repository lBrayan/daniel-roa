import type React from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, Container, Kicker, ProjectGrid } from "@/components/site/Blocks";
import { PATHS, UI, orderedProjects, type Locale } from "@/lib/site";

export type WorkFilter = "design" | "development" | undefined;

export const WORK_COPY = {
    es: {
        title: "Proyectos de diseño y desarrollo web | Portafolio",
        description:
            "Portafolio del estudio: identidades de marca, empaques, diseño UX/UI, páginas web, tiendas Shopify y software a la medida para marcas de Colombia, México y Estados Unidos.",
        h1: "Proyectos",
        lead: "Identidades de marca, empaques, páginas web, tiendas online y software a la medida. Algunos los hizo diseño, otros tecnología y los mejores, los dos juntos.",
    },
    en: {
        title: "Design and web development work | Portfolio",
        description:
            "Our studio portfolio: brand identities, packaging, UX/UI design, websites, Shopify stores and custom software for brands in Colombia, Mexico and the United States.",
        h1: "Work",
        lead: "Brand identities, packaging, websites, online stores and custom software. Some by design, some by technology, and the best ones by both together.",
    },
};

export function WorkPage({ locale, filter, onFilter }: { locale: Locale; filter: WorkFilter; onFilter: (f: WorkFilter) => void }) {
    const t = UI[locale];
    const c = WORK_COPY[locale];
    const projects = orderedProjects(filter);
    const tabs: { key: WorkFilter; label: string }[] = [
        { key: undefined, label: t.all },
        { key: "design", label: t.disciplines.design },
        { key: "development", label: t.disciplines.development },
    ];

    return (
        <SiteLayout locale={locale} alternate={PATHS.work[locale === "es" ? "en" : "es"]}>
            <Container className="pt-14 pb-24">
                <Breadcrumbs
                    locale={locale}
                    items={[
                        { name: t.breadcrumbHome, path: PATHS.home[locale] },
                        { name: c.h1, path: PATHS.work[locale] },
                    ]}
                />
                <div className="mt-10 mb-14 flex flex-wrap items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <Kicker>{t.tagline}</Kicker>
                        <h1 className="rise mt-5 text-6xl font-bold sm:text-8xl" style={{ "--d": "80ms" } as React.CSSProperties}>{c.h1}</h1>
                        <p className="mt-6 text-xl leading-relaxed text-soft">{c.lead}</p>
                    </div>
                    <div role="group" aria-label={locale === "es" ? "Filtrar proyectos" : "Filter work"} className="flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const active = tab.key === filter;
                            return (
                                <button
                                    key={tab.label}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => onFilter(tab.key)}
                                    className={`min-h-11 rounded-full px-5 text-sm transition-colors ${
                                        active ? "bg-paper text-ink" : "border border-line text-paper hover:border-soft"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <ProjectGrid projects={projects} locale={locale} eagerFirst />
            </Container>
        </SiteLayout>
    );
}
