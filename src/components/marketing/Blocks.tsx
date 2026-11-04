import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/fx/Reveal";
import {
    DIFFERENTIATORS,
    PROCESS_STEPS,
    SERVICES,
    formatCOP,
    type Faq,
    type Service,
} from "@/data/marketing";
import { WhatsAppButton } from "./MarketingLayout";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`mx-auto max-w-6xl px-5 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
    return <p className="text-xs font-semibold tracking-[0.25em] text-arc uppercase">{children}</p>;
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
    return (
        <nav aria-label="Ruta de navegación" className="text-xs text-mist">
            <ol className="flex flex-wrap items-center gap-2">
                {items.map((item, i) => (
                    <li key={item.path} className="flex items-center gap-2">
                        {i > 0 && <span aria-hidden>/</span>}
                        {i < items.length - 1 ? (
                            <Link to={item.path as never} className="hover:text-white">
                                {item.name}
                            </Link>
                        ) : (
                            <span aria-current="page" className="text-white/70">
                                {item.name}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

/** Encabezado de página con H1, bajada y llamados a la acción. */
export function PageHero({
    breadcrumbs,
    eyebrow,
    title,
    lead,
    waMessage,
    bullets,
}: {
    breadcrumbs: { name: string; path: string }[];
    eyebrow: string;
    title: ReactNode;
    lead: ReactNode;
    waMessage: string;
    bullets?: string[];
}) {
    return (
        <section className="relative overflow-hidden border-b border-white/10">
            <div className="stage-grid absolute inset-0" aria-hidden />
            <Container className="relative py-16 sm:py-24">
                <Breadcrumbs items={breadcrumbs} />
                <div className="mt-8 max-w-3xl">
                    <Eyebrow>{eyebrow}</Eyebrow>
                    <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl md:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-mist sm:text-xl">{lead}</p>
                    {bullets && (
                        <ul className="mt-6 grid gap-2 text-sm text-white/85 sm:grid-cols-2">
                            {bullets.map((b) => (
                                <li key={b} className="flex gap-2">
                                    <span className="text-arc">✓</span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <WhatsAppButton message={waMessage} />
                        <Link
                            to={"/servicios" as never}
                            hash="precios"
                            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50"
                        >
                            Ver precios
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export function Section({
    id,
    eyebrow,
    title,
    intro,
    children,
    className = "",
}: {
    id?: string;
    eyebrow?: string;
    title: ReactNode;
    intro?: ReactNode;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <section id={id} className={`scroll-mt-24 py-16 sm:py-20 ${className}`}>
            <Container>
                <Reveal>
                    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                    <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
                    {intro && <p className="mt-4 max-w-3xl text-base leading-relaxed text-mist sm:text-lg">{intro}</p>}
                </Reveal>
                {children && <div className="mt-10">{children}</div>}
            </Container>
        </section>
    );
}

function PriceTag({ service }: { service: Service }) {
    if (service.priceFrom === null) {
        return <p className="text-2xl font-semibold">A cotizar</p>;
    }
    return (
        <p>
            <span className="text-xs tracking-wide text-mist uppercase">Desde</span>
            <br />
            <span className="text-3xl font-semibold">{formatCOP(service.priceFrom)}</span>
            <span className="ml-1 text-sm text-mist">COP</span>
        </p>
    );
}

export function PricingGrid({ ids }: { ids?: string[] }) {
    const list = ids ? SERVICES.filter((s) => ids.includes(s.id)) : SERVICES;
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((s, i) => (
                <Reveal key={s.id} delay={i * 80} as="article">
                    <div
                        className={`flex h-full flex-col rounded-2xl border p-6 ${
                            s.featured ? "border-arc/60 bg-arc/[0.07]" : "border-white/10 bg-white/[0.02]"
                        }`}
                    >
                        {s.featured && (
                            <span className="mb-3 self-start rounded-full bg-arc px-3 py-1 text-[11px] font-semibold text-black">
                                Más pedido
                            </span>
                        )}
                        <h3 className="text-xl font-semibold">{s.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-mist">{s.summary}</p>
                        <div className="mt-5">
                            <PriceTag service={s} />
                            <p className="mt-1 text-xs text-mist">Entrega: {s.delivery}</p>
                        </div>
                        <ul className="mt-5 flex-1 space-y-2 text-sm text-white/85">
                            {s.includes.map((item) => (
                                <li key={item} className="flex gap-2">
                                    <span className="text-arc">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 text-xs text-mist">Ideal para: {s.idealFor}</p>
                        <WhatsAppButton
                            message={`Hola Brayan, quiero cotizar: ${s.name}.`}
                            variant={s.featured ? "primary" : "ghost"}
                            className="mt-6 w-full"
                        >
                            Cotizar este plan
                        </WhatsAppButton>
                        {s.href && (
                            <Link
                                to={s.href as never}
                                className="mt-3 text-center text-xs text-mist underline-offset-4 hover:text-white hover:underline"
                            >
                                Más información
                            </Link>
                        )}
                    </div>
                </Reveal>
            ))}
        </div>
    );
}

export function ProcessList() {
    return (
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 70} as="li">
                    <div className="h-full rounded-2xl border border-white/10 p-5">
                        <span className="text-sm font-semibold text-arc">0{i + 1}</span>
                        <h3 className="mt-2 font-semibold">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-mist">{step.text}</p>
                    </div>
                </Reveal>
            ))}
        </ol>
    );
}

export function Differentiators() {
    return (
        <div className="grid gap-5 sm:grid-cols-2">
            {DIFFERENTIATORS.map((d, i) => (
                <Reveal key={d.title} delay={i * 70}>
                    <div className="h-full rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold">{d.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-mist">{d.text}</p>
                    </div>
                </Reveal>
            ))}
        </div>
    );
}

/** Preguntas frecuentes con <details>: el texto queda en el HTML para Google. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
    return (
        <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
            {faqs.map((f) => (
                <details key={f.q} className="group px-6 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                        <h3 className="text-base">{f.q}</h3>
                        <span className="text-arc transition-transform group-open:rotate-45" aria-hidden>
                            +
                        </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-mist">{f.a}</p>
                </details>
            ))}
        </div>
    );
}

export function CtaBand({ title, text, waMessage }: { title: string; text: string; waMessage: string }) {
    return (
        <section className="py-16 sm:py-20">
            <Container>
                <Reveal>
                    <div className="rounded-3xl border border-arc/40 bg-gradient-to-br from-arc/15 to-transparent p-8 text-center sm:p-14">
                        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
                        <p className="mx-auto mt-4 max-w-xl text-mist">{text}</p>
                        <div className="mt-8 flex justify-center">
                            <WhatsAppButton message={waMessage}>Escríbeme por WhatsApp</WhatsAppButton>
                        </div>
                        <p className="mt-4 text-xs text-mist">Respuesta el mismo día · Cotización sin costo</p>
                    </div>
                </Reveal>
            </Container>
        </section>
    );
}

/** Bloque de texto largo (contenido SEO) con buena tipografía. */
export function Prose({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-white/80 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-white [&_ul]:space-y-2">
            {children}
        </div>
    );
}
