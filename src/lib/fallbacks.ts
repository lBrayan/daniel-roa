// src/lib/fallbacks.ts
import dataEs from "@/data/daniel.json";
import dataEn from "@/data/daniel.en.json";
import type { AIResponse } from "@/components/ResponsePanel";
import type { Locale } from "@/i18n/LanguageContext";

function buildFallbacks(data: typeof dataEs, locale: Locale) {
    const isEs = locale === "es";
    return {
        proyectos: {
            type: "projects" as const,
            message: isEs
                ? "Aquí están mis proyectos — empresa y freelance."
                : "Here are my projects — company and freelance.",
            data: { ids: data.projects.map((p) => p.id) },
        },
        experiencia: {
            type: "experience" as const,
            message: isEs
                ? `Más de ${data.personal.yearsOfExperience} años en proyectos de alto impacto.`
                : `Over ${data.personal.yearsOfExperience} years on high-impact projects.`,
            data: { ids: data.experience.map((e) => e.id) },
        },
        skills: {
            type: "skills" as const,
            message: isEs ? "Mi stack técnico completo." : "My complete technical stack.",
            data: { ids: data.skills.categories.map((c) => c.id) },
        },
        sobre: {
            type: "about" as const,
            message: isEs ? "Aquí un poco sobre mí." : "Here's a bit about me.",
            data: { key: "about" },
        },
        historia: {
            type: "story" as const,
            message: isEs
                ? "Te cuento cómo empezó todo."
                : "Let me tell you how it all started.",
            data: { ids: data.story.timeline.map((t) => t.id) },
        },
        contacto: {
            type: "contact" as const,
            message: isEs ? "Puedes contactarme por aquí." : "You can reach me here.",
            data: { key: "contact" },
        },
    };
}

export function getFallback(query: string, locale: Locale = "es"): AIResponse | null {
    const data = locale === "en" ? dataEn : dataEs;
    const fb = buildFallbacks(data, locale);
    const q = query.toLowerCase();

    // Detectar keywords en ambos idiomas
    if (q.includes("project") || q.includes("freelance") || q.includes("client") || q.includes("portfolio") ||
        q.includes("proyecto") || q.includes("cliente") || q.includes("portafolio"))
        return fb.proyectos;

    if (q.includes("experience") || q.includes("work") || q.includes("job") || q.includes("company") ||
        q.includes("experiencia") || q.includes("laboral") || q.includes("empresa") || q.includes("trabaj"))
        return fb.experiencia;

    if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("aws") || q.includes("ai") ||
        q.includes("habilidad") || q.includes("tecnol") || q.includes("cloud") || q.includes("ia"))
        return fb.skills;

    if (q.includes("story") || q.includes("histor") || q.includes("start") || q.includes("began") ||
        q.includes("empez") || q.includes("origen") || q.includes("trayect") || q.includes("programaci"))
        return fb.historia;

    if (q.includes("who") || q.includes("about") || q.includes("profile") || q.includes("bio") ||
        q.includes("quién") || q.includes("quien") || q.includes("perfil") || q.includes("sobre") || q.includes("eres"))
        return fb.sobre;

    if (q.includes("contact") || q.includes("email") || q.includes("linkedin") || q.includes("github") ||
        q.includes("contacto") || q.includes("contactar"))
        return fb.contacto;

    return null;
}