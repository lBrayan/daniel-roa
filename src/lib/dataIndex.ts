// src/lib/dataIndex.ts
import dataEs from "@/data/daniel.json";
import dataEn from "@/data/daniel.en.json";
import type { Locale } from "@/i18n/LanguageContext";

function getData(locale: Locale = "es") {
    return locale === "en" ? dataEn : dataEs;
}

// ─── Lookup maps por locale ───────────────────────────────────────────────────

export function getExperienceById(locale: Locale) {
    return Object.fromEntries(getData(locale).experience.map((e) => [e.id, e]));
}

export function getProjectsById(locale: Locale) {
    return Object.fromEntries(getData(locale).projects.map((p) => [p.id, p]));
}

export function getTimelineById(locale: Locale) {
    return Object.fromEntries(getData(locale).story.timeline.map((t) => [t.id, t]));
}

export function getSkillsById(locale: Locale) {
    return Object.fromEntries(getData(locale).skills.categories.map((c) => [c.id, c]));
}

// ─── Fuzzy match ──────────────────────────────────────────────────────────────

function fuzzyFindProject(id: string, locale: Locale) {
    const projectsById = getProjectsById(locale);
    const data = getData(locale);

    if (projectsById[id]) return projectsById[id];
    const idLower = id.toLowerCase();
    const byIdMatch = Object.keys(projectsById).find((k) => k.toLowerCase().includes(idLower));
    if (byIdMatch) return projectsById[byIdMatch];
    return data.projects.find(
        (p) => p.name.toLowerCase().includes(idLower) ||
            p.description.toLowerCase().includes(idLower) ||
            p.tech.some((t) => t.toLowerCase().includes(idLower))
    ) ?? null;
}

function fuzzyFindExperience(id: string, locale: Locale) {
    const experienceById = getExperienceById(locale);
    const data = getData(locale);

    if (experienceById[id]) return experienceById[id];
    const idLower = id.toLowerCase();
    const key = Object.keys(experienceById).find((k) => k.toLowerCase().includes(idLower));
    if (key) return experienceById[key];
    return data.experience.find(
        (e) => e.company?.toLowerCase().includes(idLower) ||
            e.role?.toLowerCase().includes(idLower)
    ) ?? null;
}

// ─── Hydrators con locale ─────────────────────────────────────────────────────

export function hydrateExperience(ids: string[], locale: Locale = "es") {
    return ids.map((id) => fuzzyFindExperience(id, locale)).filter(Boolean);
}

export function hydrateProjects(ids: string[], locale: Locale = "es") {
    return ids.map((id) => fuzzyFindProject(id, locale)).filter(Boolean);
}

export function hydrateTimeline(ids: string[], locale: Locale = "es") {
    const timelineById = getTimelineById(locale);
    return ids.map((id) => timelineById[id]).filter(Boolean);
}

export function hydrateSkills(ids: string[], locale: Locale = "es") {
    const skillsById = getSkillsById(locale);
    return ids.map((id) => skillsById[id]).filter(Boolean);
}

// ─── Exports de listas completas ──────────────────────────────────────────────

export function getAllData(locale: Locale = "es") {
    const data = getData(locale);
    return {
        allExperience: data.experience,
        allProjects: data.projects,
        allTimeline: data.story.timeline,
        allSkills: data.skills.categories,
        storyIntro: data.story.intro,
        personalData: data.personal,
        aboutData: data.about,
        contactData: data.contact,
    };
}

// Compatibilidad con imports directos que ya existen en otros archivos
export const allExperience = dataEs.experience;
export const allProjects = dataEs.projects;
export const allTimeline = dataEs.story.timeline;
export const allSkills = dataEs.skills.categories;
export const storyIntro = dataEs.story.intro;
export const personalData = dataEs.personal;
export const aboutData = dataEs.about;
export const contactData = dataEs.contact;