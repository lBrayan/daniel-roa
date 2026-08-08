import { useRef } from "react";
import { useGsapScene, reducedReveal } from "@/hooks/useGsapScene";
import { SectionTitle } from "@/components/cinema/SectionTitle";
import { useTranslation } from "react-i18next"; // <-- 1. Importamos el hook

// 2. Cambiamos los textos fijos por claves que coincidan con nuestro JSON
const NODE_KEYS = ["user", "frontend", "api", "database"];

/**
 * Sección 2 — Everything starts with an idea.
 * Un punto luminoso genera línea a línea una arquitectura mínima (SVG puro).
 */
export function IdeaSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation(); // <-- 3. Extraemos 't'

  useGsapScene(ref, ({ gsap, q, root, reduced }) => {
    const nodes = q("[data-node]");
    const lines = q("[data-line]");
    const dot = q("[data-dot]");

    if (reduced) {
      gsap.set([...lines], { strokeDashoffset: 0 });
      reducedReveal(gsap, [...dot, ...nodes], root);
      return;
    }

    gsap.set(nodes, { autoAlpha: 0, y: 24, scale: 0.94 });
    gsap.set(lines, { strokeDashoffset: 1, autoAlpha: 0 });
    gsap.set(dot, { scale: 0, autoAlpha: 0, transformOrigin: "center" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=200%", pin: true, scrub: 1 },
    });

    tl.to(dot, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "power3.out" });
    tl.to(nodes[0]!, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }, ">-0.1");
    lines.forEach((line, i) => {
      tl.to(line, { autoAlpha: 1, strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" });
      tl.to(
        nodes[i + 1]!,
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
        ">-0.25",
      );
    });
    tl.to(q("[data-diagram]"), { scale: 1.06, duration: 1, ease: "power1.inOut" }, "<");
  });

  return (
    <section ref={ref} className="relative flex h-screen flex-col justify-start overflow-hidden px-6 pt-24 pb-12">
      {/* <-- 4. Traducimos el título */}
      <SectionTitle>{t("idea.title")}</SectionTitle>

      <div className="mt-10 flex flex-1 items-center justify-center">
        <svg
          data-diagram
          viewBox="0 0 320 440"
          className="h-[46vh] w-full max-w-[340px]"
          role="img"
          // <-- 5. Traducimos el texto accesible del diagrama
          aria-label={t("idea.diagramAria")}
        >
          <circle data-dot cx="160" cy="220" r="4" fill="var(--arc)" />
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              data-line
              x1="160"
              y1={78 + i * 120}
              x2="160"
              y2={130 + i * 120}
              stroke="var(--arc)"
              strokeWidth="1"
              pathLength={1}
              strokeDasharray={1}
            />
          ))}
          {NODE_KEYS.map((nodeKey, i) => (
            <g data-node key={nodeKey} style={{ transformOrigin: `160px ${52 + i * 120}px` }}>
              <rect
                x="70"
                y={30 + i * 120}
                width="180"
                height="46"
                rx="10"
                fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.14)"
              />
              <text
                x="160"
                y={58 + i * 120}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                letterSpacing="2"
              >
                {/* <-- 6. Extraemos la traducción dinámica de cada nodo */}
                {t(`idea.nodes.${nodeKey}`)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}