import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import ImageBreadcrumb from '../ImageBreadcrumb';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TeamMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, 'team');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rec = snap.docs.map((d) => ({ firebaseDocId: d.id, ...d.data() }));
      const sorted = rec.sort((a, b) => {
        const idA = a.id?.toString() || '';
        const idB = b.id?.toString() || '';
        const numA = parseFloat(idA);
        const numB = parseFloat(idB);
        return (!isNaN(numA) && !isNaN(numB)) ? numA - numB : idA.localeCompare(idB);
      });
      setMembers(sorted);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <ImageBreadcrumb
        title="Team Members"
        subtitle="The visionaries behind Mahanta Group's transformative real estate journey."
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Team Members' }]}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-[#1174d6] text-xs font-bold tracking-widest uppercase mb-3">Meet the Visionaries</p>
            <h2
              className="text-slate-900 font-light"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
            >
              Our <strong className="font-bold">Core Team</strong>
            </h2>
          </div>

          <style>{`
            .team-swiper .swiper-pagination-bullet {
              background: #0A2540;
              opacity: 0.15;
            }
            .team-swiper .swiper-pagination-bullet-active {
              width: 32px !important;
              border-radius: 4px !important;
              background: linear-gradient(to right, #2563eb, #d946ef) !important;
              opacity: 1;
            }
            .team-swiper { padding-bottom: 70px !important; }
          `}</style>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              576: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="team-swiper"
          >
            {loading
              ? [1, 2, 3, 4].map((i) => (
                <SwiperSlide key={i}>
                  <div className="aspect-[4/5.5] bg-slate-100 rounded-2xl animate-pulse" />
                </SwiperSlide>
              ))
              : members.map((m) => (
                <SwiperSlide key={m.firebaseDocId}>
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5.5] group cursor-pointer shadow-md hover:-translate-y-1 transition-transform duration-500">
                    <img
                      src={m.image || 'https://via.placeholder.com/400x550'}
                      alt={m.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/85 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400" />
                    {/* Info card */}
                    <div className="absolute bottom-4 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 text-center translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                      <h3 className="text-slate-900 font-bold text-sm">{m.name}</h3>
                      <p className="text-[#1174d6] text-xs font-semibold mt-0.5 tracking-wide">{m.role?.toLowerCase()}</p>
                    </div>
                    {/* Always visible name at bottom */}
                    <div className="absolute bottom-4 left-0 right-0 text-center group-hover:opacity-0 transition-opacity duration-200">
                      <p className="text-white font-bold text-sm drop-shadow-lg">{m.name}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default TeamMembersPage;