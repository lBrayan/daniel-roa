"use client";

// 1. Importamos Variants de framer-motion
import { motion, Variants } from "framer-motion";

interface SplitTextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

export function SplitTextReveal({ text, className = "", delay = 0 }: SplitTextRevealProps) {
    const words = text.split(" ");

    // 2. Le decimos a TypeScript que esto es explícitamente del tipo Variants
    const containerVariants: Variants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.06,
                delayChildren: delay,
            },
        },
    };

    // 3. Y hacemos lo mismo aquí. Ahora TS sabe que ese array es una curva Bézier.
    const wordVariants: Variants = {
        hidden: {
            y: "120%",
            rotate: 4,
        },
        visible: {
            y: "0%",
            rotate: 0,
            transition: {
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <motion.span
            className={`inline-flex flex-wrap ${className}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
        >
            {words.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block mr-[0.25em] pb-1 -mb-1">
                    <motion.span
                        variants={wordVariants}
                        className="inline-block origin-bottom-left"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}