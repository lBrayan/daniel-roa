import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { WorkPage, WORK_COPY, type WorkFilter } from "@/pages/WorkPage";
import { breadcrumbSchema, organizationSchema, pageHead, projectListSchema } from "@/lib/seo";
import { BRAND, PATHS, projectPath } from "@/lib/site";

const L = "en" as const;

export const Route = createFileRoute("/en/work/")({
    validateSearch: (search: Record<string, unknown>): { d?: "design" | "development" } =>
        search["d"] === "design" || search["d"] === "development" ? { d: search["d"] } : {},
    head: () =>
        pageHead({
            title: `${WORK_COPY[L].title} | ${BRAND}`,
            description: WORK_COPY[L].description,
            path: PATHS.work[L],
            locale: L,
            alternates: { es: PATHS.work.es, en: PATHS.work.en },
            schemas: [
                organizationSchema(L),
                projectListSchema(L, (slug) => projectPath(slug, L)),
                breadcrumbSchema([
                    { name: "Home", path: PATHS.home[L] },
                    { name: "Work", path: PATHS.work[L] },
                ]),
            ],
        }),
    component: Page,
});

function Page() {
    const { d } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });
    const setFilter = (f: WorkFilter) =>
        navigate({ search: f ? { d: f } : {}, replace: true, resetScroll: false });
    return <WorkPage locale={L} filter={d} onFilter={setFilter} />;
}
