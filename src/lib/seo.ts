import { SERVICES, type Faq } from "@/data/marketing";
import { BRAND, PROJECTS, SITE, SITE_URL, TEAM, type Locale, type Project, type Member } from "@/lib/site";

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const OG_LOCALE: Record<Locale, string> = { es: "es_CO", en: "en_US" };

const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

/**
 * Arma el `head` de una página: título, descripción, canonical, hreflang
 * (es/en/x-default), Open Graph, Twitter y los bloques JSON-LD.
 *
 * `path` es la ruta de la página en su idioma; `alternates` las rutas
 * equivalentes en cada idioma (si la página existe en ambos).
 */
export function pageHead({
    title,
    description,
    path,
    locale = "es",
    alternates,
    image,
    type = "website",
    schemas = [],
    noindex = false,
}: {
    title: string;
    description: string;
    path: string;
    locale?: Locale;
    alternates?: Partial<Record<Locale, string>>;
    image?: string;
    type?: "website" | "article" | "profile";
    schemas?: object[];
    noindex?: boolean;
}) {
    const url = `${SITE_URL}${path}`;
    const ogImage = image ? abs(image) : DEFAULT_OG_IMAGE;
    const links: { rel: string; href: string; hrefLang?: string }[] = [{ rel: "canonical", href: url }];
    if (alternates) {
        for (const [lang, p] of Object.entries(alternates)) {
            if (p) links.push({ rel: "alternate", hrefLang: lang, href: `${SITE_URL}${p}` });
        }
        const xDefault = alternates.es ?? alternates.en;
        if (xDefault) links.push({ rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${xDefault}` });
    }
    const otherLocale: Locale = locale === "es" ? "en" : "es";
    return {
        meta: [
            { title },
            { name: "description", content: description },
            ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
            { property: "og:site_name", content: BRAND },
            { property: "og:locale", content: OG_LOCALE[locale] },
            ...(alternates?.[otherLocale] ? [{ property: "og:locale:alternate", content: OG_LOCALE[otherLocale] }] : []),
            { property: "og:title", content: title },
            { property: "og:description", content: description },
            { property: "og:type", content: type },
            { property: "og:url", content: url },
            { property: "og:image", content: ogImage },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: title },
            { name: "twitter:description", content: description },
            { name: "twitter:image", content: ogImage },
        ],
        links,
        scripts: schemas.map((schema) => ({
            type: "application/ld+json",
            children: JSON.stringify(schema),
        })),
    };
}

// ---------- Datos estructurados (schema.org) ----------

const ORG_ID = `${SITE_URL}/#organization`;

export function personSchema(m: Member, locale: Locale) {
    return {
        "@type": "Person",
        "@id": `${SITE_URL}/equipo/${m.slug}#person`,
        name: m.name,
        jobTitle: m.role[locale],
        description: m.short[locale],
        url: `${SITE_URL}${locale === "es" ? "/equipo/" : "/en/team/"}${m.slug}`,
        worksFor: { "@id": ORG_ID },
        knowsAbout: m.skills,
        sameAs: m.links.map((l) => l.url),
    };
}

/** El estudio como negocio de servicios (diseño + desarrollo) en Bogotá. */
export function organizationSchema(locale: Locale = "es") {
    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: BRAND,
        url: SITE_URL,
        logo: `${SITE_URL}/apple-touch-icon.png`,
        image: DEFAULT_OG_IMAGE,
        description:
            locale === "es"
                ? "Estudio de diseño y tecnología en Bogotá: branding, páginas web, tiendas online, apps, chatbots con IA y software a la medida."
                : "Design and technology studio in Bogotá, Colombia: branding, websites, online stores, apps, AI chatbots and custom software.",
        email: SITE.email,
        telephone: `+${SITE.whatsapp}`,
        priceRange: "$$",
        address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressRegion: "Bogotá D.C.", addressCountry: "CO" },
        areaServed: [
            { "@type": "Country", name: "Colombia" },
            { "@type": "Country", name: "United States" },
            { "@type": "Place", name: "Latin America" },
        ],
        knowsLanguage: ["es", "en"],
        employee: TEAM.map((m) => personSchema(m, locale)),
        sameAs: Object.values(SITE.socials),
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: locale === "es" ? "Servicios" : "Services",
            itemListElement: SERVICES.map((s) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: s.name, description: s.summary },
            })),
        },
    };
}

export function websiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND,
        inLanguage: ["es", "en"],
        publisher: { "@id": ORG_ID },
    };
}

export function projectSchema(p: Project, locale: Locale, path: string) {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: p.title,
        description: p.summary[locale],
        url: `${SITE_URL}${path}`,
        inLanguage: locale,
        ...(p.year ? { dateCreated: String(p.year) } : {}),
        ...(p.cover ? { image: abs(p.cover.src) } : {}),
        keywords: [...p.services[locale], ...p.stack].join(", "),
        creator: { "@id": ORG_ID },
        contributor: p.team
            .map((slug) => TEAM.find((m) => m.slug === slug))
            .filter(Boolean)
            .map((m) => ({ "@type": "Person", name: (m as Member).name })),
    };
}

export function projectListSchema(locale: Locale, pathFor: (slug: string) => string) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: PROJECTS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}${pathFor(p.slug)}`,
            name: p.title,
        })),
    };
}

/** Compatibilidad con las páginas de servicios existentes. */
export const BUSINESS_SCHEMA = organizationSchema("es");

export function faqSchema(faqs: Faq[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${SITE_URL}${item.path}`,
        })),
    };
}
