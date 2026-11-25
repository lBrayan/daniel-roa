import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, Container, Kicker } from "@/components/site/Blocks";
import { PATHS, UI, whatsappLink } from "@/lib/site";

export const SERVICES_EN = {
    title: "Branding, web design and custom software services",
    description:
        "Brand identity, packaging, UX/UI, websites, Shopify stores, custom web and mobile apps, AI chatbots and AWS cloud architecture. A nearshore design and development team in Colombia.",
};

const GROUPS = [
    {
        kicker: "01 · Design",
        title: "Brand & design",
        items: [
            ["Brand identity", "Logo, colour, typography and the visual personality of your brand."],
            ["Brand systems", "Guidelines and ready-to-use assets so your brand looks the same everywhere."],
            ["Packaging & labels", "Packaging and labels for food, beverage and consumer products."],
            ["UX / UI design", "Website and app interfaces designed to be built, not just presented."],
        ],
    },
    {
        kicker: "02 · Technology",
        title: "Web & software",
        items: [
            ["Websites & landing pages", "Fast, SEO-ready websites that turn visitors into enquiries."],
            ["Online stores", "Shopify, WooCommerce or custom e-commerce, integrated with payments and shipping."],
            ["Custom web & mobile apps", "Internal systems, client portals, SaaS products and MVPs."],
            ["AI chatbots & automation", "Assistants for WhatsApp and the web trained on your business, plus workflow automation."],
            ["Cloud architecture & integrations", "AWS infrastructure, APIs, integrations and modernisation of existing systems."],
        ],
    },
];

const WHY = [
    ["Design and engineering in one team", "No hand-offs between agencies: the people who design your product also build it."],
    ["Senior technical leadership", "Architecture led by an engineer with 10+ years building systems for companies."],
    ["Nearshore, same time zone", "Based in Colombia (UTC-5): real-time collaboration with US and Latin American teams."],
    ["Clear scope and price", "Every project starts with a written proposal: scope, fixed price and delivery date."],
];

export function ServicesEnPage() {
    const t = UI.en;
    return (
        <SiteLayout locale="en" alternate={PATHS.services.es}>
            <Container className="pt-14 pb-16">
                <Breadcrumbs
                    locale="en"
                    items={[
                        { name: t.breadcrumbHome, path: PATHS.home.en },
                        { name: t.nav.services, path: PATHS.services.en },
                    ]}
                />
                <div className="mt-10 max-w-3xl">
                    <Kicker>{t.tagline}</Kicker>
                    <h1 className="mt-5 text-6xl font-bold sm:text-7xl">Services</h1>
                    <p className="mt-6 text-xl leading-relaxed text-soft">
                        From the first sketch of your brand to software running in production. Hire design, development or both,
                        with one team accountable for the result.
                    </p>
                </div>
            </Container>
            <Container className="grid gap-6 pb-16 lg:grid-cols-2">
                {GROUPS.map((g) => (
                    <section key={g.title} className="flex flex-col gap-6 rounded-3xl border border-line bg-ink-2 p-9">
                        <Kicker className="!text-brand">{g.kicker}</Kicker>
                        <h2 className="text-4xl font-bold">{g.title}</h2>
                        <ul className="flex flex-col">
                            {g.items.map(([name, text]) => (
                                <li key={name} className="border-t border-line py-4">
                                    <h3 className="text-xl font-medium">{name}</h3>
                                    <p className="mt-1 text-soft">{text}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </Container>
            <Container className="py-16">
                <h2 className="mb-10 text-5xl font-bold">Why work with us</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {WHY.map(([title, text]) => (
                        <div key={title} className="border-t-2 border-brand pt-6">
                            <h3 className="text-2xl font-bold">{title}</h3>
                            <p className="mt-3 leading-relaxed text-soft">{text}</p>
                        </div>
                    ))}
                </div>
                <a
                    href={whatsappLink(t.waDefault)}
                    target="_blank"
                    rel="noopener"
                    className="mt-12 inline-flex min-h-12 items-center rounded-full bg-brand px-7 font-semibold text-ink hover:opacity-90"
                >
                    Request a quote ↗
                </a>
            </Container>
        </SiteLayout>
    );
}
