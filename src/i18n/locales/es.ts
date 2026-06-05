// src/i18n/locales/es.ts
export const es = {
    // ── PortfolioClient / header ──────────────────────────────────────────────
    available: "Disponible para proyectos",
    years_exp: "años de exp.",
    years_coding: "años programando",
    location: "Bogotá, Colombia",
    download_cv: "Descargar CV",
    contact: "Contacto",

    // ── Selector de idioma ────────────────────────────────────────────────────
    language: "Idioma",
    lang_es: "Español",
    lang_en: "English",

    // ── Chat / ChatInput ──────────────────────────────────────────────────────
    chat_placeholder: "Pregúntame algo...",
    chat_send: "Enviar mensaje",
    chat_sending: "Enviando...",
    chat_error: "No entiendo esa pregunta. Prueba con los botones de arriba para explorar mis proyectos, experiencia, skills y más.",
    open_chat: "Pregúntame algo",
    close_chat: "Cerrar chat",

    // ── Quick actions ─────────────────────────────────────────────────────────
    qa_projects: "Proyectos",
    qa_experience: "Experiencia",
    qa_skills: "Skills",
    qa_about: "Sobre mí",
    qa_story: "Historia en la programación",
    qa_contact: "Contacto",
    qa_ai_cloud: "IA & Cloud",

    qa_projects_query: "¿Qué proyectos has realizado?",
    qa_experience_query: "Cuéntame tu experiencia laboral",
    qa_skills_query: "¿Cuáles son tus habilidades técnicas?",
    qa_about_query: "¿Quién eres y cuál es tu perfil?",
    qa_story_query: "¿Como es tu historia en la programción?",
    qa_contact_query: "¿Cómo puedo contactarte?",
    qa_ai_cloud_query: "¿Cuál es tu experiencia con IA y Cloud?",

    // ── ResponsePanel ─────────────────────────────────────────────────────────
    ai_disclaimer: "La IA puede cometer errores, si la respuesta no se visualiza bien o completa, intenta nuevamente.",
    welcome_title: "Hola, soy Daniel",
    welcome_subtitle: "Desarrollador Senior Fullstack & IA Engineer",
    welcome_cta: "Usa los botones de abajo para explorar mis proyectos, experiencia, habilidades o historia. También puedes escribir libremente.",
    stack_label: "Stack principal",

    // ── Experiencia / cards ───────────────────────────────────────────────────
    highlights: "Highlights",
    period: "Período",
    company: "Empresa",

    // ── Proyectos ─────────────────────────────────────────────────────────────
    project_type_empresa: "Empresa",
    project_type_freelance: "Freelance",
    private_repo: "Repositorio privado",
    private_nda: "Acceso restringido por NDA",
    view_project: "Ver proyecto",

    // ── Skills ────────────────────────────────────────────────────────────────
    skills_title: "Habilidades técnicas",

    // ── About ─────────────────────────────────────────────────────────────────
    years_label: "años exp.",
    location_label: "ubicación",
    currently_label: "actualmente",

    // ── Contact ───────────────────────────────────────────────────────────────
    contact_email: "Email",
    contact_github: "GitHub",
    contact_linkedin: "LinkedIn",

    // ── Accessibility panel ───────────────────────────────────────────────────
    a11y_label: "Opciones de accesibilidad",
    a11y_title: "Accesibilidad",
    a11y_font_size: "Tamaño de texto",
    a11y_contrast: "Contraste de color",
    a11y_contrast_default: "Normal",
    a11y_contrast_high: "Alto",
    a11y_contrast_inverted: "Invertido",
    a11y_reduce_motion: "Reducir movimiento",
    a11y_reduce_motion_desc: "Desactiva animaciones y transiciones",
    a11y_focus_highlight: "Resaltar foco",
    a11y_focus_highlight_desc: "Hace el indicador de foco más visible",
    a11y_dyslexia: "Fuente para dislexia",
    a11y_dyslexia_desc: "Cambia la tipografía para facilitar la lectura",
    a11y_line_spacing: "Mayor interlineado",
    a11y_line_spacing_desc: "Aumenta el espacio entre líneas de texto",
    a11y_reset: "Restaurar por defecto",
    a11y_saved: "Configuración guardada automáticamente",
    a11y_close: "Cerrar panel de accesibilidad",

    // ── WelcomeState — stats ──────────────────────────────────────────────────────
    stat_years_exp: "años de experiencia",
    stat_years_coding: "años programando",
    stat_companies: "empresas",
    stat_freelance: "proyectos freelance",

    // ── WelcomeState — highlights ─────────────────────────────────────────────────
    hl_ia_title: "IA & Automatización",
    hl_ia_desc: "Reduje un equipo de 8 personas a 2 con una herramienta propia de deploys con agente IA.",
    hl_aws_title: "AWS Serverless",
    hl_aws_desc: "Lambda, S3, DynamoDB, CloudFormation, Amplify — arquitecturas cloud en producción.",
    hl_fintech_title: "Banca & Fintech",
    hl_fintech_desc: "Lideré Mis Finanzas en Casa para Davivienda y plataformas para IBM y Bancolombia.",
    hl_fullstack_title: "Fullstack desde el día uno",
    hl_fullstack_desc: "React, Next.js, Angular, Node.js, C# Web API 2, PHP, Python Django — sin depender de un solo stack.",

    // ── WelcomeState — CTA ────────────────────────────────────────────────────────
    welcome_cta_hint: "Usa los botones de abajo para explorar mis proyectos, experiencia, habilidades o historia. También puedes escribir libremente.",

} as const;

export type TranslationKey = keyof typeof es;