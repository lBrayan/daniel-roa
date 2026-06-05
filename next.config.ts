import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" genera un bundle autocontenido en .next/standalone/
  // que se puede deployar directamente a Lambda sin node_modules completos.
  // Reduce el tamaño del paquete Lambda de ~200MB a ~30-40MB.
  output: "standalone",

  // Opcional: comprimir respuestas (CloudFront también lo hace, pero esto
  // reduce la factura de Lambda si el tráfico es alto)
  compress: true,

  // Headers de seguridad y SEO
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Cache largo para assets con hash (gestionado también en CloudFront)
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;