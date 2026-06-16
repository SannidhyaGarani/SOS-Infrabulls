import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Play, Quote } from 'lucide-react';
import { db } from '../Firebase';
import { SectionTitle, Reveal } from './ui';

import 'swiper/css';
import 'swiper/css/pagination';
import './homepage.css';

const FALLBACK_VIDEOS = [
  { videoId: 'dtYuw2SlOtw', title: 'Client Story 1' },
  { videoId: 'Eeav-EL8zZ4', title: 'Client Story 2' },
  { videoId: 'Ycqs8-ykZwA', title: 'Client Story 3' },
];

const VideoCard = ({ videoId, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="hp-card-lift bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {!isPlaying ? (
          <>
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gray-900/20" />
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label={`Play ${title}`}
            >
              <span className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 text-blue-600 ml-0.5 fill-blue-600" />
              </span>
            </button>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="p-5 text-center border-t border-gray-50">
        <div className="w-9 h-9 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-500 flex items-center justify-center">
          <Quote className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-[10px] tracking-[0.15em] uppercase text-blue-600 font-semibold mt-1">Verified Investor</p>
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
    <section id="testimonials" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <SectionTitle
            align="center"
            eyebrow="Our Happy Faces"
            title="Stories from our"
            highlight="successful events"
            subtitle="Hear directly from the families and investors who trust SOS Infrabulls with their dreams."
          />
        </Reveal>

        <Reveal delay={100}>
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={videos.length > 1}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="pb-14"
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id || video.videoId}>
                <VideoCard videoId={video.videoId} title={video.title || 'Our Happy Faces'} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonial;
