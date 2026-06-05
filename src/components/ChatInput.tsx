"use client";

// src/components/ChatInput.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import type { AIResponse } from "@/components/ResponsePanel";
import { getFallback } from "@/lib/fallbacks";
import { STATIC_RESPONSES } from "@/data/staticResponses";

export const QUICK_ACTIONS = [
    { label: "Proyectos", query: "¿Qué proyectos has realizado?" },
    { label: "Experiencia", query: "Cuéntame tu experiencia laboral" },
    { label: "Skills", query: "¿Cuáles son tus habilidades técnicas?" },
    { label: "Sobre mí", query: "¿Quién eres y cuál es tu perfil?" },
    { label: "Historia en la programación", query: "¿Como es tu historia en la programción?" },
    { label: "Contacto", query: "¿Cómo puedo contactarte?" },
    { label: "IA & Cloud", query: "¿Cuál es tu experiencia con IA y Cloud?" },
];

interface ChatInputProps {
    onResponse: (res: AIResponse) => void;
    onLoadingChange: (loading: boolean) => void;
    onError: (err: string | null) => void;
    onTalkStart?: () => void;
    sendRef?: React.MutableRefObject<((query: string, fromButton?: boolean) => void) | null>;
}

export function ChatInput({ onResponse, onLoadingChange, onError, onTalkStart, sendRef }: ChatInputProps) {
    const [value, setValue] = useState("");
    const [sending, setSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const send = useCallback(
        async (query: string, fromButton = false) => {
            if (!query.trim() || sending) return;

            if (fromButton) {
                const staticResponse = STATIC_RESPONSES[query];
                if (staticResponse) {
                    onTalkStart?.();
                    onResponse(staticResponse);
                    onError(null);
                    return;
                }
            }

            setSending(true);
            onLoadingChange(true);
            onError(null);
            onTalkStart?.();

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: query }),
                });

                if (res.status === 503 || res.status === 429) {
                    const fallback = getFallback(query);
                    if (fallback) {
                        onResponse(fallback);
                        onError(null);
                    } else {
                        onError("No entiendo esa pregunta. Prueba con los botones de arriba para explorar mis proyectos, experiencia, skills y más.");
                    }
                    return;
                }

                if (!res.ok) throw new Error("Error del servidor");

                const data: AIResponse = await res.json();
                onResponse(data);

            } catch {
                const fallback = getFallback(query);
                if (fallback) {
                    onResponse(fallback);
                    onError(null);
                } else {
                    onError("No entiendo esa pregunta. Prueba con los botones de arriba para explorar mis proyectos, experiencia, skills y más.");
                }
            } finally {
                setSending(false);
                onLoadingChange(false);
                setValue("");
            }
        },
        [sending, onResponse, onLoadingChange, onError, onTalkStart]
    );

    useEffect(() => {
        if (sendRef) sendRef.current = send;
    }, [send, sendRef]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        send(value, false);
    };

    return (
        <div className="border-t border-cyan-900/20 bg-[#020818]/95 backdrop-blur-sm">
            {/* Quick-action badges */}
            <nav aria-label="Preguntas rápidas" className="flex gap-1.5 flex-wrap px-4 pt-3 pb-1">
                {QUICK_ACTIONS.map((a) => (
                    <button
                        type="button"
                        key={a.label}
                        onClick={() => send(a.query, true)}
                        disabled={sending}
                        className="rounded-full border border-cyan-900/40 bg-cyan-950/30 px-2.5 py-1 font-mono text-[10px] text-cyan-300/80 transition-all hover:border-cyan-500/50 hover:text-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {a.label}
                    </button>
                ))}
            </nav>

            {/* Text input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 pb-4 pt-2" role="search">
                <label htmlFor="chat-input" className="sr-only">
                    Escribe una pregunta para Daniel
                </label>
                <input
                    id="chat-input"
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={sending}
                    placeholder="Pregúntame algo..."
                    className="flex-1 rounded-lg border border-cyan-900/30 bg-[#040f1e] px-3 py-2.5 font-mono text-xs text-slate-200 placeholder-slate-500 transition-all focus-visible:border-cyan-500/60 focus-visible:ring-1 focus-visible:ring-cyan-500/30 disabled:opacity-50"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={sending || !value.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-700/30 bg-cyan-950/50 text-cyan-400 transition-all hover:bg-cyan-900/50 hover:text-cyan-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={sending ? "Enviando mensaje" : "Enviar mensaje"}
                >
                    {sending ? (
                        <>
                            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span className="sr-only">Enviando...</span>
                        </>
                    ) : (
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}