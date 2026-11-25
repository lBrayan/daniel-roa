import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/lib/site";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { CtaBand, FaqList, PageHero, PricingGrid, Prose, Section } from "@/components/marketing/Blocks";
import type { Faq } from "@/data/marketing";
import { organizationSchema, breadcrumbSchema, faqSchema, pageHead } from "@/lib/seo";

const PATH = "/chatbot-whatsapp-ia";
const CRUMBS = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/servicios" },
    { name: "Chatbot con IA para WhatsApp", path: PATH },
];

const FAQ_BOT: Faq[] = [
    {
        q: "¿Cuánto cuesta un chatbot con IA para WhatsApp en Colombia?",
        a: "La implementación cuesta desde $600.000 COP. Además hay un costo mensual de uso: las conversaciones de WhatsApp Business API que cobra Meta y el consumo del modelo de IA. Para un negocio pequeño suele ser bajo, y te lo estimo antes de empezar.",
    },
    {
        q: "¿Necesito cambiar mi número de WhatsApp?",
        a: "Se recomienda un número dedicado para la WhatsApp Business API. Puede ser una línea nueva o tu número actual, siempre que lo migremos a la API (deja de funcionar en la app normal de WhatsApp).",
    },
    {
        q: "¿El bot puede equivocarse o inventar respuestas?",
        a: "El bot responde solo con la información de tu negocio que cargamos (precios, horarios, servicios, políticas). Si no sabe algo o el cliente lo pide, pasa la conversación a una persona de tu equipo.",
    },
    {
        q: "¿Qué puede hacer el chatbot?",
        a: "Responder preguntas frecuentes, enviar catálogos y precios, tomar pedidos, agendar citas, calificar clientes potenciales y enviar recordatorios, 24 horas al día.",
    },
    {
        q: "¿Cuánto tarda la implementación?",
        a: "Entre una y dos semanas, incluyendo la verificación de tu cuenta de WhatsApp Business ante Meta, la carga de información y las pruebas con conversaciones reales.",
    },
];

export const Route = createFileRoute("/chatbot-whatsapp-ia")({
    head: () =>
        pageHead({
            title: `Chatbot con IA para WhatsApp en Colombia | Atiende 24/7 | ${BRAND}`,
            description:
                "Chatbot con inteligencia artificial para WhatsApp Business: responde a tus clientes 24/7, agenda citas, toma pedidos y pasa a un asesor cuando hace falta. Implementación desde $600.000 COP.",
            path: PATH,
            schemas: [organizationSchema("es"), faqSchema(FAQ_BOT), breadcrumbSchema(CRUMBS)],
        }),
    component: ChatbotPage,
});

const USE_CASES = [
    ["Consultorios y clínicas", "Agenda citas, confirma y envía recordatorios sin que tu recepcionista conteste lo mismo cien veces."],
    ["Restaurantes y domicilios", "Envía el menú, toma el pedido y la dirección y lo pasa a cocina."],
    ["Tiendas y emprendimientos", "Responde precios, tallas y disponibilidad, y envía el link de pago."],
    ["Inmobiliarias", "Filtra interesados por zona y presupuesto antes de pasarlos a un asesor."],
    ["Academias y colegios", "Informa horarios, costos y procesos de inscripción a cualquier hora."],
    ["Servicios profesionales", "Califica al cliente y agenda la primera llamada contigo."],
];

function ChatbotPage() {
    return (
        <MarketingLayout>
            <PageHero
                breadcrumbs={CRUMBS}
                eyebrow="Inteligencia artificial para tu negocio"
                title="Chatbot con IA para WhatsApp que atiende a tus clientes 24/7"
                lead="Tus clientes escriben por WhatsApp a cualquier hora. Un asistente con inteligencia artificial les responde al instante con la información de tu negocio, agenda citas, toma pedidos y te pasa los casos que necesitan a una persona."
                waMessage="Hola, me interesa un chatbot con IA para WhatsApp."
                bullets={[
                    "WhatsApp Business API oficial",
                    "Responde con la información de tu negocio",
                    "Pasa a un asesor humano cuando hace falta",
                    "Implementación desde $600.000 COP",
                ]}
            />

            <Section eyebrow="Cómo funciona" title="Así trabaja tu asistente virtual">
                <Prose>
                    <p>
                        El chatbot se conecta a la <strong>API oficial de WhatsApp Business</strong> de Meta. Cuando un
                        cliente escribe, el mensaje llega a un servidor seguro en la nube, el asistente busca la respuesta
                        en la <strong>base de conocimiento de tu negocio</strong> (precios, horarios, servicios,
                        políticas) y responde en segundos, con un tono natural y en español.
                    </p>
                    <p>
                        No es un menú de “marque 1, marque 2”: entiende preguntas escritas como las escribe la gente, con
                        errores de ortografía incluidos. Y si el cliente pide hablar con alguien, o la pregunta no está en
                        la información cargada, <strong>la conversación pasa a una persona de tu equipo</strong>.
                    </p>
                    <h3>Lo que puede hacer por tu negocio</h3>
                    <ul>
                        <li>Responder preguntas frecuentes al instante, de día y de noche.</li>
                        <li>Enviar catálogos, precios y links de pago.</li>
                        <li>Agendar, confirmar y recordar citas.</li>
                        <li>Tomar pedidos y datos de envío.</li>
                        <li>Calificar clientes potenciales y avisarte cuando hay uno listo para comprar.</li>
                    </ul>
                </Prose>
            </Section>

            <Section eyebrow="Casos de uso" title="Negocios que ya pueden automatizar su WhatsApp" className="border-t border-white/10">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {USE_CASES.map(([title, text]) => (
                        <div key={title} className="rounded-2xl border border-white/10 p-5">
                            <h3 className="font-semibold">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-mist">{text}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                id="precios"
                eyebrow="Precio"
                title="Implementa tu chatbot"
                intro="Pago único de implementación. El costo mensual de uso (Meta + IA) depende del volumen de conversaciones y te lo estimo antes de empezar."
                className="border-t border-white/10"
            >
                <PricingGrid ids={["chatbot", "landing", "medida"]} />
            </Section>

            <Section eyebrow="Preguntas frecuentes" title="Preguntas sobre chatbots para WhatsApp" className="border-t border-white/10">
                <FaqList faqs={FAQ_BOT} />
            </Section>

            <CtaBand
                title="Deja de responder lo mismo todo el día"
                text="Cuéntanos qué preguntas recibes más por WhatsApp y te mostramos cómo respondería tu asistente."
                waMessage="Hola, quiero un chatbot con IA para el WhatsApp de mi negocio."
            />
        </MarketingLayout>
    );
}
