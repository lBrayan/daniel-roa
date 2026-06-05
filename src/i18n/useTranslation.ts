// src/i18n/useTranslation.ts
// Hook principal — consume el contexto de idioma y devuelve el t() translator
import { useLocale } from "./LanguageContext";
import { es } from "./locales/es";
import { en } from "./locales/en";
import type { TranslationKey } from "./locales/es";

const translations = { es, en };

export function useTranslation() {
    const { locale, setLocale } = useLocale();
    const dict = translations[locale];

    function t(key: TranslationKey): string {
        return dict[key] ?? es[key] ?? key;
    }

    return { t, locale, setLocale };
}