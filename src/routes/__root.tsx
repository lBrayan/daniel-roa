import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '../i18n';
import {
    Outlet,
    Link,
    createRootRouteWithContext,
    useRouter,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { CursorParticles } from "@/components/fx/CursorParticles";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-7xl font-bold text-foreground">404</h1>
                <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
    console.error(error);
    const router = useRouter();
    useEffect(() => {
        reportLovableError(error, { boundary: "tanstack_root_error_component" });
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    This page didn't load
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Something went wrong on our end. You can try refreshing or head back home.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => {
                            router.invalidate();
                            reset();
                        }}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Try again
                    </button>
                    <a
                        href="/"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                        Go home
                    </a>
                </div>
            </div>
        </div>
    );
}

export const SITE_URL = "https://brayanroa.com";

const SITE_DESCRIPTION =
    "Brayan Roa, arquitecto de software y desarrollador Full Stack en Colombia. Desarrollo páginas web, apps, sistemas a medida, chatbots con IA y soluciones en AWS para empresas y emprendedores.";

const PERSON_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Brayan Daniel Roa Rodríguez",
    alternateName: "Brayan Roa",
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    jobTitle: "Arquitecto de Software y Desarrollador Full Stack",
    description: SITE_DESCRIPTION,
    address: { "@type": "PostalAddress", addressCountry: "CO" },
    knowsAbout: [
        "Arquitectura de software",
        "Desarrollo web",
        "React",
        "Angular",
        "Node.js",
        "Java Spring Boot",
        "PHP Laravel",
        "AWS",
        "Inteligencia Artificial",
        "Chatbots",
    ],
    sameAs: ["https://www.linkedin.com/in/brayandroa", "https://github.com/lBrayan"],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "Brayan Roa — Arquitecto de Software y Desarrollador Full Stack" },
            { name: "description", content: SITE_DESCRIPTION },
            { name: "author", content: "Brayan Daniel Roa Rodríguez" },
            { name: "robots", content: "index, follow" },
            { name: "theme-color", content: "#08080a" },
            { property: "og:site_name", content: "Brayan Roa" },
            { property: "og:locale", content: "es_CO" },
            { property: "og:title", content: "Brayan Roa — Arquitecto de Software y Desarrollador Full Stack" },
            { property: "og:description", content: SITE_DESCRIPTION },
            { property: "og:type", content: "website" },
            { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
        ],
        // Datos estructurados (schema.org) para que Google entienda quién es la persona
        // y lo relacione con sus perfiles. Se renderizan en el HTML prerenderizado.
        scripts: [
            {
                type: "application/ld+json",
                children: JSON.stringify(PERSON_SCHEMA),
            },
        ],
        links: [
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Barlow:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
            },
            {
                rel: "stylesheet",
                href: appCss,
            },
            { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
            { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
    return (
        <html lang="es">
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <Scripts />
            </body>
        </html>
    );
}

function RootComponent() {
    const { queryClient } = Route.useRouteContext();

    return (
        <QueryClientProvider client={queryClient}>
            <CursorParticles />
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
        </QueryClientProvider>
    );
}
