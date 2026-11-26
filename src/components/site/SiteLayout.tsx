import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BRAND, PATHS, SITE, UI, whatsappLink, type Locale } from "@/lib/site";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { useReveal } from "@/components/site/Motion";
import { AssistantWidget } from "@/components/site/AssistantWidget";

export const openAssistant = () => window.dispatchEvent(new Event("open-assistant"));

/** Logotipo de texto del estudio. */
export function BrandMark({ className = "" }: { className?: string }) {
    const [first, ...rest] = BRAND.split(" ");
    return (
        <span className={`font-grotesk text-xl font-bold tracking-tight ${className}`}>
            {first?.toLowerCase()}
            <span className="text-brand">.</span>
            {rest.join(" ").toLowerCase()}
        </span>
    );
}

/**
 * Estructura común de todas las páginas: cabecera con navegación y cambio de
 * idioma, contenido y pie de página. `alternate` es la ruta de esta misma
 * página en el otro idioma (si existe).
 */
export function SiteLayout({
    locale,
    alternate,
    children,
}: {
    locale: Locale;
    alternate?: string;
    children: ReactNode;
}) {
    useReveal();
    const t = UI[locale];
    const other: Locale = locale === "es" ? "en" : "es";
    const nav = [
        { to: PATHS.work[locale], label: t.nav.work },
        { to: PATHS.services[locale], label: t.nav.services },
        { to: PATHS.team[locale], label: t.nav.team },
    ];

    return (
        <div className="site min-h-screen bg-ink text-paper antialiased">
            <a
                href="#contenido"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-ink"
            >
                {locale === "es" ? "Saltar al contenido" : "Skip to content"}
            </a>
            <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 sm:px-8">
                    <Link to={PATHS.home[locale] as never} aria-label={`${BRAND} — ${t.breadcrumbHome}`}>
                        <BrandMark />
                    </Link>
                    <nav aria-label={locale === "es" ? "Principal" : "Main"} className="order-3 flex w-full gap-6 overflow-x-auto text-[15px] sm:order-none sm:w-auto">
                        {nav.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to as never}
                                className="whitespace-nowrap text-soft transition-colors hover:text-paper"
                                activeProps={{ className: "!text-paper" }}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <a href="#contacto" className="whitespace-nowrap text-soft transition-colors hover:text-paper">
                            {t.nav.contact}
                        </a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <a
                            href={alternate ?? PATHS.home[other]}
                            hrefLang={other}
                            lang={other}
                            className="font-mono text-xs tracking-widest text-dim uppercase hover:text-paper"
                        >
                            <span className="sr-only">{t.langSwitch}</span>
                            <span aria-hidden>{other}</span>
                        </a>
                        <button
                            type="button"
                            onClick={openAssistant}
                            className="inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
                        >
                            {t.cta} ↗
                        </button>
                    </div>
                </div>
            </header>

            <main id="contenido">{children}</main>

            <ContactBand locale={locale} />

            <AssistantWidget locale={locale} />

            <footer className="border-t border-line">
                <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 text-sm text-dim sm:grid-cols-3 sm:px-8">
                    <div>
                        <BrandMark className="text-paper" />
                        <p className="mt-4 max-w-xs leading-relaxed">{t.footerAbout}</p>
                        <p className="mt-4">{t.location}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-paper">{t.nav.work}</p>
                        <ul className="mt-3 space-y-2">
                            <li><a href={`${PATHS.work[locale]}?d=design`} className="hover:text-paper">{t.disciplines.design}</a></li>
                            <li><a href={`${PATHS.work[locale]}?d=development`} className="hover:text-paper">{t.disciplines.development}</a></li>
                            <li><Link to={PATHS.team[locale] as never} className="hover:text-paper">{t.nav.team}</Link></li>
                            <li><Link to={PATHS.services[locale] as never} className="hover:text-paper">{t.nav.services}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-paper">{t.nav.contact}</p>
                        <ul className="mt-3 space-y-2">
                            <li><a href={whatsappLink(t.waDefault)} target="_blank" rel="noopener" className="hover:text-paper">WhatsApp</a></li>
                            <li><a href={`mailto:${SITE.email}`} className="hover:text-paper">{SITE.email}</a></li>
                            <li><a href={SITE.socials.behance} target="_blank" rel="noopener" className="hover:text-paper">Behance</a></li>
                            <li><a href={SITE.socials.github} target="_blank" rel="noopener" className="hover:text-paper">GitHub</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-5 pb-10 text-xs text-dim sm:px-8">
                    © {new Date().getFullYear()} {BRAND}. {t.rights}
                </div>
            </footer>
        </div>
    );
}

function ContactBand({ locale }: { locale: Locale }) {
    const t = UI[locale];
    return (
        <section id="contacto" aria-labelledby="contacto-titulo" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
            <div data-reveal className="flex flex-wrap items-end justify-between gap-10 rounded-[2rem] bg-brand px-8 py-14 text-ink sm:px-14 sm:py-16">
                <div className="max-w-2xl">
                    <h2 id="contacto-titulo" className="text-4xl leading-[0.95] font-bold sm:text-6xl">
                        {t.contactTitle}
                    </h2>
                    <p className="mt-5 max-w-xl text-lg text-ink/80">{t.contactLead}</p>
                </div>
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={openAssistant}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-paper px-7 font-semibold text-ink hover:bg-paper/85"
                    >
                        {t.quoteAssistant}
                    </button>
                    <a
                        href={whatsappLink(t.waDefault)}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 font-semibold text-paper hover:bg-ink/85"
                    >
                        <WhatsAppIcon className="size-5" />
                        {t.whatsapp}
                    </a>
                    <a
                        href={`mailto:${SITE.email}`}
                        className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-ink px-7 font-semibold hover:bg-ink/10"
                    >
                        {t.email}
                    </a>
                </div>
            </div>
        </section>
    );
}
