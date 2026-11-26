import { useCallback, useEffect, useRef, useState } from "react";
import { UI, whatsappLink, type Locale } from "@/lib/site";

/**
 * Asistente de cotizaciones: el cliente escribe o habla (dictado del
 * navegador) y el asistente (Lambda + Bedrock en /api/assistant) entiende qué
 * necesita, lo clasifica (diseño / tecnología / ambos) y, cuando deja sus
 * datos, avisa al equipo.
 *
 * Para abrirlo desde cualquier botón: window.dispatchEvent(new Event("open-assistant")).
 */

type Msg = { role: "user" | "assistant"; content: string };

const COPY = {
    es: {
        open: "Cotiza tu proyecto",
        title: "Asistente de cotizaciones",
        subtitle: "Cuéntanos qué necesitas. Puedes escribir o hablar.",
        hello:
            "¡Hola! Soy el asistente del estudio. Cuéntame qué tienes en mente: una marca, un logo, empaques, una página web, una tienda online, una app… Si no sabes bien qué necesitas, no te preocupes: te ayudo a descubrirlo.",
        placeholder: "Escribe aquí o toca el micrófono…",
        listening: "Te escucho…",
        send: "Enviar",
        mic: "Hablar",
        stopMic: "Dejar de escuchar",
        voiceMode: "Conversación por voz",
        close: "Cerrar",
        reset: "Empezar de nuevo",
        thinking: "Pensando…",
        advisor: "Prefiero hablar con un asesor por WhatsApp",
        error: "No pude conectarme. Intenta de nuevo o escríbenos por WhatsApp.",
        noMic: "Tu navegador no permite dictado; puedes escribir tu mensaje.",
        privacy: "Usamos tus datos solo para responder tu solicitud.",
        speechLang: "es-CO",
    },
    en: {
        open: "Get a quote",
        title: "Quote assistant",
        subtitle: "Tell us what you need. You can type or talk.",
        hello:
            "Hi! I'm the studio's assistant. Tell me what you have in mind: a brand, a logo, packaging, a website, an online store, an app… If you're not sure exactly what you need, no worries: I'll help you figure it out.",
        placeholder: "Type here or tap the microphone…",
        listening: "Listening…",
        send: "Send",
        mic: "Talk",
        stopMic: "Stop listening",
        voiceMode: "Voice conversation",
        close: "Close",
        reset: "Start over",
        thinking: "Thinking…",
        advisor: "I'd rather talk to someone on WhatsApp",
        error: "I couldn't connect. Try again or message us on WhatsApp.",
        noMic: "Your browser doesn't support dictation; you can type your message.",
        privacy: "We only use your details to answer your request.",
        speechLang: "en-US",
    },
};

// Tipos mínimos de la Web Speech API (no vienen en lib.dom de todos los TS).
type SpeechRec = {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
};

function getRecognizer(): SpeechRec | null {
    if (typeof window === "undefined") return null;
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
    const C = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    return C ? new C() : null;
}

const STORE_KEY = "assistant-chat-v1";

export function AssistantWidget({ locale }: { locale: Locale }) {
    const c = COPY[locale];
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: c.hello }]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [listening, setListening] = useState(false);
    const [voiceMode, setVoiceMode] = useState(false);
    const [micSupported, setMicSupported] = useState(true);
    const recRef = useRef<SpeechRec | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const voiceModeRef = useRef(false);
    voiceModeRef.current = voiceMode;

    // Restaurar la conversación de esta pestaña.
    useEffect(() => {
        setMicSupported(Boolean(getRecognizer()));
        try {
            const saved = sessionStorage.getItem(STORE_KEY);
            if (saved) {
                const s = JSON.parse(saved) as { messages: Msg[]; done: boolean };
                if (Array.isArray(s.messages) && s.messages.length) {
                    setMessages(s.messages);
                    setDone(Boolean(s.done));
                }
            }
        } catch {
            /* sin almacenamiento: no pasa nada */
        }
        const onOpen = () => setOpen(true);
        window.addEventListener("open-assistant", onOpen);
        return () => window.removeEventListener("open-assistant", onOpen);
    }, []);

    useEffect(() => {
        try {
            sessionStorage.setItem(STORE_KEY, JSON.stringify({ messages, done }));
        } catch {
            /* ignorar */
        }
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, done]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const speak = useCallback(
        (text: string, after?: () => void) => {
            if (!("speechSynthesis" in window)) return after?.();
            const u = new SpeechSynthesisUtterance(text.replace(/[*_#>`]/g, ""));
            u.lang = c.speechLang;
            u.rate = 1.03;
            u.onend = () => after?.();
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
        },
        [c.speechLang],
    );

    const send = useCallback(
        async (text: string) => {
            const content = text.trim();
            if (!content || busy || done) return;
            const next: Msg[] = [...messages, { role: "user", content }];
            setMessages(next);
            setInput("");
            setBusy(true);
            try {
                const res = await fetch("/api/assistant", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ lang: locale, messages: next }),
                });
                const data = (await res.json()) as { reply?: string; done?: boolean };
                const reply = data.reply || c.error;
                setMessages((m) => [...m, { role: "assistant", content: reply }]);
                if (data.done) setDone(true);
                if (voiceModeRef.current) speak(reply, () => !data.done && voiceModeRef.current && startListening(true));
            } catch {
                setMessages((m) => [...m, { role: "assistant", content: c.error }]);
            } finally {
                setBusy(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [messages, busy, done, locale, c.error, speak],
    );

    const sendRef = useRef(send);
    sendRef.current = send;

    function startListening(autoSend = false) {
        const rec = getRecognizer();
        if (!rec) {
            setMicSupported(false);
            return;
        }
        recRef.current?.stop();
        recRef.current = rec;
        rec.lang = c.speechLang;
        rec.interimResults = true;
        rec.continuous = false;
        let finalText = "";
        rec.onresult = (e) => {
            let interim = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const r = e.results[i];
                if (!r) continue;
                const t = r[0]?.transcript ?? "";
                if (r.isFinal) finalText += t;
                else interim += t;
            }
            setInput((finalText + interim).trim());
        };
        rec.onend = () => {
            setListening(false);
            if ((autoSend || voiceModeRef.current) && finalText.trim()) sendRef.current(finalText);
        };
        rec.onerror = () => setListening(false);
        setListening(true);
        try {
            rec.start();
        } catch {
            setListening(false);
        }
    }

    function stopListening() {
        recRef.current?.stop();
        setListening(false);
    }

    function reset() {
        stopListening();
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        setMessages([{ role: "assistant", content: c.hello }]);
        setDone(false);
        setInput("");
    }

    const transcriptForWa = messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(" / ")
        .slice(0, 600);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className={`fixed right-5 bottom-5 z-50 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-5 font-semibold text-ink shadow-[0_10px_40px_-10px_rgba(255,106,61,0.7)] transition-all duration-500 hover:-translate-y-0.5 ${
                    open ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
                }`}
            >
                <SparkIcon />
                {c.open}
            </button>

            <div
                role="dialog"
                aria-modal="false"
                aria-label={c.title}
                className={`fixed right-0 bottom-0 z-50 flex h-[min(680px,100dvh)] w-full max-w-md origin-bottom-right flex-col overflow-hidden border border-line bg-ink-2 text-paper shadow-2xl transition-all duration-500 sm:right-5 sm:bottom-5 sm:rounded-3xl ${
                    open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-6 scale-95 opacity-0"
                }`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
                    <div>
                        <p className="font-grotesk text-lg font-bold">{c.title}</p>
                        <p className="text-sm text-dim">{c.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={reset} className="rounded-full px-3 py-2 text-xs text-dim hover:text-paper">
                            {c.reset}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                stopListening();
                                setOpen(false);
                            }}
                            aria-label={c.close}
                            className="flex size-10 items-center justify-center rounded-full text-soft hover:bg-line hover:text-paper"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5" aria-live="polite">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <p
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line ${
                                    m.role === "user" ? "rounded-br-md bg-brand text-ink" : "rounded-bl-md bg-ink text-soft"
                                }`}
                            >
                                {m.content}
                            </p>
                        </div>
                    ))}
                    {busy && (
                        <p className="flex items-center gap-2 text-sm text-dim">
                            <span className="inline-flex gap-1" aria-hidden>
                                <span className="size-1.5 animate-bounce rounded-full bg-dim [animation-delay:-0.2s]" />
                                <span className="size-1.5 animate-bounce rounded-full bg-dim [animation-delay:-0.1s]" />
                                <span className="size-1.5 animate-bounce rounded-full bg-dim" />
                            </span>
                            {c.thinking}
                        </p>
                    )}
                    {done && (
                        <a
                            href={whatsappLink(`${UI[locale].waDefault} ${transcriptForWa}`)}
                            target="_blank"
                            rel="noopener"
                            className="block rounded-2xl border border-line px-4 py-3 text-center text-sm font-semibold hover:border-soft"
                        >
                            WhatsApp ↗
                        </a>
                    )}
                </div>

                <form
                    className="border-t border-line p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        void send(input);
                    }}
                >
                    <div className="flex items-end gap-2">
                        <label htmlFor="assistant-input" className="sr-only">
                            {c.placeholder}
                        </label>
                        <textarea
                            id="assistant-input"
                            ref={inputRef}
                            rows={1}
                            maxLength={1500}
                            value={input}
                            disabled={done}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    void send(input);
                                }
                            }}
                            placeholder={listening ? c.listening : c.placeholder}
                            className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-line bg-ink px-4 py-3 text-[15px] text-paper placeholder:text-dim focus:border-soft focus:outline-none"
                        />
                        {micSupported && (
                            <button
                                type="button"
                                onClick={() => (listening ? stopListening() : startListening())}
                                aria-label={listening ? c.stopMic : c.mic}
                                aria-pressed={listening}
                                disabled={done}
                                className={`relative flex size-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                    listening ? "border-brand bg-brand text-ink" : "border-line text-paper hover:border-soft"
                                }`}
                            >
                                {listening && <span className="absolute inset-0 animate-ping rounded-full bg-brand/40" aria-hidden />}
                                <MicIcon />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={busy || done || !input.trim()}
                            aria-label={c.send}
                            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-opacity disabled:opacity-40"
                        >
                            ↑
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-dim">
                        {micSupported ? (
                            <label className="inline-flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={voiceMode}
                                    onChange={(e) => {
                                        setVoiceMode(e.target.checked);
                                        if (e.target.checked && !listening && !busy) startListening(true);
                                        if (!e.target.checked && "speechSynthesis" in window) window.speechSynthesis.cancel();
                                    }}
                                    className="accent-[var(--brand)]"
                                />
                                {c.voiceMode}
                            </label>
                        ) : (
                            <span>{c.noMic}</span>
                        )}
                        <a href={whatsappLink(UI[locale].waDefault)} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-paper">
                            {c.advisor}
                        </a>
                    </div>
                    <p className="mt-2 text-[11px] text-dim">{c.privacy}</p>
                </form>
            </div>
        </>
    );
}

function MicIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
        </svg>
    );
}

function SparkIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.5L12 16l-1.8-5.5L4.5 9l5.7-1.4z" />
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" opacity=".7" />
        </svg>
    );
}
