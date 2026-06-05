"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticProps {
    children: React.ReactNode;
    intensity?: number; // Qué tanto "jala" el botón hacia el cursor
    className?: string;
}

export function Magnetic({ children, intensity = 0.3, className = "inline-block" }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();

        // Calculamos el centro exacto del elemento
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        // Movemos el elemento hacia el cursor, multiplicado por la intensidad
        setPosition({ x: middleX * intensity, y: middleY * intensity });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}