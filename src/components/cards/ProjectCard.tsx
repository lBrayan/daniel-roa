"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { Code, Eye, Cpu } from "lucide-react";
import { ImagePrivate } from "./imagePrivate";

export interface ProjectItem {
    title: string;
    imageUrl: string;
    description: string;
    techStack: string[];
    features: string[];
}

// Hook de prevención de scroll (¡Excelente solución para convivir con Lenis!)
function usePreventLenis(ref: React.RefObject<HTMLDivElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handler = (e: WheelEvent) => {
            const atTop = el.scrollTop === 0;
            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

            const canScroll = el.scrollHeight > el.clientHeight;
            if (!canScroll) return;

            if (atTop && e.deltaY < 0) return;
            if (atBottom && e.deltaY > 0) return;

            e.stopPropagation();
        };

        el.addEventListener("wheel", handler, { passive: true });
        return () => el.removeEventListener("wheel", handler);
    }, [ref]);
}

export function ProjectCard({ item }: { item: ProjectItem }) {
    const isPrivate = item.imageUrl === "private";

    // Si no hay imagen, arranca directo en la tab de código
    const [activeTab, setActiveTab] = useState<"preview" | "code">(
        isPrivate ? "code" : "preview"
    );
    const previewRef = useRef<HTMLDivElement>(null);
    const codeRef = useRef<HTMLDivElement>(null);

    usePreventLenis(previewRef);
    usePreventLenis(codeRef);

    // 1. Coordenadas físicas del cursor (Bypass de React para 0 lag)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            className="group relative flex flex-col rounded-2xl bg-[#020818] border border-cyan-900/30 overflow-hidden transition-transform duration-500 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(0,211,243,0.06)]"
        >
            {/* 2. El "Spotlight": Halo de luz cyan calculado por hardware que persigue el cursor */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-0"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            400px circle at ${mouseX}px ${mouseY}px,
                            rgba(0, 211, 243, 0.12),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* 3. Contenedor Glassmorphism (Z-10 para estar por encima de la luz y difuminarla) */}
            <div className="relative z-10 flex flex-col h-full bg-[#020818]/70 backdrop-blur-sm">

                {/* Tabs Header */}
                <div className="flex p-1 bg-slate-950/40 border-b border-cyan-900/20 backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === "preview" ? "bg-[#040f1e] text-cyan-400 shadow-[0_0_15px_rgba(0,211,243,0.1)]" : "text-slate-600 hover:text-slate-400"}`}
                    >
                        <Eye size={12} /> Preview
                    </button>
                    <button
                        onClick={() => setActiveTab("code")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === "code" ? "bg-[#040f1e] text-cyan-400 shadow-[0_0_15px_rgba(0,211,243,0.1)]" : "text-slate-600 hover:text-slate-400"}`}
                    >
                        <Code size={12} /> {"</>"} Código
                    </button>
                </div>

                {/* Content Area */}
                <div className="relative h-64">
                    <AnimatePresence mode="wait">
                        {activeTab === "preview" ? (
                            <motion.div
                                key="preview"
                                data-scroll-inner
                                initial={{ opacity: 0, filter: "blur(4px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(4px)" }}
                                transition={{ duration: 0.3 }}
                                ref={previewRef}
                                className="absolute inset-0 p-3 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#00d3f3]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#00d3f3]/50 transition-colors"
                            >
                                {item.imageUrl === "private" ? (
                                    <ImagePrivate />
                                ) : (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-auto object-top rounded-xl shadow-lg ring-1 ring-cyan-900/20"
                                    />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="code"
                                data-scroll-inner
                                initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                                transition={{ duration: 0.3 }}
                                ref={codeRef}
                                className="absolute inset-0 p-5 text-slate-300 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#00d3f3]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#00d3f3]/50 transition-colors"
                            >
                                <h3 className="font-mono text-cyan-300 text-sm mb-3">{item.title}</h3>
                                <p className="text-xs leading-relaxed text-slate-400 mb-4 font-mono">
                                    {item.description}
                                </p>

                                {/* Tech Stack con efecto Glass */}
                                <div className="mb-4">
                                    <h4 className="text-[#00d3f3] text-[9px] uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                                        <Cpu size={10} /> Tech Stack
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 text-[9px] uppercase font-bold bg-cyan-950/40 border border-cyan-800/50 text-cyan-400 rounded backdrop-blur-md"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-1.5">
                                    {item.features.map((feat, i) => (
                                        <li
                                            key={i}
                                            className="text-[10px] text-slate-400 font-mono flex items-start gap-2"
                                        >
                                            <span className="text-cyan-600 font-bold">›</span> {feat}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}