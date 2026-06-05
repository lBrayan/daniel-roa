// src/data/staticResponses.ts
import data from "@/data/daniel.json";
import type { AIResponse } from "@/components/ResponsePanel";

export const STATIC_RESPONSES: Record<string, AIResponse> = {
    "¿Qué proyectos has realizado?": {
        type: "projects",
        message: "Aquí tienes todos mis proyectos — empresa y freelance.",
        data: { ids: data.projects.map((p) => p.id) },
    },
    "Cuéntame tu experiencia laboral": {
        type: "experience",
        message: `Más de ${data.personal.yearsOfExperience} años en proyectos de alto impacto.`,
        data: { ids: data.experience.map((e) => e.id) },
    },
    "¿Cuáles son tus habilidades técnicas?": {
        type: "skills",
        message: "Mi stack técnico completo, organizado por categoría.",
        data: { ids: data.skills.categories.map((c) => c.id) },
    },
    "¿Quién eres y cuál es tu perfil?": {
        type: "about",
        message: "Aquí un poco sobre mí.",
        data: { key: "about" },
    },
    "¿Como es tu historia en la programción?": {
        type: "story",
        message: "Mi historia arranca a los 13 años rompiendo código ajeno por curiosidad — y nunca paré.",
        data: { ids: data.story.timeline.map((t) => t.id) },
    },
    "¿Cómo puedo contactarte?": {
        type: "contact",
        message: "Puedes contactarme por cualquiera de estos canales.",
        data: { key: "contact" },
    },
    "¿Cuál es tu experiencia con IA y Cloud?": {
        type: "skills",
        message: "He aplicado IA en producción tanto en detección de bugs como en agentes y RAG.",
        data: { ids: ["ai", "cloud"] },
    },
};