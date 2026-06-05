"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsePanel, type AIResponse } from "@/components/ResponsePanel";
import { ChatInput } from "@/components/ChatInput";

interface MobileChatProps {
    open: boolean;
    onClose: () => void;
    response: AIResponse | null;
    loading: boolean;
    error: string | null;
    onResponse: (res: AIResponse) => void;
    onLoadingChange: (loading: boolean) => void;
    onError: (err: string | null) => void;
    onTalkStart?: () => void;
    pendingQuery?: string | null;           // ← nuevo
    onPendingQueryConsumed?: () => void;    // ← nuevo
}

export function MobileChat({
    open,
    onClose,
    response,
    loading,
    error,
    onResponse,
    onLoadingChange,
    onError,
    onTalkStart,
    pendingQuery,
    onPendingQueryConsumed,
}: MobileChatProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    // Ref al método send del ChatInput
    const sendRef = useRef<((query: string, fromButton?: boolean) => void) | null>(null);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    // Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    // Disparar pendingQuery cuando el sheet abre y hay query pendiente
    useEffect(() => {
        if (open && pendingQuery && sendRef.current) {
            // Pequeño delay para que la animación del sheet empiece
            const t = setTimeout(() => {
                sendRef.current?.(pendingQuery, true);
                onPendingQueryConsumed?.();
            }, 300);
            return () => clearTimeout(t);
        }
    }, [open, pendingQuery, onPendingQueryConsumed]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Chat con Daniel"
                        className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border-t border-cyan-800/30 bg-[#020c1a] shadow-[0_-8px_40px_rgba(0,0,0,0.7)]"
                        style={{ height: "92dvh", maxHeight: "92dvh" }}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 350, damping: 38 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-cyan-900/20 px-5 py-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="absolute left-1/2 top-2 -translate-x-1/2 w-10 h-1 rounded-full bg-cyan-900/50" />
                                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600">
                                    {"< Daniel AI />"}
                                </span>
                                <br />
                                {loading && (
                                    <span className="flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                                        <span className="font-mono text-[9px] text-cyan-500/60">pensando...</span>
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-900/30 text-slate-500 transition-colors hover:border-cyan-700/50 hover:text-cyan-300"
                                aria-label="Cerrar chat"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-2 py-1 bg-amber-300 flex">
                            <span className="text-[8px] text-black">La IA puede cometer errores, si la respuesta no se visualiza bien o completa, intenta nuevamnete.</span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
                            <div className="flex-1 overflow-y-auto min-h-0">
                                <ResponsePanel response={response} loading={loading} error={error} />
                            </div>
                            <ChatInput
                                onResponse={onResponse}
                                onLoadingChange={onLoadingChange}
                                onError={onError}
                                onTalkStart={onTalkStart}
                                sendRef={sendRef}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}