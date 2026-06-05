// src/components/cards/SkillsGrid.tsx
import React from "react";

export interface SkillsCategory {
    name: string;
    items: string[];
}

export function SkillsGrid({ categories }: { categories: SkillsCategory[] }) {
    return (
        <div className="space-y-4">
            {categories.map((cat) => (
                <div key={cat.name}>
                    <h4 className="mb-2 font-mono text-[10px] font-medium uppercase tracking-widest text-cyan-600">
                        {cat.name}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((item) => (
                            <span
                                key={item}
                                className="rounded-lg border border-cyan-900/40 bg-[#040f1e] px-2.5 py-1 font-mono text-[10px] text-cyan-400/80 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}