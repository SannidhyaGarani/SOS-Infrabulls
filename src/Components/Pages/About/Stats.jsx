import React from "react";

const stats = [
  { value: "2019", label: "Est. Year", icon: "📅" },
  { value: "3,200+", label: "Families Served", icon: "🏡" },
  { value: "50+", label: "Projects", icon: "🏗️" },
  { value: "₹10M+", label: "Portfolio Value", icon: "📈" },
];

const Stats = () => (
  <section className="bg-gradient-to-br from-[#0A2540] to-[#061B2E] py-16">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="text-center group">
            <div className="text-3xl mb-3">{s.icon}</div>
            <div
              className="text-3xl md:text-4xl font-bold text-white mb-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {s.value}
            </div>
            <div className="text-[#1174d6] text-xs font-bold tracking-widest uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;