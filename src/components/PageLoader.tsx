"use client";
import { motion } from "framer-motion";

export function PageLoader() {
    return (
        <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-[#020818]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
            onAnimationComplete={() => {
                const el = document.getElementById("loader");
                if (el) el.style.display = "none";
            }}
            id="loader"
        >
            <motion.div
                className="font-mono text-cyan-500 tracking-[0.2em]"
            >
                {'< DANIEL_ROA />'}
            </motion.div>
        </motion.div>
    );
}