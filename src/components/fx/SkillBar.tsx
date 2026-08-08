import { useEffect, useState } from "react";
import { useInView } from "./useInView";

/** Barra de skill que carga al entrar en viewport y muestra el % en tooltip. */
export function SkillBar({
    name,
    level,
    delay = 0,
}: {
    name: string;
    level: number;
    delay?: number;
}) {
    const { ref, inView } = useInView<HTMLDivElement>(0.3);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let raf = 0;
        const start = performance.now() + delay;
        const dur = 1100;
        const tick = (now: number) => {
            const t = Math.min(1, Math.max(0, (now - start) / dur));
            const eased = 1 - Math.pow(1 - t, 3);
            setCount(Math.round(eased * level));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, level, delay]);

    return (
        <div ref={ref} className="group/skill relative">
            <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] tracking-wide opacity-80">{name}</span>
                <span className="font-mono text-[11px] text-cyan opacity-0 transition group-hover/skill:opacity-100">
                    {count}%
                </span>
            </div>
            <div
                className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-navy-foreground/10"
                role="progressbar"
                aria-label={name}
                aria-valuenow={level}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <span
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan via-blue to-purple shadow-glow"
                    style={{
                        width: inView ? `${level}%` : "0%",
                        transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
                    }}
                />
            </div>

            {/* Tooltip */}
            <span className="pointer-events-none absolute -top-7 right-0 z-10 scale-90 rounded-md border border-cyan/40 bg-navy px-2 py-1 font-mono text-[10px] text-cyan opacity-0 shadow-glow transition duration-200 group-hover/skill:scale-100 group-hover/skill:opacity-100">
                {level}%
            </span>
        </div>
    );
}
