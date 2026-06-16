import React from 'react';
import { X } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-9 h-9 border-2 border-[#1174d6] border-t-transparent rounded-full animate-spin" />
    <p className="text-xs font-medium tracking-widest uppercase text-slate-400">{label}</p>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
    {Icon && (
      <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
        <Icon className="w-5 h-5" />
      </div>
    )}
    <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
    {description && <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const StatCard = ({ label, value, hint, accent = 'from-[#1174d6] to-cyan-500' }) => (
  <article className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div className="p-5">
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
    <div className={`h-1 bg-gradient-to-r ${accent}`} />
  </article>
);

export const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-600 border-slate-200',
    running: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    completed: 'bg-blue-50 text-blue-700 border-blue-100',
    featured: 'bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white border-transparent',
    sale: 'bg-blue-50 text-blue-700 border-blue-100',
    rent: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide uppercase ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
};

export const BtnPrimary = ({ children, onClick, type = 'button', disabled, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1174d6] to-[#0a5ab8] text-white text-xs font-semibold tracking-wide shadow-md shadow-blue-500/20 hover:shadow-lg disabled:opacity-50 transition-all ${className}`}
  >
    {children}
  </button>
);

export const BtnGhost = ({ children, onClick, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:border-[#1174d6]/30 hover:text-[#1174d6] transition-colors ${className}`}
  >
    {children}
  </button>
);

export const BtnDanger = ({ children, onClick, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
  >
    {children}
  </button>
);

export const Modal = ({ open, onClose, title, subtitle, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col ${wide ? 'max-w-3xl' : 'max-w-xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
      </div>
    </div>
  );
};

export const FormField = ({ label, required, hint, children }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-semibold tracking-wide uppercase text-slate-600">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
  </div>
);

export const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1174d6] focus:ring-2 focus:ring-[#1174d6]/10 transition-all';

export const textareaClass = `${inputClass} min-h-[88px] resize-y`;

export const ProgressBar = ({ progress, label }) => (
  <div className="space-y-2">
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-[#1174d6] to-cyan-400 transition-all duration-300" style={{ width: `${progress}%` }} />
    </div>
    {label && <p className="text-[11px] text-slate-500">{label} {progress}%</p>}
  </div>
);

export const SectionHeader = ({ title, subtitle, homepage, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      {homepage && (
        <p className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-semibold tracking-wider uppercase text-[#1174d6]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1174d6]" />
          Homepage: {homepage}
        </p>
      )}
    </div>
    {action}
  </div>
);

export const ListRow = ({ image, title, meta, badges, actions }) => (
  <li className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all">
    {image && (
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
        <img src={image} alt="" className="w-full h-full object-cover" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
      {meta && <p className="text-xs text-slate-500 mt-0.5 truncate">{meta}</p>}
      {badges && <div className="flex flex-wrap gap-1.5 mt-2">{badges}</div>}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </li>
);
