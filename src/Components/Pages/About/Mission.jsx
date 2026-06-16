import React from "react";

const MissionVision = () => (
  <section className="py-16 bg-white border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      <div className="text-center mb-12">
        <p className="text-[#1174d6] text-xs font-bold tracking-widest uppercase mb-3">Our Purpose</p>
        <h2
          className="text-slate-900 font-light"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
        >
          Mission &amp; <strong className="font-bold">Vision</strong>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0f3460] p-8 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
            style={{ background: "radial-gradient(circle, #1174d6 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
          />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#1174d6]/20 border border-[#1174d6]/30 flex items-center justify-center mb-6 text-2xl">🎯</div>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Our Mission</h3>
            <p className="text-white/70 leading-relaxed text-sm">
              To empower middle-class families and investors with transparent, secure, and high-value real estate opportunities — helping every family build their dream home and create lasting wealth for future generations.
            </p>
          </div>
        </div>
        {/* Vision */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1174d6] to-[#0a5ab8] p-8 text-white">
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15 blur-2xl"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
          />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center mb-6 text-2xl">🌟</div>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Our Vision</h3>
            <p className="text-white/80 leading-relaxed text-sm">
              To become India's most trusted real estate group by delivering transformative value through innovation, integrity, and an unwavering commitment to our clients' prosperity and the nation's urban growth.
            </p>
          </div>
        </div>
      </div>

      {/* Vision image */}
      <div className="mt-10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <img
          src="./images/Vision.jpg"
          alt="Vision"
          className="w-full object-cover"
          style={{ maxHeight: 400 }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    </div>
  </section>
);

export default MissionVision;
