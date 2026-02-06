import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
    "Analyzing raw concept...",
    "Identifying market gaps...",
    "Structuring execution logic...",
    "Building strategy nodes...",
    "Calculating confidence score..."
];

export default function BlurReveal({ isLoading }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="relative w-24 h-24 mb-8">
                <motion.div
                    className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"
                />
                <motion.div
                    className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-cyan-500 rounded-full blur-sm"
                    />
                </div>
            </div>

            <div className="h-20 flex items-center justify-center overflow-hidden relative w-full">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={index}
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl font-bold text-slate-800 dark:text-slate-100 absolute"
                    >
                        {loadingMessages[index]}
                    </motion.h2>
                </AnimatePresence>
            </div>

            <p className="text-slate-500 dark:text-slate-400 mt-2">AI Strategist is thinking...</p>
        </div>
    );
}
