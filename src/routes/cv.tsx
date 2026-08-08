import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowLeft,
    Download, // <-- Cambiamos Printer por Download
    Brain,
    Cloud,
    Code2,
    Settings,
    Rocket,
    Layers,
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Github,
    Globe,
    Briefcase,
    Award,
    GraduationCap,
    Languages,
    Trophy,
    Users,
    Lightbulb,
    Heart,
    User,
    Target,
} from "lucide-react";
import resume from "@/data/resume.json";
// Importamos el PDF directamente desde la ruta de tu repositorio
import hvelempleoPdf from "@/downloads/HVElempleo.pdf";

export const Route = createFileRoute("/cv")({
    head: () => ({
        meta: [
            { title: "Brayan Daniel Roa — Technical Lead & Software Architect" },
            {
                name: "description",
                content:
                    "Hoja de vida de Brayan Daniel Roa Rodríguez: líder técnico y arquitecto de software con más de 10 años en cloud, DevOps e Inteligencia Artificial.",
            },
            { property: "og:title", content: "Brayan Daniel Roa — Technical Lead & Software Architect" },
            {
                property: "og:description",
                content:
                    "Arquitectura de software, cloud, DevOps e IA aplicada al negocio. Experiencia, proyectos y competencias.",
            },
            { property: "og:type", content: "profile" },
            { name: "twitter:card", content: "summary_large_image" },
        ],
    }),
    component: ResumePage,
});

const iconMap: Record<string, typeof Code2> = {
    code: Code2,
    cloud: Cloud,
    settings: Settings,
    brain: Brain,
    rocket: Rocket,
    layers: Layers,
    trophy: Trophy,
    users: Users,
    lightbulb: Lightbulb,
    heart: Heart,
};

type ToneKey = "blue" | "green" | "purple" | "amber";

const tone: Record<ToneKey, { dot: string; chip: string; text: string; panel: string }> = {
    blue: {
        dot: "bg-blue",
        chip: "bg-blue-soft text-foreground",
        text: "text-blue",
        panel: "bg-blue",
    },
    green: {
        dot: "bg-green",
        chip: "bg-green-soft text-foreground",
        text: "text-green",
        panel: "bg-green",
    },
    purple: {
        dot: "bg-purple",
        chip: "bg-purple-soft text-foreground",
        text: "text-purple",
        panel: "bg-purple",
    },
    amber: {
        dot: "bg-amber",
        chip: "bg-muted text-foreground",
        text: "text-amber",
        panel: "bg-amber",
    },
};

function toneOf(key: string) {
    return tone[(key as ToneKey) in tone ? (key as ToneKey) : "blue"];
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Code2; children: string }) {
    return (
        <div className="mb-5 flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-blue text-primary-foreground">
                <Icon className="size-4" />
            </span>
            <h2 className="text-lg font-bold tracking-wide uppercase">{children}</h2>
            <span className="h-px flex-1 bg-border" />
        </div>
    );
}

function ResumePage() {
    const { profile, timeline, skillLayers, experience, projects, certifications, education, languages, values } =
        resume;

    return (
        <main className="mx-auto max-w-6xl bg-card shadow-sm">
            {/* Barra superior con botón de descarga directa */}
            <div className="flex items-center justify-between border-b border-border px-8 py-3 print:hidden">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-blue uppercase transition hover:opacity-70"
                >
                    <ArrowLeft className="size-4" /> Volver al inicio
                </Link>

                {/* Enlace de descarga directa usando el archivo importado */}
                <a
                    href={hvelempleoPdf}
                    download="CV Brayan Roa.pdf"
                    className="inline-flex items-center gap-2 rounded-md bg-blue px-4 py-2 text-xs font-bold tracking-widest text-primary-foreground uppercase transition hover:opacity-90"
                >
                    <Download className="size-4" />
                    Descargar PDF
                </a>
            </div>

            {/* Header */}
            <header className="bg-gradient-navy px-8 py-10 text-navy-foreground">
                <div className="flex flex-col gap-8 md:flex-row md:items-start">
                    <div className="flex size-32 shrink-0 items-center justify-center rounded-full border-4 border-navy-foreground/40 bg-navy-foreground/10 text-4xl font-bold">
                        {profile.initials}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl leading-none font-bold tracking-tight uppercase">
                            {profile.firstName}
                            <span className="mt-1 block text-3xl font-light tracking-wide opacity-90">
                                {profile.lastName}
                            </span>
                        </h1>
                        <p className="mt-3 text-sm font-semibold tracking-wide text-blue-soft uppercase">
                            {profile.headline}
                        </p>
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed opacity-85">{profile.summary}</p>
                    </div>
                    <ul className="space-y-2.5 text-sm md:w-72">
                        {[
                            { icon: Mail, value: profile.contact.email },
                            { icon: Phone, value: profile.contact.phone },
                            { icon: MapPin, value: profile.contact.location },
                            { icon: Linkedin, value: profile.contact.linkedin },
                            { icon: Github, value: profile.contact.github },
                        ].map(({ icon: Icon, value }) => (
                            <li key={value} className="flex items-center gap-3">
                                <Icon className="size-4 shrink-0 opacity-80" />
                                <span className="opacity-90">{value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>

            {/* Timeline */}
            <section className="px-8 py-10">
                <SectionTitle icon={User}>Resumen Profesional</SectionTitle>
                <div className="relative">
                    <div className="absolute top-[4.25rem] right-0 left-0 hidden h-0.5 bg-navy md:block" />
                    <div className="grid gap-8 md:grid-cols-5">
                        {timeline.map((item) => {
                            const Icon = iconMap[item.icon] ?? Code2;
                            const t = toneOf(item.color);
                            return (
                                <div key={item.period} className="relative text-center">
                                    <p className="text-sm font-bold">{item.period}</p>
                                    <div className="mt-3 flex justify-center">
                                        <span className={`size-4 rounded-full ring-4 ring-card ${t.dot}`} />
                                    </div>
                                    <div className="mt-3 flex justify-center">
                                        <span
                                            className={`flex size-12 items-center justify-center rounded-full text-primary-foreground ${t.panel}`}
                                        >
                                            <Icon className="size-6" />
                                        </span>
                                    </div>
                                    <h3 className="mt-3 text-sm font-bold">{item.title}</h3>
                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Skill layers */}
            <section className="px-8 pb-10">
                <SectionTitle icon={Layers}>Competencias por Capas</SectionTitle>
                <div className="space-y-4">
                    {skillLayers.map((layer) => {
                        const Icon = iconMap[layer.icon] ?? Layers;
                        const t = toneOf(layer.color);
                        return (
                            <div key={layer.name} className="grid gap-3 md:grid-cols-[13rem_1fr]">
                                <div
                                    className={`flex items-center gap-3 rounded-lg px-5 py-6 text-primary-foreground ${t.panel}`}
                                >
                                    <Icon className="size-7 shrink-0" />
                                    <span className="text-sm font-bold tracking-wide uppercase">{layer.name}</span>
                                </div>
                                <div className="flex flex-wrap content-center gap-2 rounded-lg bg-muted/60 p-4">
                                    {layer.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className={`rounded-md px-3 py-1.5 text-xs font-medium shadow-sm ${t.chip}`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Experience + sidebar */}
            <section className="grid gap-10 px-8 pb-10 lg:grid-cols-[1.8fr_1fr]">
                <div>
                    <SectionTitle icon={Briefcase}>Experiencia Destacada</SectionTitle>
                    <div className="space-y-8 border-l border-border pl-6">
                        {experience.map((job) => {
                            const t = toneOf(job.color);
                            return (
                                <article key={job.role + job.company} className="relative">
                                    <span
                                        className={`absolute top-1.5 -left-[1.9rem] size-3.5 rounded-full ring-4 ring-card ${t.dot}`}
                                    />
                                    <p className="text-xs font-bold text-muted-foreground uppercase">{job.period}</p>
                                    <h3 className="mt-1 text-lg font-bold">{job.role}</h3>
                                    <p className={`text-sm font-bold ${t.text}`}>{job.company}</p>
                                    <ul className="mt-3 space-y-1.5">
                                        {job.highlights.map((h) => (
                                            <li key={h} className="flex gap-2 text-sm leading-relaxed">
                                                <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-3 text-xs">
                                        <span className="font-bold">Tecnologías: </span>
                                        <span className="text-muted-foreground">{job.technologies.join(" | ")}</span>
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>

                <aside className="space-y-8">
                    <div className="rounded-lg bg-muted/60 p-5">
                        <SectionTitle icon={Rocket}>Proyectos Destacados</SectionTitle>
                        <div className="space-y-4">
                            {projects.map((p) => (
                                <div key={p.name} className="flex gap-3">
                                    <Target className="mt-0.5 size-5 shrink-0 text-blue" />
                                    <div>
                                        <h3 className="text-sm font-bold">{p.name}</h3>
                                        <p className="text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {certifications.length > 0 && (
                        <div className="rounded-lg bg-muted/60 p-5">
                            <SectionTitle icon={Award}>Certificaciones</SectionTitle>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                {certifications.map((c) => (
                                    <li key={c}>{c}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="rounded-lg bg-muted/60 p-5">
                        <SectionTitle icon={GraduationCap}>Educación</SectionTitle>
                        {education.map((e) => (
                            <div key={e.title} className="text-sm">
                                <p className="font-bold">{e.title}</p>
                                <p className="text-muted-foreground">{e.institution}</p>
                                <p className="text-muted-foreground">{e.detail}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg bg-muted/60 p-5">
                        <SectionTitle icon={Languages}>Idiomas</SectionTitle>
                        <div className="space-y-3">
                            {languages.map((l) => (
                                <div key={l.name} className="flex items-center gap-3 text-xs">
                                    <span className="w-16 font-semibold">{l.name}</span>
                                    <span className="h-2 flex-1 rounded-full bg-border">
                                        <span
                                            className="block h-2 rounded-full bg-blue"
                                            style={{ width: `${l.level}%` }}
                                        />
                                    </span>
                                    <span className="w-28 text-right text-muted-foreground">{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </section>

            <footer className="bg-gradient-navy px-8 py-6 text-navy-foreground">
                <ul className="flex flex-wrap items-center justify-around gap-6">
                    {values.map((v) => {
                        const Icon = iconMap[v.icon] ?? Trophy;
                        return (
                            <li key={v.label} className="flex items-center gap-2 text-sm">
                                <Icon className="size-5 opacity-80" />
                                {v.label}
                            </li>
                        );
                    })}
                </ul>
            </footer>
        </main>
    );
}