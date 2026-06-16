import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Home, Info, Building2, Image, MessageSquare, Mail,
  Menu, X, ChevronDown, Phone, MapPin, ArrowUpRight, Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "#" },
  { label: "About", icon: Info, href: "#about" },
  { label: "Projects", icon: Building2, href: "#projects", hasDropdown: true },
  { label: "Gallery", icon: Image, href: "#gallery" },
  { label: "Testimonials", icon: MessageSquare, href: "#testimonials" },
  { label: "Contact", icon: Mail, href: "#contact" },
];

const DROPDOWN_ITEMS = [
  { label: "Residential", sub: "Luxury homes & villas", icon: "🏡" },
  { label: "Commercial", sub: "Office & retail spaces", icon: "🏢" },
  { label: "Developments", sub: "New launch projects", icon: "🏗️" },
  { label: "Investments", sub: "High-yield portfolios", icon: "📈" },
];

export default function PremiumHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const dropdownRef = useRef(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100]">
        {/* ── Announcement bar ── */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex items-center justify-center gap-3 bg-[#1174d6] text-white text-[0.7rem] font-semibold tracking-widest uppercase py-2.5 px-4"
        >
          <Sparkles size={11} className="opacity-60" />
          <span>Award-winning real estate consultancy — Trusted by 3,200+ families across India</span>
          <Sparkles size={11} className="opacity-60" />
        </motion.div>

        {/* ── Fixed Header ── */}
        <motion.header
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ height: 90 }}
          className={`w-full transition-all duration-700 ${scrolled
              ? "bg-white/90 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] border-b border-[#1174d6]/10"
              : "bg-white/5 backdrop-blur-[12px] border-b border-white/10"
            }`}
        >
          <div className="max-w-[1400px] mx-auto h-full px-6 lg:px-12 flex items-center justify-between gap-8">

            {/* ── Logo ── */}
            <motion.a
              href="#"
              className="flex items-center gap-3.5 flex-shrink-0 group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-11 h-11 flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-[#1174d6] rotate-6 opacity-20 group-hover:rotate-12 transition-all duration-500" />
                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#1174d6] to-[#0a5ab8] flex items-center justify-center shadow-[0_4px_20px_rgba(17,116,214,0.38)]">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M3 19V9.5L11 3L19 9.5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="8" y="13" width="6" height="6" rx="0.5" fill="white" opacity="0.9" />
                    <path d="M11 3V19" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className={`text-[1.35rem] font-black tracking-tight transition-colors duration-300 ${scrolled ? "text-slate-900" : "text-white"}`}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.02em" }}
                >
                  SOS<span className="text-[#1174d6]">Infrabulls</span>
                </span>
                <span className={`text-[0.6rem] font-semibold tracking-[0.24em] uppercase transition-colors duration-300 mt-0.5 ${scrolled ? "text-slate-400" : "text-white/60"}`}>
                  International Pvt. Ltd.
                </span>
              </div>
            </motion.a>

            {/* ── Desktop Nav ── */}
            <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_ITEMS.map((item, i) => (
                <div key={item.label} className="relative">
                  <motion.a
                    href={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(e) => {
                      setActiveNav(item.label);
                      if (item.hasDropdown) {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === item.label ? null : item.label);
                      }
                    }}
                    className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[0.83rem] font-semibold tracking-wide transition-colors duration-300 select-none
                    ${activeNav === item.label
                        ? "text-[#1174d6]"
                        : scrolled ? "text-slate-600 hover:text-[#1174d6]" : "text-white/90 hover:text-white"}`}
                  >
                    {activeNav === item.label && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-[#1174d6]/8"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    {item.hasDropdown && (
                      <motion.span
                        animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="relative z-10"
                      >
                        <ChevronDown size={13} strokeWidth={2.5} />
                      </motion.span>
                    )}
                    {/* Hover underline */}
                    <motion.span
                      className="absolute bottom-1.5 left-4 right-4 h-[1.5px] bg-[#1174d6] rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: activeNav === item.label ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.a>

                  {/* Mega Dropdown */}
                  <AnimatePresence>
                    {item.hasDropdown && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-[440px] bg-white rounded-2xl shadow-[0_24px_64px_rgba(17,116,214,0.13),0_4px_16px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden z-50"
                      >
                        <div className="bg-gradient-to-r from-[#1174d6] to-[#0a5ab8] px-6 py-4">
                          <p className="text-white/55 text-xs font-semibold tracking-widest uppercase">Explore</p>
                          <p className="text-white text-lg font-bold mt-0.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Our Projects</p>
                        </div>
                        <div className="p-3 grid grid-cols-2 gap-2">
                          {DROPDOWN_ITEMS.map((d) => (
                            <motion.a
                              key={d.label}
                              href="#"
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-[#1174d6]/5 group/item transition-colors duration-150"
                            >
                              <span className="text-2xl leading-none mt-0.5">{d.icon}</span>
                              <div>
                                <p className="text-sm font-bold text-slate-800 group-hover/item:text-[#1174d6] transition-colors">{d.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5 font-medium">{d.sub}</p>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                        <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-medium">20+ active developments</span>
                          <a href="#" className="text-xs font-bold text-[#1174d6] flex items-center gap-1 hover:gap-2 transition-all duration-200">
                            View all <ArrowUpRight size={12} />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* ── Right: Phone + CTA ── */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <motion.a
                href="tel:+911234567890"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className={`flex items-center gap-2 transition-colors duration-300 group ${scrolled ? "text-slate-500 hover:text-[#1174d6]" : "text-white/80 hover:text-white"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${scrolled ? "bg-[#1174d6]/8 group-hover:bg-[#1174d6]/15" : "bg-white/10 group-hover:bg-white/20"}`}>
                  <Phone size={13} className={scrolled ? "text-[#1174d6]" : "text-white"} />
                </div>
                <span className="text-xs font-semibold tracking-wide">+91 98765 43210</span>
              </motion.a>

              <div className="w-px h-6 bg-slate-200" />

              <motion.a
                href="#contact"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #1174d6 0%, #0a5ab8 100%)",
                  boxShadow: "0 4px 20px rgba(17,116,214,0.35), 0 1px 4px rgba(17,116,214,0.2)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10">Book Consultation</span>
                <ArrowUpRight size={15} className="relative z-10 group-hover:rotate-12 transition-transform duration-200" />
              </motion.a>
            </div>

            {/* ── Mobile hamburger ── */}
            <motion.button
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${scrolled
                  ? "border-slate-200 text-slate-600 hover:border-[#1174d6]/40 hover:text-[#1174d6]"
                  : "border-white/30 text-white hover:bg-white/10"
                }`}
              onClick={() => setMobileOpen(true)}
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={20} strokeWidth={2} />
            </motion.button>
          </div>
        </motion.header>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[120] w-[85vw] max-w-[380px] bg-white shadow-[-24px_0_64px_rgba(0,0,0,0.1)] flex flex-col lg:hidden overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1174d6] to-[#0a5ab8] flex items-center justify-center shadow-[0_4px_12px_rgba(17,116,214,0.3)]">
                    <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                      <path d="M3 19V9.5L11 3L19 9.5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="8" y="13" width="6" height="6" rx="0.5" fill="white" opacity="0.9" />
                    </svg>
                  </div>
                  <span
                    className="text-xl font-black text-slate-900 tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    SOS<span className="text-[#1174d6]">Infrabulls</span>
                  </span>
                </div>
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  whileTap={{ scale: 0.88 }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-[#1174d6]/40 hover:text-[#1174d6] transition-all"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.07 + i * 0.055, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => { setActiveNav(item.label); setMobileOpen(false); }}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-[0.875rem] transition-all duration-200 group
                      ${activeNav === item.label
                        ? "bg-[#1174d6]/8 text-[#1174d6]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#1174d6]"
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${activeNav === item.label
                        ? "bg-[#1174d6] text-white shadow-[0_4px_12px_rgba(17,116,214,0.3)]"
                        : "bg-slate-100 text-slate-400 group-hover:bg-[#1174d6]/10 group-hover:text-[#1174d6]"}`}>
                      <item.icon size={16} strokeWidth={2} />
                    </div>
                    <span>{item.label}</span>
                    {item.hasDropdown && <ChevronDown size={13} className="ml-auto text-slate-300" />}
                  </motion.a>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="px-4 pb-8 pt-5 space-y-3 border-t border-slate-100">
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:border-[#1174d6]/30 hover:text-[#1174d6] transition-all duration-200"
                >
                  <Phone size={16} className="text-[#1174d6]" />
                  <span className="text-sm font-semibold">+91 98765 43210</span>
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #1174d6 0%, #0a5ab8 100%)",
                    boxShadow: "0 4px 20px rgba(17,116,214,0.35)",
                  }}
                >
                  Book Consultation
                  <ArrowUpRight size={15} />
                </a>
                <div className="flex items-center justify-center gap-2 pt-1 text-slate-400 text-xs">
                  <MapPin size={11} />
                  <span className="font-medium">Bhopal · Mumbai · Delhi · Bangalore</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap');
      `}</style>
    </>
  );
}