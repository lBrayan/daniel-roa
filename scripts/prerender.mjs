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
// Si en el futuro agregas rutas nuevas al sitio, agrégalas también aquí.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const ROUTES = ["/", "/cv"];
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
}

main().catch((error) => {
  console.error("✗ Prerender falló:", error);
  process.exit(1);
});
