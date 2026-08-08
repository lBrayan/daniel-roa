import { useRef } from "react";
import { useGsapScene, reducedReveal } from "@/hooks/useGsapScene";
import { SectionTitle } from "@/components/cinema/SectionTitle";
import { useTranslation } from "react-i18next"; // <-- 1. Importamos el hook

/** 
 * 2. Cambiamos el arreglo por claves descriptivas para los pasos.
 */
const STEP_KEYS = ["discovery", "architecture", "development", "testing", "deployment", "optimization"];

/**
 * Sección 5 — How I Build.
 * Una línea vertical se dibuja con el scroll y revela cada paso del proceso.
 */
export function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation(); // <-- 3. Extraemos 't'

  useGsapScene(ref, ({ gsap, q, root, reduced }) => {
    const steps = q("[data-step]");
    const line = q("[data-spine]");

    if (reduced) {
      gsap.set(line, { scaleY: 1 });
      reducedReveal(gsap, steps, root);
      return;
    }

    gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(steps, { autoAlpha: 0, x: 24 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=280%", pin: true, scrub: 1 },
    });

    tl.to(line, { scaleY: 1, duration: STEP_KEYS.length, ease: "none" }, 0);
    steps.forEach((step, i) => {
      tl.to(step, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, i * 0.9 + 0.15);
    });
  });

  return (
    <section ref={ref} className="relative flex h-screen flex-col justify-start overflow-hidden px-6 pt-24 pb-12">
      {/* <-- 4. Traducimos el título principal */}
      <SectionTitle>{t("process.title")}</SectionTitle>

      <div className="relative mx-auto mt-10 w-full max-w-2xl pl-8">
        <span
          data-spine
          className="absolute top-1 left-0 h-full w-px bg-gradient-to-b from-arc/70 to-arc/10"
          aria-hidden
        />
        <ol className="space-y-7">
          {STEP_KEYS.map((key) => (
            <li data-step key={key} className="relative">
              <span className="absolute top-2 -left-8 size-1.5 -translate-x-[3px] rounded-full bg-arc" />
              {/* <-- 5. Extraemos la traducción del nombre y la nota de cada paso */}
              <p className="text-lg font-medium text-white sm:text-xl">{t(`process.steps.${key}.name`)}</p>
              <p className="mt-1 text-sm text-mist">{t(`process.steps.${key}.note`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}