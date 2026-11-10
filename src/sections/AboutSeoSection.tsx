import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

type ServiceItem = { t: string; d: string; to: string };

/**
 * Sección de texto "Sobre mí" al final de la landing.
 * Le dice a Google, con texto real, qué hago y para quién
 * (ingeniero de software, desarrollador web freelance, Colombia).
 */
export function AboutSeoSection() {
    const { t } = useTranslation();
    const services = t("seo.services", { returnObjects: true }) as ServiceItem[];

    return (
        <section aria-labelledby="about-title" className="border-t border-white/10 px-6 py-20 sm:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="text-xs font-semibold tracking-[0.25em] text-arc uppercase">{t("seo.eyebrow")}</p>
                <h2 id="about-title" className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                    {t("seo.title")}
                </h2>
                <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-white/80">
                    <p>{t("seo.p1")}</p>
                    <p>{t("seo.p2")}</p>
                </div>

                <h3 className="mt-12 text-xl font-semibold">{t("seo.servicesTitle")}</h3>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {Array.isArray(services) &&
                        services.map((s) => (
                            <li key={s.to}>
                                <Link
                                    to={s.to as never}
                                    className="block h-full rounded-2xl border border-white/10 p-5 transition-colors hover:border-white/30"
                                >
                                    <span className="font-semibold text-white">{s.t}</span>
                                    <span className="mt-2 block text-sm leading-relaxed text-mist">{s.d}</span>
                                </Link>
                            </li>
                        ))}
                </ul>

                <div className="mt-12 grid gap-10 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-semibold">{t("seo.stackTitle")}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/80">{t("seo.stack")}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">{t("seo.whyTitle")}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/80">{t("seo.why")}</p>
                    </div>
                </div>

                <Link
                    to={"/servicios" as never}
                    className="mt-12 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50"
                >
                    {t("seo.cta")}
                </Link>
            </div>
        </section>
    );
}
