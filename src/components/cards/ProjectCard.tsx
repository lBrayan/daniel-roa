// src/components/cards/ProjectCard.tsx
import React from "react";

export interface ProjectItem {
    name: string;
    url: string | null;
    description: string;
    tech: string[];
    type: string;
}

export function ProjectCard({ item }: { item: ProjectItem }) {
    return (
        <article className="group relative rounded-xl border border-cyan-900/30 bg-[#040f1e]/80 p-4 transition-all duration-300 hover:border-cyan-500/40 hover:bg-[#071525]/90 hover:shadow-[0_0_24px_rgba(61,214,245,0.06)]">
            {/* Type badge */}
            <span
                className={`absolute right-4 top-4 rounded-full px-2 py-0.5 text-[9px] font-medium tracking-widest uppercase ${item.type === "freelance"
                        ? "bg-emerald-900/40 text-emerald-400"
                        : "bg-blue-900/40 text-blue-400"
                    }`}
            >
                {item.type}
            </span>

            {/* Name */}
            <h3 className="mb-1 pr-16 font-mono text-sm font-semibold text-cyan-300">
                {item.url ? (
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-cyan-100"
                    >
                        {item.name}
                        <span className="ml-1 opacity-50">↗</span>
                    </a>
                ) : (
                    item.name
                )}
            </h3>

            {/* Description */}
            <p className="mb-3 text-xs leading-relaxed text-slate-400">
                {item.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5">
                {item.tech.map((t) => (
                    <span
                        key={t}
                        className="rounded-md bg-cyan-950/50 px-2 py-0.5 font-mono text-[9px] text-cyan-500/80"
                    >
                        {t}
                    </span>
                ))}
            </div>
        </article>
    );
}