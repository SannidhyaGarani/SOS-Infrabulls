import React from 'react';
import { getSection } from '../config/sections';

const AdminHeader = ({ sectionId }) => {
  const section = getSection(sectionId);
  if (!section) return null;

  return (
    <header className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/60 px-6 md:px-8 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1174d6] mb-1">
            SOS Infrabulls
          </p>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
            {section.label}
          </h1>
          {section.description && (
            <p className="text-sm text-slate-500 mt-1">{section.description}</p>
          )}
          {section.homepage && (
            <p className="text-xs text-slate-400 mt-1">
              Powers the <span className="font-medium text-slate-600">{section.homepage}</span> section on the homepage
            </p>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-600">Live sync</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
