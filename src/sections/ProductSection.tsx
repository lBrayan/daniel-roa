import { useRef } from "react";
import { useGsapScene, reducedReveal } from "@/hooks/useGsapScene";
import { SectionTitle } from "@/components/cinema/SectionTitle";
import { useTranslation } from "react-i18next"; // <-- 1. Importamos el hook

// 2. Cambiamos los textos quemados por claves de traducción
const SCREEN_KEYS = ["dashboard", "marketplace", "pos", "inventory", "analytics", "payments"];

/**
 * Sección 4 — From Architecture to Product.
 * Los bloques técnicos se transforman orgánicamente en pantallas de producto.
 */
export function ProductSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation(); // <-- 3. Extraemos 't'

  useGsapScene(ref, ({ gsap, q, root, reduced }) => {
    const screens = q("[data-screen]");

    if (reduced) {
      reducedReveal(gsap, screens, root);
      return;
    }

    gsap.set(screens, { autoAlpha: 0, scale: 0.82, y: 30, filter: "blur(8px)" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=260%", pin: true, scrub: 1 },
    });

    screens.forEach((screen) => {
      tl.to(screen, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
      });
      tl.to(screen.querySelectorAll("[data-line]"), {
        scaleX: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      });
    });
  });

  return (
    <section ref={ref} className="relative flex h-screen flex-col justify-start overflow-hidden px-6 pt-24 pb-12">
      {/* <-- 4. Traducimos el título */}
      <SectionTitle>{t("product.title")}</SectionTitle>

      <div className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {SCREEN_KEYS.map((sKey) => (
          <figure
            data-screen
            key={sKey} // <-- Usamos la clave como key de React
            className="rounded-xl border border-white/10 bg-white/[0.02] p-3 will-change-transform"
          >
            <div className="flex gap-1.5">
              <span className="size-1.5 rounded-full bg-white/25" />
              <span className="size-1.5 rounded-full bg-white/15" />
              <span className="size-1.5 rounded-full bg-white/10" />
            </div>
            <div className="mt-3 space-y-2">
              <span data-line className="block h-7 origin-left scale-x-0 rounded bg-arc/25" />
              <span data-line className="block h-2 w-4/5 origin-left scale-x-0 rounded bg-white/12" />
              <span data-line className="block h-2 w-3/5 origin-left scale-x-0 rounded bg-white/10" />
            </div>
            <figcaption className="mt-4 text-[11px] tracking-[0.22em] text-mist uppercase">
              {/* <-- 5. Traducimos el nombre de cada pantalla */}
              {t(`product.screens.${sKey}`)}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}