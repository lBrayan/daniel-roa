import { useRef } from "react";
import { useGsapScene, reducedReveal } from "@/hooks/useGsapScene";
import { SectionTitle } from "@/components/cinema/SectionTitle";
import { useTranslation } from "react-i18next"; // <-- 1. Importamos el hook

/** Nodos de la red: coordenadas en el viewBox 0 0 720 460. */
const NODES = [
  { id: "react", x: 110, y: 90 },
  { id: "typescript", x: 110, y: 240 },
  { id: "node", x: 300, y: 150 },
  { id: "postgresql", x: 300, y: 330 },
  { id: "aws", x: 500, y: 100 },
  { id: "docker", x: 500, y: 250 },
  { id: "githubActions", x: 500, y: 390 },
  { id: "ai", x: 650, y: 230 },
];

const EDGES: [number, number][] = [
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [5, 6],
  [4, 7],
  [5, 7],
  [6, 7],
];

/**
 * Sección 6 — Technology Stack.
 * No es una nube de logos: es una red que se conecta con el scroll.
 */
export function StackSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation(); // <-- 2. Extraemos 't'

  useGsapScene(ref, ({ gsap, q, root, reduced }) => {
    const edges = q("[data-edge]");
    const nodes = q("[data-node]");

    if (reduced) {
      gsap.set(edges, { strokeDashoffset: 0 });
      reducedReveal(gsap, nodes, root);
      return;
    }

    gsap.set(edges, { strokeDashoffset: 1, autoAlpha: 0 });
    gsap.set(nodes, { autoAlpha: 0, scale: 0.7, transformOrigin: "center" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=280%", pin: true, scrub: 1 },
    });

    nodes.forEach((node, i) => {
      tl.to(node, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" }, i * 0.35);
    });
    edges.forEach((edge, i) => {
      tl.to(
        edge,
        { autoAlpha: 0.6, strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" },
        0.5 + i * 0.28,
      );
    });
  });

  return (
    <section ref={ref} className="relative flex h-screen flex-col justify-start overflow-hidden px-6 pt-24 pb-12">
      {/* <-- 3. Traducimos el título */}
      <SectionTitle>{t("stack.title")}</SectionTitle>

      <div className="mt-8 flex flex-1 items-center justify-center">
        <svg
          viewBox="0 0 720 460"
          className="h-[60vh] w-full max-w-5xl" /* <-- 4. Aumentamos tamaño a 60vh y max-w-5xl */
          role="img"
          // <-- 5. Traducimos el texto accesible del SVG
          aria-label={t("stack.diagramAria")}
        >
          {EDGES.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              data-edge
              x1={NODES[a]!.x}
              y1={NODES[a]!.y}
              x2={NODES[b]!.x}
              y2={NODES[b]!.y}
              stroke="var(--arc)"
              strokeWidth="1.8" /* <-- Líneas más visibles */
              pathLength={1}
              strokeDasharray={1}
            />
          ))}
          {NODES.map((n) => (
            <g data-node key={n.id} style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
              <circle cx={n.x} cy={n.y} r="7" fill="var(--arc)" /> {/* <-- Círculo central más grande */}
              <circle cx={n.x} cy={n.y} r="18" fill="#050505" stroke="rgba(255,255,255,0.18)" /> {/* <-- Órbita con fondo sólido para tapar líneas por detrás */}
              <text
                x={n.x}
                y={n.y - 28}
                textAnchor="middle"
                fill="#fff"
                fontSize="14" /* <-- Fuente más grande y legible */
                fontWeight="500"
                letterSpacing="1"
              >
                {/* <-- 6. Traducimos el nombre de la tecnología (si aplica) o usamos su valor */}
                {t(`stack.nodes.${n.id}`)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}