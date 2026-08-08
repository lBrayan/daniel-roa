import { useRef } from "react";
import { useGsapScene } from "@/hooks/useGsapScene";
import { createParticleField } from "@/utils/particleField";
import { useTranslation } from "react-i18next"; // <-- 1. Importamos el hook

/**
 * Sección 1 — Hero.
 * El nombre se dibuja como partículas; al hacer scroll se desintegran hacia
 * el centro mientras emerge una cuadrícula tecnológica muy tenue.
 */
export function HeroSection({ name = "Brayan R" }: { name?: string }) {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // <-- 2. Inicializamos la función 't' para traducir textos
  const { t } = useTranslation();

  useGsapScene(ref, ({ gsap, q, root, reduced }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const field = createParticleField(canvas, name);
    field.resize();

    const onResize = () => field.resize();
    window.addEventListener("resize", onResize);

    if (reduced) {
      field.render(0);
      return () => window.removeEventListener("resize", onResize);
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=130%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => field.render(self.progress),
      },
    });

    tl.to(q("[data-hero-copy]"), { autoAlpha: 0, y: -30, filter: "blur(6px)", duration: 0.5 }, 0)
      .to(q("[data-hero-hint]"), { autoAlpha: 0, duration: 0.2 }, 0)
      .fromTo(q("[data-hero-grid]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 0.25);

    return () => window.removeEventListener("resize", onResize);
  });

  return (
    <section ref={ref} className="relative flex h-screen items-center justify-center px-6">
      <div data-hero-grid className="stage-grid absolute inset-0 opacity-0" aria-hidden />

      {/* <-- 3. Reemplazamos el texto para lectores de pantalla */}
      <h1 className="sr-only">{t("hero.srTitle")}</h1>

      <div className="relative flex w-full max-w-4xl flex-col items-center">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="h-[34vh] w-full max-h-[260px]"
          style={{ willChange: "contents" }}
        />

        <div data-hero-copy className="mt-2 flex flex-col items-center gap-2 text-center">
          {/* <-- 4. Reemplazamos los roles usando las claves del JSON */}
          <p className="text-sm tracking-[0.35em] text-mist uppercase sm:text-base">
            {t("hero.role1")}
          </p>
          <p className="text-sm tracking-[0.35em] text-mist uppercase sm:text-base">
            {t("hero.role2")}
          </p>
          <p className="text-sm tracking-[0.35em] text-mist uppercase sm:text-base">
            {t("hero.role3")}
          </p>
        </div>
      </div>

      <span
        data-hero-hint
        className="absolute bottom-10 text-[11px] tracking-[0.4em] text-mist/60 uppercase"
      >
        {/* <-- 5. Reemplazamos la indicación de scroll */}
        {t("hero.scrollHint")}
      </span>
    </section>
  );
}