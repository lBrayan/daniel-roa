import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import es from '../locales/es.json';
import pt from '../locales/pt.json'; // Si lo agregas luego

// Tipado estricto para TypeScript (Autocompletado de keys)
export const defaultNS = 'translation';
export const resources = {
    en: { translation: en },
    es: { translation: es },
    pt: { translation: pt },
} as const;

i18n
    .use(LanguageDetector) // Detecta el idioma del navegador y lo guarda en localStorage
    .use(initReactI18next) // Pasa la instancia a react-i18next
    .init({
        resources,
        fallbackLng: 'es', // Idioma por defecto si falla la detección
        interpolation: {
            escapeValue: false, // React ya previene XSS por defecto
        },
    });

export default i18n;