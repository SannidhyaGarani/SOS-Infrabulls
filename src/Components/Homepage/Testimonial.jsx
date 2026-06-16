import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Play, Quote } from 'lucide-react';
import { db } from '../Firebase';
import { SectionTitle, Reveal } from './ui';

import 'swiper/css';
import 'swiper/css/pagination';

const FALLBACK_VIDEOS = [
  { videoId: 'dtYuw2SlOtw', title: 'Client Story 1' },
  { videoId: 'Eeav-EL8zZ4', title: 'Client Story 2' },
  { videoId: 'Ycqs8-ykZwA', title: 'Client Story 3' },
];

const VideoCard = ({ videoId, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="group relative bg-white border border-gray-100/80 rounded-[2rem] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)] transition-all duration-700 h-full flex flex-col justify-between isolate">
      
      {/* Visual / Video Container Frame */}
      <div className="relative aspect-[4/3] bg-gray-950 overflow-hidden rounded-t-[2rem] z-0">
        {!isPlaying ? (
          <>
            {/* Cinematic Thumbnail Imagery */}
            <img 
              src={thumbnail} 
              alt={title} 
              className="w-full h-full object-cover opacity-90 transition-transform duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105 group-hover:opacity-100" 
              loading="lazy" 
              decoding="async" 
            />
            {/* Soft Editorial Shadow Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-black/20" />
            
            {/* Luxury Trigger Play Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center focus:outline-none"
              aria-label={`Play ${title}`}
            >
              <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:bg-gray-900 z-10">
                {/* Micro Ripple Pulse Circle */}
                <div className="absolute -inset-2 rounded-full border border-white/30 animate-ping opacity-0 group-hover:opacity-100 duration-1000 pointer-events-none" />
                
                <Play className="w-5 h-5 text-blue-600 ml-1 fill-blue-600 transition-colors duration-500 group-hover:text-white group-hover:fill-white" />
              </div>
            </button>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            className="absolute inset-0 w-full h-full border-0 z-20"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Narrative & Branding Container */}
      <div className="relative p-6 md:p-8 flex flex-col items-center text-center flex-grow bg-white z-10">
        {/* Editorial Typography Area */}
        <div className="space-y-2 flex-grow">
          <h4 className="text-lg font-bold text-gray-900 tracking-tight leading-snug px-2 transition-colors duration-300 group-hover:text-blue-600">
            {title}
          </h4>
          <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gray-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            Verified Investor
          </p>
        </div>

        {/* Premium Laser Progression Accent Line */}
        <div className="w-12 h-[2px] bg-gray-100 mt-6 relative overflow-hidden rounded-full transition-all duration-700 group-hover:w-24">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-fuchsia-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1)" />
        </div>
      </div>
    </div>
  );
};

const Testimonial = () => {
  const [videos, setVideos] = useState(FALLBACK_VIDEOS);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'testimonials'), (snap) => {
      if (snap.empty) return;
      setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <section id="testimonials" className="py-12 md:py-20 bg-white overflow-hidden relative w-full">
      
      {/* Ambient Radial Luxury Glow Elements */}
      <div className="absolute top-1/4 right-10 w-[600px] h-[600px] bg-gradient-to-tr from-fuchsia-50/30 via-blue-50/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-gradient-to-br from-cyan-50/20 via-blue-50/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* 1440px Strict Layout Constraints Wrapper */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10 w-full">
        
        {/* Preserved Section Title Element */}
        <Reveal className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <SectionTitle
            align="center"
            eyebrow="Our Happy Faces"
            title="Stories from our"
            highlight="successful events"
            subtitle="Hear directly from the families and investors who trust SOS Infrabulls with their dreams."
          />
        </Reveal>

        {/* Premium Swiper Implementation Frame */}
        <Reveal delay={100}>
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={videos.length > 1}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 24 },
              768: { slidesPerView: 2, spaceBetween: 32 },
              1200: { slidesPerView: 3, spaceBetween: 32 },
            }}
            className="testimonial-swiper !pb-20 !px-4"
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id || video.videoId} className="h-auto py-4">
                <VideoCard videoId={video.videoId} title={video.title || 'Our Happy Faces'} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      </div>

      {/* Custom Swiper Component Overrides */}
      <style>{`
        .testimonial-swiper .swiper-pagination {
          bottom: 10px !important;
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(to right, #2563eb, #d946ef) !important;
          width: 36px !important;
          border-radius: 6px !important;
          opacity: 1 !important;
        }
        .testimonial-swiper .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 0.7;
          height: 4px;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </section>
  );
};

export default Testimonial;