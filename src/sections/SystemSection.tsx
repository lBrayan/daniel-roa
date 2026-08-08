import { useRef } from "react";
import { useGsapScene, reducedReveal } from "@/hooks/useGsapScene";
import { SectionTitle } from "@/components/cinema/SectionTitle";
import { useTranslation } from "react-i18next"; // <-- 1. Importamos el hook

/** 
 * 2. Cambiamos 'label' por 'key' para mapear las traducciones. 
 */
const PIECES_DATA = [
  { key: "auth", angle: -150 },
  { key: "microservices", angle: -95 },
  { key: "eventBus", angle: -40 },
  { key: "cache", angle: 15 },
  { key: "storage", angle: 70 },
  { key: "monitoring", angle: 125 },
  { key: "ai", angle: 180 },
];

const CX = 350;
const CY = 260;
const R = 210;

function pos(angle: number) {
  const rad = (angle * Math.PI) / 180;
  // Ajustamos ligeramente el multiplicador vertical para mantener la proporción
  return { x: CX + Math.cos(rad) * R, y: CY + Math.sin(rad) * R * 0.82 };
}

/**
 * Sección 3 — El sistema crece.
 * Cada tramo de scroll conecta e ilumina un nuevo componente.
 */
export function SystemSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation(); // <-- 3. Extraemos 't'

  useGsapScene(ref, ({ gsap, q, root, reduced }) => {
    const edges = q("[data-edge]");
    const pieces = q("[data-piece]");

    if (reduced) {
      gsap.set(edges, { strokeDashoffset: 0 });
      reducedReveal(gsap, pieces, root);
      return;
    }

    gsap.set(edges, { strokeDashoffset: 1, autoAlpha: 0 });
    gsap.set(pieces, { autoAlpha: 0, scale: 0.8, transformOrigin: "center" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=320%", pin: true, scrub: 1 },
    });

    edges.forEach((edge, i) => {
      tl.to(edge, { autoAlpha: 1, strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" });
      tl.to(edge, { opacity: 0.45, duration: 0.4, ease: "power1.out" }, ">-0.1");
      tl.to(pieces[i]!, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out" }, "<-0.35");
    });
  });

  return (
    <section ref={ref} className="relative flex h-screen flex-col justify-start overflow-hidden px-6 pt-24 pb-12">
      {/* <-- 4. Traducimos el título */}
      <SectionTitle>{t("system.title")}</SectionTitle>

      <div className="mt-8 flex flex-1 items-center justify-center">
        <svg
          viewBox="0 0 700 520"
          className="h-[60vh] w-full max-w-5xl"
          role="img"
          aria-label={t("system.diagramAria")}
        >
          {/* 1. PRIMERO dibujamos las líneas para que queden en el fondo */}
          {PIECES_DATA.map((p) => {
            const { x, y } = pos(p.angle);
            return (
              <line
                key={`e-${p.key}`}
                data-edge
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke="var(--arc)"
                strokeWidth="1.5"
                pathLength={1}
                strokeDasharray={1}
              />
            );
          })}

          {/* 2. DESPUÉS dibujamos el CORE para que tape las líneas que llegan al centro */}
          <circle
            cx={CX}
            cy={CY}
            r="60"
            fill="#050505" /* <-- Relleno sólido idéntico al de las demás cajas */
            stroke="var(--arc)"
          />
          <text
            x={CX}
            y={CY + 5}
            textAnchor="middle"
            fill="#fff"
            fontSize="16"
            letterSpacing="3"
            fontWeight="bold"
          >
            {t("system.core")}
          </text>

          {/* 3. Por último dibujamos los nodos exteriores */}
          {PIECES_DATA.map((p) => {
            const { x, y } = pos(p.angle);
            return (
              <g data-piece key={p.key} style={{ transformOrigin: `${x}px ${y}px` }}>
                <rect
                  x={x - 85}
                  y={y - 23}
                  width="170"
                  height="46"
                  rx="10"
                  fill="#050505"
                  stroke="rgba(255,255,255,0.16)"
                />
                <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="14" letterSpacing="1">
                  {t(`system.pieces.${p.key}`)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}