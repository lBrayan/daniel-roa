export const ImagePrivate = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d3f3" strokeWidth="0.5" strokeOpacity="0.1" />
                </pattern>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <rect width="100%" height="100%" fill="#020818" />

            <rect width="100%" height="100%" fill="url(#grid)" />

            <g transform="translate(400, 220)">
                <path d="M -25 -20 V -40 A 25 25 0 0 1 25 -40 V -20" fill="none" stroke="#00d3f3" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                <rect x="-45" y="-20" width="90" height="65" rx="12" fill="#040f1e" stroke="#00d3f3" strokeWidth="3" filter="url(#glow)" />
                <text x="0" y="23" fill="#00d3f3" fontFamily="monospace" fontSize="28" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
            </g>

            <text x="400" y="350" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontSize="26" fontWeight="800" letterSpacing="4" textAnchor="middle">REPOSITORIO PRIVADO</text>
            <text x="400" y="385" fill="#00d3f3" fontFamily="monospace" fontSize="12" fontWeight="600" letterSpacing="3" textAnchor="middle" opacity="0.8">ACCESO RESTRINGIDO POR NDA</text>
            <circle cx="220" cy="342" r="3" fill="#00d3f3" opacity="0.5" />
            <path d="M 230 342 L 290 342" fill="none" stroke="#00d3f3" strokeWidth="1" opacity="0.3" />

            <circle cx="580" cy="342" r="3" fill="#00d3f3" opacity="0.5" />
            <path d="M 510 342 L 570 342" fill="none" stroke="#00d3f3" strokeWidth="1" opacity="0.3" />
        </svg>
    );
}