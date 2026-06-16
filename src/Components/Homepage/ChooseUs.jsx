import React from 'react';
import { ShieldCheck, LineChart, Handshake } from 'lucide-react';
import { SectionTitle, Reveal, DividerGradient } from './ui';

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

const Pillars = () => (
    <section className="w-full py-24 md:py-36 bg-gray-50/50 overflow-hidden relative border-t border-gray-100">
        {/* Fine-line geometric detail for a high-end architectural feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200/40 hidden lg:block pointer-events-none" />
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-blue-50/20 via-transparent to-fuchsia-50/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1440px Max Width Layout Wrapper */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-20 w-full relative">
            
            {/* Header Area */}
            <div className="max-w-3xl mb-16 md:mb-24">
                <Reveal delay={50} className="space-y-4">
                    <SectionTitle
                        eyebrow="The SOS Foundation"
                        title="Built on principles of"
                        highlight="enduring value"
                    />
                    <div className="w-24">
                        <DividerGradient />
                    </div>
                </Reveal>
            </div>

            {/* Premium 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 relative z-10">
                {pillars.map(({ number, icon: Icon, title, description }, index) => (
                    <Reveal 
                        key={title} 
                        delay={100 * (index + 1)}
                        className="group relative flex flex-col justify-between p-8 xl:p-10 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
                    >
                        {/* Interactive gradient edge line on hover */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div>
                            {/* Card Top: Number Indicator & Luxury Icon Treatment */}
                            <div className="flex items-center justify-between mb-10">
                                <span className="text-[11px] font-bold tracking-[0.25em] text-gray-300 group-hover:text-blue-600/80 transition-colors duration-500 uppercase">
                                    Pillar // {number}
                                </span>
                                
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-fuchsia-500 group-hover:text-white group-hover:shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)]">
                                    <Icon className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
                                </div>
                            </div>

                            {/* Card Content */}
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-fuchsia-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 inline-block">
                                {title}
                            </h3>
                            
                            <p className="text-gray-500 text-[15px] font-light leading-relaxed tracking-wide">
                                {description}
                            </p>
                        </div>

                        {/* Minimalist lower indicator arrow */}
                        <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-end opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mr-2">Learn More</span>
                            <svg className="w-4 h-4 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </Reveal>
                ))}
            </div>

        </div>
    </section>
);

export default Pillars;