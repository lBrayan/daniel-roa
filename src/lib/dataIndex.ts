import data from "@/data/daniel.json";

// Mapas de lookup por ID
export const experienceById = Object.fromEntries(
    data.experience.map((e) => [e.id, e])
);

export const projectsById = Object.fromEntries(
    data.projects.map((p) => [p.id, p])
);

export const timelineById = Object.fromEntries(
    data.story.timeline.map((t) => [t.id, t])
);

export const skillsById = Object.fromEntries(
    data.skills.categories.map((c) => [c.id, c])
);

// ─── Fuzzy match: si el ID no existe exacto, busca el más parecido ────────────
// Cubre alucinaciones del modelo que inventa IDs cortos ("ormigga", "topaz", "srg")

function fuzzyFindProject(id: string) {
    // 1. Exact match
    if (projectsById[id]) return projectsById[id];

    const idLower = id.toLowerCase();

    // 2. El ID del JSON contiene el ID inventado (ej: "ormigga" está en "IngenieroDesarrolloOrmigga2020T2020")
    //    — pero ese es de experience, no projects. Buscar en projects primero.
    const projectKeys = Object.keys(projectsById);

    // Buscar proyecto cuyo ID o nombre contenga el término
    const byIdMatch = projectKeys.find((k) => k.toLowerCase().includes(idLower));
    if (byIdMatch) return projectsById[byIdMatch];

    // 3. Buscar por nombre del proyecto (ej: "topaz" → "Herramienta de Despliegues + Agente IA" en Topaz)
    const byNameMatch = data.projects.find(
        (p) => p.name.toLowerCase().includes(idLower) ||
            p.description.toLowerCase().includes(idLower) ||
            p.tech.some((t) => t.toLowerCase().includes(idLower))
    );
    if (byNameMatch) return byNameMatch;

    return null;
}

function fuzzyFindExperience(id: string) {
    if (experienceById[id]) return experienceById[id];
    const idLower = id.toLowerCase();
    const key = Object.keys(experienceById).find((k) => k.toLowerCase().includes(idLower));
    if (key) return experienceById[key];
    return data.experience.find(
        (e) => e.company?.toLowerCase().includes(idLower) ||
            e.role?.toLowerCase().includes(idLower)
    ) ?? null;
}

// ─── Helpers de hidratación ───────────────────────────────────────────────────

export function hydrateExperience(ids: string[]) {
    return ids.map((id) => fuzzyFindExperience(id)).filter(Boolean);
}

export function hydrateProjects(ids: string[]) {
    return ids.map((id) => fuzzyFindProject(id)).filter(Boolean);
}

export function hydrateTimeline(ids: string[]) {
    return ids.map((id) => timelineById[id]).filter(Boolean);
}

export function hydrateSkills(ids: string[]) {
    return ids.map((id) => skillsById[id]).filter(Boolean);
}

// ─── Exports de listas completas para fallbacks ───────────────────────────────

export const allExperience = data.experience;
export const allProjects = data.projects;
export const allTimeline = data.story.timeline;
export const allSkills = data.skills.categories;
export const storyIntro = data.story.intro;
export const personalData = data.personal;
export const aboutData = data.about;
export const contactData = data.contact;