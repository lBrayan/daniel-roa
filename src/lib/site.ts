// Contenido y utilidades del sitio del equipo (bilingüe ES/EN).
//
// - El contenido vive en src/content/*.json para que también lo pueda leer
//   scripts/prerender.mjs (que genera el HTML estático y el sitemap).
// - Español va en la raíz (/, /proyectos, /equipo…) e inglés bajo /en.
// - Para cambiar el nombre del estudio, edita src/content/site.json.
import site from "@/content/site.json";
import projectsData from "@/content/projects.json";
import teamData from "@/content/team.json";

export type Locale = "es" | "en";
export type L10n<T = string> = Record<Locale, T>;
export type Discipline = "design" | "development" | "both";

export type Img = { src: string; width: number; height: number; alt: L10n };

export type Project = {
    slug: string;
    title: string;
    client: string;
    year: number | null;
    discipline: Discipline;
    team: string[];
    featured: boolean;
    /** false = no aparece en el portafolio del estudio (p. ej. trabajo de agencia de un integrante). */
    listed: boolean;
    services: L10n<string[]>;
    stack: string[];
    summary: L10n;
    challenge: L10n | null;
    solution: L10n | null;
    cover: Img | null;
    gallery: Img[];
    links: { label: string; url: string }[];
};

export type Member = {
    slug: string;
    name: string;
    published: boolean;
    discipline: Discipline;
    initials: string;
    photo?: { src: string; width: number; height: number };
    role: L10n;
    short: L10n;
    bio: L10n<string[]>;
    skills: string[];
    links: { label: string; url: string }[];
};

export const SITE = site;
export const SITE_URL = site.url;
export const BRAND = site.brand;

export const PROJECTS = projectsData as Project[];
export const TEAM = (teamData as Member[]).filter((m) => m.published);

export const LISTED = PROJECTS.filter((p) => p.listed);
export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const getMember = (slug: string) => TEAM.find((m) => m.slug === slug);
export const projectsBy = (memberSlug: string) => PROJECTS.filter((p) => p.team.includes(memberSlug));

/** Orden de portafolio: destacados primero, y alternando diseño y desarrollo. */
export function orderedProjects(filter?: "design" | "development") {
    const list = PROJECTS.filter((p) => p.listed).filter(
        (p) => !filter || p.discipline === filter || p.discipline === "both",
    );
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
}

// ---------- Rutas ----------

export const PATHS = {
    home: { es: "/", en: "/en" },
    work: { es: "/proyectos", en: "/en/work" },
    team: { es: "/equipo", en: "/en/team" },
    services: { es: "/servicios", en: "/en/services" },
} as const;

export type PageKey = keyof typeof PATHS;

export const projectPath = (slug: string, l: Locale) => `${PATHS.work[l]}/${slug}`;
export const memberPath = (slug: string, l: Locale) => `${PATHS.team[l]}/${slug}`;

export const localeFromPath = (pathname: string): Locale =>
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";

export function whatsappLink(message: string) {
    return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

// ---------- Textos de interfaz ----------

export const UI = {
    es: {
        nav: { work: "Proyectos", services: "Servicios", team: "Equipo", contact: "Contacto" },
        cta: "Empezar un proyecto",
        langSwitch: "English",
        tagline: "Estudio de diseño y tecnología",
        location: "Bogotá, Colombia · Atendemos en español e inglés",
        disciplines: { design: "Diseño", development: "Tecnología", both: "Diseño + tecnología" } as Record<Discipline, string>,
        all: "Todos",
        viewProject: "Ver proyecto",
        viewAll: "Ver todos los proyectos",
        moreWork: "Más proyectos",
        teamOnProject: "Equipo",
        services: "Servicios",
        stack: "Tecnología",
        year: "Año",
        client: "Cliente",
        challenge: "El reto",
        solution: "Lo que hicimos",
        visit: "Ver en",
        meet: "Conocer",
        projectsOf: "Proyectos de",
        agencyWork: "Trayectoria en agencia",
        agencyNote: (n: string) => `Campañas y piezas para marcas de consumo masivo en las que ${n} participó como director de arte en agencia, por fuera del estudio.`,
        skills: "Especialidades",
        back: "Volver",
        breadcrumbHome: "Inicio",
        waDefault: "Hola, vi la página del estudio y quiero cotizar un proyecto.",
        waProject: (title: string) => `Hola, vi el proyecto ${title} y quiero algo parecido para mi negocio.`,
        contactTitle: "¿Tienes un proyecto en mente?",
        contactLead: "Cuéntanos qué necesitas y te respondemos en menos de 24 horas con una propuesta clara.",
        whatsapp: "Escríbenos por WhatsApp",
        quoteAssistant: "Cotiza con nuestro asistente",
        email: "Escríbenos un correo",
        footerAbout:
            "Diseño de marca, páginas web, tiendas online, apps y software a la medida para negocios de Colombia y el exterior.",
        rights: "Todos los derechos reservados.",
        notFound: "Esta página no existe o se movió.",
        goHome: "Ir al inicio",
    },
    en: {
        nav: { work: "Work", services: "Services", team: "Team", contact: "Contact" },
        cta: "Start a project",
        langSwitch: "Español",
        tagline: "Design & technology studio",
        location: "Bogotá, Colombia · We work in English and Spanish",
        disciplines: { design: "Design", development: "Technology", both: "Design + technology" } as Record<Discipline, string>,
        all: "All",
        viewProject: "View project",
        viewAll: "See all work",
        moreWork: "More work",
        teamOnProject: "Team",
        services: "Services",
        stack: "Technology",
        year: "Year",
        client: "Client",
        challenge: "The challenge",
        solution: "What we did",
        visit: "View on",
        meet: "Meet",
        projectsOf: "Work by",
        agencyWork: "Agency background",
        agencyNote: (n: string) => `Campaigns and assets for consumer brands that ${n} worked on as an agency art director, outside the studio.`,
        skills: "Expertise",
        back: "Back",
        breadcrumbHome: "Home",
        waDefault: "Hi! I saw your studio's website and I'd like a quote for a project.",
        waProject: (title: string) => `Hi! I saw the ${title} project and I'd like something similar for my business.`,
        contactTitle: "Have a project in mind?",
        contactLead: "Tell us what you need and we'll get back to you within 24 hours with a clear proposal.",
        whatsapp: "Message us on WhatsApp",
        quoteAssistant: "Get a quote with our assistant",
        email: "Send us an email",
        footerAbout:
            "Brand design, websites, online stores, apps and custom software for businesses in Colombia and abroad.",
        rights: "All rights reserved.",
        notFound: "This page doesn't exist or has moved.",
        goHome: "Go home",
    },
};
