import { createFileRoute, Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/site";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { CtaBand, FaqList, PageHero, PricingGrid, ProcessList, Prose, Section } from "@/components/marketing/Blocks";
import type { Faq } from "@/data/marketing";
import { organizationSchema, breadcrumbSchema, faqSchema, pageHead } from "@/lib/seo";

const PATH = "/desarrollo-de-aplicaciones";
const CRUMBS = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/servicios" },
    { name: "Desarrollo de aplicaciones", path: PATH },
];

const FAQ_APPS: Faq[] = [
    {
        q: "¿Cuánto cuesta desarrollar una aplicación en Colombia?",
        a: "Depende de las funcionalidades, las integraciones y si es web, móvil o ambas. Para controlar la inversión propongo empezar con una primera versión (MVP) con lo esencial y crecer por fases. Después de una conversación corta recibes una propuesta con precio cerrado.",
    },
    {
        q: "¿Cuánto tiempo toma desarrollar una aplicación?",
        a: "Una primera versión funcional suele estar lista entre 3 y 8 semanas, según el alcance. Durante el desarrollo ves avances cada semana y puedes probar la aplicación antes de la entrega final.",
    },
    {
        q: "¿Hacen aplicaciones móviles para Android y iPhone?",
        a: "Sí. Según el caso desarrollo una aplicación web progresiva (PWA), que se instala desde el navegador y funciona en cualquier celular, o una app híbrida para publicar en las tiendas de Android y iOS con un solo código.",
    },
    {
        q: "¿La aplicación y el código quedan a mi nombre?",
        a: "Sí. El código, el dominio, las cuentas en la nube y los datos quedan a tu nombre. Te entregamos la documentación para que cualquier desarrollador pueda continuar el proyecto.",
    },
    {
        q: "¿Qué pasa después de la entrega?",
        a: "Incluye un periodo de soporte para ajustes y dudas. Después puedes contratar soporte mensual para mantenimiento, mejoras y nuevas funcionalidades.",
    },
];

export const Route = createFileRoute("/desarrollo-de-aplicaciones")({
    head: () =>
        pageHead({
            title: `Desarrollo de aplicaciones web y móviles a la medida en Colombia | ${BRAND}`,
            description:
                "Desarrollo de aplicaciones web y móviles a la medida en Bogotá y Colombia: sistemas de gestión, inventarios, reservas, portales de clientes y MVPs para startups. Precio cerrado y entregas por fases.",
            path: PATH,
            schemas: [organizationSchema("es"), faqSchema(FAQ_APPS), breadcrumbSchema(CRUMBS)],
        }),
    component: AppsPage,
});

function AppsPage() {
    return (
        <MarketingLayout>
            <PageHero
                breadcrumbs={CRUMBS}
                eyebrow="Software a la medida"
                title="Desarrollo de aplicaciones web y móviles a la medida"
                lead="Convierto los procesos de tu negocio en una aplicación que ahorra tiempo y reduce errores: sistemas de gestión, portales para tus clientes y productos digitales listos para crecer, desarrollados en Colombia."
                waMessage="Hola, quiero desarrollar una aplicación para mi negocio."
                bullets={[
                    "Aplicaciones web, PWA y móviles",
                    "Primera versión en semanas",
                    "Código y datos a tu nombre",
                    "Infraestructura segura en AWS",
                ]}
            />

            <Section eyebrow="Qué desarrollo" title="Aplicaciones hechas para tu operación, no plantillas genéricas">
                <Prose>
                    <p>
                        Si tu equipo trabaja con hojas de cálculo, mensajes sueltos y procesos manuales, una{" "}
                        <strong>aplicación a la medida</strong> puede ordenar la operación y darte información en tiempo real.
                        Como desarrollador de software con más de 10 años de experiencia, diseño cada aplicación alrededor de
                        cómo trabaja tu negocio.
                    </p>
                    <h3>Tipos de aplicaciones</h3>
                    <ul>
                        <li><strong>Sistemas de gestión</strong>: inventarios, punto de venta, pedidos, compras y facturación.</li>
                        <li><strong>Agendamiento y reservas</strong> para consultorios, salones, talleres y servicios.</li>
                        <li><strong>Portales de clientes</strong> para consultar pedidos, pagos, documentos o estados de cuenta.</li>
                        <li><strong>Paneles administrativos y reportes</strong> con los indicadores de tu negocio.</li>
                        <li><strong>MVPs para startups</strong>: la primera versión de tu producto para validarlo con usuarios reales.</li>
                        <li><strong>Aplicaciones móviles</strong> web progresivas (PWA) o híbridas para Android y iPhone.</li>
                    </ul>
                    <h3>Cómo la construimos</h3>
                    <p>
                        Frontend con Angular o React, backend con Node.js, Java (Spring Boot), Laravel o Python, bases de datos
                        PostgreSQL, MySQL o DynamoDB, e infraestructura en Amazon Web Services con copias de seguridad,
                        HTTPS y costos ajustados a tu tamaño. Cuando aporta valor, sumo inteligencia artificial para
                        automatizar tareas o atender clientes.
                    </p>
                    <h3>Integraciones</h3>
                    <p>
                        Pasarelas de pago, facturación electrónica, WhatsApp, correo, ERPs y cualquier servicio con API, para
                        que tu aplicación se conecte con las herramientas que ya usas.
                    </p>
                    <p>
                        ¿Solo necesitas presencia en internet? Mira{" "}
                        <Link to={"/crear-pagina-web" as never}>cuánto cuesta crear una página web</Link>. ¿Buscas a alguien
                        para reforzar tu equipo? Conoce cómo trabajo como{" "}
                        <Link to={"/ingeniero-de-software-freelance" as never}>ingeniero de software freelance</Link>.
                    </p>
                </Prose>
            </Section>

            <Section
                eyebrow="Inversión"
                title="Software a la medida y automatización"
                intro="Cada aplicación se cotiza según su alcance, con precio cerrado y entregas por fases."
                className="border-t border-white/10"
            >
                <PricingGrid ids={["medida", "chatbot"]} />
            </Section>

            <Section eyebrow="Proceso" title="De la idea a tu aplicación publicada" className="border-t border-white/10">
                <ProcessList />
            </Section>

            <Section eyebrow="Preguntas frecuentes" title="Preguntas sobre el desarrollo de aplicaciones" className="border-t border-white/10">
                <FaqList faqs={FAQ_APPS} />
            </Section>

            <CtaBand
                title="¿Qué proceso quieres convertir en aplicación?"
                text="Cuéntanos cómo funciona hoy y qué te gustaría mejorar. Te proponemos una primera versión con precio y fechas."
                waMessage="Hola, quiero cotizar una aplicación a la medida."
            />
        </MarketingLayout>
    );
}
