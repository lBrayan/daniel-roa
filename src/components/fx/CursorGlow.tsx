import type { ReactNode } from "react";

/** Título de sección: editorial, mucho aire, sin decoración. */
export function SectionTitle({
    children,
    align = "left",
}: {
    children: ReactNode;
    align?: "left" | "center";
}) {
    return (
        <h2
            data-section-title
            className={`font-inter text-2xl font-medium tracking-tight text-white sm:text-3xl md:text-4xl ${align === "center" ? "mx-auto text-center" : ""
                } max-w-3xl`}
        >
            {children}
        </h2>
    );
}
