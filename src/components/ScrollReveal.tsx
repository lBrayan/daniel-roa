"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    width?: "fit-content" | "100%";
}

export function ScrollReveal({ children, delay = 0, width = "100%" }: ScrollRevealProps) {
    return (
        // ❌ Quitamos el overflow: "hidden" de aquí para que el hover y la luz no se corten
        <div style={{ width }}>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 60,
                    filter: "blur(10px)"
                }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)"
                }}
                viewport={{
                    once: true,
                    margin: "-40px"
                }}
                transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: delay
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}