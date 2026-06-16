import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const FloatingScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-[90] w-12 h-12 bg-[#1174d6] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(17,116,214,0.4)] hover:bg-[#0a5ab8] hover:-translate-y-1 transition-all duration-300"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={20} strokeWidth={2.5} />
                    <div className="absolute inset-0 rounded-full bg-[#1174d6] animate-ping opacity-20 -z-10" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default FloatingScrollToTop;
