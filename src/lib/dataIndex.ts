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

// Helpers de hidratación — convierten arrays de IDs en arrays de datos
export function hydrateExperience(ids: string[]) {
    return ids.map((id) => experienceById[id]).filter(Boolean);
}

export function hydrateProjects(ids: string[]) {
    return ids.map((id) => projectsById[id]).filter(Boolean);
}

export function hydrateTimeline(ids: string[]) {
    return ids.map((id) => timelineById[id]).filter(Boolean);
}

export function hydrateSkills(ids: string[]) {
    return ids.map((id) => skillsById[id]).filter(Boolean);
}

// Exports de listas completas para fallbacks
export const allExperience = data.experience;
export const allProjects = data.projects;
export const allTimeline = data.story.timeline;
export const allSkills = data.skills.categories;
export const storyIntro = data.story.intro;
export const personalData = data.personal;
export const aboutData = data.about;
export const contactData = data.contact;