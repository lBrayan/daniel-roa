# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Sitio del equipo (diseño + tecnología)

- Contenido editable sin tocar componentes: `src/content/site.json` (nombre del estudio, contacto),
  `src/content/team.json` (integrantes; `published: false` oculta a alguien) y
  `src/content/projects.json` (proyectos de diseño y desarrollo).
- Español en la raíz (`/`, `/proyectos`, `/equipo`, `/servicios`…) e inglés bajo `/en`
  (`/en/work`, `/en/team`, `/en/services`), con canonical, hreflang, Open Graph y JSON-LD.
- `npm run build` prerenderiza todas las rutas (incluidas las de cada proyecto e integrante)
  y genera `sitemap.xml` con las versiones en ambos idiomas.
