import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { EMAIL, WHATSAPP_NUMBER, whatsappLink } from "@/data/marketing";

const NAV = [
    { to: "/servicios", label: "Servicios y precios" },
    { to: "/crear-pagina-web", label: "Páginas web" },
    { to: "/chatbot-whatsapp-ia", label: "Chatbots IA" },
    { to: "/cv", label: "CV" },
] as const;

const DEFAULT_WA_MESSAGE = "Hola Brayan, vi tu página y quiero cotizar un proyecto.";

/** Ícono de WhatsApp (SVG propio, sin dependencias). */
export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.51-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
        </svg>
    );
}

export function WhatsAppButton({
    message = DEFAULT_WA_MESSAGE,
    children = "Cotizar por WhatsApp",
    variant = "primary",
    className = "",
}: {
    message?: string;
    children?: ReactNode;
    variant?: "primary" | "ghost";
    className?: string;
}) {
    const styles =
        variant === "primary"
            ? "bg-[#25D366] text-black hover:bg-[#1ebe5b]"
            : "border border-white/20 text-white hover:border-white/50";
    return (
        <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener"
            className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${styles} ${className}`}
        >
            <WhatsAppIcon />
            {children}
        </a>
    );
}

export function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="stage font-inter min-h-screen bg-stage text-white antialiased">
            <header className="sticky top-0 z-40 border-b border-white/10 bg-stage/85 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
                    <Link to="/" className="text-sm font-semibold tracking-[0.25em] uppercase">
                        Brayan Roa
                    </Link>
                    <nav aria-label="Principal" className="hidden items-center gap-6 text-sm text-mist md:flex">
                        {NAV.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to as never}
                                className="transition-colors hover:text-white"
                                activeProps={{ className: "text-white" }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <WhatsAppButton className="!px-4 !py-2 text-xs">Cotizar</WhatsAppButton>
                </div>
                <nav
                    aria-label="Principal móvil"
                    className="flex gap-5 overflow-x-auto px-5 pb-3 text-xs whitespace-nowrap text-mist md:hidden"
                >
                    {NAV.map((item) => (
                        <Link key={item.to} to={item.to as never} activeProps={{ className: "text-white" }}>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </header>

            <main>{children}</main>

            <footer className="border-t border-white/10">
                <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 text-sm text-mist sm:grid-cols-3">
                    <div>
                        <p className="font-semibold text-white">Brayan Roa</p>
                        <p className="mt-3 leading-relaxed">
                            Arquitecto de software y desarrollador web en Bogotá. Páginas web, tiendas online, chatbots con IA y
                            software a la medida para empresas de toda Colombia.
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Servicios</p>
                        <ul className="mt-3 space-y-2">
                            <li><Link to={"/servicios" as never} className="hover:text-white">Servicios y precios</Link></li>
                            <li><Link to={"/desarrollo-web-bogota" as never} className="hover:text-white">Desarrollador web en Bogotá</Link></li>
                            <li><Link to={"/crear-pagina-web" as never} className="hover:text-white">Crear página web en Colombia</Link></li>
                            <li><Link to={"/chatbot-whatsapp-ia" as never} className="hover:text-white">Chatbot con IA para WhatsApp</Link></li>
                            <li><Link to="/cv" className="hover:text-white">Hoja de vida</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Contacto</p>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <a href={whatsappLink(DEFAULT_WA_MESSAGE)} target="_blank" rel="noopener" className="hover:text-white">
                                    WhatsApp: +57 {WHATSAPP_NUMBER.slice(2, 5)} {WHATSAPP_NUMBER.slice(5, 8)} {WHATSAPP_NUMBER.slice(8)}
                                </a>
                            </li>
                            <li><a href={`mailto:${EMAIL}`} className="hover:text-white">{EMAIL}</a></li>
                            <li>Bogotá, Colombia · Atención remota en todo el país</li>
                        </ul>
                    </div>
                </div>
                <p className="pb-8 text-center text-xs text-white/30">© {new Date().getFullYear()} Brayan Roa</p>
            </footer>

            <a
                href={whatsappLink(DEFAULT_WA_MESSAGE)}
                target="_blank"
                rel="noopener"
                aria-label="Escribir por WhatsApp"
                className="fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-black shadow-lg shadow-black/40 transition-transform hover:scale-105"
            >
                <WhatsAppIcon className="size-7" />
            </a>
        </div>
    );
}
