import React from 'react';
import { ShieldCheck, LineChart, Handshake, ArrowUpRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { SectionTitle, Reveal } from './ui';

import 'swiper/css';
import 'swiper/css/pagination';

const pillars = [
    {
        number: '01',
        icon: ShieldCheck,
        title: 'Security',
        description: "At SOS, we understand that buying property is a monumental step. We prioritize your peace of mind by executing rigorous, exhaustive inspections and providing crystal-clear, transparent financial reporting so your assets remain fully protected.",
    },
    {
        number: '02',
        icon: LineChart,
        title: 'Opportunity',
        description: "We are passionate about unlocking sustainable growth. Whether your objective points toward long-term passive rental yield or high-velocity short-term returns, we build bespoke strategies designed to maximize your investment performance.",
    },
    {
        number: '03',
        icon: Handshake,
        title: 'Sincerity',
        description: "Trust is our absolute baseline. We work alongside you with uncompromising clarity, mapping both rewards and market risks with clarity. With SOS, you have a partner dedicated solely to acting in your absolute best interest.",
    },
];

const PillarCard = ({ number, icon: Icon, title, description }) => (
    <div className="group relative flex flex-col justify-between p-8 md:p-10 rounded-[2rem] bg-white border border-gray-100/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.06)] hover:border-blue-500/20 transition-all duration-500 hover:-translate-y-1.5 h-[390px] isolate overflow-hidden">
        
        {/* Subtle, Sophisticated Background Luminous Radial Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-gradient-to-br from-blue-50 to-fuchsia-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        <div>
            {/* Top Row: Luxury Minimal Branding Elements */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-gray-300 uppercase">
                        Pillar
                    </span>
                    <span className="text-xl font-extrabold text-blue-600/20 group-hover:text-blue-600/40 transition-colors duration-500">
                        {number}
                    </span>
                </div>
                
                {/* Luminous Light-Theme Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100/60 flex items-center justify-center text-gray-700 transition-all duration-500 group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-fuchsia-500 group-hover:text-white group-hover:shadow-[0_12px_24px_rgba(37,99,235,0.18)] group-hover:scale-105">
                    <Icon className="w-6 h-6 stroke-[1.35]" />
                </div>
            </div>

            {/* Typography Core Block */}
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-4 transition-colors duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-fuchsia-600 group-hover:bg-clip-text">
                {title}
            </h3>
            
            {/* Clamped for precise vertical structural symmetry across elements */}
            <p className="text-gray-500 text-sm md:text-[15px] font-normal leading-relaxed tracking-wide line-clamp-5">
                {description}
            </p>
        </div>

        {/* Clean, Understated Light-Theme Bottom Anchor Line */}
        <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                Core Value
            </span>
            <div className="h-[1px] flex-grow bg-gray-100/70" />
            <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-blue-600 transition-colors duration-500">
                <span className="text-[11px] font-bold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                    Discover
                </span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
        </div>
    </div>
);

const Pillars = () => (
    <section className="w-full py-8 md:py-10 bg-white overflow-hidden relative">
        {/* Soft, ultra-faded ambient backdrop lines */}
        <div className="absolute top-1/4 left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-50/20 via-fuchsia-50/10 to-transparent rounded-full blur-[140px] pointer-events-none -translate-x-1/2" />

        {/* Strict 1440px Workspace Boundaries */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 w-full relative z-10">
            
            {/* Header Content Engine */}
            <div className="max-w-3xl mb-16 md:mb-20">
                <Reveal delay={50}>
                    <SectionTitle
                        eyebrow="The SOS Foundation"
                        title="Built on principles of"
                        highlight="enduring value"
                        subtitle="Our core pillars define everything we do, ensuring each investment becomes a lasting legacy for generations to come."
                    />
                </Reveal>
            </div>

            {/* Slider Interface Integration */}
            <Reveal delay={150}>
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={32}
                    slidesPerView={1}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    breakpoints={{
                        640: { slidesPerView: 1.2, spaceBetween: 24 },
                        768: { slidesPerView: 2, spaceBetween: 32 },
                        1024: { slidesPerView: 3, spaceBetween: 32 },
                    }}
                    className="pillars-swiper !pb-16 !px-2"
                >
                    {pillars.map((pillar) => (
                        <SwiperSlide key={pillar.title} className="h-auto py-2">
                            <PillarCard {...pillar} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Reveal>
        </div>

        {/* Minimalist Light Bullet Active Custom States */}
        <style>{`
            .pillars-swiper .swiper-pagination {
                bottom: 0px !important;
            }
            .pillars-swiper .swiper-pagination-bullet-active {
                background: linear-gradient(to right, #2563eb, #d946ef) !important;
                width: 32px !important;
                border-radius: 4px !important;
                opacity: 1 !important;
            }
            .pillars-swiper .swiper-pagination-bullet {
                background: #94a3b8;
                opacity: 0.4;
                height: 4px;
                transition: all 0.4s ease;
            }
        `}</style>
    </section>
);

export default Pillars;