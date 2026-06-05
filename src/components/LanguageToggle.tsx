// src/components/LanguageToggle.tsx  (nuevo componente pequeño)
"use client";
import { useTranslation } from "@/i18n/useTranslation";

export function LanguageToggle() {
    const { t, locale, setLocale } = useTranslation();
    return (
        <div
            className="flex items-center gap-1 rounded-lg border border-cyan-900/30 bg-[#040f1e] p-0.5"
            role="group"
            aria-label={t("language")}
        >
            {(["es", "en"] as const).map((lang) => (
                <button
                    key={lang}
                    onClick={() => setLocale(lang)}
                    aria-pressed={locale === lang}
                    className={`rounded-md px-2.5 py-1 font-mono text-[10px] transition-all ${locale === lang
                            ? "bg-cyan-700/30 text-cyan-300"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                >
                    {lang === "es" ? t("lang_es") : t("lang_en")}
                </button>
            ))}
        </div>
    );
}