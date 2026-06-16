import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { ChevronLeft, ChevronRight, MapPin, Ruler, ArrowRight } from 'lucide-react';
import { SectionTitle, Reveal, GradientText } from './ui';

const formatLocationSummary = (location) => {
    if (!location) return '';
    if (typeof location === 'string') return location;
    return location.address || '';
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentCard, setCurrentCard] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const autoPlayRef = useRef(null);

    const go = (direction) => {
        if (!projects.length) return;
        setCurrentCard((prev) =>
            direction === 'next'
                ? (prev + 1) % projects.length
                : (prev - 1 + projects.length) % projects.length
        );
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'projects'),
            (snapshot) => {
                const projectData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                const runningProjects = projectData.filter((p) => (p.status || 'running') === 'running');
                setProjects(runningProjects);
                setLoading(false);
            },
            () => {
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (projects.length <= 1 || isHovering) return;
        autoPlayRef.current = setInterval(() => {
            setCurrentCard((prev) => (prev + 1) % projects.length);
        }, 5500);
        return () => clearInterval(autoPlayRef.current);
    }, [projects.length, isHovering]);

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center bg-white">
                <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-400 tracking-[0.2em] uppercase text-[11px]">Loading projects</p>
            </div>
        );
    }

    if (projects.length === 0) return null;

    const project = projects[currentCard];

    return (
        <section
            className="py-24 md:py-32 bg-white overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
                    <Reveal>
                        <SectionTitle
                            eyebrow="Running Projects"
                            title="Signature"
                            highlight="developments"
                            subtitle="Explore our ongoing projects — masterfully designed developments in prime locations across Madhya Pradesh."
                        />
                    </Reveal>

                    <Reveal delay={100} className="flex items-center gap-4 shrink-0">
                        <div className="text-right mr-2">
                            <p className="text-2xl font-semibold text-gray-900 tabular-nums">
                                0{currentCard + 1}
                                <span className="text-gray-300 font-normal"> / 0{projects.length}</span>
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => go('prev')}
                            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                            aria-label="Previous project"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go('next')}
                            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                            aria-label="Next project"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </Reveal>
                </div>

                <Reveal>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                        <div className="lg:col-span-7 relative aspect-[16/11] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                            <img
                                key={project.id}
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-gray-900/10" />

                            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-[10px] font-semibold tracking-wider uppercase text-gray-700">
                                    <Ruler className="w-3 h-3 text-blue-600" />
                                    {project.size || 'Exclusive'}
                                </span>
                                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-500 text-[10px] font-semibold tracking-wider uppercase text-white">
                                    Ongoing
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-blue-600 text-[10px] font-semibold tracking-[0.2em] uppercase">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {formatLocationSummary(project.location) || 'Prime Location'}
                                </div>

                                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
                                    <GradientText>{project.title}</GradientText>
                                </h3>

                                <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base">
                                    {project.description ||
                                        'A masterfully designed development that defines the pinnacle of luxury living. Experience unmatched elegance and modern amenities.'}
                                </p>
                            </div>

                            <div className="pt-8 mt-8 border-t border-gray-100">
                                <Link
                                    to={`/projects/${project.id}`}
                                    className="group flex items-center justify-between w-full px-6 py-4 rounded-full bg-gray-900 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-fuchsia-500 transition-all duration-400"
                                >
                                    <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">View Full Project</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex gap-2">
                        {projects.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentCard(index)}
                                aria-label={`Go to project ${index + 1}`}
                                className={`h-1 rounded-full transition-all duration-500 ${
                                    index === currentCard
                                        ? 'w-10 bg-gradient-to-r from-blue-600 to-fuchsia-500'
                                        : 'w-4 bg-gray-200 hover:bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>

                    <Link
                        to="/projectgallery"
                        className="group flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Explore All Projects
                        <span className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-blue-300 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Projects;
