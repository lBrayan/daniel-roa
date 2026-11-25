import { createFileRoute, Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/site";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { CtaBand, Differentiators, FaqList, PageHero, ProcessList, Prose, Section } from "@/components/marketing/Blocks";
import type { Faq } from "@/data/marketing";
import { organizationSchema, breadcrumbSchema, faqSchema, pageHead } from "@/lib/seo";

const PATH = "/ingeniero-de-software-freelance";
const CRUMBS = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/servicios" },
    { name: "Ingeniero de software freelance", path: PATH },
];

const FAQ_FREELANCE: Faq[] = [
    {
        q: "¿Cuánto cobra un ingeniero de software freelance en Colombia?",
        a: "Depende del alcance. Trabajamos por proyecto con precio cerrado, por horas o con una bolsa mensual de soporte. Después de una conversación corta te enviamos una propuesta por escrito con el valor, las entregas y las fechas, sin costo.",
    },
    {
        q: "¿Es mejor contratar un freelance, una agencia o un empleado?",
        a: "Un freelance senior te da la calidad técnica de una agencia sin sus costos fijos ni intermediarios, y sin la carga de contratar a alguien de tiempo completo. Es ideal para proyectos con alcance definido, para lanzar un MVP o para reforzar a tu equipo en una etapa puntual.",
    },
    {
        q: "¿Trabajan de forma remota?",
        a: "Sí. Trabajamos de forma remota con clientes de toda Colombia y Latinoamérica, con videollamadas y avances frecuentes. Si estás en Bogotá también podemos reunirnos en persona.",
    },
    {
        q: "¿Pueden continuar un proyecto que empezó otro desarrollador?",
        a: "Sí. Primero revisamos el código y la infraestructura, te entregamos un diagnóstico con riesgos y prioridades, y luego continuamos con las correcciones y nuevas funcionalidades.",
    },
    {
        q: "¿Firmas acuerdos de confidencialidad?",
        a: "Sí. Firmo acuerdos de confidencialidad (NDA) y el código, los accesos y la propiedad intelectual del proyecto quedan a tu nombre.",
    },
];

export const Route = createFileRoute("/ingeniero-de-software-freelance")({
    head: () =>
        pageHead({
            title: `Ingeniero de software freelance en Colombia | Desarrollador full stack | ${BRAND}`,
            description:
                "Ingeniero de software y desarrollador full stack freelance en Bogotá, Colombia. Desarrollo de sistemas a la medida, APIs, integraciones, migraciones y arquitectura en AWS. Más de 10 años de experiencia.",
            path: PATH,
            schemas: [organizationSchema("es"), faqSchema(FAQ_FREELANCE), breadcrumbSchema(CRUMBS)],
        }),
    component: FreelancePage,
});

function FreelancePage() {
    return (
        <MarketingLayout>
            <PageHero
                breadcrumbs={CRUMBS}
                eyebrow="Desarrollo de software freelance"
                title="Ingeniero de software freelance para tu proyecto en Colombia"
                lead="Un equipo liderado por un ingeniero de software y desarrollador full stack con más de 10 años de experiencia. Diseñamos, programamos y desplegamos software a la medida para empresas, startups y emprendedores, de forma remota o en Bogotá."
                waMessage="Hola, necesito un ingeniero de software para un proyecto."
                bullets={[
                    "Más de 10 años de experiencia",
                    "Frontend, backend y nube",
                    "Precio cerrado por proyecto",
                    "Diseño y desarrollo en un solo equipo",
                ]}
            />

            <Section eyebrow="Qué hacemos" title="Un desarrollador de software freelance que cubre todo el proyecto">
                <Prose>
                    <p>
                        Contratar un <strong>programador freelance</strong> no debería significar recibir solo código. Como
                        equipo liderado por un <strong>arquitecto de software</strong>, nos encargamos del proyecto completo: entendemos el
                        problema de tu negocio, proponemos la arquitectura, desarrollamos el frontend y el backend, lo publicamos en la
                        nube y te dejamos la documentación para que el sistema pueda crecer.
                    </p>
                    <h3>Proyectos en los que podemos ayudarte</h3>
                    <ul>
                        <li><strong>Sistemas a la medida</strong>: inventarios, puntos de venta, facturación, reservas, CRM y paneles administrativos.</li>
                        <li><strong>APIs e integraciones</strong> con pasarelas de pago, facturación electrónica, ERPs y servicios externos.</li>
                        <li><strong>Modernización y migraciones</strong>: actualizar sistemas antiguos en PHP o Java, pasar a la nube o separar un monolito en servicios.</li>
                        <li><strong>Arquitectura en AWS</strong>: infraestructura como código, serverless, bases de datos administradas, seguridad y costos bajo control.</li>
                        <li><strong>Inteligencia artificial</strong>: chatbots, asistentes con tus documentos (RAG) y automatización de procesos.</li>
                        <li><strong>Revisión técnica</strong> de código e infraestructura antes de un lanzamiento.</li>
                    </ul>
                    <h3>Tecnologías</h3>
                    <p>
                        Angular, React, Node.js, Java con Spring Boot, PHP con Laravel, Python, PostgreSQL, MySQL, DynamoDB,
                        Amazon Web Services (Lambda, ECS, S3, CloudFront, RDS, CDK) e integraciones con OpenAI.
                    </p>
                    <h3>Formas de trabajo</h3>
                    <ul>
                        <li><strong>Por proyecto</strong>, con alcance, precio cerrado y fecha de entrega por escrito.</li>
                        <li><strong>Por horas</strong>, para tareas puntuales, soporte o revisión técnica.</li>
                        <li><strong>Soporte mensual</strong>, para mantener y evolucionar tu sistema después del lanzamiento.</li>
                    </ul>
                    <p>
                        ¿Buscas algo más concreto? Mira{" "}
                        <Link to={"/desarrollo-de-aplicaciones" as never}>desarrollo de aplicaciones a la medida</Link>,{" "}
                        <Link to={"/desarrollo-web-bogota" as never}>desarrollo web en Bogotá</Link> o{" "}
                        <Link to={"/chatbot-whatsapp-ia" as never}>chatbots con IA para WhatsApp</Link>.
                    </p>
                </Prose>
            </Section>

            <Section eyebrow="Por qué yo" title="Calidad de software empresarial, trato de independiente" className="border-t border-white/10">
                <Differentiators />
            </Section>

            <Section eyebrow="Proceso" title="Cómo trabajamos" className="border-t border-white/10">
                <ProcessList />
            </Section>

            <Section eyebrow="Preguntas frecuentes" title="Preguntas sobre contratar un ingeniero de software freelance" className="border-t border-white/10">
                <FaqList faqs={FAQ_FREELANCE} />
            </Section>

            <CtaBand
                title="Cuéntanos tu proyecto"
                text="Explícanos qué necesitas construir o mejorar. Te respondemos el mismo día con preguntas y, después, con una propuesta por escrito."
                waMessage="Hola, quiero cotizar un proyecto de software."
            />
        </MarketingLayout>
    );
}
