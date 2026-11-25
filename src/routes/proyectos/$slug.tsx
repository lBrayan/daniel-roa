import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProjectPage } from "@/pages/ProjectPage";
import { breadcrumbSchema, pageHead, projectSchema } from "@/lib/seo";
import { BRAND, PATHS, UI, getProject, projectPath } from "@/lib/site";

const L = "es" as const;

export const Route = createFileRoute("/proyectos/$slug")({
    loader: ({ params }) => {
        const project = getProject(params.slug);
        if (!project) throw notFound();
        return project;
    },
    head: ({ loaderData: p }) => {
        if (!p) return {};
        const path = projectPath(p.slug, L);
        const kind = UI[L].disciplines[p.discipline];
        return pageHead({
            title: `${p.title} — ${kind} | ${BRAND}`,
            description: p.summary[L],
            path,
            locale: L,
            type: "article",
            ...(p.cover ? { image: p.cover.src } : {}),
            alternates: { es: projectPath(p.slug, "es"), en: projectPath(p.slug, "en") },
            schemas: [
                projectSchema(p, L, path),
                breadcrumbSchema([
                    { name: "Inicio", path: PATHS.home[L] },
                    { name: "Proyectos", path: PATHS.work[L] },
                    { name: p.title, path },
                ]),
            ],
        });
    },
    component: Page,
});

function Page() {
    const project = Route.useLoaderData();
    return <ProjectPage project={project} locale={L} />;
}
