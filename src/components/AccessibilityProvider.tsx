"use client";

// src/components/AccessibilityProvider.tsx
// WCAG 2.1 Level AAA — Contraste, tamaño de texto, movimiento reducido, alto contraste
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FontSize = "normal" | "large" | "xl" | "xxl";
export type ContrastMode = "default" | "high" | "inverted";

export interface A11ySettings {
    fontSize: FontSize;
    contrastMode: ContrastMode;
    reduceMotion: boolean;
    focusHighlight: boolean;
    dyslexiaFont: boolean;
    lineSpacing: boolean;
}

interface A11yContextValue {
    settings: A11ySettings;
    setFontSize: (size: FontSize) => void;
    setContrastMode: (mode: ContrastMode) => void;
    toggleReduceMotion: () => void;
    toggleFocusHighlight: () => void;
    toggleDyslexiaFont: () => void;
    toggleLineSpacing: () => void;
    resetSettings: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: A11ySettings = {
    fontSize: "normal",
    contrastMode: "default",
    reduceMotion: false,
    focusHighlight: false,
    dyslexiaFont: false,
    lineSpacing: false,
};

const STORAGE_KEY = "a11y-settings";

// ─── Context ──────────────────────────────────────────────────────────────────

const A11yContext = createContext<A11yContextValue | null>(null);

export function useA11y() {
    const ctx = useContext(A11yContext);
    if (!ctx) throw new Error("useA11y debe usarse dentro de AccessibilityProvider");
    return ctx;
}

// ─── CSS variable injection ───────────────────────────────────────────────────

function applySettingsToDOM(settings: A11ySettings) {
    const root = document.documentElement;

    // ── Tamaño de fuente ──────────────────────────────────────────────────────
    const fontScales: Record<FontSize, string> = {
        normal: "100%",
        large: "115%",
        xl: "130%",
        xxl: "150%",
    };
    root.style.fontSize = fontScales[settings.fontSize];

    // ── Modos de contraste ────────────────────────────────────────────────────
    root.classList.remove("contrast-high", "contrast-inverted");
    if (settings.contrastMode === "high") {
        root.classList.add("contrast-high");
    } else if (settings.contrastMode === "inverted") {
        root.classList.add("contrast-inverted");
    }

    // ── Reducir movimiento ────────────────────────────────────────────────────
    if (settings.reduceMotion) {
        root.classList.add("reduce-motion");
    } else {
        root.classList.remove("reduce-motion");
    }

    // ── Resaltado de foco ─────────────────────────────────────────────────────
    if (settings.focusHighlight) {
        root.classList.add("focus-highlight");
    } else {
        root.classList.remove("focus-highlight");
    }

    // ── Fuente dislexia ───────────────────────────────────────────────────────
    if (settings.dyslexiaFont) {
        root.style.setProperty("--font-family-override", "'OpenDyslexic', 'Comic Sans MS', sans-serif");
        root.classList.add("dyslexia-font");
    } else {
        root.style.removeProperty("--font-family-override");
        root.classList.remove("dyslexia-font");
    }

    // ── Espaciado de líneas ───────────────────────────────────────────────────
    if (settings.lineSpacing) {
        root.classList.add("line-spacing");
    } else {
        root.classList.remove("line-spacing");
    }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS);
    const [mounted, setMounted] = useState(false);

    // Cargar desde localStorage en el cliente
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed: A11ySettings = JSON.parse(saved);
                setSettings(parsed);
                applySettingsToDOM(parsed);
            }
        } catch {
            // Silencioso — usamos defaults
        }
        setMounted(true);
    }, []);

    // Persistir y aplicar cada vez que cambian los settings
    useEffect(() => {
        if (!mounted) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch { /* quota exceeded — ignorar */ }
        applySettingsToDOM(settings);
    }, [settings, mounted]);

    // ── Setters ───────────────────────────────────────────────────────────────

    const setFontSize = useCallback((size: FontSize) => {
        setSettings((s) => ({ ...s, fontSize: size }));
    }, []);

    const setContrastMode = useCallback((mode: ContrastMode) => {
        setSettings((s) => ({ ...s, contrastMode: mode }));
    }, []);

    const toggleReduceMotion = useCallback(() => {
        setSettings((s) => ({ ...s, reduceMotion: !s.reduceMotion }));
    }, []);

    const toggleFocusHighlight = useCallback(() => {
        setSettings((s) => ({ ...s, focusHighlight: !s.focusHighlight }));
    }, []);

    const toggleDyslexiaFont = useCallback(() => {
        setSettings((s) => ({ ...s, dyslexiaFont: !s.dyslexiaFont }));
    }, []);

    const toggleLineSpacing = useCallback(() => {
        setSettings((s) => ({ ...s, lineSpacing: !s.lineSpacing }));
    }, []);

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
    }, []);

    return (
        <A11yContext.Provider
            value={{
                settings,
                setFontSize,
                setContrastMode,
                toggleReduceMotion,
                toggleFocusHighlight,
                toggleDyslexiaFont,
                toggleLineSpacing,
                resetSettings,
            }}
        >
            {children}
        </A11yContext.Provider>
    );
}