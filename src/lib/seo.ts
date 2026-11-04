import { SITE_URL, SERVICES, EMAIL, WHATSAPP_NUMBER, type Faq } from "@/data/marketing";

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Arma el `head` de una página de marketing: título, descripción, canonical,
 * Open Graph y los bloques JSON-LD que se le pasen.
 */
export function pageHead({
    title,
    description,
    path,
    schemas = [],
}: {
    title: string;
    description: string;
    path: string;
    schemas?: object[];
}) {
    const url = `${SITE_URL}${path}`;
    return {
        meta: [
            { title },
            { name: "description", content: description },
            { property: "og:title", content: title },
            { property: "og:description", content: description },
            { property: "og:type", content: "website" },
            { property: "og:url", content: url },
            { property: "og:image", content: OG_IMAGE },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: title },
            { name: "twitter:description", content: description },
        ],
        links: [{ rel: "canonical", href: url }],
        scripts: schemas.map((schema) => ({
            type: "application/ld+json",
            children: JSON.stringify(schema),
        })),
    };
}

/** Negocio local de servicios (aparece en búsquedas locales tipo "desarrollador web Bogotá"). */
export const BUSINESS_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: "Brayan Roa — Desarrollo web y software",
    url: SITE_URL,
    image: OG_IMAGE,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    description:
        "Desarrollo de páginas web, tiendas online, chatbots con IA para WhatsApp y software a la medida en Bogotá y toda Colombia.",
    telephone: `+${WHATSAPP_NUMBER}`,
    email: EMAIL,
    priceRange: "$$",
    currenciesAccepted: "COP",
    address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressRegion: "Bogotá D.C.", addressCountry: "CO" },
    areaServed: [
        { "@type": "City", name: "Bogotá" },
        { "@type": "Country", name: "Colombia" },
    ],
    founder: { "@type": "Person", name: "Brayan Daniel Roa Rodríguez", url: SITE_URL },
    hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios de desarrollo web",
        itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.name, description: s.summary },
            ...(s.priceFrom
                ? {
                      priceSpecification: {
                          "@type": "PriceSpecification",
                          price: s.priceFrom,
                          minPrice: s.priceFrom,
                          priceCurrency: "COP",
                      },
                  }
                : {}),
        })),
    },
};

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
