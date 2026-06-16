import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import ImageBreadcrumb from "../ImageBreadcrumb";
import { ArrowRight, MapPin } from "lucide-react";

const formatLocationSummary = (location) => {
  if (!location) return "";
  if (typeof location === "string") return location;
  return location.summary || location.address || "";
};

const NO_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%2394a3b8">No Image Available</text></svg>`;

const ProjectCard = ({ project, onView }) => (
  <article
    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(17,116,214,0.14)] transition-all duration-400 flex flex-col border border-slate-100"
  >
    <div className="relative overflow-hidden aspect-video">
      <img
        src={project.image || NO_IMG}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = NO_IMG; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/70 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4">
        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg">Completed</span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-slate-800 font-bold text-base mb-1 line-clamp-2">{project.title}</h3>
      {(project.tagline || project.location) && (
        <p className="text-slate-400 text-sm flex items-start gap-1.5 mb-4">
          <MapPin size={13} className="mt-0.5 flex-shrink-0 text-[#1174d6]" />
          <span className="line-clamp-2">{project.tagline || formatLocationSummary(project.location)}</span>
        </p>
      )}
      <button
        onClick={onView}
        className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#1174d6] to-[#0a5ab8] text-white text-sm font-bold shadow-[0_6px_20px_rgba(17,116,214,0.3)] hover:shadow-[0_10px_28px_rgba(17,116,214,0.4)] hover:-translate-y-0.5 transition-all duration-200"
      >
        View Project Details
        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </article>
);

const Complete = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"),
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProjects(data.filter((p) => p.status === "completed"));
        setLoading(false);
      },
      () => { setError("Unable to load completed projects."); setLoading(false); }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <ImageBreadcrumb
        title="Completed Projects"
        subtitle="Milestones delivered with excellence — every project a testament to our commitment."
        crumbs={[{ label: 'Projects', href: '/projects' }, { label: 'Completed' }]}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-[#1174d6] text-xs font-bold tracking-widest uppercase mb-3">Our Portfolio</p>
            <h2
              className="text-slate-900 font-light"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
            >
              Completed <strong className="font-bold">Project Portfolio</strong>
            </h2>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-10 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-slate-400 py-16">{error}</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-slate-700 font-bold text-xl mb-2">Coming Soon</h3>
              <p className="text-slate-400 text-sm">Completed projects will appear here soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} onView={() => navigate(`/projects/${p.id}`)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Complete;
