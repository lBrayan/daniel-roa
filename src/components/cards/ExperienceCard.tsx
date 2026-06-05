// src/components/cards/ExperienceCard.tsx
import React from "react";

export interface ExperienceItem {
    role: string;
    company: string;
    period: string;
    highlights: string[];
}

export function ExperienceCard({ item, index }: { item: ExperienceItem; index: number }) {
    return (
        <article
            className="relative border-l-2 border-cyan-900/50 pl-4 pb-6 last:pb-0"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Timeline dot */}
            <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-cyan-500/70 ring-2 ring-[#020818]" />

            {/* Header */}
            <div className="mb-1">
                <h3 className="font-mono text-sm font-semibold text-cyan-300">{item.role}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-300">{item.company}</span>
                    <span className="text-[10px] text-slate-500">{item.period}</span>
                </div>
            </div>

            {/* Highlights */}
            <ul className="space-y-1">
                {item.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                        <span className="mt-1 text-cyan-600">›</span>
                        <span>{h}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
}