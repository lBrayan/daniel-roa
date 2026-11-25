import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Container, Kicker, MemberCard, ProjectGrid } from "@/components/site/Blocks";
import { PATHS, PROJECTS, TEAM, UI, whatsappLink, type Locale } from "@/lib/site";

const COPY = {
    es: {
        kicker: "Estudio de diseño y tecnología · Bogotá, Colombia · ES / EN",
        h1a: "Marcas que se ven bien.",
        h1b: "Software",
        h1c: "que funciona.",
        lead: "Somos un equipo de diseño y desarrollo. Creamos la identidad de tu marca, diseñamos la experiencia y construimos la página web, la tienda o el sistema que la hace crecer, de la idea a producción.",
        seeWork: "Ver proyectos",
        talk: "Cuéntanos tu idea",
        strip: ["Branding", "Empaques", "UI / UX", "Páginas web", "Tiendas online", "Apps a la medida", "IA y chatbots", "Nube · AWS"],
        workTitle: "Trabajo seleccionado",
        servicesTitle: "Lo que hacemos",
        design: {
            kicker: "01 · Diseño",
            title: "Que tu marca se recuerde",
            items: ["Branding e identidad visual", "Sistemas de marca y manual de uso", "Empaques, etiquetas y piezas digitales", "UI / UX para webs y apps"],
            link: { label: "Ver proyectos de diseño", href: "/proyectos?d=design" },
        },
        tech: {
            kicker: "02 · Tecnología",
            title: "Que tu negocio funcione solo",
            items: [
                { label: "Páginas web y landing pages", href: "/crear-pagina-web" },
                { label: "Tiendas online (Shopify, WooCommerce o a la medida)", href: "/servicios" },
                { label: "Aplicaciones web y móviles a la medida", href: "/desarrollo-de-aplicaciones" },
                { label: "Chatbots con IA para WhatsApp", href: "/chatbot-whatsapp-ia" },
                { label: "Arquitectura en la nube (AWS), APIs e integraciones", href: "/ingeniero-de-software-freelance" },
            ],
            link: { label: "Ver servicios y precios", href: "/servicios" },
        },
        teamTitle: "El equipo",
        teamLead: "Perfiles que se complementan: diseño y tecnología trabajando juntos desde el primer día. Hablas con quien hace el trabajo, en español o en inglés.",
        processTitle: "Cómo trabajamos",
        process: [
            ["Entendemos", "Una llamada para conocer tu negocio, tus clientes y lo que necesitas lograr."],
            ["Proponemos", "Propuesta por escrito con alcance, precio cerrado y fecha de entrega."],
            ["Diseñamos y construimos", "Avances cada semana para que veas y opines sobre el trabajo real."],
            ["Lanzamos y acompañamos", "Publicamos, te enseñamos a usarlo y seguimos contigo después de la entrega."],
        ],
        seoTitle: "Estudio de diseño gráfico y desarrollo web en Bogotá",
        seoText:
            "Reunimos en un solo equipo lo que normalmente contratarías por separado: diseño de marca, diseño de interfaces y desarrollo de software. Diseñamos logotipos, identidades visuales y empaques; creamos páginas web, tiendas online y aplicaciones a la medida; e integramos inteligencia artificial y la nube de AWS cuando le sirven a tu negocio. Trabajamos con empresas y emprendedores de Bogotá, de toda Colombia y del exterior.",
    },
    en: {
        kicker: "Design & technology studio · Bogotá, Colombia · EN / ES",
        h1a: "Brands that look good.",
        h1b: "Software",
        h1c: "that works.",
        lead: "We are a design and development team. We create your brand identity, design the experience and build the website, store or system that helps it grow, from idea to production.",
        seeWork: "See our work",
        talk: "Tell us your idea",
        strip: ["Branding", "Packaging", "UI / UX", "Websites", "Online stores", "Custom apps", "AI & chatbots", "Cloud · AWS"],
        workTitle: "Selected work",
        servicesTitle: "What we do",
        design: {
            kicker: "01 · Design",
            title: "A brand people remember",
            items: ["Branding and visual identity", "Brand systems and guidelines", "Packaging, labels and digital assets", "UI / UX for websites and apps"],
            link: { label: "See design work", href: "/en/work?d=design" },
        },
        tech: {
            kicker: "02 · Technology",
            title: "A business that runs itself",
            items: [
                { label: "Websites and landing pages", href: "/en/services" },
                { label: "Online stores (Shopify, WooCommerce or custom)", href: "/en/services" },
                { label: "Custom web and mobile apps", href: "/en/services" },
                { label: "AI chatbots for WhatsApp and the web", href: "/en/services" },
                { label: "Cloud architecture (AWS), APIs and integrations", href: "/en/services" },
            ],
            link: { label: "See services", href: "/en/services" },
        },
        teamTitle: "The team",
        teamLead: "Complementary profiles: design and technology working together from day one. You talk to the people doing the work, in English or Spanish.",
        processTitle: "How we work",
        process: [
            ["We listen", "A call to understand your business, your customers and what you need to achieve."],
            ["We propose", "A written proposal with scope, fixed price and delivery date."],
            ["We design and build", "Weekly progress so you can see and comment on real work."],
            ["We launch and support", "We go live, train you and stay with you after delivery."],
        ],
        seoTitle: "Graphic design and web development studio in Colombia",
        seoText:
            "We bring together in one team what you would usually hire separately: brand design, interface design and software development. We design logos, visual identities and packaging; build websites, online stores and custom applications; and add AI and AWS cloud when it actually helps your business. A nearshore team in Colombia (UTC-5) working with companies in Latin America and the United States.",
    },
};

export function HomePage({ locale }: { locale: Locale }) {
    const c = COPY[locale];
    const t = UI[locale];
    const featured = PROJECTS.filter((p) => p.featured);

    return (
        <SiteLayout locale={locale} alternate={PATHS.home[locale === "es" ? "en" : "es"]}>
            <Container className="pt-20 pb-16 sm:pt-28">
                <Kicker>{c.kicker}</Kicker>
                <h1 className="mt-7 max-w-5xl text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] font-bold">
                    {c.h1a} <span className="text-brand">{c.h1b}</span> {c.h1c}
                </h1>
                <div className="mt-12 flex flex-wrap items-end justify-between gap-8">
                    <p className="max-w-2xl text-xl leading-relaxed text-soft">{c.lead}</p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to={PATHS.work[locale] as never}
                            className="inline-flex min-h-12 items-center rounded-full border border-line px-6 hover:border-soft"
                        >
                            {c.seeWork}
                        </Link>
                        <a
                            href={whatsappLink(t.waDefault)}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex min-h-12 items-center rounded-full bg-paper px-6 font-semibold text-ink hover:bg-soft"
                        >
                            {c.talk}
                        </a>
                    </div>
                </div>
            </Container>

            <div className="border-y border-line">
                <Container className="flex flex-wrap justify-between gap-x-10 gap-y-3 py-6 font-mono text-xs tracking-[0.12em] text-dim uppercase">
                    {c.strip.map((s) => (
                        <span key={s}>{s}</span>
                    ))}
                </Container>
            </div>

            <Container className="py-24">
                <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                    <h2 className="text-5xl font-bold sm:text-6xl">{c.workTitle}</h2>
                    <Link to={PATHS.work[locale] as never} className="inline-flex min-h-11 items-center font-semibold hover:text-brand">
                        {t.viewAll} →
                    </Link>
                </div>
                <ProjectGrid projects={featured} locale={locale} eagerFirst />
            </Container>

            <Container className="py-16">
                <h2 className="mb-12 text-5xl font-bold sm:text-6xl">{c.servicesTitle}</h2>
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-6 rounded-3xl border border-line bg-ink-2 p-9">
                        <Kicker className="!text-brand">{c.design.kicker}</Kicker>
                        <h3 className="text-4xl font-bold">{c.design.title}</h3>
                        <ul className="flex flex-col text-lg text-soft">
                            {c.design.items.map((i) => (
                                <li key={i} className="border-t border-line py-3">
                                    {i}
                                </li>
                            ))}
                        </ul>
                        <a href={c.design.link.href} className="mt-auto inline-flex min-h-11 items-center font-semibold hover:text-brand">
                            {c.design.link.label} →
                        </a>
                    </div>
                    <div className="flex flex-col gap-6 rounded-3xl border border-line bg-ink-2 p-9">
                        <Kicker className="!text-brand">{c.tech.kicker}</Kicker>
                        <h3 className="text-4xl font-bold">{c.tech.title}</h3>
                        <ul className="flex flex-col text-lg text-soft">
                            {c.tech.items.map((i) => (
                                <li key={i.label} className="border-t border-line py-3">
                                    <Link to={i.href as never} className="hover:text-paper">
                                        {i.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link to={c.tech.link.href as never} className="mt-auto inline-flex min-h-11 items-center font-semibold hover:text-brand">
                            {c.tech.link.label} →
                        </Link>
                    </div>
                </div>
            </Container>

            <section className="my-16 bg-paper text-ink">
                <Container className="py-24">
                    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                        <h2 className="text-5xl font-bold sm:text-6xl">{c.teamTitle}</h2>
                        <p className="max-w-md text-lg text-ink/70">{c.teamLead}</p>
                    </div>
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 [&_.text-soft]:text-ink/80 [&_.text-dim]:text-ink/60">
                        {TEAM.map((m) => (
                            <MemberCard key={m.slug} member={m} locale={locale} />
                        ))}
                    </div>
                </Container>
            </section>

            <Container className="py-16">
                <h2 className="mb-12 text-5xl font-bold sm:text-6xl">{c.processTitle}</h2>
                <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {c.process.map(([title, text], i) => (
                        <li key={title} className="flex flex-col gap-3 border-t-2 border-brand pt-6">
                            <span className="font-mono text-xs text-dim">0{i + 1}</span>
                            <strong className="font-grotesk text-2xl">{title}</strong>
                            <span className="leading-relaxed text-soft">{text}</span>
                        </li>
                    ))}
                </ol>
            </Container>

            <Container className="pt-8 pb-24">
                <div className="max-w-3xl">
                    <h2 className="text-3xl font-bold">{c.seoTitle}</h2>
                    <p className="mt-5 text-lg leading-relaxed text-soft">{c.seoText}</p>
                </div>
            </Container>
        </SiteLayout>
    );
}
