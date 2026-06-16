import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Globe
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

  const quickLinks = [
    { name: "Bespoke Services", href: "#" },
    { name: "Private Advisory", href: "#" },
    { name: "Global Investment", href: "#" },
    { name: "Corporate Governance", href: "#" },
    { name: "Sustainability Charter", href: "#" },
    { name: "Careers Elite", href: "#" },
  ];

  const projectPortfolio = [
    { name: "The Luminary Towers", location: "Downtown" },
    { name: "Aurelia Oceanfront Mansions", location: "Coastal" },
    { name: "Vivant Business District", location: "Metropolis" },
    { name: "The Grand Plaza Penthouse", location: "Skyline" },
    { name: "Elysian Reserve Estates", location: "Sanctuary" },
  ];

  // Premium Custom Transition
  const luxuryTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

  return (
    <footer className="relative bg-white text-neutral-900 border-t border-neutral-100 overflow-hidden font-sans">
      {/* Subtle Architectural Gradient Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-neutral-50 to-blue-50/30 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-10 w-[600px] h-[600px] bg-gradient-to-tl from-slate-50 to-neutral-50 rounded-full blur-3xl translate-y-1/3" />
      </div>

      {/* Main Structural Layout */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-12">
        
        {/* Top Section: Corporate Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 pb-20 border-b border-neutral-100">
          
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-3 flex flex-col items-start space-y-6">
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-[0.25em] text-neutral-900 uppercase">
                SOS<span className="text-[#1174d6]">Infrabulls</span>
              </span>
              <span className="text-[9px] font-semibold tracking-[0.4em] text-neutral-400 uppercase mt-1">
                International Pvt. Ltd.
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500 font-light max-w-sm">
              Established in 2019, SOS Infrabulls International Pvt. Ltd. is dedicated to helping you find your dream property across Residential, Commercial, and Industrial sectors.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium tracking-wider text-neutral-400 uppercase flex items-center gap-1">
                <Globe size={12} className="text-neutral-300" /> Global Headquarters Active
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 lg:pl-4">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-6">
              Navigation
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="group flex items-center text-sm text-neutral-600 hover:text-[#1174d6] font-light transition-colors duration-300"
                  >
                    <span className="relative overflow-hidden">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#1174d6] transition-all duration-300 group-hover:w-full" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Premium Portfolio Projects */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-6">
              Signature Holdings
            </h4>
            <ul className="space-y-4">
              {projectPortfolio.map((project, idx) => (
                <li key={idx} className="group cursor-pointer">
                  <div className="flex items-center justify-between text-sm text-neutral-800 group-hover:text-[#1174d6] transition-colors duration-300">
                    <span className="font-normal truncate pr-2">{project.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] tracking-wider text-neutral-400 font-light uppercase bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-sm">
                        {project.location}
                      </span>
                      <ArrowUpRight size={12} className="text-neutral-300 group-hover:text-[#1174d6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Private Desk Contact Details */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-6">
              Private Concierge
            </h4>
            <ul className="space-y-4 text-sm font-light text-neutral-600">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#1174d6] mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  750 Fifth Avenue,<br />
                  Penthouse Suite 10A,<br />
                  New York, NY 10019
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={16} className="text-[#1174d6] shrink-0" />
                <a href="tel:+18005559000" className="group-hover:text-[#1174d6] transition-colors duration-300">
                  +1 (800) 555-9000
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={16} className="text-[#1174d6] shrink-0" />
                <a href="mailto:concierge@aureliaestates.com" className="group-hover:text-[#1174d6] transition-colors duration-300 truncate">
                  vip@aurelia.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Intelligence & Newsletter Subscription */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-2">
              Market Intelligence
            </h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Access exclusive, off-market real estate insights and quarterly global macroeconomic briefings.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter elite private email" 
                className="w-full bg-neutral-50 border border-neutral-200/80 rounded-none px-4 py-3 text-xs font-light text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#1174d6] focus:bg-white transition-all duration-300 pr-12 shadow-sm"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full px-4 flex items-center justify-center bg-[#1174d6] text-white hover:bg-[#0f67be] transition-colors duration-300"
                aria-label="Subscribe"
              >
                <ArrowUpRight size={16} />
              </button>
            </form>

            <AnimatePresence>
              {isSubmitted && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-emerald-600 font-medium tracking-wide mt-1"
                >
                  Subscription verified. Welcome to the circle.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom Section: Compliance, Socials, and Back to Top */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 gap-6 relative">
          
          {/* Legal Compliance and Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 order-2 md:order-1 text-center sm:text-left">
            <span className="text-xs font-light text-neutral-400 tracking-wide">
              © {new Date().getFullYear()} SOS Infrabulls International Pvt. Ltd. All rights reserved.
            </span>
            <div className="flex gap-4 text-xs font-light text-neutral-400 tracking-wide">
              <a href="#" className="hover:text-[#1174d6] transition-colors">Privacy Charter</a>
              <span className="text-neutral-200">|</span>
              <a href="#" className="hover:text-[#1174d6] transition-colors">Terms of Luxury Accord</a>
            </div>
          </div>

          {/* Social Architecture */}
          <div className="flex items-center gap-3 order-1 md:order-2">
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
                className="w-9 h-9 flex items-center justify-center border border-neutral-100 rounded-full bg-white text-neutral-500 hover:text-[#1174d6] hover:border-[#1174d6]/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <social.icon size={15} strokeWidth={1.8} />
              </a>
            ))}
          </div>

          {/* Back to Top Component */}
          <div className="absolute right-0 top-0 -translate-y-1/2 hidden xl:block">
            <motion.button
              onClick={scrollToTop}
              onMouseEnter={() => setIsHoveredBackToTop(true)}
              onMouseLeave={() => setIsHoveredBackToTop(false)}
              className="flex items-center justify-center w-14 h-14 bg-white border border-neutral-100 shadow-xl rounded-full text-neutral-700 hover:text-white transition-colors duration-300 relative overflow-hidden"
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
                animate={isHoveredBackToTop ? { y: -3, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={luxuryTransition}
                className="relative z-10"
              >
                <ArrowUp size={20} strokeWidth={1.5} />
              </motion.div>
            </motion.button>
          </div>

        </div>

      </div>
    </footer>
  );
}