"use client";

// src/components/PortfolioClient.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import CodeFace from "@/components/CodeFace";
import { ChatInput, QUICK_ACTIONS } from "@/components/ChatInput";
import { ResponsePanel, type AIResponse } from "@/components/ResponsePanel";
import { MobileChat } from "@/components/MobileChat";
import { SplitTextReveal } from "@/components/SplitTextReveal";
import { Magnetic } from "@/components/Magnetic";
import { ClientParallax } from "./ClientParallax";

export function PortfolioClient() {
    const [response, setResponse] = useState<AIResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTalking, setIsTalking] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pendingQuery, setPendingQuery] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const { scrollYProgress } = useScroll({
        target: hasMounted ? containerRef : undefined,
        offset: ["start start", "end end"]
    });
    const asideY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const asideBlur = useTransform(scrollYProgress, [0, 0.4], [0, 8]);
    const blurStyle = useMotionTemplate`blur(${asideBlur}px)`;

    const handleTalkStart = useCallback(() => setIsTalking(true), []);
    const handleTalkEnd = useCallback(() => setIsTalking(false), []);
    const handleMobileBadge = useCallback((query: string) => {
        setPendingQuery(query);
        setMobileOpen(true);
    }, []);

    return (
        <ClientParallax>
            {(asideY: any, blurStyle: any) => (
                <div className="relative w-full" style={{ background: "#020818", minHeight: "100dvh" }}>

                    {/* ═══════════════════════════════════════
                        DESKTOP LAYOUT (lg+)
                    ═══════════════════════════════════════ */}
                    <div className="hidden lg:flex w-full items-start" style={{ minHeight: "100dvh" }}>

                        {/* LEFT PANEL */}
                        <motion.aside
                            aria-label="Perfil de Daniel Roa"
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative flex flex-col border-r border-cyan-900/20 shrink-0 z-30"
                            style={{
                                y: asideY,
                                filter: blurStyle,
                                width: "420px",
                                height: "100dvh",
                                position: "sticky",
                                top: 0,
                                background: "#020818",
                                overflow: "hidden",
                            }}
                        >
                            <header className="px-6 pt-8 pb-2 shrink-0">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="font-mono text-[10px] uppercase tracking-[6px] text-cyan-400/70 mb-1"
                                    aria-hidden="true"
                                >
                                    Portfolio
                                </motion.p>

                                {/* h1 único real — solo visible en desktop */}
                                <h1 className="font-mono text-lg font-semibold text-slate-100 leading-tight">
                                    <SplitTextReveal text="Brayan Daniel Roa" delay={0.3} />
                                </h1>

                                <p className="font-mono text-xs text-cyan-300/80 mt-1">
                                    <SplitTextReveal text="Senior Fullstack & IA Engineer" delay={0.6} />
                                </p>
                            </header>

                            <div className="flex flex-1 items-center justify-center px-4 py-2 min-h-0">
                                <CodeFace isTalking={isTalking} onTalkEnd={handleTalkEnd} />
                            </div>

                            <div className="shrink-0">
                                <ChatInput
                                    onResponse={setResponse}
                                    onLoadingChange={setLoading}
                                    onError={setError}
                                    onTalkStart={handleTalkStart}
                                />
                            </div>
                        </motion.aside>

                        {/* RIGHT PANEL */}
                        <motion.section
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                            className="flex flex-col flex-1 min-w-0"
                            aria-label="Respuestas del asistente"
                            aria-live="polite"
                            aria-atomic="false"
                        >
                            {/* Navegación lateral decorativa */}
                            <div
                                className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4"
                                aria-hidden="true"
                            >
                                {['Inicio', 'Proyectos', 'Experiencia', 'Contacto'].map((section) => (
                                    <motion.div
                                        key={section}
                                        className="h-10 w-0.5 bg-cyan-900/20 relative"
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-cyan-500 origin-top"
                                            initial={{ scaleY: 0 }}
                                            whileInView={{ scaleY: 1 }}
                                            viewport={{ margin: "-50% 0px -50% 0px" }}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Top bar */}
                            <div
                                className="flex items-center gap-3 border-b border-cyan-900/20 px-6 py-4 shrink-0 sticky top-0 z-20 bg-[#020818]/80 backdrop-blur-md"
                                role="status"
                                aria-live="polite"
                            >
                                <div className="flex gap-1.5" aria-hidden="true">
                                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                                </div>
                                <span className="font-mono text-[10px] text-slate-400" aria-hidden="true">
                                    brayan-roa://portfolio
                                </span>
                                {loading && (
                                    <span className="ml-auto flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" aria-hidden="true" />
                                        <span className="sr-only">Procesando respuesta</span>
                                        <span className="font-mono text-[10px] text-cyan-400" aria-hidden="true">procesando...</span>
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 pb-16">
                                <ResponsePanel response={response} loading={loading} error={error} />
                            </div>

                            <footer className="border-t border-cyan-900/10 px-6 py-6 shrink-0 mt-auto bg-[#020818]">
                                <p className="font-mono text-[10px] text-slate-400">
                                    © 2026 Brayan Daniel Roa ·{" "}

                                    <a href="mailto:lbrayan.roa@gmail.com"
                                        className="text-cyan-400/80 hover:text-cyan-300 transition-colors underline underline-offset-2 decoration-cyan-900/50 hover:decoration-cyan-400/50"
                                    >
                                        lbrayan.roa@gmail.com
                                    </a>{" "}
                                    ·{" "}

                                    <a href="https://github.com/lBrayan"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-400/80 hover:text-cyan-300 transition-colors underline underline-offset-2 decoration-cyan-900/50 hover:decoration-cyan-400/50"
                                    >
                                        GitHub
                                    </a>{" "}
                                    ·{" "}

                                    <a href="https://www.linkedin.com/in/bdanielroar"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-400/80 hover:text-cyan-300 transition-colors underline underline-offset-2 decoration-cyan-900/50 hover:decoration-cyan-400/50"
                                    >
                                        LinkedIn
                                    </a>
                                </p>
                            </footer>
                        </motion.section>
                    </div>

                    {/* ═══════════════════════════════════════
                        MOBILE LAYOUT (< lg)
                    ═══════════════════════════════════════ */}
                    <div
                        className="flex lg:hidden flex-col w-full"
                        style={{ minHeight: "100dvh" }}
                    >
                        <header className="w-full px-5 pt-6 pb-2 text-center shrink-0">
                            <p className="font-mono text-[10px] uppercase tracking-[6px] text-cyan-400/70 mb-1" aria-hidden="true">
                                Portfolio
                            </p>
                            {/* h2 en mobile — el h1 real ya está en desktop en el mismo DOM */}
                            <h2 className="font-mono text-base font-semibold text-slate-100">
                                Brayan Daniel Roa
                            </h2>
                            <p className="font-mono text-[11px] text-cyan-300/80">
                                Senior Fullstack & IA Engineer
                            </p>
                        </header>

                        <div className="flex flex-1 items-center justify-center px-4 py-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7 }}
                            >
                                <CodeFace isTalking={isTalking} onTalkEnd={handleTalkEnd} />
                            </motion.div>
                        </div>

                        <div className="w-full px-5 pb-8 pt-2 space-y-3 shrink-0">
                            <Magnetic intensity={0.2} className="w-full block">
                                <motion.button
                                    type="button"
                                    onClick={() => { setPendingQuery(null); setMobileOpen(true); }}
                                    className="w-full rounded-xl border border-cyan-700/40 bg-cyan-950/40 py-3.5 font-mono text-sm text-cyan-300 backdrop-blur-sm transition-all"
                                    whileTap={{ scale: 0.97 }}
                                    aria-label="Abrir chat con Daniel Roa"
                                    aria-expanded={mobileOpen}
                                    aria-controls="mobile-chat-dialog"
                                >
                                    ▶ Pregúntame algo
                                </motion.button>
                            </Magnetic>

                            <nav aria-label="Accesos rápidos al portfolio">
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {QUICK_ACTIONS.map((a) => (
                                        <button
                                            type="button"
                                            key={a.label}
                                            onClick={() => handleMobileBadge(a.query)}
                                            className="rounded-full border border-cyan-900/40 bg-cyan-950/30 px-3 py-1 font-mono text-[10px] text-cyan-300/80 transition-all hover:border-cyan-600/50 hover:text-cyan-300"
                                        >
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </nav>

                            <footer className="text-center pt-2">
                                <p className="font-mono text-[10px] text-slate-400">
                                    © 2026 Brayan Daniel Roa · Bogotá, Colombia
                                </p>
                            </footer>
                        </div>
                    </div>

                    <MobileChat
                        attr-id="mobile-chat-dialog"
                        open={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                        response={response}
                        loading={loading}
                        error={error}
                        onResponse={setResponse}
                        onLoadingChange={setLoading}
                        onError={setError}
                        onTalkStart={handleTalkStart}
                        pendingQuery={pendingQuery}
                        onPendingQueryConsumed={() => setPendingQuery(null)}
                    />
                </div >
            )
            }
        </ClientParallax >
    );
}