import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Utility to join classes
const cn = (...classes) => classes.filter(Boolean).join(" ");

/* ======================================================
   THEME TOGGLE HOOK
====================================================== */
export const useThemeToggle = ({
    variant = "circle",
    blur = false,
    gifUrl = "",
} = {}) => {
    const { theme, toggleTheme: contextToggleTheme } = useTheme();
    const [isDark, setIsDark] = useState(theme === 'dark');

    // Sync state with context
    useEffect(() => {
        setIsDark(theme === "dark");
    }, [theme]);

    const updateStyles = useCallback((css) => {
        let style = document.getElementById("theme-transition");
        if (!style) {
            style = document.createElement("style");
            style.id = "theme-transition";
            document.head.appendChild(style);
        }
        style.textContent = css;
    }, []);

    const toggleTheme = useCallback(() => {
        // Optimistic toggle for local state
        const nextState = !isDark;
        setIsDark(nextState);

        // Create animation CSS
        const animation = createAnimation(
            variant,
            "bottom-right",
            blur,
            gifUrl,
        );

        // Inject styles
        updateStyles(animation.css);

        // Perform actual switch
        const switchTheme = () => contextToggleTheme();

        if (!document.startViewTransition) {
            switchTheme();
            return;
        }

        document.startViewTransition(switchTheme);
    }, [contextToggleTheme, variant, blur, gifUrl, isDark, updateStyles]);

    return { isDark, toggleTheme };
};

/* ======================================================
   TOGGLE BUTTON
====================================================== */
export const ThemeToggleButton = ({
    className = "",
    variant = "circle",
    blur = false,
    gifUrl = "",
}) => {
    const { isDark, toggleTheme } = useThemeToggle({
        variant,
        blur,
        gifUrl,
    });

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "w-10 h-10 rounded-full bg-slate-900 border border-slate-700 transition active:scale-95 flex items-center justify-center overflow-hidden",
                className,
            )}
            aria-label="Toggle Theme"
        >
            <motion.div
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full relative"
            >
                {/* Simple visualization of sun/moon or just the rotating circle as requested by user's minimal design */}
                <svg viewBox="0 0 240 240" fill="none" className="w-full h-full p-2" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path
                            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
                            fill="white"
                        />
                        <path
                            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
                            fill="black"
                        />
                    </g>
                    <path
                        d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
                        fill="white"
                    />
                </svg>
            </motion.div>
        </button>
    );
};

// Default Export for the component usage
const ThemeToggle = () => {
    return (
        <ThemeToggleButton variant="circle" />
    )
}

export default ThemeToggle;


/* ======================================================
   ANIMATION CREATOR (ONLY bottom-right)
====================================================== */
export const createAnimation = (
    variant,
    _start, // unused, always bottom-right
    blur = false,
    url
) => {
    /* ---------- RECTANGLE ---------- */
    if (variant === "rectangle") {
        return {
            name: "rectangle-bottom-right",
            css: `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: cubic-bezier(.19,1,.22,1);
      }

      ::view-transition-new(root) {
        animation-name: reveal;
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }

      @keyframes reveal {
        from {
          clip-path: polygon(100% 100%,100% 100%,100% 100%,100% 100%);
          ${blur ? "filter: blur(8px);" : ""}
        }
        to {
          clip-path: polygon(0% 0%,100% 0%,100% 100%,0% 100%);
          ${blur ? "filter: blur(0);" : ""}
        }
      }
      `,
        };
    }

    /* ---------- CIRCLE ---------- */
    if (variant === "circle") {
        return {
            name: "circle-bottom-right",
            css: `
      ::view-transition-new(root) {
        animation: circleReveal 0.9s ease-out;
      }

      ::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }

      @keyframes circleReveal {
        from {
          clip-path: circle(0% at 100% 100%);
        }
        to {
          clip-path: circle(150% at 100% 100%);
        }
      }
      `,
        };
    }

    /* ---------- GIF ---------- */
    if (variant === "gif") {
        return {
            name: "gif-bottom-right",
            css: `
      ::view-transition-new(root) {
        mask: url('${url}') bottom right / 0 no-repeat;
        animation: gifScale 2s ease-out;
      }

      ::view-transition-old(root) {
        animation: none;
      }

      @keyframes gifScale {
        to {
          mask-size: 2000vmax;
        }
      }
      `,
        };
    }

    /* ---------- CIRCLE BLUR ---------- */
    if (variant === "circle-blur") {
        return {
            name: "circle-blur-bottom-right",
            css: `
      ::view-transition-new(root) {
        animation: blurCircle 1s ease-out;
      }

      ::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }

      @keyframes blurCircle {
        from {
          clip-path: circle(0% at 100% 100%);
          filter: blur(8px);
        }
        to {
          clip-path: circle(150% at 100% 100%);
          filter: blur(0);
        }
      }
      `,
        };
    }

    /* ---------- POLYGON ---------- */
    return {
        name: "polygon-bottom-right",
        css: `
    ::view-transition-new(root) {
      animation: poly 0.7s ease-out;
    }

    ::view-transition-old(root) {
      animation: none;
      z-index: -1;
    }

    @keyframes poly {
      from {
        clip-path: polygon(100% 100%,100% 100%,100% 100%);
      }
      to {
        clip-path: polygon(0% 0%,100% 0%,100% 100%,0% 100%);
      }
    }
    `,
    };
};
