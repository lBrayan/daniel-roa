import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    Outlet,
    Link,
    createRootRouteWithContext,
    useRouter,
    useRouterState,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { UI, PATHS, localeFromPath } from "@/lib/site";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
    const pathname = useRouterState({ select: (st) => st.location.pathname });
    const locale = localeFromPath(pathname);
    return (
        <div className="site flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
            <div className="max-w-md text-center">
                <h1 className="text-8xl font-bold">404</h1>
                <p className="mt-4 text-lg text-soft">{UI[locale].notFound}</p>
                <div className="mt-8">
                    <Link
                        to={PATHS.home[locale] as never}
                        className="inline-flex min-h-11 items-center rounded-full bg-brand px-6 font-semibold text-ink"
                    >
                        {UI[locale].goHome}
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { name: "robots", content: "index, follow, max-image-preview:large" },
            { name: "theme-color", content: "#0b0b0c" },
            { name: "format-detection", content: "telephone=no" },
        ],
        links: [
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
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
    const pathname = useRouterState({ select: (st) => st.location.pathname });
    return (
        <html lang={localeFromPath(pathname) === "en" ? "en" : "es-CO"}>
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
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
        </QueryClientProvider>
    );
}
