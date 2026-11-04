import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
    CtaBand,
    Differentiators,
    FaqList,
    PageHero,
    PricingGrid,
    ProcessList,
    Section,
} from "@/components/marketing/Blocks";
import { FAQ_GENERAL } from "@/data/marketing";
import { BUSINESS_SCHEMA, breadcrumbSchema, faqSchema, pageHead } from "@/lib/seo";

const PATH = "/servicios";
const CRUMBS = [
    { name: "Inicio", path: "/" },
    { name: "Servicios y precios", path: PATH },
];

export const Route = createFileRoute("/servicios")({
    head: () =>
        pageHead({
            title: "Servicios de desarrollo web y precios en Colombia | Brayan Roa",
            description:
                "Precios claros para páginas web, landing pages, tiendas online, chatbots con IA para WhatsApp y software a la medida. Desarrollador web en Bogotá con más de 10 años de experiencia.",
            path: PATH,
            schemas: [BUSINESS_SCHEMA, faqSchema(FAQ_GENERAL), breadcrumbSchema(CRUMBS)],
        }),
    component: ServicesPage,
});

function ServicesPage() {
    return (
        <MarketingLayout>
            <PageHero
                breadcrumbs={CRUMBS}
                eyebrow="Servicios y precios"
                title="Desarrollo web y software a la medida en Colombia"
                lead="Páginas web que venden, tiendas online, chatbots con inteligencia artificial y sistemas para tu empresa. Precios claros desde el inicio y trato directo con quien construye tu proyecto."
                waMessage="Hola Brayan, vi tus servicios y quiero cotizar un proyecto."
                bullets={[
                    "Precio cerrado antes de empezar",
                    "Entregas desde 3 días",
                    "SEO y Google desde el día uno",
                    "Soporte después de la entrega",
                ]}
            />

            <Section
                id="precios"
                eyebrow="Planes"
                title="¿Qué necesita tu negocio?"
                intro="Estos son precios de referencia. Cada proyecto se cotiza según lo que necesitas y siempre recibes un precio fijo por escrito antes de pagar."
            >
                <PricingGrid />
            </Section>

            <Section
                eyebrow="Por qué trabajar conmigo"
                title="Un arquitecto de software construyendo tu página"
                intro="No uso plantillas genéricas ni te paso a un equipo junior: diseño y programo tu proyecto con la misma calidad que aplico en sistemas para bancos y empresas."
                className="border-t border-white/10"
            >
                <Differentiators />
            </Section>

            <Section eyebrow="Cómo trabajamos" title="De la idea a tu página publicada en 5 pasos" className="border-t border-white/10">
                <ProcessList />
            </Section>

            <Section
                eyebrow="Tecnología"
                title="Herramientas modernas, resultados medibles"
                className="border-t border-white/10"
            >
                <p className="max-w-3xl leading-relaxed text-mist">
                    Trabajo con React, Next.js, Angular, Node.js, Java Spring Boot y PHP Laravel,
                    según lo que más le convenga a tu proyecto. Publico en Amazon Web Services (AWS) para que tu sitio
                    sea rápido, seguro y no se caiga cuando crece el tráfico. Integro pasarelas de pago colombianas
                    (Wompi, Mercado Pago, ePayco), WhatsApp Business API, Google Analytics y modelos de inteligencia
                    artificial como GPT y Claude.
                </p>
                <p className="mt-6 text-sm text-mist">
                    ¿Estás en Bogotá?{" "}
                    <Link to={"/desarrollo-web-bogota" as never} className="text-white underline underline-offset-4">
                        Conoce mi servicio de desarrollo web en Bogotá
                    </Link>
                    . ¿Quieres saber cuánto cuesta tu sitio?{" "}
                    <Link to={"/crear-pagina-web" as never} className="text-white underline underline-offset-4">
                        Lee la guía de precios para crear una página web en Colombia
                    </Link>
                    .
                </p>
            </Section>

            <Section eyebrow="Preguntas frecuentes" title="Lo que más me preguntan" className="border-t border-white/10">
                <FaqList faqs={FAQ_GENERAL} />
            </Section>

            <CtaBand
                title="Cuéntame tu idea y te cotizo hoy mismo"
                text="Escríbeme por WhatsApp con lo que necesitas. Te respondo con preguntas concretas y una propuesta con precio y fecha de entrega."
                waMessage="Hola Brayan, quiero cotizar un proyecto. Te cuento: "
            />
        </MarketingLayout>
    );
}
