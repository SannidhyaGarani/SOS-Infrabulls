import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, ArrowUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";

const FALLBACK_EVENTS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85",
    title: "Grand Launch: Prestige Skyline Tower",
    date: "March 15, 2026",
    category: "Launch Event",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=85",
    title: "Annual Real Estate Excellence Awards",
    date: "January 22, 2026",
    category: "Awards Ceremony",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85",
    title: "Exclusive Buyer's Preview Gala",
    date: "November 8, 2025",
    category: "Gala Evening",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=85",
    title: "Green Architecture Summit 2025",
    date: "September 30, 2025",
    category: "Summit",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85",
    title: "Investors' Networking Evening",
    date: "July 12, 2025",
    category: "Networking",
  },
];

const formatGalleryItem = (item, index) => {
  const img =
    (item.images && item.images[item.primaryImageIndex || 0]) ||
    item.image ||
    (item.images && item.images[0]);
  return {
    id: item.id || item.firebaseDocId || index,
    image: img || FALLBACK_EVENTS[0].image,
    title: item.title || "SOS Event",
    date: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "Recent",
    category: (item.type || "events").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
};

// Enhanced Swiper CSS Overrides to ensure pixel-perfect elegance
const swiperCSS = `
  .events-swiper .swiper { overflow: visible !important; width: 100%; }
  .events-swiper .swiper-slide { transform: scale(0.95); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0.4; }
  .events-swiper .swiper-slide-active { transform: scale(1) !important; opacity: 1 !important; }
  .events-swiper .swiper-pagination { bottom: -44px !important; display: flex; justify-content: center; gap: 6px; }
  .events-swiper .swiper-pagination-bullet { width: 30px; height: 2px; background: #e2e8f0; opacity: 1; border-radius: 0px; transition: all 0.4s ease; }
  .events-swiper .swiper-pagination-bullet-active { background: linear-gradient(to right, #2563eb, #d946ef) !important; width: 50px; }
`;

export default function EventsGallery() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "gallery"), (snap) => {
      if (snap.empty) return;
      setEvents(snap.docs.map((d, i) => formatGalleryItem({ ...d.data(), firebaseDocId: d.id }, i)));
    });
    return () => unsub();
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="w-full py-24 md:py-36 bg-white overflow-hidden relative">
      <style>{swiperCSS}</style>

      {/* Atmospheric Luxury Ambient Light Background */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50/30 via-cyan-50/10 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* 1440px Strict Layout Constraints Container */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-20 w-full relative">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 md:mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-500 shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
              <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-gray-400">
                Exclusive Legacy
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tighter leading-[1.1]">
              Moments That <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">
                Define Excellence
              </span>
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="text-gray-500 text-lg font-light leading-relaxed max-w-md tracking-wide"
          >
            From milestone architectural reveals to exclusive investor galas — each carefully curated affair establishes a new benchmark for luxury living.
          </motion.p>
        </div>

        {/* Premium Swiper Engine Mount */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="events-swiper relative z-20 pb-12"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1.1}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation={{ prevEl, nextEl }}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              1024: { slidesPerView: 2.3 },
              1280: { slidesPerView: 2.8 },
            }}
          >
            {events.map((event) => (
              <SwiperSlide key={event.id}>
                <EventCard event={event} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* High-End Minimalist Control Hub */}
        <div className="flex items-center justify-between mt-16 pt-6 border-t border-gray-100 relative z-30">
          {/* Decorative design metric indicator matching global premium design schemes */}
          <div className="text-[10px] font-bold tracking-[0.25em] text-gray-300 uppercase hidden sm:block">
            SOS Infrabulls // Live Archive
          </div>

          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <button
              ref={(node) => setPrevEl(node)}
              className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-gray-100 text-gray-700 hover:text-blue-600 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
              aria-label="Previous event slide"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              ref={(node) => setNextEl(node)}
              className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-gray-100 text-gray-700 hover:text-fuchsia-500 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
              aria-label="Next event slide"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

function EventCard({ event }) {
  return (
    <div className="relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-950 aspect-[4/5] sm:h-[460px] w-full shadow-[0_15px_40px_-15px_rgba(0,0,0,0.2)] border border-gray-900/5">
      {/* Cinematic High-Res Image Component */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Deep Shadow Vignette Layer System */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />

      {/* Top Floating Content Ribbons */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        {/* Category Label */}
        <span className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-[0.2em] text-white uppercase bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
          {event.category}
        </span>

        {/* Date Stamp Card */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/20 backdrop-blur-md border border-white/5 text-white/90">
          <Calendar size={12} className="text-cyan-400" />
          <span className="text-[11px] font-medium tracking-wide">{event.date}</span>
        </div>
      </div>

      {/* Main Bottom Text Layout Block */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10 space-y-4">
        <h3 className="text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white group-hover:to-cyan-200 transition-all duration-300">
          {event.title}
        </h3>
        
        {/* Luxury Micro-Action Transform Link */}
        <div className="flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] uppercase text-gray-300 group-hover:text-cyan-400 transition-colors duration-300 pt-2">
          <span>View Gallery</span>
          <div className="relative overflow-hidden w-4 h-4">
            <ArrowUpRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* Subtle Bottom Border Line Indicator Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />
    </div>
  );
}