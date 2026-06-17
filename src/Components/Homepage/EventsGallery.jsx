import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, ArrowUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../Firebase";
import { SectionTitle, Reveal } from "./ui";

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
  .events-swiper .swiper-slide { transform: scale(0.92); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0.5; filter: grayscale(20%); }
  .events-swiper .swiper-slide-active { transform: scale(1) !important; opacity: 1 !important; filter: grayscale(0%); }
  .events-swiper .swiper-pagination { bottom: -54px !important; display: flex; justify-content: center; gap: 8px; }
  .events-swiper .swiper-pagination-bullet { width: 32px; height: 3px; background: #cbd5e1; opacity: 0.6; border-radius: 4px; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
  .events-swiper .swiper-pagination-bullet-active { background: linear-gradient(to right, #2563eb, #d946ef) !important; width: 64px; opacity: 1; }
`;

export default function EventsGallery() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  useEffect(() => {
    const galleryQuery = query(
      collection(db, "gallery"),
      orderBy("createdAt", "desc"),
      limit(8)
    );

    const unsub = onSnapshot(galleryQuery, (snap) => {
      if (snap.empty) return;
      setEvents(snap.docs.map((d, i) => formatGalleryItem({ ...d.data(), firebaseDocId: d.id }, i)));
    });
    return () => unsub();
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="w-full py-8 md:py-12 bg-white overflow-hidden relative">
      <style>{swiperCSS}</style>

      {/* Atmospheric Luxury Ambient Light Background */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50/40 via-cyan-50/20 to-fuchsia-50/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

      {/* 1440px Strict Layout Constraints Container */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 w-full relative">
        
        {/* Editorial Section Header (Preserved as Requested) */}
        <Reveal className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <SectionTitle
            align="center"
            eyebrow="Exclusive Legacy"
            title="Moments That"
            highlight="Define Excellence"
            subtitle="From milestone architectural reveals to exclusive investor galas — each carefully curated affair establishes a new benchmark for luxury living."
          />
        </Reveal>

        {/* Premium Swiper Engine Mount */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="events-swiper relative z-20 pb-16"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1.1}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation={{ prevEl, nextEl }}
            breakpoints={{
              640: { slidesPerView: 1.8, spaceBetween: 32 },
              1024: { slidesPerView: 2.5, spaceBetween: 40 },
              1280: { slidesPerView: 3.2, spaceBetween: 48 },
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
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100 relative z-30">
          <div className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase hidden sm:flex items-center gap-4">
            <span>SOS Infrabulls</span>
            <div className="w-12 h-[1px] bg-gray-200" />
            <span>Live Archive</span>
          </div>

          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <button
              ref={(node) => setPrevEl(node)}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-600 hover:text-blue-600 shadow-[0_8px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500"
              aria-label="Previous event slide"
            >
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>
            <button
              ref={(node) => setNextEl(node)}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-600 hover:text-fuchsia-500 shadow-[0_8px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500"
              aria-label="Next event slide"
            >
              <ChevronRight size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

function EventCard({ event }) {
  return (
    <div className="group relative w-full h-[380px] sm:h-[480px] rounded-[2rem] overflow-hidden cursor-pointer bg-gray-950 isolate shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] transition-shadow duration-700">
      
      {/* Cinematic High-Res Image with Slow Parallax Scale */}
      <div className="absolute inset-0 z-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover opacity-90 transition-all duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110 group-hover:opacity-100"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Editorial Gradient Overlays */}
      {/* Base Dark Gradient for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent opacity-90 z-10" />
      {/* Top Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-transparent to-transparent opacity-60 z-10" />
      {/* Ambient Hover Color Cast */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-fuchsia-900/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

      {/* Premium Glass Inner Border Frame */}
      <div className="absolute inset-0 rounded-[2rem] border border-white/10 group-hover:border-white/25 transition-colors duration-700 pointer-events-none z-30" />

      {/* Floating Top Elements */}
      <div className="absolute top-6 left-6 right-6 flex flex-wrap items-start justify-between gap-3 z-20">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-white uppercase relative z-10">
            {event.category}
          </span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 shadow-xl group-hover:bg-black/50 transition-colors duration-500">
          <Calendar size={14} className="text-cyan-400 group-hover:text-fuchsia-400 transition-colors duration-500" />
          <span className="text-[11px] font-semibold tracking-wider">{event.date}</span>
        </div>
      </div>

      {/* Main Content Hub (Bottom-aligned) */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-20 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
        
        {/* Title */}
        <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-[1.15] mb-5 line-clamp-2">
          {event.title}
        </h3>
        
        {/* Expanding Elegant Divider Line */}
        <div className="h-[1px] w-12 bg-white/30 mb-5 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:via-cyan-400 group-hover:to-transparent transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1)" />
        
        {/* Interactive Action Link */}
        <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 group-hover:text-white transition-colors duration-300">
          <span>View Full Gallery</span>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white group-hover:text-gray-950 group-hover:scale-110 transition-all duration-500 shadow-lg">
            <ArrowUpRight size={16} className="transform transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

      </div>
    </div>
  );
}