/** Campo de partículas generado a partir de texto rasterizado en canvas. */
export type ParticleField = {
    render: (progress: number) => void;
    resize: () => void;
};

export function createParticleField(canvas: HTMLCanvasElement, text: string): ParticleField {
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let particles: { x: number; y: number; d: number; a: number }[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let last = -1;

    function build() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        w = Math.max(rect.width, 1);
        h = Math.max(rect.height, 1);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const size = Math.min(w * 0.24, 200);
        ctx.clearRect(0, 0, w, h);
        ctx.font = `700 ${size}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, w / 2, h / 2);

        const cw = canvas.width;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const gap = w < 640 ? 3 : 2;
        particles = [];
        for (let y = 0; y < h; y += gap) {
            for (let x = 0; x < w; x += gap) {
                const px = Math.floor(x * dpr);
                const py = Math.floor(y * dpr);
                const alpha = data[(py * cw + px) * 4 + 3];
                if (alpha && alpha > 130) {
                    particles.push({ x, y, d: Math.random(), a: 0.75 + Math.random() * 0.25 });
                }
            }
        }
        last = -1;
    }

    function render(progress: number) {
        if (!particles.length) build();
        const p = Math.min(Math.max(progress, 0), 1);
        if (Math.abs(p - last) < 0.001) return;
        last = p;

        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;

        for (let i = 0; i < particles.length; i++) {
            const s = particles[i]!;
            const start = s.d * 0.35;
            const local = Math.min(Math.max((p - start) / (1 - start), 0), 1);
            // Desaceleración: las partículas ganan velocidad y frenan al llegar al centro.
            const e = local * local * (3 - 2 * local);
            const x = s.x + (cx - s.x) * e;
            const y = s.y + (cy - s.y) * e;
            const alpha = s.a * (1 - e);
            if (alpha <= 0.01) continue;
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fillRect(x, y, 1.5, 1.5);
        }
    }

    return {
        render,
        resize: () => {
            build();
            render(last < 0 ? 0 : last);
        },
    };
}
