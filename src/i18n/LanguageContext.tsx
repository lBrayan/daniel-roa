"use client";

// src/i18n/LanguageContext.tsx
// Context global de idioma — sin librerías externas
import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "es" | "en";

interface LangContextValue {
    locale: Locale;
    setLocale: (l: Locale) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "preferred-locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("es");

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
            if (saved === "es" || saved === "en") {
                setLocaleState(saved);
                document.documentElement.lang = saved;
            }
        } catch { /* ignorar */ }
    }, []);

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        document.documentElement.lang = l;
        try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignorar */ }
    };

    return (
        <LangContext.Provider value={{ locale, setLocale }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLocale() {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error("useLocale debe usarse dentro de LanguageProvider");
    return ctx;
}