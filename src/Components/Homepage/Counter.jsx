import React, { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { Users, Briefcase, CalendarCheck, FolderKanban } from 'lucide-react';
import { db } from '../Firebase';
import { SectionTitle, Reveal } from './ui';

const ICON_MAP = {
  users: Users,
  briefcase: Briefcase,
  calendar: CalendarCheck,
  folder: FolderKanban,
};

const DEFAULT_STATS = [
  { value: '1700', label: 'Happy Clients', icon: 'users' },
  { value: '200', label: 'Team Members', icon: 'briefcase' },
  { value: '6', label: 'Years Experience', icon: 'calendar' },
  { value: '15', label: 'Total Projects', icon: 'folder' },
];

const CountUp = ({ to, suffix = '+' }) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const end = parseInt(to, 10);
    const duration = 1800;
    const startTime = performance.now();
    const updateCount = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(updateCount);
      else setCount(end);
    };
    requestAnimationFrame(updateCount);
  }, [isInView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Counter = () => {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'homepage_settings', 'stats'), (snap) => {
      if (snap.exists() && snap.data().items?.length) {
        setStats(snap.data().items);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="stats" className="py-12 md:py-20 bg-white relative overflow-hidden">
      {/* Ambient background elements for a premium feel */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-50/30 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-50/30 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10 w-full">
        <Reveal className="text-center mb-16 md:mb-24">
          <SectionTitle
            align="center"
            eyebrow="Our Impact"
            title="Numbers that"
            highlight="speak for us"
            subtitle="A legacy of trust built one family, one investment, and one landmark at a time."
          />
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {stats.map((stat, index) => {
            const Icon = ICON_MAP[stat.icon] || Users;
            return (
              <Reveal key={`${stat.label}-${index}`} delay={index * 100}>
                <div className="group relative">
                  {/* Subtle hover background effect */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-blue-50 to-fuchsia-50 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />
                  
                  <div className="relative flex flex-col items-center text-center p-8 md:p-10 rounded-[2rem] bg-white border border-gray-100/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-700 group-hover:translate-y-[-10px] group-hover:shadow-[0_40px_70px_rgba(0,0,0,0.08)] group-hover:border-transparent isolate">
                    
                    {/* Decorative glass icon container */}
                    <div className="w-16 h-16 mb-8 rounded-[1.25rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-fuchsia-500 group-hover:text-white group-hover:shadow-[0_12px_24px_rgba(37,99,235,0.25)] group-hover:scale-110">
                      <Icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter transition-colors duration-500 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-fuchsia-500 group-hover:bg-clip-text">
                        <CountUp to={stat.value} />
                      </h4>
                      <p className="text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase pt-2">
                        {stat.label}
                      </p>
                    </div>

                    {/* Minimalist interactive line */}
                    <div className="w-0 h-[2px] bg-gradient-to-r from-blue-600 to-fuchsia-500 mt-6 rounded-full transition-all duration-700 group-hover:w-16 lg:group-hover:w-20" />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Counter;
