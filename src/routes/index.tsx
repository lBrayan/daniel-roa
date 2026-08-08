import { createFileRoute, Link } from "@tanstack/react-router";
import resume from "@/data/resume.json";
import { HeroSection } from "@/sections/HeroSection";
import { IdeaSection } from "@/sections/IdeaSection";
import { SystemSection } from "@/sections/SystemSection";
import { ProductSection } from "@/sections/ProductSection";
import { ProcessSection } from "@/sections/ProcessSection";
import { StackSection } from "@/sections/StackSection";
import { ProjectsSection } from "@/sections/ProjectsSection";
import { ContactSection } from "@/sections/ContactSection";

// 1. Importamos i18n global (para los meta tags) y el hook (para el componente)
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            // 2. Usamos i18n.t() para traducir el SEO directamente
            { title: i18n.t("meta.title", { defaultValue: "Daniel — Software Architect, Full Stack & AI Engineer" }) },
            {
                name: "description",
                content: i18n.t("meta.description", { defaultValue: "Portafolio cinematográfico: de la idea a la arquitectura, de la arquitectura al producto. Sistemas escalables potenciados por IA." }),
            },
            { property: "og:title", content: i18n.t("meta.title", { defaultValue: "Daniel — Software Architect, Full Stack & AI Engineer" }) },
            {
                property: "og:description",
                content: i18n.t("meta.ogDescription", { defaultValue: "Una experiencia guiada por scroll que muestra cómo una idea se convierte en arquitectura, producto e impacto." }),
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
        ],
    }),
    component: LandingPage,
});

/** Landing cinematográfica controlada íntegramente por el scroll. */
function LandingPage() {
    // 3. Extraemos t e i18n dentro del componente
    const { t, i18n: i18nInstance } = useTranslation();
    const { profile, projects } = resume;

    return (
        <div className="stage font-inter relative min-h-screen overflow-x-hidden bg-stage text-white antialiased">
            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 py-5 mix-blend-difference">
                <span className="text-[11px] tracking-[0.4em] text-white uppercase">Daniel</span>

                {/* 4. Agregamos el selector de idiomas en el centro del header */}
                <div className="flex gap-4 text-[11px] tracking-[0.2em] text-white/50 uppercase">
                    <button
                        onClick={() => i18nInstance.changeLanguage('es')}
                        className={`hover:text-white transition-colors ${i18nInstance.language === 'es' ? 'text-white font-bold' : ''}`}
                    >
                        ES
                    </button>
                    <button
                        onClick={() => i18nInstance.changeLanguage('en')}
                        className={`hover:text-white transition-colors ${i18nInstance.language === 'en' ? 'text-white font-bold' : ''}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => i18nInstance.changeLanguage('pt')}
                        className={`hover:text-white transition-colors ${i18nInstance.language === 'pt' ? 'text-white font-bold' : ''}`}
                    >
                        PT
                    </button>
                </div>

                <Link to="/cv" className="text-[11px] tracking-[0.3em] text-white uppercase hover:text-white/70 transition-colors">
                    {t("header.cv", { defaultValue: "CV" })}
                </Link>
            </header>

            <main>
                <HeroSection />
                <IdeaSection />
                <SystemSection />
                <ProductSection />
                <ProcessSection />
                <StackSection />
                {/* Nota: Los proyectos siguen viniendo de resume.json por ahora */}
                <ProjectsSection projects={projects} />
                <ContactSection contact={profile.contact} />
            </main>
        </div>
    );
}