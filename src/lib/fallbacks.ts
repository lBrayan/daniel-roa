import data from "@/data/daniel.json";
import type { AIResponse } from "@/components/ResponsePanel";

export const FALLBACK_RESPONSES: Record<string, AIResponse> = {
    proyectos: {
        type: "projects",
        message: "Aquí están mis proyectos — empresa y freelance.",
        data: { ids: data.projects.map((p) => p.id) },
    },
    experiencia: {
        type: "experience",
        message: `Más de ${data.personal.yearsOfExperience} años en proyectos de alto impacto.`,
        data: { ids: data.experience.map((e) => e.id) },
    },
    skills: {
        type: "skills",
        message: "Mi stack técnico completo.",
        data: { ids: data.skills.categories.map((c) => c.id) },
    },
    sobre: {
        type: "about",
        message: "Aquí un poco sobre mí.",
        data: { key: "about" },
    },
    historia: {
        type: "story",
        message: "Te cuento cómo empezó todo.",
        data: { ids: data.story.timeline.map((t) => t.id) },
    },
    contacto: {
        type: "contact",
        message: "Puedes contactarme por aquí.",
        data: { key: "contact" },
    },
};

export function getFallback(query: string): AIResponse | null {
    const q = query.toLowerCase();
    if (q.includes("proyecto") || q.includes("freelance") || q.includes("cliente") || q.includes("portafolio")) return FALLBACK_RESPONSES.proyectos;
    if (q.includes("experiencia") || q.includes("laboral") || q.includes("empresa") || q.includes("trabaj")) return FALLBACK_RESPONSES.experiencia;
    if (q.includes("skill") || q.includes("habilidad") || q.includes("stack") || q.includes("tecnol") || q.includes("aws") || q.includes("ia") || q.includes("cloud")) return FALLBACK_RESPONSES.skills;
    if (q.includes("histor") || q.includes("empez") || q.includes("origen") || q.includes("trayect") || q.includes("cuéntame") || q.includes("cuentame") || q.includes("camino") || q.includes("programaci")) return FALLBACK_RESPONSES.historia;
    if (q.includes("quién") || q.includes("quien") || q.includes("perfil") || q.includes("sobre") || q.includes("bio") || q.includes("eres")) return FALLBACK_RESPONSES.sobre;
    if (q.includes("contacto") || q.includes("contactar") || q.includes("email") || q.includes("linkedin") || q.includes("github")) return FALLBACK_RESPONSES.contacto;
    return null;
}