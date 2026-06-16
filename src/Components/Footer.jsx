import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Globe, 
  ShieldCheck
} from "lucide-react";
import { 
  Instagram, 
  Linkedin, 
  Facebook, 
  Twitter 
} from "./Icons";

export default function EnterpriseFooter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHoveredBackToTop, setIsHoveredBackToTop] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const operationalSectors = [
    { name: "Residential Portfolios", desc: "Premium homes & luxury apartments" },
    { name: "Commercial Hubs", desc: "Modern corporate spaces & retail complexes" },
    { name: "Industrial Infrastructure", desc: "Warehousing & strategic logistics parks" },
    { name: "Strategic Land Acquisition", desc: "High-yield investment plots & developments" },
  ];

  const corporateNavigation = [
    { name: "About Us", href: "/about" },
    { name: "About Director", href: "/about-director" },
    { name: "Team Members", href: "/team" },
    { name: "Completed Projects", href: "/projects/completed" },
    { name: "Ongoing Projects", href: "/projects/ongoing" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const luxuryTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

  return (
    <footer className="relative bg-white text-neutral-900 border-t border-neutral-100 overflow-hidden font-sans">
      {/* Premium Ambient Background Accents */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-blue-50/40 via-fuchsia-50/10 to-transparent rounded-full blur-[140px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-slate-50 to-neutral-50 rounded-full blur-[100px] translate-y-1/3" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-12">
        
        {/* Main Content Grid Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 pb-16 border-b border-neutral-100/80">
          
          {/* Column 1: Brand Anchor */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-6">
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-[0.2em] text-neutral-900 uppercase">
                SOS<span className="text-[#1174d6]">Infrabulls</span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.35em] text-neutral-400 uppercase mt-1">
                International Pvt. Ltd.
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-neutral-500 font-normal max-w-sm">
              A premier real estate corporation transforming landscape spaces into high-value assets across residential, commercial, and industrial markets.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                <Globe size={13} className="text-neutral-300" /> Corporate Headquarters Active
              </span>
            </div>
          </div>

          {/* Column 2: Structural Divisions */}
          <div className="lg:col-span-3 lg:pl-4">
            <h4 className="text-[11px] font-bold tracking-[0.25em] text-neutral-400 uppercase mb-6">
              Sector Expertise
            </h4>
            <ul className="space-y-4">
              {operationalSectors.map((sector, idx) => (
                <li key={idx} className="flex flex-col space-y-0.5 group cursor-pointer">
                  <span className="text-sm font-semibold text-neutral-800 group-hover:text-[#1174d6] transition-colors duration-300 flex items-center gap-1">
                    {sector.name}
                  </span>
                  <span className="text-xs text-neutral-400 font-light">
                    {sector.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation Charter */}
          <div className="lg:col-span-2 lg:pl-2">
            <h4 className="text-[11px] font-bold tracking-[0.25em] text-neutral-400 uppercase mb-6">
              Corporate Overview
            </h4>
            <ul className="space-y-3.5">
              {corporateNavigation.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href}
                    className="group flex items-center text-sm text-neutral-600 hover:text-[#1174d6] font-normal transition-colors duration-300"
                  >
                    <span className="relative overflow-hidden py-0.5">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#1174d6] transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Private Desk Locations */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold tracking-[0.25em] text-neutral-400 uppercase mb-6">
              Corporate Office Desk
            </h4>
            <ul className="space-y-4.5 text-sm text-neutral-600 font-normal">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#1174d6] mt-0.5 shrink-0" />
                <span className="leading-relaxed text-neutral-500">
                  405 - Shagun tower,<br /> Above Apna Sweets,<br /> AB Road, Vijay Nagar, <br />Indore, 452001
                </span>
              </li>
              <li className="flex items-center gap-3 group pt-1">
                <Phone size={16} className="text-[#1174d6] shrink-0" />
                <a href="tel:+917314909915" className="text-neutral-500 group-hover:text-[#1174d6] transition-colors duration-300 font-semibold">
                  +91 731-4909915
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={16} className="text-[#1174d6] shrink-0" />
                <a href="mailto:info@sosinfrabulls.org" className="text-neutral-500 group-hover:text-[#1174d6] transition-colors duration-300 truncate">
                  info@sosinfrabulls.org
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Middle Intelligence Banner Area */}
        <div className="py-10 border-b border-neutral-100/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1174d6]">
              <ShieldCheck size={14} /> Market Intelligence Sync
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              Subscribe to access curated off-market inventory releases, portfolio structural realignments, and verified real estate investment analysis indices.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[340px]">
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter elite professional email" 
                className="w-full bg-neutral-50 border border-neutral-200/70 rounded-xl px-5 py-3 text-xs font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#1174d6] focus:bg-white focus:shadow-sm transition-all duration-300 pr-14"
              />
              <button 
                type="submit"
                className="absolute right-1.5 w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#1174d6] to-blue-500 text-white hover:opacity-95 shadow-sm transition-opacity duration-300"
                aria-label="Subscribe"
              >
                <ArrowUpRight size={15} />
              </button>
            </form>

            <AnimatePresence>
              {isSubmitted && (
                <motion.p 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-emerald-600 font-semibold tracking-wide mt-2 px-1 absolute"
                >
                  Subscription verified. Welcome to the workspace.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Area: Footnotes & Social Accord */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 gap-6 relative">
          
          {/* Legal Compliance and Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 order-2 md:order-1 text-center sm:text-left">
            <span className="text-xs font-normal text-neutral-400 tracking-wide">
              © {new Date().getFullYear()} SOS Infrabulls International Pvt. Ltd. All rights reserved.
            </span>
            <div className="flex gap-4 text-xs font-normal text-neutral-400 tracking-wide">
              <a href="#" className="hover:text-[#1174d6] transition-colors">Privacy Charter</a>
              <span className="text-neutral-200/80">|</span>
              <a href="#" className="hover:text-[#1174d6] transition-colors">Regulatory Terms</a>
            </div>
          </div>

          {/* Social Network Channels */}
          <div className="flex items-center gap-2.5 order-1 md:order-2">
            {[
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Facebook, label: "Facebook" }
            ].map((social, idx) => (
              <a 
                key={idx}
                href="#"
                aria-label={social.label}
                className="w-9 h-9 flex items-center justify-center border border-neutral-100 rounded-full bg-white text-neutral-400 hover:text-[#1174d6] hover:border-[#1174d6]/30 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                <social.icon size={14} strokeWidth={1.8} />
              </a>
            ))}
          </div>

          {/* Floating Back to Top Element */}
          <div className="absolute right-0 top-10 hidden xl:block">
            <motion.button
              onClick={scrollToTop}
              onMouseEnter={() => setIsHoveredBackToTop(true)}
              onMouseLeave={() => setIsHoveredBackToTop(false)}
              className="flex items-center justify-center w-12 h-12 bg-white border border-neutral-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] rounded-full text-neutral-600 hover:text-white transition-colors duration-300 relative overflow-hidden"
              aria-label="Scroll to top"
            >
              <AnimatePresence>
                {isHoveredBackToTop && (
                  <motion.div 
                    className="absolute inset-0 bg-[#1174d6]"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={luxuryTransition}
                  />
                )}
              </AnimatePresence>
              <motion.div
                animate={isHoveredBackToTop ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={luxuryTransition}
                className="relative z-10"
              >
                <ArrowUp size={18} strokeWidth={1.75} />
              </motion.div>
            </motion.button>
          </div>

        </div>

      </div>
    </footer>
  );
}