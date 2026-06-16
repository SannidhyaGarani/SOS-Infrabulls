import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import ImageBreadcrumb from '../ImageBreadcrumb';
import { X, ChevronLeft, ChevronRight, Award, Calendar, Building2, Eye } from 'lucide-react';

/* ─── Gallery Card ─── */
const GalleryCard = React.memo(({ item, onClick, aspect = "aspect-[4/3]" }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <article
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(17,116,214,0.15)] transition-all duration-400 bg-slate-100 group"
    >
      <div className={`${aspect} overflow-hidden`}>
        <img
          src={(item.images && item.images[item.primaryImageIndex || 0]) || item.image}
          alt={item.title || "Gallery"}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div className="flex items-center gap-2 text-white text-sm font-semibold">
          <Eye size={16} />
          <span>View Gallery</span>
        </div>
      </div>
      {item.date && (
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[#1174d6] text-xs font-bold">
          {item.date}
        </span>
      )}
      {item.imageCount && (
        <span className="absolute top-3 right-3 px-2 py-1 bg-[#0A2540]/70 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
          {item.imageCount} photos
        </span>
      )}
      {(item.title || item.subtitle) && (
        <div className="p-4 bg-white border-t border-slate-100">
          {item.title && <p className="text-slate-800 font-semibold text-sm">{item.title}</p>}
          {item.subtitle && <p className="text-slate-400 text-xs mt-0.5">{item.subtitle}</p>}
        </div>
      )}
    </article>
  );
});
GalleryCard.displayName = 'GalleryCard';

/* ─── Section ─── */
const GallerySection = React.forwardRef(({ title, icon: Icon, items, onCardClick, sectionId, cardAspect }, ref) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 6);
  if (!items.length) return null;
  return (
    <div ref={ref} id={sectionId} className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        {Icon && <div className="w-10 h-10 rounded-xl bg-[#1174d6]/10 flex items-center justify-center"><Icon size={20} className="text-[#1174d6]" /></div>}
        <div>
          <h2 className="text-slate-800 font-bold text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h2>
          <div className="w-12 h-0.5 bg-[#1174d6] mt-1 rounded-full" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((it, idx) => (
          <GalleryCard 
            key={it.firebaseDocId || idx} 
            item={it} 
            onClick={() => onCardClick(it)} 
            aspect={cardAspect}
          />
        ))}
      </div>
      {items.length > 6 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-8 py-3 rounded-xl border-2 border-[#1174d6] text-[#1174d6] font-bold text-sm hover:bg-[#1174d6] hover:text-white transition-all duration-200"
          >
            {expanded ? 'Show Less' : `View All ${title}`}
          </button>
        </div>
      )}
    </div>
  );
});
GallerySection.displayName = 'GallerySection';

/* ─── Main ─── */
const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const achievementRef = useRef(null);
  const anniversaryRef = useRef(null);
  const corporateRef = useRef(null);

  useEffect(() => {
    const ref = collection(db, 'gallery');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rec = snap.docs.map((d) => ({ firebaseDocId: d.id, ...d.data() }));
      rec.sort((a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0));
      setItems(rec);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section && !loading) {
      setTimeout(() => {
        const refs = { achievements: achievementRef, anniversary: anniversaryRef, corporate: corporateRef };
        refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams, loading]);

  useEffect(() => {
    if (active) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  const achievementItems = useMemo(() => items.filter(it => it.type === 'achievements'), [items]);
  const anniversaryItems = useMemo(() => items.filter(it => it.type === 'anniversaries'), [items]);
  const corporateItems = useMemo(() => items.filter(it => it.type === 'corporate_meetings'), [items]);

  const handleCardClick = (item) => { setActive(item); setActiveIndex(item.primaryImageIndex || 0); };

  const prevImg = () => setActiveIndex((p) => (p - 1 + (active?.images?.length || 1)) % (active?.images?.length || 1));
  const nextImg = () => setActiveIndex((p) => (p + 1) % (active?.images?.length || 1));

  return (
    <div className="min-h-screen bg-white">
      <ImageBreadcrumb
        title="Gallery"
        subtitle="Celebrating milestones, achievements, and moments that define Mahanta Group."
        crumbs={[{ label: 'Gallery' }]}
      />

      {/* Jump Nav */}
      <div className="sticky top-[127px] z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-xs font-semibold mr-2">Jump to:</span>
          {[
            { id: 'achievements', label: 'Achievements', ref: achievementRef },
            { id: 'anniversary', label: 'Anniversary', ref: anniversaryRef },
            { id: 'corporate', label: 'Corporate', ref: corporateRef },
          ].map(({ id, label, ref }) => (
            <button
              key={id}
              onClick={() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="px-4 py-1.5 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:border-[#1174d6] hover:text-[#1174d6] transition-all duration-200"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[#1174d6]/20 border-t-[#1174d6] rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading gallery...</p>
          </div>
        ) : (
          <>
            <GallerySection ref={achievementRef} sectionId="achievements" title="Achievements & Awards" icon={Award} items={achievementItems} onCardClick={handleCardClick} cardAspect="aspect-[3/4]" />
            <GallerySection ref={anniversaryRef} sectionId="anniversary" title="Anniversary Celebrations" icon={Calendar} items={anniversaryItems} onCardClick={handleCardClick} />
            <GallerySection ref={corporateRef} sectionId="corporate" title="Corporate Meetings & Events" icon={Building2} items={corporateItems} onCardClick={handleCardClick} />
            {!achievementItems.length && !anniversaryItems.length && !corporateItems.length && (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-slate-700 font-bold text-xl mb-2">No Gallery Items Yet</h3>
                <p className="text-slate-400 text-sm">Add images from the Admin panel to get started.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-slate-800 font-bold text-lg">{active.title || 'Gallery Item'}</h3>
                {active.date && <p className="text-slate-400 text-xs mt-0.5">{active.date}</p>}
              </div>
              <button onClick={() => setActive(null)} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="relative flex-1 overflow-hidden bg-slate-900 flex items-center justify-center" style={{ minHeight: 340 }}>
              <button onClick={prevImg} className="absolute left-3 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <img
                src={active.images ? active.images[activeIndex] : active.image}
                alt={active.title || 'Preview'}
                className="max-h-[60vh] max-w-full object-contain"
              />
              <button onClick={nextImg} className="absolute right-3 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors">
                <ChevronRight size={20} />
              </button>
              {active.images?.length > 1 && (
                <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 text-white text-xs rounded-lg">
                  {activeIndex + 1} / {active.images.length}
                </span>
              )}
            </div>
            {Array.isArray(active.images) && active.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto border-t border-slate-100">
                {active.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex ? 'border-[#1174d6]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;