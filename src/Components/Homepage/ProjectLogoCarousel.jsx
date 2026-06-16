import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

import 'swiper/css';
import './homepage.css';

const ProjectLogoCarousel = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getDocs(collection(db, 'projects'))
            .then((snap) => {
                const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setProjects(data.filter((p) => p.logo || p.image));
            })
            .catch((error) => console.error('Error fetching project logos:', error))
            .finally(() => setLoading(false));
    }, []);

    if (loading || projects.length === 0) return null;

    return (
        <section className="bg-white py-8 border-b border-gray-100 overflow-hidden" aria-label="Project partners">
            <div className="container mx-auto px-6 md:px-12 mb-5">
                <p className="text-center text-[10px] tracking-[0.25em] uppercase text-gray-400 font-semibold">
                    Trusted Developments
                </p>
            </div>

            <Swiper
                modules={[Autoplay]}
                loop
                speed={4000}
                autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
                slidesPerView={3}
                spaceBetween={48}
                breakpoints={{
                    640: { slidesPerView: 4 },
                    768: { slidesPerView: 5 },
                    1024: { slidesPerView: 6 },
                    1280: { slidesPerView: 8 },
                }}
                className="ticker-swiper"
            >
                {projects.map((project) => (
                    <SwiperSlide key={project.id}>
                        <button
                            type="button"
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="w-full h-12 flex items-center justify-center opacity-35 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-400"
                        >
                            <img
                                src={project.logo || project.image}
                                alt={project.title}
                                className="max-h-full max-w-[100px] object-contain"
                                loading="lazy"
                                decoding="async"
                            />
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default ProjectLogoCarousel;
