"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);

    // Coordenadas del ratón
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Física de Apple/Framer (resorte suave)
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const smoothX = useSpring(cursorX, springConfig);
    const smoothY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        // Detectar si estamos sobre un elemento interactivo
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Si toca un enlace, botón o input, el cursor reacciona
            if (target.closest('a, button, input, textarea')) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = () => {
            setIsHovering(false);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mouseout", handleMouseOut);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full flex items-center justify-center mix-blend-difference"
            style={{
                x: smoothX,
                y: smoothY,
                translateX: "-50%", // Centrar el punto exacto del click
                translateY: "-50%",
                backgroundColor: "#ffffff", // Blanco puro para la inversión de color
            }}
            animate={{
                width: isHovering ? 64 : 14,
                height: isHovering ? 64 : 14,
                opacity: 1
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
        />
    );
}