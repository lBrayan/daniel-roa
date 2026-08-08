import { useEffect, useRef } from "react";

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
    alpha: number;
};

const PARTICLE_COUNT = 28;
const CONNECTION_DISTANCE = 95;
const CURSOR_RADIUS = 150;
const MAX_DPR = 1.5;

export function CursorParticles() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (
            typeof window === "undefined" ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) return;

        const pointer = {
            x: -9999,
            y: -9999,
            targetX: -9999,
            targetY: -9999,
            active: false,
        };

        const particles: Particle[] = [];

        let width = 0;
        let height = 0;
        let animationFrame = 0;
        let destroyed = false;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            context.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const createParticle = (): Particle => ({
            x: pointer.targetX + (Math.random() - 0.5) * CURSOR_RADIUS * 2,
            y: pointer.targetY + (Math.random() - 0.5) * CURSOR_RADIUS * 2,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            life: Math.random(),
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.35 + 0.15,
        });

        const resetParticles = () => {
            particles.length = 0;

            for (let i = 0; i < PARTICLE_COUNT; i += 1) {
                particles.push(createParticle());
            }
        };

        const handlePointerMove = (event: PointerEvent) => {
            pointer.targetX = event.clientX;
            pointer.targetY = event.clientY;
            pointer.active = true;
        };

        const handlePointerLeave = () => {
            pointer.active = false;
        };

        const update = () => {
            pointer.x += (pointer.targetX - pointer.x) * 0.08;
            pointer.y += (pointer.targetY - pointer.y) * 0.08;

            for (const particle of particles) {
                const dx = pointer.x - particle.x;
                const dy = pointer.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CURSOR_RADIUS && distance > 0) {
                    const force = (1 - distance / CURSOR_RADIUS) * 0.018;

                    particle.vx += dx * force;
                    particle.vy += dy * force;
                }

                particle.vx *= 0.985;
                particle.vy *= 0.985;

                particle.x += particle.vx;
                particle.y += particle.vy;

                particle.life += 0.002;

                if (
                    particle.life > 1 ||
                    particle.x < -100 ||
                    particle.x > width + 100 ||
                    particle.y < -100 ||
                    particle.y > height + 100
                ) {
                    particle.x = pointer.x + (Math.random() - 0.5) * CURSOR_RADIUS * 2;
                    particle.y = pointer.y + (Math.random() - 0.5) * CURSOR_RADIUS * 2;
                    particle.vx = (Math.random() - 0.5) * 0.18;
                    particle.vy = (Math.random() - 0.5) * 0.18;
                    particle.life = 0;
                }
            }
        };

        const draw = () => {
            context.clearRect(0, 0, width, height);

            if (!pointer.active) return;

            /*
             * Connections between nearby particles.
             * The opacity depends on distance so the network
             * dissolves naturally instead of looking like a grid.
             */
            for (let i = 0; i < particles.length; i += 1) {
                const a = particles[i];

                for (let j = i + 1; j < particles.length; j += 1) {
                    const b = particles[j];

                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > CONNECTION_DISTANCE) continue;

                    const opacity =
                        (1 - distance / CONNECTION_DISTANCE) * 0.18;

                    context.beginPath();
                    context.moveTo(a.x, a.y);
                    context.lineTo(b.x, b.y);
                    context.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    context.lineWidth = 0.5;
                    context.stroke();
                }
            }

            /*
             * Particles.
             */
            for (const particle of particles) {
                const dx = pointer.x - particle.x;
                const dy = pointer.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > CURSOR_RADIUS) continue;

                const proximity = 1 - distance / CURSOR_RADIUS;
                const alpha = particle.alpha * proximity;

                context.beginPath();
                context.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2,
                );

                context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                context.fill();
            }

            /*
             * Very subtle cursor glow.
             * This is intentionally restrained so it doesn't
             * compete with the portfolio's existing visual system.
             */
            const gradient = context.createRadialGradient(
                pointer.x,
                pointer.y,
                0,
                pointer.x,
                pointer.y,
                70,
            );

            gradient.addColorStop(0, "rgba(255, 255, 255, 0.07)");
            gradient.addColorStop(0.45, "rgba(255, 255, 255, 0.025)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            context.beginPath();
            context.arc(pointer.x, pointer.y, 70, 0, Math.PI * 2);
            context.fillStyle = gradient;
            context.fill();
        };

        const tick = () => {
            if (destroyed) return;

            update();
            draw();

            animationFrame = window.requestAnimationFrame(tick);
        };

        resize();
        resetParticles();

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", handlePointerMove, {
            passive: true,
        });
        window.addEventListener("pointerleave", handlePointerLeave);

        animationFrame = window.requestAnimationFrame(tick);

        return () => {
            destroyed = true;

            window.cancelAnimationFrame(animationFrame);

            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handlePointerLeave);

            context.clearRect(0, 0, width, height);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
        />
    );
}