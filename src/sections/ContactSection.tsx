import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useGsapScene } from "@/hooks/useGsapScene";
import { useTranslation } from "react-i18next"; // <-- 1. Importamos el hook

type Contact = { email: string; linkedin: string; github: string };

/**
 * Sección final — Escenario vacío, mensaje y contacto.
 */
export function ContactSection({ contact }: { contact: Contact }) {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation(); // <-- 2. Extraemos 't'

  useGsapScene(ref, ({ gsap, q, root, reduced }) => {
    const headline = q("[data-final-headline]");
    const items = q("[data-final-item]");

    if (reduced) {
      gsap.set([...headline, ...items], { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.set(headline, { autoAlpha: 0, y: 40, filter: "blur(10px)" });
    gsap.set(items, { autoAlpha: 0, y: 24 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=160%", pin: true, scrub: 1 },
    });

    tl.to(headline, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" });
    tl.to(items, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.25, ease: "power3.out" }, ">0.2");
  });

  return (
    <section ref={ref} className="relative flex h-screen flex-col items-center justify-center px-6">
      <h2
        data-final-headline
        className="max-w-3xl text-center text-2xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl"
      >
        {/* <-- 3. Traducimos el titular */}
        {t("contact.headline")}
      </h2>

      <div className="mt-14 flex flex-col items-center gap-5 text-sm">
        <a
          data-final-item
          href={`mailto:${contact.email}`}
          className="text-mist transition-colors hover:text-white"
        >
          {contact.email}
        </a>
        <a
          data-final-item
          href={`https://${contact.linkedin}`}
          target="_blank"
          rel="noreferrer"
          className="text-mist transition-colors hover:text-white"
        >
          {/* <-- 4. Traducimos etiqueta de LinkedIn (opcional, suele dejarse igual, pero queda mapeado) */}
          {t("contact.linkedin")}
        </a>
        <a
          data-final-item
          href={`https://${contact.github}`}
          target="_blank"
          rel="noreferrer"
          className="text-mist transition-colors hover:text-white"
        >
          {t("contact.github")}
        </a>
        <Link
          data-final-item
          to="/cv"
          className="mt-4 rounded-full border border-white/20 px-6 py-2.5 text-sm text-white transition-colors hover:border-arc hover:text-arc"
        >
          {/* <-- 5. Traducimos el botón de descarga del CV */}
          {t("contact.downloadResume")}
        </Link>
      </div>
    </section>
  );
}