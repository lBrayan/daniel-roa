"use client";

// src/components/ResponsePanel.tsx
import { ProjectCard, type ProjectItem } from "@/components/cards/ProjectCard";
import { ExperienceCard, type ExperienceItem } from "@/components/cards/ExperienceCard";
import { SkillsGrid, type SkillsCategory } from "@/components/cards/SkillsGrid";
import {
    hydrateExperience,
    hydrateProjects,
    hydrateTimeline,
    hydrateSkills,
    storyIntro,
    aboutData,
    contactData,
    getAllData,
} from "@/lib/dataIndex";
import { ScrollReveal } from "./ScrollReveal";
import { Magnetic } from "@/components/Magnetic";
import { useTranslation } from "@/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/locales/es";
import { Locale } from "@/i18n/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AIResponseType =
    | "projects"
    | "experience"
    | "skills"
    | "about"
    | "contact"
    | "general"
    | "story";

export interface AIResponse {
    type: AIResponseType;
    message: string;
    data: {
        ids?: string[];
        key?: string;
        text?: string;
        items?: ProjectItem[] | ExperienceItem[];
        categories?: SkillsCategory[];
        intro?: string;
        timeline?: Array<{
            year: string;
            title: string;
            description: string;
            tags: string[];
        }>;
        bio?: string;
        years?: number;
        location?: string;
        current?: string;
        email?: string;
        github?: string;
        linkedin?: string;
    };
}

interface ResponsePanelProps {
    response: AIResponse | null;
    loading: boolean;
    error: string | null;
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function Skeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="h-3 w-3/4 rounded bg-cyan-900/30" />
            <div className="h-3 w-full rounded bg-cyan-900/20" />
            <div className="h-3 w-5/6 rounded bg-cyan-900/20" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[1, 2].map((i) => (
                    <div key={i} className="h-28 rounded-xl bg-cyan-900/10" />
                ))}
            </div>
        </div>
    );
}

// ─── Welcome / idle state ─────────────────────────────────────────────────────

// Definidas como función para poder usar t() — no como constantes de módulo
function useWelcomeContent() {
    const { t } = useTranslation();

    const STATS: Array<{ value: string; labelKey: TranslationKey }> = [
        { value: "8+", labelKey: "stat_years_exp" },
        { value: "15+", labelKey: "stat_years_coding" },
        { value: "6", labelKey: "stat_companies" },
        { value: "6", labelKey: "stat_freelance" },
    ];

    const HIGHLIGHTS: Array<{ icon: string; titleKey: TranslationKey; descKey: TranslationKey }> = [
        { icon: "⬡", titleKey: "hl_ia_title", descKey: "hl_ia_desc" },
        { icon: "☁", titleKey: "hl_aws_title", descKey: "hl_aws_desc" },
        { icon: "◈", titleKey: "hl_fintech_title", descKey: "hl_fintech_desc" },
        { icon: "⌬", titleKey: "hl_fullstack_title", descKey: "hl_fullstack_desc" },
    ];

    return { t, STATS, HIGHLIGHTS };
}

const STACK_PILLS = [
    "React", "Next.js", "TypeScript", "Node.js",
    "AWS", "Claude API", "RAG", "Angular",
    "Docker", "PostgreSQL", "TensorFlow.js", "Python",
];

function WelcomeState() {
    const { t, STATS, HIGHLIGHTS } = useWelcomeContent();

    return (
        <div className="px-6 py-8 space-y-8">
            {/* Greeting */}
            <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-[5px] text-cyan-400/70">
                    {t("available")}
                </p>
                <h2 className="font-mono text-xl font-semibold text-slate-100 leading-snug">
                    {t("welcome_title")}
                </h2>
                <p className="font-mono text-xs text-cyan-300/80">
                    {t("welcome_subtitle")}
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
                {STATS.map((s) => (
                    <div
                        key={s.labelKey}
                        className="rounded-xl border border-cyan-900/25 bg-[#040f1e]/60 p-3 text-center"
                    >
                        <p className="font-mono text-lg font-bold text-cyan-400">{s.value}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t(s.labelKey)}</p>
                    </div>
                ))}
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HIGHLIGHTS.map((h) => (
                    <div
                        key={h.titleKey}
                        className="rounded-xl border border-cyan-900/25 bg-[#040f1e]/60 p-4 space-y-1.5 transition-colors hover:border-cyan-700/40"
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-base text-cyan-400/70">{h.icon}</span>
                            <p className="font-mono text-xs font-semibold text-cyan-300">{t(h.titleKey)}</p>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{t(h.descKey)}</p>
                    </div>
                ))}
            </div>

            {/* Stack pills */}
            <div className="space-y-2">
                <p className="font-mono text-[9px] uppercase tracking-[4px] text-cyan-400/60">
                    {t("stack_label")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {STACK_PILLS.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-lg border border-cyan-900/30 bg-[#040f1e] px-2.5 py-1 font-mono text-[10px] text-cyan-400/70"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* CTA hint */}
            <div className="rounded-xl border border-cyan-900/20 bg-cyan-950/20 px-4 py-3 flex items-center gap-3">
                <span className="font-mono text-cyan-400/60 text-lg" aria-hidden="true">›</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                    {t("welcome_cta")}
                </p>
            </div>
        </div>
    );
}

// ─── Content renderers ────────────────────────────────────────────────────────

function AboutContent({ data }: { data: AIResponse["data"] }) {
    const { t } = useTranslation();
    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-cyan-900/30 bg-[#040f1e]/80 p-4">
                <p className="text-sm leading-relaxed text-slate-300">{data.bio}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-cyan-900/20 pt-4">
                    {data.years && (
                        <div className="text-center">
                            <p className="font-mono text-2xl font-bold text-cyan-400">{data.years}+</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{t("years_label")}</p>
                        </div>
                    )}
                    {data.location && (
                        <div className="text-center col-span-2">
                            <p className="font-mono text-xs text-slate-300">{data.location}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{t("location_label")}</p>
                        </div>
                    )}
                </div>
                {data.current && (
                    <div className="mt-3 rounded-lg bg-cyan-950/30 p-3 border-l-2 border-cyan-500/50">
                        <p className="text-[11px] text-cyan-400/80 font-mono">
                            › {t("currently_label")}: {data.current}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ContactContent({ data }: { data: AIResponse["data"] }) {
    const { t } = useTranslation();

    const links = [
        { label: t("contact_email"), value: data.email, href: `mailto:${data.email}`, icon: "✉" },
        { label: t("contact_github"), value: data.github, href: data.github, icon: "⌥" },
        { label: t("contact_linkedin"), value: data.linkedin, href: data.linkedin, icon: "◈" },
    ].filter((l) => l.value);

    return (
        <div className="space-y-2 flex flex-col items-start">
            {links.map((l) => (
                <Magnetic key={l.label} intensity={0.4}>

                    <a href={l.href ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-cyan-900/30 bg-[#040f1e]/80 p-4 transition-all hover:border-cyan-500/40 hover:bg-[#071525]/90 w-full min-w-[280px]"
                    >
                        <span className="font-mono text-lg text-cyan-500/70">{l.icon}</span>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{l.label}</p>
                            <p className="font-mono text-xs text-cyan-300">{l.value}</p>
                        </div>
                    </a>
                </Magnetic>
            ))
            }
        </div >
    );
}

function GeneralContent({ data }: { data: AIResponse["data"] }) {
    return (
        <div className="rounded-xl border border-cyan-900/30 bg-[#040f1e]/80 p-4">
            <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{data.text}</p>
        </div>
    );
}

function StoryContent({ data }: { data: AIResponse["data"] }) {
    return (
        <div className="space-y-4">
            {data.intro && (
                <p className="text-sm leading-relaxed text-slate-300 border-l-2 border-cyan-700/40 pl-3">
                    {data.intro as string}
                </p>
            )}
            {Array.isArray(data.timeline) && (
                <div className="relative mt-2 space-y-0">
                    {(data.timeline as Array<{ year: string; title: string; description: string; tags: string[] }>).map((item, i) => (
                        <div key={i} className="relative border-l-2 border-cyan-900/50 pl-4 pb-5 last:pb-0">
                            <div className="absolute -left-1.25 top-1.5 h-2 w-2 rounded-full bg-cyan-500/70 ring-2 ring-[#020818]" />
                            <span className="inline-block mb-1 rounded-full bg-cyan-950/60 px-2 py-0.5 font-mono text-[9px] text-cyan-500/80 border border-cyan-900/40">
                                {item.year}
                            </span>
                            <h4 className="font-mono text-sm font-semibold text-cyan-300 mb-1">
                                {item.title}
                            </h4>
                            <p className="text-xs leading-relaxed text-slate-400 mb-2">
                                {item.description}
                            </p>
                            {item.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {item.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-md bg-cyan-950/40 px-2 py-0.5 font-mono text-[9px] text-cyan-500/70 border border-cyan-900/30"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Hydration helper ─────────────────────────────────────────────────────────

function hydrateResponse(response: AIResponse, locale: Locale): AIResponse {
    const { type, data } = response;

    if (data.items || data.categories || data.timeline || data.bio || data.email) {
        return response;
    }

    const ids = data.ids ?? [];
    const { storyIntro, aboutData, contactData } = getAllData(locale); // ← locale-aware

    switch (type) {
        case "experience": {
            const items = hydrateExperience(ids, locale) as ExperienceItem[];
            return { ...response, data: { ...data, items } };
        }
        case "projects": {
            const rawProjects = hydrateProjects(ids, locale);
            const items: ProjectItem[] = rawProjects.map((rawItem: any) => ({
                title: rawItem.name,
                imageUrl: rawItem.imageUrl || "/project-placeholder.png",
                description: rawItem.description,
                techStack: rawItem.tech,
                features: [rawItem.type],
            }));
            return { ...response, data: { ...data, items } };
        }
        case "skills": {
            const categories = hydrateSkills(ids, locale) as SkillsCategory[];
            return { ...response, data: { ...data, categories } };
        }
        case "story": {
            const rawTimeline = hydrateTimeline(ids, locale);
            return {
                ...response,
                data: {
                    ...data,
                    intro: storyIntro,
                    timeline: rawTimeline as AIResponse["data"]["timeline"],
                },
            };
        }
        case "about": {
            return {
                ...response,
                data: {
                    ...data,
                    bio: aboutData.bio,
                    years: aboutData.yearsExperience,
                    location: aboutData.location,
                    current: aboutData.current,
                },
            };
        }
        case "contact": {
            return {
                ...response,
                data: {
                    ...data,
                    email: contactData.email,
                    github: contactData.github,
                    linkedin: contactData.linkedin,
                },
            };
        }
        default:
            return response;
    }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ResponsePanel({ response, loading, error }: ResponsePanelProps) {
    const { t, locale } = useTranslation();

    if (loading) {
        return (
            <div className="p-5">
                <Skeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5">
                <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-4">
                    <p className="font-mono text-xs text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!response) {
        return <WelcomeState />;
    }

    const hydrated = hydrateResponse(response, locale);
    const { type, message, data } = hydrated;

    return (
        <div className="p-5 space-y-4">
            {/* Disclaimer — traducido */}
            <div className="px-2 py-1 bg-amber-300 flex">
                <span className="text-[12px] text-black">{t("ai_disclaimer")}</span>
            </div>

            {/* Model message */}
            {message && (
                <p className="font-mono text-xs text-cyan-400/80 border-l-2 border-cyan-700/40 pl-3 py-0.5">
                    {message}
                </p>
            )}

            {/* Structured content */}
            {type === "projects" && Array.isArray(data.items) && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pt-2 px-1">
                    {(data.items as ProjectItem[]).map((item, i) => (
                        <ScrollReveal key={i} delay={i * 0.15}>
                            <ProjectCard item={item} />
                        </ScrollReveal>
                    ))}
                </div>
            )}

            {type === "experience" && Array.isArray(data.items) && (
                <div className="space-y-4 border-l border-cyan-900/20 ml-2 pl-4">
                    {(data.items as ExperienceItem[]).map((item, i) => (
                        <ScrollReveal key={i} delay={i * 0.15}>
                            <ExperienceCard item={item} index={i} />
                        </ScrollReveal>
                    ))}
                </div>
            )}

            {type === "skills" && data.categories && (
                <SkillsGrid categories={data.categories} />
            )}

            {type === "story" && <StoryContent data={data} />}
            {type === "about" && <AboutContent data={data} />}
            {type === "contact" && <ContactContent data={data} />}
            {type === "general" && <GeneralContent data={data} />}
        </div>
    );
}