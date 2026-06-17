import React from "react";
import { Link } from "react-router-dom";
import ImageBreadcrumb from '../ImageBreadcrumb';

const directors = [
  {
    name: "Mr. Pawan Tilve",
    role: "Founder & Managing Director",
    badge: "Founder & MD",
    image: "images/img/01 (1).png",
    quotes: [
      "Leading with purpose and precision, Mr. Pawan Tilve brings transformative vision to Mahanta Group. His leadership is rooted in deep industry expertise and an unwavering commitment to excellence.",
      "\"एक नए कल की शुरुआत, हमारी प्राथमिकता मध्यवर्गीय परिवार की मेहनत से एकत्र की गई जमापूँजी को एक सही जगह निवेश कराना है, ताकि वह अपने सपनों का आशियाना वहाँ बना पाएं...\"",
      "Under his guidance, Mahanta Group has redefined real estate standards, focusing on sustainable growth, innovative solutions, and creating lasting value for stakeholders.",
    ],
    reverse: false,
  },
  {
    name: "Mr. Vikas Garg",
    role: "Chief Managing Director",
    badge: "CMD",
    image: "images/img/01 (2).png",
    quotes: [
      "With strategic foresight and decades of experience, Mr. Vikas Garg shapes the future of real estate development. His philosophy centers on trust, transparency, and creating spaces that inspire.",
      "\"सर्वप्रथम हम आपको धन्यवाद देते हैं कि आपने हमसे संपर्क किया और हमारे बारे में जानने के लिए उत्सुक हैं। हम कौन हैं? हम भी बिल्कुल आप ही की तरह हैं...\"",
      "\"आप और मैं तभी तो कहलायेंगे 'हम'\"",
    ],
    reverse: true,
  },
];

const Director = () => (
  <div className="min-h-screen bg-white">
    <ImageBreadcrumb
      title="About Director"
      subtitle="Guiding Mahanta Group with wisdom, integrity, and forward-thinking vision."
      crumbs={[{ label: 'About', href: '/about' }, { label: 'About Director' }]}
    />

    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-24">
        {directors.map((d, idx) => (
          <div
            key={idx}
            className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${d.reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
          >
            {/* Text content */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#1174d6]/10 text-[#1174d6] text-xs font-bold tracking-widest uppercase mb-5">
                {d.badge}
              </span>
              <h2
                className="text-slate-900 font-light mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 3rem)" }}
              >
                {d.name}
              </h2>
              <div className="text-[#1174d6] font-semibold text-sm tracking-wide uppercase mb-2 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#1174d6] inline-block" />
                {d.role}
              </div>
              <div className="mt-6 space-y-4">
                {d.quotes.map((q, qi) => (
                  qi === 1
                    ? (
                      <blockquote key={qi} className="relative pl-5 border-l-[3px] border-[#1174d6] bg-blue-50/50 rounded-r-xl p-4 italic text-slate-600 text-sm leading-relaxed">
                        {q}
                      </blockquote>
                    )
                    : (
                      <p key={qi} className="text-slate-500 leading-relaxed text-[15px]">{q}</p>
                    )
                ))}
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white text-xs font-bold tracking-[0.18em] uppercase rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Connect with Us <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Photo */}
            <div className="relative">
              <div className="absolute -top-5 -right-5 w-full h-full rounded-2xl border-2 border-[#1174d6]/20 rounded-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(10,37,64,0.15)]">
                <span className="absolute top-5 right-5 z-10 px-3 py-1.5 bg-[#1174d6] text-white text-xs font-bold rounded-full shadow-lg">
                  {d.badge}
                </span>
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full object-cover object-top"
                  style={{ maxHeight: 600 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Director;