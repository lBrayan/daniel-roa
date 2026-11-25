import { createFileRoute, Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/site";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
    CtaBand,
    Differentiators,
    FaqList,
    PageHero,
    PricingGrid,
    ProcessList,
    Prose,
    Section,
} from "@/components/marketing/Blocks";
import type { Faq } from "@/data/marketing";
import { BUSINESS_SCHEMA, breadcrumbSchema, faqSchema, pageHead } from "@/lib/seo";

const PATH = "/desarrollo-web-bogota";
const CRUMBS = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/servicios" },
    { name: "Desarrollador web en Bogotá", path: PATH },
];

const FAQ_BOGOTA: Faq[] = [
    {
        q: "¿Por qué contratar un desarrollador web independiente en Bogotá y no una agencia?",
        a: "Hablas directamente con quienes diseñan y programan tu sitio, sin intermediarios. Eso se traduce en respuestas más rápidas, precios más bajos que los de una agencia grande y la misma calidad técnica.",
    },
    {
        q: "¿Podemos reunirnos en persona?",
        a: "Sí. Si tu negocio está en Bogotá o Soacha podemos reunirnos para la primera conversación o la capacitación final. El resto del proceso se hace por videollamada y WhatsApp para avanzar más rápido.",
    },
    {
        q: "¿Cuánto cuesta una página web en Bogotá?",
        a: "Una landing page cuesta desde $350.000, una página web corporativa desde $900.000 y una tienda online desde $1.800.000 COP. El precio final depende de las secciones, funcionalidades e integraciones.",
    },
    {
        q: "¿Me ayudas a aparecer en Google Maps?",
        a: "Sí. En el plan corporativo configuro tu perfil de Google Business Profile y lo conecto con tu página para que aparezcas en búsquedas locales como “restaurante en Chapinero” o “abogado en Bogotá”.",
    },
    {
        q: "¿Qué necesito tener listo para empezar?",
        a: "Tu logo, los textos básicos de tu negocio y algunas fotos. Si no los tienes, te ayudamos a redactar los textos y a elegir imágenes profesionales.",
    },
];

export const Route = createFileRoute("/desarrollo-web-bogota")({
    head: () =>
        pageHead({
            title: `Desarrollador web en Bogotá | Páginas web profesionales | ${BRAND}`,
            description:
                "Desarrollador web freelance en Bogotá. Diseño de páginas web, landing pages y tiendas online para negocios y empresas, con SEO local y Google Maps. Cotiza por WhatsApp.",
            path: PATH,
            schemas: [BUSINESS_SCHEMA, faqSchema(FAQ_BOGOTA), breadcrumbSchema(CRUMBS)],
        }),
    component: BogotaPage,
});

function BogotaPage() {
    return (
        <MarketingLayout>
            <PageHero
                breadcrumbs={CRUMBS}
                eyebrow="Desarrollo web en Bogotá"
                title="Desarrollador web en Bogotá para negocios que quieren vender más"
                lead="Diseño y desarrollo páginas web, landing pages y tiendas online para negocios de Bogotá. Sitios rápidos, que se ven bien en el celular, aparecen en Google y llevan a tus clientes directo a WhatsApp."
                waMessage="Hola, tengo un negocio en Bogotá y quiero una página web."
                bullets={[
                    "Reunión presencial en Bogotá si la necesitas",
                    "SEO local y Google Maps",
                    "Precios desde $350.000 COP",
                    "Hablas directo con quien diseña y programa",
                ]}
            />

            <Section
                eyebrow="Para negocios bogotanos"
                title="Tu negocio en Bogotá merece aparecer cuando te buscan"
            >
                <Prose>
                    <p>
                        Cada día miles de personas en Bogotá buscan en Google cosas como “odontólogo en Usaquén”,
                        “restaurante en Chapinero” o “taller de motos en Kennedy”. Si tu negocio no tiene una página web
                        bien hecha, esos clientes terminan en tu competencia.
                    </p>
                    <p>
                        Somos un estudio de diseño y desarrollo en Bogotá, liderado por un arquitecto de software con más de
                        10 años de experiencia y una diseñadora de marca. Ponemos esa experiencia al servicio de negocios
                        bogotanos que necesitan una página profesional, sin pagar precios de agencia grande.
                    </p>
                    <h3>¿Qué incluye trabajar con nosotros?</h3>
                    <ul>
                        <li><strong>Diseño a la medida</strong>, pensado para tu tipo de cliente y no una plantilla genérica.</li>
                        <li><strong>Optimización para celular</strong>: la mayoría de tus visitas llegan desde el teléfono.</li>
                        <li><strong>SEO local</strong>: títulos, contenido y datos estructurados para búsquedas en Bogotá.</li>
                        <li><strong>Google Business Profile</strong> conectado para que aparezcas en Google Maps.</li>
                        <li><strong>WhatsApp y formularios</strong> para que convertir una visita en cliente sea fácil.</li>
                        <li><strong>Hosting rápido y seguro</strong> con certificado HTTPS.</li>
                    </ul>
                    <h3>Sectores con los que trabajamos</h3>
                    <p>
                        Consultorios médicos y odontológicos, abogados y contadores, restaurantes y cafés, inmobiliarias,
                        gimnasios, salones de belleza, talleres, colegios y academias, constructoras y tiendas de barrio
                        que quieren vender en línea.
                    </p>
                </Prose>
            </Section>

            <Section
                id="precios"
                eyebrow="Precios"
                title="Planes de página web en Bogotá"
                intro="Precios de referencia en pesos colombianos. Antes de empezar recibes una propuesta con precio cerrado."
                className="border-t border-white/10"
            >
                <PricingGrid ids={["landing", "corporativa", "tienda"]} />
                <p className="mt-6 text-sm text-mist">
                    ¿Necesitas automatizar la atención?{" "}
                    <Link to={"/chatbot-whatsapp-ia" as never} className="text-white underline underline-offset-4">
                        Mira el chatbot con IA para WhatsApp
                    </Link>
                    .
                </p>
            </Section>

            <Section eyebrow="Por qué yo" title="Calidad de software empresarial, trato de independiente" className="border-t border-white/10">
                <Differentiators />
            </Section>

            <Section eyebrow="Proceso" title="Así trabajamos" className="border-t border-white/10">
                <ProcessList />
            </Section>

            <Section eyebrow="Preguntas frecuentes" title="Preguntas sobre desarrollo web en Bogotá" className="border-t border-white/10">
                <FaqList faqs={FAQ_BOGOTA} />
            </Section>

            <CtaBand
                title="¿Listo para tener la página web de tu negocio?"
                text="Cuéntanos qué hace tu negocio y en qué zona de Bogotá estás. Te enviamos una propuesta con precio y fecha de entrega."
                waMessage="Hola, tengo un negocio en Bogotá y quiero cotizar una página web."
            />
        </MarketingLayout>
    );
}
