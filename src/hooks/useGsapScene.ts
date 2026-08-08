import { useLayoutEffect, useRef, type RefObject } from "react";
import { initGsap } from "@/animations/gsap";
import type gsapType from "gsap";

type Build = (ctx: {
    gsap: typeof gsapType;
    root: HTMLElement;
    q: (selector: string) => HTMLElement[];
    reduced: boolean;
}) => void;

/**
 * Monta una escena GSAP acotada al elemento raíz.
 * Limpia todos los ScrollTrigger/listeners al desmontar mediante gsap.context.
 */
export function useGsapScene<T extends HTMLElement>(ref: RefObject<T | null>, build: Build) {
    const buildRef = useRef(build);
    buildRef.current = build;

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root || typeof window === "undefined") return;

        const { gsap } = initGsap();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const ctx = gsap.context(() => {
            const q = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, root);
            buildRef.current({ gsap, root, q, reduced });
        }, root);

        return () => ctx.revert();
    }, [ref]);
}

/** Fade sencillo usado cuando el usuario pide movimiento reducido. */
export function reducedReveal(gsap: typeof gsapType, targets: gsap.TweenTarget, root: Element) {
    gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 16 },
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: { trigger: root, start: "top 75%" },
        },
    );
}
