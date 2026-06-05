"use client";
import { motion, useScroll, useTransform, useMotionTemplate, MotionValue } from "framer-motion";

interface ClientParallaxProps {
    children: (asideY: MotionValue<number>, blurStyle: MotionValue<string>) => React.ReactNode;
}

export function ClientParallax({ children }: ClientParallaxProps) {
    // 1. Quitamos el ref si quieres parallax de toda la página (window scroll)
    // Esto es mucho más estable y evita errores de hidratación
    const { scrollYProgress } = useScroll();

    // 2. Transformaciones
    const asideY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const asideBlur = useTransform(scrollYProgress, [0, 0.4], [0, 8]);
    const blurStyle = useMotionTemplate`blur(${asideBlur}px)`;

    return (
        <div className="w-full h-full">
            {children(asideY, blurStyle)}
        </div>
    );
}