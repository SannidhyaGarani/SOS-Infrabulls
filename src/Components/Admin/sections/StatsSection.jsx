import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { SectionHeader, LoadingSpinner, FormField, inputClass, BtnPrimary } from '../components/ui';

const DEFAULT_STATS = [
  { value: '1700', label: 'Happy Clients', icon: 'users' },
  { value: '200', label: 'Team Members', icon: 'briefcase' },
  { value: '6', label: 'Years Experience', icon: 'calendar' },
  { value: '15', label: 'Total Projects', icon: 'folder' },
];

const StatsSection = () => {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'homepage_settings', 'stats'))
      .then((snap) => {
        if (snap.exists() && snap.data().items?.length) {
          setStats(snap.data().items);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index, field, value) => {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, 'homepage_settings', 'stats'), { items: stats, updatedAt: new Date().toISOString() });
      alert('Stats saved! They will appear on the homepage Counter section.');
    } catch {
      alert('Failed to save stats.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SectionHeader
        title="Impact Stats"
        subtitle="Edit the numbers shown in the Counter section on the homepage."
        homepage="Counter Section"
        action={<BtnPrimary onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Stats'}</BtnPrimary>}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-5 rounded-2xl bg-white border border-slate-100 space-y-3">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Stat {index + 1}</p>
            <FormField label="Value">
              <input
                value={stat.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                className={inputClass}
                placeholder="1700"
              />
            </FormField>
            <FormField label="Label">
              <input
                value={stat.label}
                onChange={(e) => handleChange(index, 'label', e.target.value)}
                className={inputClass}
                placeholder="Happy Clients"
              />
            </FormField>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
