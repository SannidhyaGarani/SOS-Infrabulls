import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * ImageBreadcrumb – shared hero breadcrumb component
 * Props:
 * title       : string  — main heading   e.g. "About Us"
 * subtitle    : string  — optional tagline
 * crumbs      : array   — [{ label, href }]  last item is current page (no href needed)
 * bgImage     : string  — optional background image url (falls back to gradient)
 */
const ImageBreadcrumb = ({ title, subtitle, crumbs = [], bgImage }) => {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden z-0"
      style={{ 
        minHeight: "440px", // Increased min-height slightly to accommodate the extra top space
        marginTop: "-90px", // Pulls the component up behind a 90px header
        paddingTop: "90px"  // Pushes the text content back down so it isn't hidden under the header
      }}
    >
      {/* Background */}
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540]/90 via-[#061B2E]/80 to-[#0a3e84]/70" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-135 from-[#0A2540] via-[#0f3460] to-[#061B2E]"
          style={{ background: "linear-gradient(135deg, #0A2540 0%, #0f3460 50%, #061B2E 100%)" }}
        />
      )}

      {/* Decorative orbs */}
      <div className="absolute top-0 left-[15%] w-72 h-72 rounded-full opacity-20 blur-[80px]"
        style={{ background: "radial-gradient(circle, rgba(17,116,214,0.6) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-[10%] w-56 h-56 rounded-full opacity-15 blur-[60px]"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)" }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }} />

      <div className="relative z-10 text-center px-4 py-16 w-full max-w-4xl mx-auto mt-20">

        {/* Breadcrumb trail */}
        <nav className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-6">
          <Link to="/" className="flex items-center gap-1.5 text-[#1174d6] hover:text-blue-300 transition-colors duration-200">
            <Home size={12} />
            Home
          </Link>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={12} className="text-white/30" />
              {crumb.href ? (
                <Link to={crumb.href} className="text-white/60 hover:text-white transition-colors duration-200">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/90">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Thin accent line */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-[#1174d6]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#1174d6]" />
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-[#1174d6]" />
        </div>

        {/* Title */}
        <h1
          className="text-white font-light leading-tight mb-4"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            letterSpacing: "-0.02em"
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-white/60 text-sm md:text-base font-normal tracking-wide max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Bottom accent bar */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="w-8 h-[2px] rounded-full bg-[#1174d6]" />
          <div className="w-3 h-[2px] rounded-full bg-[#1174d6]/50" />
          <div className="w-1 h-[2px] rounded-full bg-[#1174d6]/25" />
        </div>
      </div>
    </section>
  );
};

export default ImageBreadcrumb;