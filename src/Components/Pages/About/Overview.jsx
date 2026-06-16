import React from "react";
import { Link } from "react-router-dom";

const pillars = [
  {
    icon: "🏛️",
    title: "Backed by Giants",
    desc: "Nurtured by SOS Infrabulls International Pvt. Ltd., a legacy of trust since 2019.",
  },
  {
    icon: "📍",
    title: "Strategic Hub",
    desc: "Exclusive properties in Indore — Madhya Pradesh's economic capital and India's cleanest city.",
  },
  {
    icon: "💼",
    title: "Complete Portfolio",
    desc: "Expert solutions spanning Residential, Commercial, and Industrial land investments.",
  },
  {
    icon: "🛡️",
    title: "Secure Future",
    desc: "Safe investments and high-value resale opportunities backed by market expertise.",
  },
];

const Overview = () => (
  <>
    {/* About Text Section */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <p className="text-[#1174d6] text-xs font-bold tracking-widest uppercase mb-4">
              Welcome To Mahanta Group
            </p>
            <h2
              className="text-slate-900 font-light leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
            >
              Built on the trusted legacy of{" "}
              <strong className="font-bold text-[#1174d6]">SOS Infrabulls</strong>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4 text-[15px]">
              Mahanta Group, built and nurtured by SOS Infrabulls International Pvt. Ltd., was established on 02 June 2019. With a strong foundation in Residential, Commercial and Industrial land, the Group provides secure investment and resale opportunities in India's cleanest city and Madhya Pradesh's economic capital — Indore.
            </p>
            <p className="text-slate-500 leading-relaxed text-[15px] mb-8">
              Carrying forward the trusted legacy of SOS Infrabulls, Mahanta Group now works with an even stronger commitment towards trust, transparency and growth.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1174d6] text-white text-sm font-bold shadow-[0_8px_24px_rgba(17,116,214,0.35)] hover:bg-[#0a5ab8] hover:-translate-y-0.5 transition-all duration-200"
              >
                Talk to Our Team
              </Link>
              <Link
                to="/projects/completed"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1174d6] text-[#1174d6] text-sm font-bold hover:bg-[#1174d6]/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Portfolio
              </Link>
            </div>
          </div>

          {/* Right card */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-[#1174d6]/20 rounded-2xl" />
            <div className="relative bg-gradient-to-br from-white to-blue-50/50 border border-[#1174d6]/15 rounded-2xl p-8 shadow-[0_20px_60px_rgba(17,116,214,0.08)]">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#1174d6] text-white text-xs font-bold tracking-wide mb-4">
                Indore First
              </span>
              <h3 className="text-slate-800 text-lg font-bold mb-4">
                Exclusive projects across the city's fastest growing corridors.
              </h3>
              <ul className="space-y-3">
                {pillars.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-500 text-sm">
                    <span className="text-base mt-0.5">{p.icon}</span>
                    <span><strong className="text-slate-700">{p.title}:</strong> {p.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Why Choose Grid */}
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-[#1174d6] text-xs font-bold tracking-widest uppercase mb-3">Why Choose Mahanta Group</p>
          <h2
            className="text-slate-900 font-light"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
          >
            Secure investments, <strong className="font-bold">guided by experts.</strong>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(17,116,214,0.1)] transition-all duration-300 group"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-slate-800 font-bold text-[15px] mb-2 group-hover:text-[#1174d6] transition-colors">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Overview;