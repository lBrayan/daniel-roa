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
        // En el build (prerender en Node) no hay navegador real: Node expone
        // navigator.language = "en-US" y el HTML estático salía en inglés.
        // Forzamos español en servidor para que Google indexe el sitio en español;
        // en el navegador sigue funcionando la detección automática.
        lng: typeof window === 'undefined' ? 'es' : undefined,
        fallbackLng: 'es', // Idioma por defecto si falla la detección
        interpolation: {
            escapeValue: false, // React ya previene XSS por defecto
        },
    });

export default i18n;