import type { ReactNode } from "react";
import type React from "react";
import { Link } from "@tanstack/react-router";
import { UI, getMember, memberPath, projectPath, type Img, type Locale, type Member, type Project } from "@/lib/site";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`mx-auto max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <p className={`font-mono text-xs tracking-[0.14em] text-dim uppercase ${className}`}>{children}</p>;
}

export function Breadcrumbs({ items, locale }: { items: { name: string; path: string }[]; locale: Locale }) {
    return (
        <nav aria-label={locale === "es" ? "Ruta de navegación" : "Breadcrumb"} className="font-mono text-xs text-dim">
            <ol className="flex flex-wrap items-center gap-2">
                {items.map((item, i) => (
                    <li key={item.path} className="flex items-center gap-2">
                        {i > 0 && <span aria-hidden>/</span>}
                        {i < items.length - 1 ? (
                            <Link to={item.path as never} className="hover:text-paper">
                                {item.name}
                            </Link>
                        ) : (
                            <span aria-current="page" className="text-soft">
                                {item.name}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

const FALLBACK_TONES = ["#1f1a2e", "#12261c", "#10222e", "#2e1a10"];

/** Imagen de un proyecto; si no hay imagen, una portada tipográfica. */
export function ProjectCover({
    project,
    locale,
    eager = false,
    className = "",
}: {
    project: Project;
    locale: Locale;
    eager?: boolean;
    className?: string;
}) {
    if (project.cover) {
        return (
            <ResponsiveImg
                img={project.cover}
                locale={locale}
                eager={eager}
                className={`h-full w-full object-cover object-top ${className}`}
            />
        );
    }
    const tone = FALLBACK_TONES[project.slug.length % FALLBACK_TONES.length];
    return (
        <div
            role="img"
            aria-label={project.title}
            className={`flex h-full w-full flex-col justify-between p-7 ${className}`}
            style={{ background: tone }}
        >
            <span className="font-mono text-xs tracking-widest text-paper/60 uppercase">{project.stack.slice(0, 3).join(" · ")}</span>
            <span className="font-grotesk text-3xl leading-none font-bold text-paper sm:text-4xl">{project.title}</span>
        </div>
    );
}

export function ResponsiveImg({
    img,
    locale,
    eager = false,
    className = "",
}: {
    img: Img;
    locale: Locale;
    eager?: boolean;
    className?: string;
}) {
    return (
        <img
            src={img.src}
            alt={img.alt[locale]}
            width={img.width}
            height={img.height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            {...(eager ? { fetchPriority: "high" as const } : {})}
            referrerPolicy="no-referrer"
            className={className}
        />
    );
}

export function ProjectCard({
    project,
    locale,
    eager = false,
    index = 0,
}: {
    project: Project;
    locale: Locale;
    eager?: boolean;
    index?: number;
}) {
    const t = UI[locale];
    return (
        <article className="group" data-reveal style={{ "--d": `${(index % 2) * 120}ms` } as React.CSSProperties}>
            <Link to={projectPath(project.slug, locale) as never} className="flex flex-col gap-4">
                <div className="card-lift aspect-[4/3] overflow-hidden rounded-2xl bg-ink-2">
                    <ProjectCover
                        project={project}
                        locale={locale}
                        eager={eager}
                        className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-2xl font-medium">{project.title}</h3>
                    <span className="font-mono text-xs tracking-widest text-dim uppercase">
                        {t.disciplines[project.discipline]}
                        {project.year ? ` · ${project.year}` : ""}
                    </span>
                </div>
                <p className="text-[15px] leading-relaxed text-soft">{project.summary[locale]}</p>
            </Link>
        </article>
    );
}

export function ProjectGrid({ projects, locale, eagerFirst = false }: { projects: Project[]; locale: Locale; eagerFirst?: boolean }) {
    return (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} locale={locale} eager={eagerFirst && i < 2} index={i} />
            ))}
        </div>
    );
}

const AVATAR_TONES: Record<string, string> = {
    design: "bg-brand text-ink",
    development: "bg-[#8fb8ff] text-ink",
    both: "bg-soft text-ink",
};

export function Avatar({ member, size = "lg", eager = false }: { member: Member; size?: "lg" | "xl"; eager?: boolean }) {
    if (member.photo) {
        return (
            <img
                src={member.photo.src}
                alt={member.name}
                width={member.photo.width}
                height={member.photo.height}
                loading={eager ? "eager" : "lazy"}
                decoding="async"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
        );
    }
    return (
        <div
            aria-hidden
            className={`flex items-center justify-center rounded-2xl font-grotesk font-bold ${AVATAR_TONES[member.discipline]} ${
                size === "xl" ? "aspect-[4/5] w-full text-8xl" : "aspect-[4/5] w-full text-6xl"
            }`}
        >
            {member.initials}
        </div>
    );
}

export function MemberCard({ member, locale, index = 0 }: { member: Member; locale: Locale; index?: number }) {
    return (
        <article data-reveal style={{ "--d": `${index * 110}ms` } as React.CSSProperties}>
            <Link to={memberPath(member.slug, locale) as never} className="group flex flex-col gap-4">
                <div className="card-lift overflow-hidden rounded-2xl">
                    <div className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]">
                        <Avatar member={member} />
                    </div>
                </div>
                <h3 className="text-3xl font-bold group-hover:text-brand">{member.name}</h3>
                <p className="text-soft">{member.role[locale]}</p>
                <p className="text-sm text-dim">{member.short[locale]}</p>
            </Link>
        </article>
    );
}

export function TeamNames({ slugs, locale }: { slugs: string[]; locale: Locale }) {
    return (
        <>
            {slugs
                .map((s) => getMember(s))
                .filter((m): m is Member => Boolean(m))
                .map((m, i, arr) => (
                    <span key={m.slug}>
                        <Link to={memberPath(m.slug, locale) as never} className="underline decoration-line underline-offset-4 hover:text-brand">
                            {m.name}
                        </Link>
                        {i < arr.length - 1 ? ", " : ""}
                    </span>
                ))}
        </>
    );
}
