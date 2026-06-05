"use client";
// src/components/ChatInput.tsx
import { useState, useRef, useCallback } from "react";
import type { AIResponse } from "@/components/ResponsePanel";
import { getFallback } from "@/lib/fallbacks";
import { STATIC_RESPONSES } from "@/data/staticResponses";
import { useTranslation } from "@/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/locales/es";

// Quick actions definidas por claves de traducción
export const QUICK_ACTIONS: Array<{
    labelKey: TranslationKey;
    queryKey: TranslationKey;
}> = [
        { labelKey: "qa_projects", queryKey: "qa_projects_query" },
        { labelKey: "qa_experience", queryKey: "qa_experience_query" },
        { labelKey: "qa_skills", queryKey: "qa_skills_query" },
        { labelKey: "qa_about", queryKey: "qa_about_query" },
        { labelKey: "qa_story", queryKey: "qa_story_query" },
        { labelKey: "qa_contact", queryKey: "qa_contact_query" },
        { labelKey: "qa_ai_cloud", queryKey: "qa_ai_cloud_query" },
    ];

interface ChatInputProps {
    onResponse: (res: AIResponse) => void;
    onLoadingChange: (loading: boolean) => void;
    onError: (err: string | null) => void;
    onTalkStart?: () => void;
    sendRef?: React.MutableRefObject<((query: string, fromButton?: boolean) => void) | null>;
}

export function ChatInput({
    onResponse,
    onLoadingChange,
    onError,
    onTalkStart,
    sendRef,
}: ChatInputProps) {
    const { t, locale } = useTranslation(); // ← consume idioma activo
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const send = useCallback(
        async (query: string, fromButton = false) => {
            const q = query.trim();
            if (!q || isSending) return;

            setIsSending(true);
            onLoadingChange(true);
            onError(null);
            if (!fromButton) setInput("");
            onTalkStart?.();

            // Botones quick action → respuesta estática directa, nunca van a la IA
            if (fromButton) {
                const staticResponse = STATIC_RESPONSES[q];
                if (staticResponse) {
                    onResponse(staticResponse);
                    onLoadingChange(false);
                    setIsSending(false);
                    return;
                }
            }

            // Texto libre → siempre va a la IA primero
            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: q, locale }),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: AIResponse = await res.json();
                onResponse(data);
            } catch {
                // La IA falló → ahora sí intentamos el fallback como último recurso
                const fallback = getFallback(q, locale);
                if (fallback) {
                    onResponse(fallback);
                } else {
                    onError(t("chat_error"));
                }
            } finally {
                onLoadingChange(false);
                setIsSending(false);
            }
        },
        [isSending, locale, onError, onLoadingChange, onResponse, onTalkStart, t]
    );

    // Exponer send para MobileChat via ref
    if (sendRef) sendRef.current = send;

    return (
        <div className="border-t border-cyan-900/20 p-4 space-y-3">
            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("open_chat")}>
                {QUICK_ACTIONS.map(({ labelKey, queryKey }) => (
                    <button
                        key={labelKey}
                        onClick={() => send(t(queryKey), true)}
                        disabled={isSending}
                        className="rounded-lg border border-cyan-900/30 bg-[#040f1e] px-3 py-1.5 font-mono text-[10px] text-cyan-400/70 transition-all hover:border-cyan-700/50 hover:text-cyan-300 disabled:opacity-40"
                    >
                        {t(labelKey)}
                    </button>
                ))}
            </div>

            {/* Text input */}
            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send(input)}
                    placeholder={t("chat_placeholder")}
                    aria-label={t("chat_placeholder")}
                    disabled={isSending}
                    className="flex-1 rounded-lg border border-cyan-900/30 bg-[#040f1e] px-3 py-2 font-mono text-xs text-slate-300 placeholder-slate-600 outline-none transition-colors focus:border-cyan-700/60 focus:ring-1 focus:ring-cyan-700/30 disabled:opacity-40"
                />
                <button
                    onClick={() => send(input)}
                    disabled={isSending || !input.trim()}
                    aria-label={isSending ? t("chat_sending") : t("chat_send")}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-900/30 bg-[#040f1e] text-cyan-400/70 transition-all hover:border-cyan-700/50 hover:text-cyan-300 disabled:opacity-40"
                >
                    {isSending ? (
                        <span className="h-3 w-3 rounded-full border-2 border-cyan-400/40 border-t-cyan-400 animate-spin" />
                    ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}