// Genera HTML estático a partir del worker SSR ya compilado por Nitro.
//
// Por qué existe este script: tanto `nitro.preset: "static"` como
// `tanstackStart.prerender.enabled` (los dos mecanismos "oficiales" para
// generar HTML en build time) están rotos en esta combinación de versiones
// (nitro 3.0 beta + @tanstack/react-start 1.168.32 + vite 8). En vez de
// depender de esos, este script llama directamente a `.output/server/index.mjs`
// (el mismo Worker que Nitro ya compila y que sabemos que renderiza bien)
// en el propio proceso de Node, y guarda el HTML resultante como archivo
// estático dentro de `.output/public` — que es justo lo que necesita el
// despliegue a S3 + CloudFront.
//
// Las rutas fijas van aquí; las de proyectos y equipo se generan solas a partir
// de src/content/*.json. El mismo listado produce el sitemap.xml (con hreflang).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const readJson = async (p) => JSON.parse(await readFile(join(process.cwd(), p), "utf8"));
const site = await readJson("src/content/site.json");
const projects = await readJson("src/content/projects.json");
const team = (await readJson("src/content/team.json")).filter((m) => m.published);

/** Cada entrada: rutas equivalentes por idioma (es / en). */
const PAGES = [
  { es: "/", en: "/en", priority: "1.0" },
  { es: "/proyectos", en: "/en/work", priority: "0.9" },
  { es: "/equipo", en: "/en/team", priority: "0.7" },
  { es: "/servicios", en: "/en/services", priority: "0.9" },
  { es: "/desarrollo-web-bogota", priority: "0.8" },
  { es: "/crear-pagina-web", priority: "0.8" },
  { es: "/chatbot-whatsapp-ia", priority: "0.8" },
  { es: "/ingeniero-de-software-freelance", priority: "0.8" },
  { es: "/desarrollo-de-aplicaciones", priority: "0.8" },
  ...projects.map((p) => ({ es: `/proyectos/${p.slug}`, en: `/en/work/${p.slug}`, priority: "0.7" })),
  ...team.map((m) => ({ es: `/equipo/${m.slug}`, en: `/en/team/${m.slug}`, priority: "0.6" })),
];
const ROUTES = PAGES.flatMap((p) => [p.es, p.en].filter(Boolean));

function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = PAGES.flatMap((page) => {
    const variants = [page.es, page.en].filter(Boolean);
    return variants.map((path) => {
      const alts =
        variants.length > 1
          ? [
              `    <xhtml:link rel="alternate" hreflang="es" href="${site.url}${page.es}"/>`,
              `    <xhtml:link rel="alternate" hreflang="en" href="${site.url}${page.en}"/>`,
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${site.url}${page.es}"/>`,
            ].join("\n") + "\n"
          : "";
      return `  <url>\n    <loc>${site.url}${path}</loc>\n${alts}    <lastmod>${today}</lastmod>\n    <priority>${page.priority}</priority>\n  </url>`;
    });
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

const SERVER_ENTRY = join(process.cwd(), ".output/server/index.mjs");
const PUBLIC_DIR = ".output/public";

async function main() {
  const { default: worker } = await import(pathToFileURL(SERVER_ENTRY));
  const fakeCtx = { waitUntil: () => {}, passThroughOnException: () => {} };

  for (const route of ROUTES) {
    const request = new Request(`http://localhost${route}`);
    const response = await worker.fetch(request, {}, fakeCtx);

    if (!response.ok) {
      throw new Error(
        `No se pudo prerenderizar ${route}: HTTP ${response.status} ${response.statusText}`,
      );
    }

    const html = await response.text();
    const outPath =
      route === "/"
        ? join(PUBLIC_DIR, "index.html")
        : join(PUBLIC_DIR, route, "index.html");

    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    console.log(`✓ prerendered ${route} -> ${outPath} (${html.length} bytes)`);
  }

  await writeFile(join(PUBLIC_DIR, "sitemap.xml"), sitemapXml(), "utf8");
  console.log(`✓ sitemap.xml con ${ROUTES.length} URLs`);
}

main().catch((error) => {
  console.error("✗ Prerender falló:", error);
  process.exit(1);
});
