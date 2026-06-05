"use client";

// src/components/PortfolioClient.tsx
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import CodeFace from "@/components/CodeFace";
import { ChatInput, QUICK_ACTIONS } from "@/components/ChatInput";
import { ResponsePanel, type AIResponse } from "@/components/ResponsePanel";
import { MobileChat } from "@/components/MobileChat";

export function PortfolioClient() {
    const [response, setResponse] = useState<AIResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTalking, setIsTalking] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pendingQuery, setPendingQuery] = useState<string | null>(null);

    const handleTalkStart = useCallback(() => setIsTalking(true), []);
    const handleTalkEnd = useCallback(() => setIsTalking(false), []);
    const handleMobileBadge = useCallback((query: string) => {
        setPendingQuery(query);
        setMobileOpen(true);
    }, []);

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ background: "#020818", minHeight: "100dvh" }}
        >

            {/* ═══════════════════════════════════════
                DESKTOP LAYOUT (lg+)
                — left panel fijo en viewport, no crece
                — right panel scrollea independiente
            ═══════════════════════════════════════ */}
            <div className="hidden lg:flex w-full" style={{ height: "100dvh" }}>

                {/* LEFT PANEL — altura fija al viewport, no scrollea */}
                <motion.aside
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative flex flex-col border-r border-cyan-900/20 shrink-0"
                    style={{
                        width: "420px",
                        height: "100dvh",       // ancla al viewport
                        position: "sticky",
                        top: 0,
                        background: "#020818",
                        overflow: "hidden",     // nunca scrollea
                    }}
                >
                    {/* Header */}
                    <header className="px-6 pt-8 pb-2 shrink-0">
                        <p className="font-mono text-[9px] uppercase tracking-[6px] text-cyan-600/60 mb-1">
                            Portfolio
                        </p>
                        <h1 className="font-mono text-lg font-semibold text-slate-100 leading-tight">
                            Brayan Daniel Roa
                        </h1>
                        <p className="font-mono text-xs text-cyan-500/70">
                            Senior Fullstack & IA Engineer
                        </p>
                    </header>

                    {/* CodeFace — ocupa el espacio disponible entre header y input */}
                    <div className="flex flex-1 items-center justify-center px-4 py-2 min-h-0">
                        <CodeFace isTalking={isTalking} onTalkEnd={handleTalkEnd} />
                    </div>

                    {/* ChatInput — siempre pegado al fondo */}
                    <div className="shrink-0">
                        <ChatInput
                            onResponse={setResponse}
                            onLoadingChange={setLoading}
                            onError={setError}
                            onTalkStart={handleTalkStart}
                        />
                    </div>
                </motion.aside>

                {/* RIGHT PANEL — scrollea independiente */}
                <motion.main
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="flex flex-col flex-1 min-w-0"
                    style={{
                        height: "100dvh",
                        overflow: "hidden",     // el scroll lo maneja ResponsePanel interno
                    }}
                    aria-label="Respuestas del asistente"
                >
                    {/* Top bar */}
                    <div className="flex items-center gap-3 border-b border-cyan-900/20 px-6 py-4 shrink-0">
                        <div className="flex gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                        </div>
                        <span className="font-mono text-[10px] text-slate-600">
                            daniel-roa://portfolio
                        </span>
                        {loading && (
                            <span className="ml-auto flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                                <span className="font-mono text-[9px] text-cyan-600">procesando...</span>
                            </span>
                        )}
                    </div>

                    {/* ResponsePanel ocupa el espacio restante y scrollea solo */}
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <ResponsePanel response={response} loading={loading} error={error} />
                    </div>

                    {/* Footer */}
                    <footer className="border-t border-cyan-900/10 px-6 py-3 shrink-0">
                        <p className="font-mono text-[9px] text-slate-700">
                            © 2025 Brayan Daniel Roa ·{" "}

                            <a href="mailto:lbrayan.roa@gmail.com" className="text-cyan-800/60 hover:text-cyan-600 transition-colors">
                                lbrayan.roa@gmail.com
                            </a>{" "}
                            ·{" "}

                            <a href="https://github.com/lBrayan"
                                target="_blank"
                                rel="noopener noreferrer" className="text-cyan-800/60 hover:text-cyan-600 transition-colors"
                            >
                                GitHub
                            </a>{" "}
                            ·{" "}

                            <a href="https://www.linkedin.com/in/bdanielroar"
                                target="_blank"
                                rel="noopener noreferrer" className="text-cyan-800/60 hover:text-cyan-600 transition-colors"
                            >
                                LinkedIn
                            </a>
                        </p>
                    </footer>
                </motion.main>
            </div>

            {/* ═══════════════════════════════════════
                    MOBILE LAYOUT (< lg)
                ═══════════════════════════════════════ */}
            <div
                className="flex lg:hidden flex-col w-full"
                style={{ minHeight: "100dvh" }}
            >
                {/* Mobile header */}
                <header className="w-full px-5 pt-6 pb-2 text-center shrink-0">
                    <p className="font-mono text-[9px] uppercase tracking-[6px] text-cyan-600/60 mb-1">
                        Portfolio
                    </p>
                    <h1 className="font-mono text-base font-semibold text-slate-100">
                        Brayan Daniel Roa
                    </h1>
                    <p className="font-mono text-[11px] text-cyan-500/70">
                        Senior Fullstack & IA Engineer
                    </p>
                </header>

                {/* CodeFace */}
                <div className="flex flex-1 items-center justify-center px-4 py-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <CodeFace isTalking={isTalking} onTalkEnd={handleTalkEnd} />
                    </motion.div>
                </div>

                {/* CTA + badges */}
                <div className="w-full px-5 pb-8 pt-2 space-y-3 shrink-0">
                    <motion.button
                        onClick={() => { setPendingQuery(null); setMobileOpen(true); }}
                        className="w-full rounded-xl border border-cyan-700/40 bg-cyan-950/40 py-3.5 font-mono text-sm text-cyan-300 backdrop-blur-sm transition-all active:scale-[0.98]"
                        whileTap={{ scale: 0.97 }}
                        aria-label="Abrir chat con Daniel"
                    >
                        ▶ Pregúntame algo
                    </motion.button>

                    {/* Todos los badges iguales que desktop */}
                    <div className="flex flex-wrap gap-1.5 justify-center">
                        {QUICK_ACTIONS.map((a) => (
                            <button
                                key={a.label}
                                onClick={() => handleMobileBadge(a.query)}
                                className="rounded-full border border-cyan-900/40 bg-cyan-950/30 px-3 py-1 font-mono text-[10px] text-cyan-500/70 transition-all hover:border-cyan-600/50 hover:text-cyan-300"
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>

                    <footer className="text-center pt-2">
                        <p className="font-mono text-[8px] text-slate-700">
                            © 2025 Brayan Daniel Roa · Bogotá, Colombia
                        </p>
                    </footer>
                </div>
            </div>

            {/* Mobile Chat Sheet */}
            <MobileChat
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
        </div>
    );
}