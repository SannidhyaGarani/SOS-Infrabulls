import React from 'react';
import HeroSlider from './Hero';
import ChooseUs from './ChooseUs';
import TestimonialSection from './Testimonial';
import Welcome from './Welcome';
import ProjectsSection from './Projects';
import BlogsSpotlight from './Blogs';
import ProjectLogoCarousel from './ProjectLogoCarousel';
import Counter from './Counter';
import EventsGallery from './EventsGallery';
import './homepage.css';

function Home() {
    return (
        <main className="bg-white antialiased">
            <HeroSlider />
            <ProjectLogoCarousel />
            <Welcome />
            <ChooseUs />
            <ProjectsSection />
            <Counter />
            <EventsGallery />
            {/* <BlogsSpotlight /> */}
            <TestimonialSection />
        </main>
    );
}

export default Home;
