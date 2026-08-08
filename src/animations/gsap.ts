import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registra ScrollTrigger una sola vez (solo en cliente). */
export function initGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Curvas compartidas: todo debe tener inercia, peso y desaceleración. */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  soft: "expo.out",
} as const;

export { gsap, ScrollTrigger };