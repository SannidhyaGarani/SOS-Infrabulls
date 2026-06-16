import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import Dashboard from './sections/Dashboard';
import ProjectsSection from './sections/ProjectsSection';
import PropertiesSection from './sections/PropertiesSection';
import BlogsSection from './sections/BlogsSection';
import GallerySection from './sections/GallerySection';
import TeamSection from './sections/TeamSection';
import StatsSection from './sections/StatsSection';
import TestimonialsSection from './sections/TestimonialsSection';

const SECTION_MAP = {
  dashboard: Dashboard,
  projects: ProjectsSection,
  properties: PropertiesSection,
  blogs: BlogsSection,
  gallery: GallerySection,
  team: TeamSection,
  stats: StatsSection,
  testimonials: TestimonialsSection,
};

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const ActiveComponent = SECTION_MAP[activeSection] || Dashboard;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 antialiased">
      <AdminSidebar active={activeSection} onNavigate={setActiveSection} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader sectionId={activeSection} />
        <main className="flex-1 px-6 md:px-8 py-8 overflow-auto">
          <ActiveComponent onNavigate={setActiveSection} />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
