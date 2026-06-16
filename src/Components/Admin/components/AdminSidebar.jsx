import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import { ADMIN_SECTIONS } from '../config/sections';

const AdminSidebar = ({ active, onNavigate }) => (
  <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white flex flex-col h-screen sticky top-0">
    <div className="px-5 py-6 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1174d6] to-[#0a5ab8] flex items-center justify-center shadow-md shadow-blue-500/25">
          <span className="text-white text-xs font-bold">SOS</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 tracking-tight">Admin Panel</p>
          <p className="text-[10px] text-slate-400 tracking-wider uppercase">Content Manager</p>
        </div>
      </div>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
      {ADMIN_SECTIONS.map(({ id, label, icon: Icon, homepage }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
              isActive
                ? 'bg-[#1174d6]/10 text-[#1174d6]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1174d6]' : 'text-slate-400'}`} />
            <div className="min-w-0">
              <span className="block text-sm font-medium">{label}</span>
              {homepage && id !== 'dashboard' && (
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">{homepage}</span>
              )}
            </div>
            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1174d6]" />}
          </button>
        );
      })}
    </nav>

    <div className="p-4 border-t border-slate-100 space-y-2">
      <Link
        to="/"
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-[#1174d6] hover:bg-slate-50 transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View Website
      </Link>
      <button
        type="button"
        onClick={() => (window.location.href = '/')}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        Exit Admin
      </button>
    </div>
  </aside>
);

export default AdminSidebar;
