import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { ArrowLeft, MapPin, Building2, LayoutGrid, CheckCircle, Star, Phone } from "lucide-react";

const formatLocationSummary = (location) => {
  if (!location) return "";
  if (typeof location === "string") return location;
  return location.summary || location.address || "";
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const collectPricingTypes = (pricing = {}) => {
  const buckets = new Set();
  ["rate_per_sqft", "electricity_charge", "maintenance", "prime_location_charges", "plot_size_sqft"].forEach(
    (key) => {
      const group = pricing[key];
      if (group && typeof group === "object") {
        Object.keys(group).forEach((type) => buckets.add(type));
      }
    }
  );
  return Array.from(buckets);
};

const NO_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%2394a3b8">No Image Available</text></svg>`;

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const snapshot = await getDoc(doc(db, "projects", projectId));
        if (!snapshot.exists()) setError("The requested project was not found.");
        else setProject({ id: snapshot.id, ...snapshot.data() });
      } catch {
        setError("Unable to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const pricing = project?.pricing || {};
  const pricingTypes = useMemo(() => collectPricingTypes(pricing), [pricing]);
  const configurations = project?.configurations || {};
  const configurationEntries = Object.entries(configurations);
  const advantages = safeArray(project?.location?.advantages);
  const amenities = safeArray(project?.amenities);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-40">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1174d6]/20 border-t-[#1174d6] rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-40">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-slate-600 font-semibold">{error || "Project not found."}</p>
          <Link to="/projects" className="mt-4 inline-flex items-center gap-2 text-[#1174d6] font-semibold text-sm hover:underline">
            <ArrowLeft size={14} /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = project.status === "completed";

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: "calc(90px + 37px)" }}>

      {/* Hero Image */}
      <section
        className="relative h-[50vh] min-h-[320px] flex items-end bg-cover bg-center"
        style={{ backgroundImage: `url(${project.image || NO_IMG})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/40 to-transparent" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12 pb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Link
              to={isCompleted ? "/projects/completed" : "/projects/ongoing"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold border border-white/20 hover:bg-white/25 transition-colors"
            >
              <ArrowLeft size={12} />
              Back to Projects
            </Link>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
              {isCompleted ? "Completed" : "Running"}
            </span>
          </div>
          <h1
            className="text-white font-light text-3xl md:text-5xl leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {project.title}
          </h1>
          {(project.tagline || project.location) && (
            <p className="text-white/70 mt-2 text-sm flex items-center gap-1.5">
              <MapPin size={13} />
              {project.tagline || formatLocationSummary(project.location)}
            </p>
          )}
        </div>
      </section>

      {/* Floating meta bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-[127px] z-30">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-4 flex flex-wrap gap-4">
          {[
            { icon: Building2, label: "Developer", value: project.developer || "SOS Infrabulls" },
            { icon: LayoutGrid, label: "Layout", value: project.project_layout || "—" },
            { icon: MapPin, label: "Location", value: project.location?.address || formatLocationSummary(project.location) || "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
              <Icon size={15} className="text-[#1174d6] flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                <p className="text-slate-700 font-semibold text-sm leading-tight">{value}</p>
              </div>
            </div>
          ))}
          {project.ctaUrl && (
            <a
              href={project.ctaUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1174d6] text-white text-sm font-bold hover:bg-[#0a5ab8] transition-colors"
            >
              {project.ctaLabel || "Visit Project Site"}
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 space-y-14">

        {/* Overview */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-[#1174d6]" />
            <h2 className="text-slate-800 font-bold text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Project Overview</h2>
          </div>
          <p className="text-slate-500 leading-relaxed text-[15px] max-w-3xl">
            {project.location?.summary || formatLocationSummary(project.location) || "Detailed description will be published soon."}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              {project.project_name || project.title}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              {isCompleted ? "Delivered milestone" : "Actively selling"}
            </span>
            {project.developer && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                By {project.developer}
              </span>
            )}
          </div>
        </section>

        {/* Location Advantage + Amenities */}
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full bg-[#1174d6]" />
              <h2 className="text-slate-800 font-bold text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Location Advantage</h2>
            </div>
            {advantages.length ? (
              <ul className="space-y-2">
                {advantages.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-slate-500 text-sm">
                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm italic">Proximity highlights will be updated shortly.</p>
            )}
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full bg-[#1174d6]" />
              <h2 className="text-slate-800 font-bold text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Amenities</h2>
            </div>
            {amenities.length ? (
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1174d6]/8 text-[#1174d6] text-xs font-semibold border border-[#1174d6]/15"
                  >
                    <Star size={10} fill="currentColor" />
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">Amenity mix will be announced soon.</p>
            )}
          </section>
        </div>

        {/* Configurations */}
        {configurationEntries.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-[#1174d6]" />
              <h2 className="text-slate-800 font-bold text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Configurations</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {configurationEntries.map(([type, config]) => (
                <div key={type} className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-100">
                  <h3 className="text-[#1174d6] font-bold text-sm uppercase tracking-wide mb-1">{type}</h3>
                  <p className="text-slate-600 text-sm">{safeArray(config?.sizes_sqft).join(", ")} sq.ft</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing */}
        {pricingTypes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-[#1174d6]" />
              <h2 className="text-slate-800 font-bold text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Pricing Snapshot</h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#0A2540] to-[#0f3460] text-white">
                    {["Typology", "Rate / Sq.ft", "Electricity", "Maintenance", "Prime Charges", "Plot Sizes (Sq.ft)"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pricingTypes.map((type, i) => (
                    <tr key={type} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-t border-slate-100`}>
                      <td className="px-4 py-3 font-semibold text-slate-700">{type}</td>
                      <td className="px-4 py-3 text-slate-500">{pricing.rate_per_sqft?.[type] ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500">{pricing.electricity_charge?.[type] ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500">{pricing.maintenance?.[type] ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500">{pricing.prime_location_charges?.[type] ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {Array.isArray(pricing.plot_size_sqft?.[type])
                          ? pricing.plot_size_sqft[type].join(", ")
                          : pricing.plot_size_sqft?.[type] || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CTA Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0f3460] p-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Need a guided walkthrough?
            </h3>
            <p className="text-white/60 text-sm">
              Connect with our advisory desk to receive brochures, payment plans, and site visit slots.
            </p>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1174d6] text-white font-bold text-sm shadow-[0_8px_24px_rgba(17,116,214,0.5)] hover:bg-blue-500 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Phone size={15} />
            Talk to us →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;
