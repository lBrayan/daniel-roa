import type { ReactNode } from "react";
import { useRef } from "react";

/** Tarjeta con reflejo que sigue el cursor dentro de su superficie. */
export function SpotlightCard({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ref}
            onPointerMove={(e) => {
                const el = ref.current;
                if (!el) return;
                const r = el.getBoundingClientRect();
                el.style.setProperty("--mx", `${e.clientX - r.left}px`);
                el.style.setProperty("--my", `${e.clientY - r.top}px`);
            }}
            className={`group relative overflow-hidden ${className}`}
        >
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background:
                        "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--cyan) 16%, transparent), transparent 70%)",
                }}
            />
            <div className="relative">{children}</div>
        </div>
    );
}
