// Contenido comercial del sitio (servicios, precios, preguntas frecuentes).
// Todo vive aquí para que las páginas de servicios y los datos estructurados
// (schema.org) usen exactamente la misma información. Para cambiar un precio,
// cámbialo aquí y se actualiza en todas las páginas.

export const SITE_URL = "https://brayanroa.com";

export const WHATSAPP_NUMBER = "573114740930";
export const EMAIL = "lbrayan.roa@gmail.com";

export function whatsappLink(message: string) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type Service = {
    id: string;
    name: string;
    /** Precio base en COP; null = se cotiza según alcance. */
    priceFrom: number | null;
    priceSuffix?: string;
    delivery: string;
    summary: string;
    includes: string[];
    idealFor: string;
    featured?: boolean;
    href?: string;
};

export const SERVICES: Service[] = [
    {
        id: "landing",
        name: "Landing page",
        priceFrom: 350000,
        delivery: "3 a 5 días",
        summary: "Una página de una sola sección pensada para vender: explica tu oferta y lleva al cliente directo a WhatsApp o a un formulario.",
        includes: [
            "Diseño a la medida, adaptado a celular",
            "Botón de WhatsApp y formulario de contacto",
            "SEO básico: títulos, descripción y Google Search Console",
            "Velocidad de carga optimizada",
            "Publicación en tu dominio",
        ],
        idealFor: "Campañas, lanzamientos y profesionales independientes",
        href: "/crear-pagina-web",
    },
    {
        id: "corporativa",
        name: "Página web corporativa",
        priceFrom: 900000,
        delivery: "1 a 2 semanas",
        summary: "El sitio completo de tu empresa: inicio, servicios, nosotros, blog y contacto, listo para aparecer en Google.",
        includes: [
            "Hasta 6 secciones o páginas",
            "Panel para editar textos e imágenes",
            "SEO local: Google Business Profile y datos estructurados",
            "Correo corporativo configurado",
            "Analítica (Google Analytics) y mapa de ubicación",
        ],
        idealFor: "Empresas, consultorios, restaurantes y firmas de servicios",
        featured: true,
        href: "/desarrollo-web-bogota",
    },
    {
        id: "tienda",
        name: "Tienda online",
        priceFrom: 1800000,
        delivery: "2 a 3 semanas",
        summary: "Vende 24/7 con catálogo, carrito y pagos en línea con PSE, tarjetas, Nequi o contra entrega.",
        includes: [
            "Catálogo con categorías, variantes e inventario",
            "Pasarela de pagos (Wompi, Mercado Pago o ePayco)",
            "Pedidos por WhatsApp y notificaciones por correo",
            "Cálculo de envíos y cupones de descuento",
            "Capacitación para administrar la tienda",
        ],
        idealFor: "Emprendimientos y comercios que quieren vender en línea",
    },
    {
        id: "chatbot",
        name: "Chatbot con IA para WhatsApp",
        priceFrom: 600000,
        delivery: "1 a 2 semanas",
        summary: "Un asistente que responde a tus clientes en WhatsApp las 24 horas con la información de tu negocio y te pasa los casos importantes.",
        includes: [
            "WhatsApp Business API oficial de Meta",
            "Entrenado con tus precios, horarios y preguntas frecuentes",
            "Agenda citas, toma pedidos o califica clientes",
            "Escala a una persona cuando hace falta",
            "Panel de conversaciones",
        ],
        idealFor: "Negocios que reciben muchas preguntas repetidas por WhatsApp",
        href: "/chatbot-whatsapp-ia",
    },
    {
        id: "medida",
        name: "Software y apps a la medida",
        priceFrom: null,
        delivery: "Según alcance",
        summary: "Plataformas, sistemas internos, apps móviles e integraciones diseñadas para tu operación, en la nube de AWS.",
        includes: [
            "Levantamiento de requerimientos y arquitectura",
            "Web apps con React, Angular, Node.js, Java o Laravel",
            "Integraciones con ERP, pagos, facturación electrónica y APIs",
            "Infraestructura escalable en AWS",
            "Soporte y evolución continua",
        ],
        idealFor: "Empresas que necesitan automatizar procesos o lanzar un producto digital",
    },
];

export function formatCOP(value: number) {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
}

export const PROCESS_STEPS = [
    { title: "Conversamos", text: "Una llamada o chat de 20 minutos para entender tu negocio, tus clientes y lo que necesitas lograr. Sin costo." },
    { title: "Propuesta clara", text: "Recibes alcance, precio cerrado y fecha de entrega por escrito. Sin letra pequeña." },
    { title: "Diseño y desarrollo", text: "Te muestro avances durante el proceso para que opines antes de que esté terminado." },
    { title: "Publicación", text: "Publicamos en tu dominio, configuramos Google y te enseño a administrarlo." },
    { title: "Acompañamiento", text: "Incluye soporte después de la entrega para ajustes y dudas." },
];

export const DIFFERENTIATORS = [
    { title: "Más de 10 años construyendo software", text: "He liderado equipos y proyectos para banca y empresas de distintos sectores. Tu página la construye un arquitecto de software, no una plantilla." },
    { title: "Pensado para vender", text: "Cada página tiene un objetivo: que te escriban, te llamen o te compren. Diseño, textos y botones van a eso." },
    { title: "Rápido y bien posicionado", text: "Sitios livianos, seguros (HTTPS) y con SEO técnico desde el día uno para que Google los encuentre." },
    { title: "Trato directo", text: "Hablas conmigo de principio a fin, sin intermediarios ni agencias. Respuestas rápidas por WhatsApp." },
];

export type Faq = { q: string; a: string };

export const FAQ_GENERAL: Faq[] = [
    {
        q: "¿Cuánto cuesta una página web en Colombia?",
        a: "Depende del tipo de sitio. Una landing page arranca desde $350.000, una página web corporativa desde $900.000 y una tienda online desde $1.800.000. Siempre te doy un precio cerrado antes de empezar.",
    },
    {
        q: "¿Cuánto tiempo tarda en estar lista?",
        a: "Una landing page está lista en 3 a 5 días hábiles; una página corporativa en 1 a 2 semanas y una tienda online en 2 a 3 semanas, siempre que tengamos los textos e imágenes.",
    },
    {
        q: "¿Cómo es la forma de pago?",
        a: "50% para iniciar y 50% al entregar. Puedes pagar por transferencia bancaria, Nequi o Daviplata.",
    },
    {
        q: "¿El dominio y el hosting están incluidos?",
        a: "Te ayudo a comprar y configurar tu dominio (.com o .co) y el hosting. Su costo anual se paga aparte y queda a tu nombre, para que siempre sea tuyo.",
    },
    {
        q: "¿Mi página va a aparecer en Google?",
        a: "Sí. Todas las páginas incluyen SEO técnico, sitemap y registro en Google Search Console. Posicionar en los primeros lugares para búsquedas competidas toma tiempo y contenido; te explico qué hacer para lograrlo.",
    },
    {
        q: "¿Puedo editar la página yo mismo?",
        a: "Sí. En los planes corporativo y tienda online te dejo un panel para cambiar textos, fotos y productos, y te enseño a usarlo.",
    },
    {
        q: "¿Trabajas solo en Bogotá?",
        a: "Estoy en Bogotá, pero trabajo de forma remota con clientes de toda Colombia y Latinoamérica. Si estás en Bogotá también podemos reunirnos en persona.",
    },
];
