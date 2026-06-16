import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, Award, Users, Home, ShieldCheck } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1920&q=90",
    label: "SOS Infrabulls International",
    headline: "Your Trusted\nReal Estate Partner",
    subheadline: "Specializing in Residential, Commercial, and Industrial land since 2019. We help you secure the perfect investment for your future.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=1920&q=90",
    headline: "Invest in Choice\nPrime Locations",
    subheadline: "From resale deals to fresh investment opportunities, we offer a wide range of verified properties to suit your specific goals.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=90",
    label: "Expert Guidance",
    headline: "Transparent Deals,\nMaximum Returns",
    subheadline: "With our expertise in industrial and commercial assets, we act in your best interest to ensure long-term financial success.",
  },
];

const stats = [
  { icon: Award, value: "5+", label: "Years Experience" },
  { icon: Home, value: "500+", label: "Happy Clients" },
  { icon: Users, value: "100+", label: "Acres Sold" },
];

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12 + 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.35, ease: "easeInOut" } },
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const timerRef = useRef(null);

  // Track layout boundaries safely for responsive coordinates
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const goTo = (idx) => {
    setCurrent(idx);
  };

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 7000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const slide = slides[current];

  // Calculate parallax offsets safely
  const parallaxX = (mousePos.x - dimensions.width / 2) * 0.015;
  const parallaxY = (mousePos.y - dimensions.height / 2) * 0.015;

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen min-h-[750px] max-h-[1080px] overflow-hidden bg-gray-950 group/hero select-none"
    >
      {/* 1. T-Square Drafting Crosshair Lines */}
      <div className="absolute inset-0 z-30 pointer-events-none hidden lg:block opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300 will-change-transform">
        <div className="absolute h-full w-[1px] bg-white/10" style={{ left: mousePos.x, top: 0 }} />
        <div className="absolute w-full h-[1px] bg-white/10" style={{ top: mousePos.y, left: 0 }} />
        <div
          className="absolute w-6 h-6 border-2 border-[#1174d6] rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-[0_0_15px_rgba(17,116,214,0.4)]"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>

      {/* 2. Layered Background Frame Engine */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slide.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        >
          {/* Parallax Core Mount Container */}
          <motion.div
            className="w-full h-full relative"
            animate={{ x: parallaxX, y: parallaxY }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
          >
            <motion.img
              src={slide.image}
              alt={slide.headline}
              className="w-full h-full object-cover origin-center transform scale-110"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1.16 }}
              transition={{ duration: 7, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              draggable={false}
            />
          </motion.div>

          {/* Luxury Shadow/Lighting Falloffs */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/55 z-10" />
          {/* Darker top band for header readability */}
          <div className="absolute inset-x-0 top-0 h-44 md:h-52 bg-gradient-to-b from-black/80 via-black/45 to-transparent z-10 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* 3. Blueprint Drafting Grid Mask */}
      <div 
        className="absolute inset-0 z-[2] opacity-[0.14] pointer-events-none transition-opacity duration-500 hidden lg:block"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)`,
          backgroundSize: "50px 50px",
          WebkitMaskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 25%, transparent 100%)`,
          maskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 25%, transparent 100%)`
        }}
      />

      {/* 4. Live Floating Blueprint Tags */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[28%] right-[15%] px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hidden xl:flex items-center gap-2.5 shadow-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-[#1174d6] animate-pulse shadow-[0_0_8px_#1174d6]" />
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.2em]">Verified Plots Available</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
          transition={{ duration: 4.8, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[38%] left-[45%] px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hidden xl:flex items-center gap-2.5 shadow-2xl"
        >
          <ShieldCheck size={14} className="text-cyan-400" />
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.2em]">RERA Registered</span>
        </motion.div>
      </div>

      {/* 5. Typography Content System */}
      <div className="relative z-20 h-full flex flex-col justify-center">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 w-full">
          <AnimatePresence mode="wait">
            <motion.div key={`content-${slide.id}`} className="max-w-3xl">
              {/* Badge Anchor */}
              <motion.div
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="inline-flex items-center gap-3 mb-6"
              >
                <span className="w-10 h-[1.5px]" style={{ background: "#1174d6" }} />
                <span className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#60b3ff]">
                  {slide.label || "SOS Infrabulls International"}
                </span>
              </motion.div>

              {/* Master Display Headline */}
              <motion.h1
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.08] mb-6 tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                style={{
                  fontFamily: "'Georgia', serif",
                  whiteSpace: "pre-line",
                }}
              >
                {slide.headline}
              </motion.h1>

              {/* Informational Subtext */}
              <motion.p
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-[15px] md:text-[18px] text-white/70 max-w-xl leading-relaxed mb-10 tracking-wide font-light"
              >
                {slide.subheadline}
              </motion.p>

              {/* Interactive CTAs */}
              <motion.div
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  href="#projects"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-[13px] font-bold text-white tracking-wider uppercase transition-shadow"
                  style={{
                    background: "linear-gradient(135deg, #1174d6 0%, #0a5ab5 100%)",
                    boxShadow: "0 6px 24px rgba(17,116,214,0.35)",
                  }}
                >
                  Explore Projects
                  <ArrowRight size={15} />
                </motion.a>
                <motion.a
                  href="#contact"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.15)", y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-[13px] font-bold text-white border border-white/25 backdrop-blur-sm transition-all bg-white/5 tracking-wider uppercase"
                >
                  <Calendar size={15} className="text-cyan-400" />
                  Schedule Visit
                </motion.a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 6. Linear Stats Dashboard Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-12 right-6 md:right-16 z-40 hidden md:block"
      >
        <div className="flex rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.4)] overflow-hidden">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-start px-8 py-5 min-w-[140px]"
              style={{
                borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon size={15} className="text-[#60b3ff]" />
                <span className="text-2xl font-bold text-white tracking-tight leading-none">{stat.value}</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 7. Controls and Dynamic Timelines */}
      <div className="absolute bottom-10 md:bottom-12 left-6 md:left-16 z-40 flex items-center gap-4">
        {/* Step Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 text-white bg-white/5 hover:bg-white/15 hover:border-white/20 transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 text-white bg-white/5 hover:bg-white/15 hover:border-white/20 transition-all active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Modular Progressive Tickers */}
        <div className="flex items-center gap-2.5 ml-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group h-1.5 rounded-full transition-all duration-500 overflow-hidden relative bg-white/20"
              style={{ width: i === current ? "40px" : "12px" }}
            >
              {i === current && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#1174d6] to-cyan-400"
                  initial={{ left: "-100%" }}
                  animate={{ left: "0%" }}
                  transition={{ duration: 7, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 8. Vertical Scroll Anchored Guide */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/30 font-bold">Scroll Down</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-[#1174d6]"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}