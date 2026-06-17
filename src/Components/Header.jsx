import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Home, Info, Building2, Image, Mail,
  Menu, X, ChevronDown, Phone, MapPin, ArrowUpRight, Sparkles
} from "lucide-react";
import { BtnPrimary } from "./Homepage/ui";

/* ─── Nav structure ─── */
const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  {
    label: "About",
    icon: Info,
    href: "/about",
    hasDropdown: true,
    dropdown: [
      { label: "Who We Are", href: "/about" },
      { label: "About Director", href: "/about-director" },
      { label: "Team Members", href: "/team" },
    ],
  },
  {
    label: "Projects",
    icon: Building2,
    href: "/projects",
    hasDropdown: true,
    dropdown: [
      { label: "Completed Projects", href: "/projects/completed" },
      { label: "Ongoing Projects", href: "/projects/ongoing" },
    ],
  },
  { label: "Gallery", icon: Image, href: "/gallery" },
  { label: "Contact", icon: Mail, href: "/contact" },
];

export default function PremiumHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

  /* handle mobile drawer scroll lock */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* close drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isActive = (item) => {
    if (item.href === "/") return location.pathname === "/";
    return location.pathname.startsWith(item.href);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100]">
        {/* Announcement bar */}
        <div className="hidden md:flex items-center justify-center gap-3 bg-[#1174d6] text-white text-[0.7rem] font-semibold tracking-widest uppercase py-2.5 px-4">
          <Sparkles size={11} className="opacity-60" />
          <span>Award-winning real estate consultancy — Trusted by 3,200+ families across India</span>
          <Sparkles size={11} className="opacity-60" />
        </div>

        {/* Header bar */}
        <header
          style={{ height: 90 }}
          className={`w-full transition-all duration-700 ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] border-b border-[#1174d6]/10"
              : "bg-white/5 backdrop-blur-[12px] border-b border-white/10"
          }`}
        >
          <div className="max-w-[1400px] mx-auto h-full px-6 lg:px-12 flex items-center justify-between gap-8">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3.5 flex-shrink-0 group">
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
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_ITEMS.map((item) => (
                <div 
                  key={item.label} 
                  className="relative group/nav"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
                >
                  {/* Parent item */}
                  <Link
                    to={item.href}
                    className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[0.83rem] font-semibold tracking-wide transition-colors duration-300 select-none
                      ${isActive(item)
                        ? "text-[#1174d6]"
                        : scrolled ? "text-slate-600 hover:text-[#1174d6]" : "text-white/90 hover:text-white"
                      }`}
                  >
                    {isActive(item) && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-[#1174d6]/8"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown size={12} className={`relative z-10 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Simple Dropdown Panel (on hover) */}
                  <AnimatePresence>
                    {item.hasDropdown && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden py-2"
                      >
                        {item.dropdown.map((d) => (
                          <Link
                            key={d.label}
                            to={d.href}
                            className="block px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-[#1174d6] hover:bg-[#1174d6]/5 transition-colors"
                          >
                            {d.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <a
                href="tel:+917314909915"
                className={`flex items-center gap-2 transition-colors duration-300 group ${scrolled ? "text-slate-500 hover:text-[#1174d6]" : "text-white/80 hover:text-white"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${scrolled ? "bg-[#1174d6]/8 group-hover:bg-[#1174d6]/15" : "bg-white/10 group-hover:bg-white/20"}`}>
                  <Phone size={13} className={scrolled ? "text-[#1174d6]" : "text-white"} />
                </div>
                <span className="text-xs font-semibold tracking-wide">+91 731-4909915</span>
              </a>
              <div className="w-px h-6 bg-slate-200" />
              <BtnPrimary to="/join" className="!px-6 !py-3 !text-[13px] !shadow-[0_4px_20px_rgba(17,116,214,0.35)]">
                Join us
              </BtnPrimary>
            </div>

            {/* Mobile hamburger */}
            <motion.button
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${
                scrolled
                  ? "border-slate-200 text-slate-600 hover:border-[#1174d6]/40 hover:text-[#1174d6]"
                  : "border-white/30 text-white hover:bg-white/10"
              }`}
              onClick={() => setMobileOpen(true)}
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={20} strokeWidth={2} />
            </motion.button>
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
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
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1174d6] to-[#0a5ab8] flex items-center justify-center shadow-[0_4px_12px_rgba(17,116,214,0.3)]">
                    <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                      <path d="M3 19V9.5L11 3L19 9.5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="8" y="13" width="6" height="6" rx="0.5" fill="white" opacity="0.9" />
                    </svg>
                  </div>
                  <span className="text-xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    SOS<span className="text-[#1174d6]">Infrabulls</span>
                  </span>
                </Link>
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
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    <Link
                      to={item.href}
                      onClick={() => !item.hasDropdown && setMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-[0.875rem] transition-all duration-200 group
                        ${isActive(item)
                          ? "bg-[#1174d6]/8 text-[#1174d6]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#1174d6]"
                        }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                        ${isActive(item)
                          ? "bg-[#1174d6] text-white shadow-[0_4px_12px_rgba(17,116,214,0.3)]"
                          : "bg-slate-100 text-slate-400 group-hover:bg-[#1174d6]/10 group-hover:text-[#1174d6]"
                        }`}
                      >
                        <item.icon size={16} strokeWidth={2} />
                      </div>
                      <span>{item.label}</span>
                      {item.hasDropdown && <ChevronDown size={13} className="ml-auto text-slate-300" />}
                    </Link>

                    {item.hasDropdown && item.dropdown && (
                      <div className="ml-[52px] mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-[#1174d6] hover:bg-[#1174d6]/5 transition-all duration-150"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="px-4 pb-8 pt-5 space-y-3 border-t border-slate-100">
                <a
                  href="tel:+917314909915"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:border-[#1174d6]/30 hover:text-[#1174d6] transition-all duration-200"
                >
                  <Phone size={16} className="text-[#1174d6]" />
                  <span className="text-sm font-semibold">+91 731-4909915</span>
                </a>
                <Link
                  to="/join"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1174d6] to-[#0a5ab8] shadow-[0_4px_20px_rgba(17,116,214,0.35)]"
                >
                  Join As Partner
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap');`}</style>
    </>
  );
}