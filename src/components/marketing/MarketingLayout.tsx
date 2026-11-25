import type { ReactNode } from "react";
import { whatsappLink } from "@/data/marketing";
import { SiteLayout } from "@/components/site/SiteLayout";

const DEFAULT_WA_MESSAGE = "Hola, vi su página y quiero cotizar un proyecto.";

export { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";

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

export function MarketingLayout({ children, alternate }: { children: ReactNode; alternate?: string }) {
    // Las páginas de servicios (en español) usan la misma cabecera y pie del sitio del equipo.
    return (
        <SiteLayout locale="es" alternate={alternate ?? "/en/services"}>
            <div className="stage font-inter text-white">{children}</div>
        </SiteLayout>
    );
}
