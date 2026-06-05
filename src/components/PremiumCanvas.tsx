"use client";
import { useEffect, useRef } from "react";

export function PremiumCanvas() {
    const lightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentY = window.scrollY;
        let targetY = window.scrollY;
        let rafId: number;
        let isScrolling = false;

        const onWheel = (e: WheelEvent) => {
            // No interceptar si el target tiene scroll propio
            const target = e.target as HTMLElement;
            const scrollable = target.closest('[data-scroll-inner]');
            if (scrollable) return;

            e.preventDefault();
            targetY += e.deltaY * 0.8; // multiplier — reduce la distancia bruta
            targetY = Math.max(0, Math.min(targetY, document.body.scrollHeight - window.innerHeight));

            if (!isScrolling) {
                isScrolling = true;
                animate();
            }
        };

        const animate = () => {
            // Lerp agresivo: 0.18 da suavidad sin lag
            currentY += (targetY - currentY) * 0.18;

            // Cuando está casi en destino, snap exacto
            if (Math.abs(targetY - currentY) < 0.5) {
                currentY = targetY;
                window.scrollTo(0, currentY);
                isScrolling = false;
                return;
            }

            window.scrollTo(0, currentY);
            rafId = requestAnimationFrame(animate);
        };

        // passive: false para poder llamar preventDefault()
        window.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", onWheel);
            cancelAnimationFrame(rafId);
        };
    }, []);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            if (lightRef.current) {
                lightRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(0, 211, 243, 0.04), transparent 40%)`;
            }
        };

        window.addEventListener("mousemove", updateMousePosition, { passive: true });
        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, []);

    return (
        <>
            <div className="grain-overlay" /> 
            <div ref={lightRef} className="pointer-events-none fixed inset-0 z-30" />
        </>
    );
}