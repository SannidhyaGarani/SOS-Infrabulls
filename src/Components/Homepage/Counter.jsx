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
    <section id="stats" className="py-24 md:py-32 bg-white border-y border-gray-100">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-14">
          <SectionTitle
            align="center"
            eyebrow="Our Impact"
            title="Numbers that"
            highlight="speak"
            subtitle="A legacy of trust built one family, one investment, and one landmark at a time."
          />
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = ICON_MAP[stat.icon] || Users;
            return (
              <Reveal key={`${stat.label}-${index}`} delay={index * 70}>
                <div className="hp-card-lift relative text-center p-8 md:p-10 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <div className="w-11 h-11 mx-auto mb-5 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-2">
                    <CountUp to={stat.value} />
                  </p>
                  <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">{stat.label}</p>
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
