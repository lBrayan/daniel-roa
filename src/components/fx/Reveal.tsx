import type { ReactNode } from "react";
import { useInView } from "./useInView";

type Props = {
    children: ReactNode;
    delay?: number;
    className?: string;
    as?: "div" | "section" | "article" | "li";
};

/** Envoltorio que anima la entrada del contenido al hacer scroll. */
export function Reveal({ children, delay = 0, className = "", as = "div" }: Props) {
    const { ref, inView } = useInView<HTMLDivElement>(0.15);
    const Tag = as;

    return (
        <Tag
            ref={ref as never}
            className={`reveal ${inView ? "reveal-in" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </Tag>
    );
}
