import React from 'react';
import { Building2, TrendingUp, Shield, Award } from 'lucide-react';
import { SectionTitle, Reveal, BtnPrimary, DividerGradient } from './ui';

const highlights = [
    { icon: Building2, label: 'Residential & Commercial' },
    { icon: TrendingUp, label: 'Investment & Resale' },
    { icon: Shield, label: 'Industrial Land' },
    { icon: Award, label: 'Established 2019' },
];

const Welcome = () => (
    <section className="w-full py-24 md:py-36 bg-white overflow-hidden relative">
        {/* Elegant Ambient Glow Backgrounds */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-50/40 via-fuchsia-50/20 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-50/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        {/* 1440px Max Width Layout Wrapper */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-20 w-full relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 xl:gap-24 items-center">
                
                {/* Left Side: Luxury Asymmetric Image Layout */}
                <Reveal className="lg:col-span-5 relative group">
                    {/* Behind-image decorative frame accent */}
                    <div className="absolute inset-0 border border-gray-900/5 rounded-2xl translate-x-4 translate-y-4 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2" />
                    
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] bg-gray-50">
                        <img
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            alt="SOS Infrabulls Premium Architecture"
                            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/30 via-transparent to-transparent" />
                    </div>

                    {/* Floating Luxury Year Badge */}
                    <div className="absolute -bottom-6 -right-4 md:-right-6 bg-white/95 backdrop-blur-md rounded-2xl px-8 py-5 border border-gray-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:-translate-y-1">
                        <p className="text-4xl font-extrabold tracking-tighter leading-none">
                            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">2019</span>
                        </p>
                        <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 font-bold mt-2">Year Founded</p>
                    </div>
                </Reveal>

                {/* Right Side: Editorial Content Area */}
                <div className="lg:col-span-7 space-y-10">
                    <Reveal delay={80} className="space-y-4">
                        <SectionTitle
                            eyebrow="Welcome to SOS"
                            title="Your trusted partner in"
                            highlight="premium real estate"
                        />
                        <div className="w-24">
                            <DividerGradient />
                        </div>
                    </Reveal>

                    <Reveal delay={160} className="space-y-6 text-gray-500 text-lg font-light leading-relaxed tracking-wide max-w-3xl">
                        <p>
                            Welcome to <strong className="text-gray-900 font-semibold">SOS Infrabulls International Pvt. Ltd.</strong> Established in 2019, our company is dedicated to helping you discover your dream property. Our primary focus spans across elite Residential, Commercial, and Industrial land layouts, offering both premier investments and high-yield resale options tailored to your long-term goals.
                        </p>
                        <p>
                            We invite you to explore our carefully curated portfolio and experience a higher tier of property management. With our deep industry expertise and continuous guidance, we are confident you will find the perfect asset built around your unique aspirations.
                        </p>
                        
                        {/* High-End Clean Signature Accent */}
                        <div className="relative pl-6 border-l-2 border-gradient-to-b from-blue-600 to-fuchsia-500 py-1">
                            <p className="text-gray-900 font-medium text-base tracking-normal">
                                Thank you for choosing SOS Infrabulls International as your trusted partner in real estate excellence.
                            </p>
                        </div>
                    </Reveal>

                    {/* Premium Feature Grid */}
                    <Reveal delay={240} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                        {highlights.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="group/card flex items-center gap-4 px-5 py-4 rounded-xl bg-white border border-gray-100 hover:border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover/card:bg-gradient-to-br group-hover/card:from-blue-50 group-hover/card:to-fuchsia-50/50 flex items-center justify-center text-gray-700 group-hover/card:text-blue-600 shrink-0 transition-colors duration-300 border border-gray-100/50">
                                    <Icon className="w-4 h-4 transition-transform duration-500 group-hover/card:rotate-[360deg]" />
                                </div>
                                <span className="text-sm font-semibold text-gray-800 tracking-wide group-hover/card:text-gray-900 transition-colors">{label}</span>
                            </div>
                        ))}
                    </Reveal>

                    {/* Action Button */}
                    <Reveal delay={320} className="pt-2">
                        <BtnPrimary to="/about">Discover Our Story</BtnPrimary>
                    </Reveal>
                </div>

            </div>
        </div>
    </section>
);

export default Welcome;