import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Animaciones de entrada sutiles: los elementos con `data-reveal` aparecen
 * (fundido + leve desplazamiento) al entrar en pantalla.
 *
 * El HTML prerenderizado se ve completo sin JavaScript (bueno para SEO y para
 * quien desactive JS). Solo después de hidratar se activa la clase `motion` en
 * <html>; lo que ya está a la vista se marca visible de inmediato para que no
 * parpadee. Respeta `prefers-reduced-motion`.
 */
export function useReveal() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const root = document.documentElement;
        const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
        const vh = window.innerHeight;
        for (const el of nodes) {
            if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("is-in");
        }
        root.classList.add("motion");

        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        e.target.classList.add("is-in");
                        io.unobserve(e.target);
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
        );
        nodes.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [pathname]);
}
