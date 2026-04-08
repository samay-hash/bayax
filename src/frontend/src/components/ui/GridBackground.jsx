import React, { useState, useEffect } from 'react';

const GridBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Background Layer - handled by global CSS/Tailwind in App.jsx, but we confirm transparency here or match variables if needed */}
            {/* Light Mode Gradient */}
            <div
                className="absolute inset-0 dark:hidden transition-opacity duration-300"
                style={{
                    backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
                    backgroundSize: "100% 100%",
                }}
            />
            {/* Dark Mode Background */}
            <div className="absolute inset-0 hidden dark:block bg-[#020617] transition-colors duration-300">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)`,
                    }}
                />
            </div>

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.10] dark:opacity-[0.15]"
                style={{
                    backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    color: '#64748b' // Slate-500 for neutral grid
                }}
            ></div>

            {/* Mouse Spotlight */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.1), transparent 40%)`, // Cyan glow compatible with both
                }}
            ></div>
        </div>
    );
};

export default GridBackground;
