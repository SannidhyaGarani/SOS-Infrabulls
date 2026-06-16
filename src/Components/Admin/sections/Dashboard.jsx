import React from 'react';
import { Building2, Home, Newspaper, Images, Users, BarChart3, MessageSquareQuote } from 'lucide-react';
import { useCollection, useGallery, useTeam } from '../hooks/useCollection';
import { StatCard, LoadingSpinner } from '../components/ui';
import { ADMIN_SECTIONS } from '../config/sections';

const iconMap = {
  projects: Building2,
  properties: Home,
  blogs: Newspaper,
  gallery: Images,
  team: Users,
  stats: BarChart3,
  testimonials: MessageSquareQuote,
};

const Dashboard = ({ onNavigate }) => {
  const { items: projects, loading: lp } = useCollection('projects');
  const { items: properties, loading: lpr } = useCollection('properties');
  const { items: blogs, loading: lb } = useCollection('blogs');
  const { items: gallery, loading: lg } = useGallery();
  const { items: team, loading: lt } = useTeam();
  const { items: testimonials, loading: ltm } = useCollection('testimonials');

  const loading = lp || lpr || lb || lg || lt || ltm;

  const counts = {
    projects: projects.length,
    properties: properties.length,
    blogs: blogs.length,
    gallery: gallery.length,
    team: team.length,
    testimonials: testimonials.length,
    running: projects.filter((p) => (p.status || 'running') === 'running').length,
    featured: properties.filter((p) => p.featured).length,
  };

  if (loading) return <LoadingSpinner label="Loading dashboard" />;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Running Projects" value={counts.running} hint={`${counts.projects} total projects`} />
        <StatCard label="Properties Listed" value={counts.properties} hint={`${counts.featured} featured`} accent="from-cyan-500 to-teal-400" />
        <StatCard label="Blog Posts" value={counts.blogs} hint="Shown in Journal section" accent="from-fuchsia-500 to-pink-400" />
        <StatCard label="Gallery Items" value={counts.gallery} hint="Events & achievements" accent="from-purple-500 to-fuchsia-400" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Homepage Sections</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {ADMIN_SECTIONS.filter((s) => s.id !== 'dashboard').map((section) => {
            const Icon = iconMap[section.id] || Building2;
            const count = counts[section.id] ?? '—';
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onNavigate(section.id)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#1174d6]/20 hover:shadow-md transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#1174d6] group-hover:border-[#1174d6]/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{section.label}</p>
                  <p className="text-xs text-slate-500 truncate">{section.homepage}</p>
                </div>
                <span className="text-lg font-semibold text-slate-300 group-hover:text-[#1174d6] tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
