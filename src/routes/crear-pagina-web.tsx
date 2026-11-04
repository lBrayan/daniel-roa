import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { CtaBand, FaqList, PageHero, PricingGrid, Prose, Section } from "@/components/marketing/Blocks";
import type { Faq } from "@/data/marketing";
import { BUSINESS_SCHEMA, breadcrumbSchema, faqSchema, pageHead } from "@/lib/seo";

const PATH = "/crear-pagina-web";
const CRUMBS = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/servicios" },
    { name: "Crear página web en Colombia", path: PATH },
];

const FAQ_CREAR: Faq[] = [
    {
        q: "¿Cuánto cuesta crear una página web en Colombia en 2026?",
        a: "Una landing page profesional cuesta entre $350.000 y $1.000.000 COP; una página corporativa entre $900.000 y $3.000.000 COP, y una tienda online desde $1.800.000 COP. A eso se suma el dominio y el hosting, que se pagan cada año.",
    },
    {
        q: "¿Cuánto cuesta el dominio y el hosting al año?",
        a: "Un dominio .com cuesta alrededor de $60.000 a $90.000 COP al año y un .co algo más. Un hosting básico para una página pequeña puede costar desde $100.000 COP al año. Los precios varían según el proveedor.",
    },
    {
        q: "¿Qué es mejor, una landing page o una página web completa?",
        a: "Si vendes un solo producto o servicio, o vas a hacer publicidad en Facebook o Google, una landing page suele convertir mejor. Si ofreces varios servicios y quieres posicionar en Google a largo plazo, conviene una página web completa.",
    },
    {
        q: "¿Puedo hacer mi página web gratis con Wix o un constructor?",
        a: "Puedes, pero las versiones gratuitas muestran publicidad, no usan tu dominio y tienen límites de SEO. Para un negocio que quiere verse profesional y aparecer en Google, una página a la medida suele ser mejor inversión.",
    },
    {
        q: "¿La página web es mía?",
        a: "Sí. El dominio, el hosting y el contenido quedan a tu nombre. Al final te entrego los accesos para que tengas control total.",
    },
];

export const Route = createFileRoute("/crear-pagina-web")({
    head: () =>
        pageHead({
            title: "Crear página web en Colombia: precios 2026 y cómo hacerlo | Brayan Roa",
            description:
                "¿Cuánto cuesta crear una página web en Colombia? Precios reales de landing pages, páginas corporativas y tiendas online, qué incluyen y cómo elegir. Cotiza con un desarrollador web.",
            path: PATH,
            schemas: [BUSINESS_SCHEMA, faqSchema(FAQ_CREAR), breadcrumbSchema(CRUMBS)],
        }),
    component: CreateWebsitePage,
});

function CreateWebsitePage() {
    return (
        <MarketingLayout>
            <PageHero
                breadcrumbs={CRUMBS}
                eyebrow="Guía de precios 2026"
                title="Crear una página web en Colombia: precios y lo que debes saber"
                lead="Si estás pensando en crear la página web de tu negocio, aquí tienes precios reales del mercado colombiano, qué tipo de sitio te conviene y cómo evitar pagar de más."
                waMessage="Hola Brayan, quiero crear una página web para mi negocio."
            />

            <Section eyebrow="Precios" title="¿Cuánto cuesta una página web en Colombia?">
                <Prose>
                    <p>
                        El precio de una página web depende de tres cosas: <strong>cuántas secciones tiene</strong>,
                        <strong> qué funciones necesita</strong> (pagos, reservas, catálogo, chat) y{" "}
                        <strong>quién la hace</strong>. En Colombia estos son los rangos que encontrarás en 2026:
                    </p>
                    <ul>
                        <li><strong>Landing page:</strong> entre $350.000 y $1.000.000 COP.</li>
                        <li><strong>Página web corporativa (5 a 8 secciones):</strong> entre $900.000 y $3.000.000 COP.</li>
                        <li><strong>Tienda online:</strong> desde $1.800.000 COP, según el número de productos e integraciones.</li>
                        <li><strong>Plataformas y sistemas a la medida:</strong> desde $5.000.000 COP en adelante.</li>
                    </ul>
                    <p>
                        A eso súmale el <strong>dominio</strong> (tu dirección .com o .co) y el <strong>hosting</strong>{" "}
                        (el servidor donde vive tu página), que se renuevan cada año. Desconfía de las ofertas de “página
                        web por $100.000”: casi siempre son plantillas que no aparecen en Google, no te dejan el dominio a
                        tu nombre o cobran mensualidades escondidas.
                    </p>
                </Prose>
            </Section>

            <Section
                id="planes"
                eyebrow="Mis planes"
                title="Planes para crear tu página web"
                intro="Precio cerrado por escrito antes de empezar, 50% al iniciar y 50% al entregar."
                className="border-t border-white/10"
            >
                <PricingGrid ids={["landing", "corporativa", "tienda"]} />
            </Section>

            <Section eyebrow="Paso a paso" title="Cómo crear la página web de tu negocio" className="border-t border-white/10">
                <Prose>
                    <h3>1. Define el objetivo</h3>
                    <p>
                        ¿Quieres que te escriban por WhatsApp, que agenden una cita o que compren en línea? El objetivo
                        decide el tipo de página, el diseño y los botones. Una página sin objetivo claro es solo un
                        folleto bonito.
                    </p>
                    <h3>2. Elige tu dominio</h3>
                    <p>
                        Usa el nombre de tu negocio, corto y fácil de dictar por teléfono. En Colombia funcionan bien los
                        .com y los .co. Evita guiones y números.
                    </p>
                    <h3>3. Prepara el contenido</h3>
                    <p>
                        Logo, fotos reales de tu negocio, una lista de servicios con precios o rangos y las preguntas que
                        más te hacen tus clientes. Si no tienes los textos, te ayudo a redactarlos pensando en Google.
                    </p>
                    <h3>4. Diseño y desarrollo</h3>
                    <p>
                        Aquí se construye la página: diseño adaptado al celular, carga rápida, botón de WhatsApp,
                        formularios y SEO técnico (títulos, descripciones, sitemap y datos estructurados).
                    </p>
                    <h3>5. Publica y conéctala con Google</h3>
                    <p>
                        Al publicar, registro tu sitio en Google Search Console y, si tienes local, en Google Business
                        Profile para que aparezcas en Google Maps. Desde ahí puedes medir cuántas personas te encuentran.
                    </p>
                </Prose>
            </Section>

            <Section eyebrow="Checklist" title="Lo que toda página web profesional debe tener" className="border-t border-white/10">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        ["Se ve bien en el celular", "La mayoría de las visitas en Colombia llegan desde el teléfono."],
                        ["Carga en menos de 3 segundos", "Si tarda más, la mayoría de visitantes se van."],
                        ["Certificado HTTPS", "El candado de seguridad; sin él Google la marca como “no segura”."],
                        ["Botón de WhatsApp visible", "Es el canal preferido por los clientes en Colombia."],
                        ["SEO técnico", "Títulos, descripciones, sitemap y datos estructurados para Google."],
                        ["Dominio a tu nombre", "Tu página debe ser tuya, no del proveedor."],
                    ].map(([title, text]) => (
                        <div key={title} className="rounded-2xl border border-white/10 p-5">
                            <p className="font-semibold">✓ {title}</p>
                            <p className="mt-2 text-sm text-mist">{text}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-8 text-sm text-mist">
                    ¿Tu negocio está en Bogotá?{" "}
                    <Link to={"/desarrollo-web-bogota" as never} className="text-white underline underline-offset-4">
                        Mira el servicio de desarrollo web en Bogotá
                    </Link>
                    . ¿Quieres ver todos los servicios?{" "}
                    <Link to={"/servicios" as never} className="text-white underline underline-offset-4">
                        Servicios y precios
                    </Link>
                    .
                </p>
            </Section>

            <Section eyebrow="Preguntas frecuentes" title="Preguntas sobre crear una página web" className="border-t border-white/10">
                <FaqList faqs={FAQ_CREAR} />
            </Section>

            <CtaBand
                title="Crea tu página web con un desarrollador experto"
                text="Cuéntame qué hace tu negocio y qué quieres lograr. Te recomiendo el plan que de verdad necesitas, sin venderte de más."
                waMessage="Hola Brayan, quiero crear una página web. ¿Me ayudas a cotizar?"
            />
        </MarketingLayout>
    );
}
