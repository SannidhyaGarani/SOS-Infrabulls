import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { MapPin, Ruler, ArrowRight, ArrowUpRight } from 'lucide-react';
import { SectionTitle, Reveal, GradientText } from './ui';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const formatLocationSummary = (location) => {
    if (!location) return '';
    if (typeof location === 'string') return location;
    return location.address || '';
};

const ProjectCard = ({ project }) => (
    <Link
        to={`/projects/${project.id}`}
        className="group relative block w-full h-[400px] md:h-[480px] rounded-3xl overflow-hidden cursor-pointer bg-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)] transition-shadow duration-700"
    >
        {/* Base Image with Parallax-like slow scale */}
        <div className="absolute inset-0">
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                loading="lazy"
            />
        </div>

        {/* Deep Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent opacity-90 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent opacity-60 z-10" />

        {/* Ambient Color Cast on Hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-fuchsia-600/30 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

        {/* Inner Border Refinement */}
        <div className="absolute inset-0 border border-white/10 rounded-3xl z-30 pointer-events-none group-hover:border-white/20 transition-colors duration-500" />

        {/* Top Floating UI Elements */}
        <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-20">
            <span className="relative overflow-hidden inline-flex px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-[0.25em] uppercase text-white shadow-2xl transition-all duration-500 group-hover:border-transparent">
                <span className="relative z-10">{project.status || 'Ongoing'}</span>
                {/* Status pill hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </span>

            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-white group-hover:text-gray-900 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                <ArrowUpRight className="w-5 h-5" />
            </div>
        </div>

        {/* Bottom Editorial Content Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col justify-end">
            {/* Elegant Glassmorphic Tags */}
            <div className="flex items-center gap-3 mb-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-80 group-hover:opacity-100">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-semibold tracking-wider text-gray-200 uppercase truncate max-w-[140px]">
                        {formatLocationSummary(project.location) || 'Prime Location'}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                    <Ruler className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] font-semibold tracking-wider text-gray-200 uppercase">
                        {project.size || 'Elite Plots'}
                    </span>
                </div>
            </div>

            {/* Typography Block */}
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight leading-[1.1] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white group-hover:to-cyan-200 transition-all duration-500">
                    {project.title}
                </h3>
                <p className="text-gray-400 text-sm font-light line-clamp-2 leading-relaxed md:max-w-[90%] group-hover:text-gray-300 transition-colors duration-500">
                    {project.description || 'A masterfully designed development that defines the pinnacle of luxury living.'}
                </p>
            </div>

            {/* Animated Laser Progress Line */}
            <div className="w-full h-[2px] bg-white/10 mt-7 relative overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-fuchsia-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1)" />
            </div>
        </div>
    </Link>
);

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'projects'),
            (snapshot) => {
                const projectData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                const runningProjects = projectData.filter((p) => (p.status || 'running') === 'running');
                setProjects(runningProjects);
                setLoading(false);
            },
            () => setLoading(false)
        );
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center bg-white">
                <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-400 tracking-[0.2em] uppercase text-[11px]">Loading projects</p>
            </div>
        );
    }

    if (projects.length === 0) return null;

    return (
        <section className="py-8 bg-white overflow-hidden w-full relative">
            {/* 1440px Strict Layout Wrapper */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                
                {/* Header Section (Design Preserved Exactly as Requested) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <Reveal>
                        <SectionTitle
                            eyebrow="Signature Developments"
                            title="Ongoing"
                            highlight="Projects"
                            subtitle="Explore our masterfully designed developments in prime locations across Madhya Pradesh."
                        />
                    </Reveal>

                    <Reveal delay={100} className="hidden md:flex gap-3">
                        <Link
                            to="/projects"
                            className="group flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-600 hover:text-blue-600 transition-all border border-gray-100 px-6 py-3 rounded-full bg-gray-50/50 hover:bg-white hover:shadow-md"
                        >
                            View All Projects
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Reveal>
                </div>

                <Reveal delay={200}>
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={32}
                        slidesPerView={1}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        breakpoints={{
                            640: { slidesPerView: 1.2 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="projects-swiper !pb-16 !pt-4"
                    >
                        {projects.map((project) => (
                            <SwiperSlide key={project.id}>
                                <ProjectCard project={project} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Reveal>
            </div>
            
            {/* Enhanced Swiper Styles for Premium Aesthetic */}
            <style>{`
                .projects-swiper .swiper-pagination {
                    bottom: 0px !important;
                }
                .projects-swiper .swiper-pagination-bullet-active {
                    background: linear-gradient(to right, #2563eb, #d946ef) !important;
                    width: 32px !important;
                    border-radius: 4px !important;
                    opacity: 1 !important;
                }
                .projects-swiper .swiper-pagination-bullet {
                    background: #cbd5e1;
                    opacity: 0.6;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .projects-swiper .swiper-slide {
                    transition: transform 0.5s ease;
                }
            `}</style>
        </section>
    );
};

export default Projects;