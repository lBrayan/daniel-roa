import { useRef } from "react";
import { useGsapScene, reducedReveal } from "@/hooks/useGsapScene";
import { useTranslation } from "react-i18next"; // <-- 1. Importamos el hook

export type Project = { name: string; description: string; tags?: string[] };

/**
 * Sección 7 — Proyectos como portales.
 * Cada nombre abre un portal que muestra una vista previa y vuelve a cerrarse.
 */
export function ProjectsSection({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation(); // <-- 2. Extraemos 't'

  useGsapScene(ref, ({ gsap, q, root, reduced }) => {
    const portals = q("[data-portal]");
    const previews = q("[data-preview]");
    const names = q("[data-project-name]");

    if (reduced) {
      gsap.set(portals, { height: "auto", autoAlpha: 1 });
      gsap.set(previews, { autoAlpha: 1 });
      reducedReveal(gsap, names, root);
      return;
    }

    gsap.set(names, { autoAlpha: 0.25, y: 12 });
    gsap.set(portals, { scaleY: 0, autoAlpha: 0, transformOrigin: "top center" });
    gsap.set(previews, { autoAlpha: 0, y: 18 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=340%", pin: true, scrub: 1 },
    });

    names.forEach((name, i) => {
      tl.to(name, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" });
      tl.to(portals[i]!, { scaleY: 1, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, "<0.1");
      tl.to(previews[i]!, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "<0.15");
      tl.to({}, { duration: 0.5 });
      tl.to(previews[i]!, { autoAlpha: 0, y: -12, duration: 0.35, ease: "power2.in" });
      tl.to(portals[i]!, { scaleY: 0, autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, "<0.1");
      tl.to(name, { autoAlpha: 0.25, duration: 0.3 }, "<");
    });
  });

  return (
    <section ref={ref} className="relative flex h-screen flex-col justify-start overflow-hidden px-6 pt-24 pb-12">
      {/* <-- 3. Traducimos el texto superior */}
      <p className="mb-8 text-[11px] tracking-[0.4em] text-mist uppercase">{t("projects.selectedWork")}</p>

      <ul className="mx-auto w-full max-w-3xl space-y-5">
        {projects.map((p) => (
          <li key={p.name}>
            <h3
              data-project-name
              className="text-lg font-medium tracking-tight text-white sm:text-2xl"
            >
              {p.name}
            </h3>
            <div
              data-portal
              className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] will-change-transform"
            >
              <div data-preview className="p-5">
                <p className="text-sm leading-relaxed text-mist">{p.description}</p>
                <div className="mt-4 flex gap-2">
                  <span className="h-1 w-16 rounded bg-arc/60" />
                  <span className="h-1 w-10 rounded bg-white/15" />
                  <span className="h-1 w-6 rounded bg-white/10" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}