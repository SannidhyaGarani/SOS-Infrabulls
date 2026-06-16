import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Shield, IdCard, LogOut, Menu, X, Settings,
  CheckCircle, Clock, Loader2, Lock, ExternalLink, Mail, Phone, MapPin, Calendar,
  KeyRound, Eye, EyeOff, AlertCircle, ChevronRight
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { signOutAgent, setAgentPasswordOnce } from '../Firebase/agentHelpers';
import S3Image from '../S3Image';
import { getImageViewUrl } from '../Firebase/s3UploadService';

const mapAgentInfo = (agent) => {
  const docsUploaded = [agent.photographUrl, agent.panCardUrl, agent.aadhaarCardUrl].filter(Boolean).length;
  return {
    name: agent.fullName || [agent.firstName, agent.middleName, agent.lastName].filter(Boolean).join(' '),
    id: agent.loginId || agent.email,
    email: agent.email,
    mobile: agent.mobile1,
    status: agent.status || 'Pending',
    joiningDate: agent.date || '—',
    dob: agent.dob || '—',
    panCardNo: agent.panCardNo || '—',
    aadhaarCardNo: agent.aadhaarCardNo || '—',
    profileCompletion: Math.round((docsUploaded / 3) * 100),
    address: agent.localAddressLine2 || agent.permanentAddressLine1 || '—',
    city: agent.localCity || agent.permanentCity || '—',
    state: agent.localState || agent.permanentState || '—',
    pincode: agent.localPinCode || agent.permanentPinCode || '—',
    photographUrl: agent.photographUrl,
    panCardUrl: agent.panCardUrl,
    aadhaarCardUrl: agent.aadhaarCardUrl,
    passwordChanged: !!agent.passwordChanged,
    uid: agent.id,
  };
};

const inputClass =
  'w-full h-11 px-4 rounded-xl border border-slate-200/80 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1174d6]/20 focus:border-[#1174d6]/40 transition-all';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agentInfo, setAgentInfo] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const isApproved = agentInfo?.status === 'Approved';
  const hasSetPassword = agentInfo?.passwordChanged;

  useEffect(() => {
    let unsubDoc = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubDoc) unsubDoc();
      if (!user) { navigate('/agent/login'); return; }
      unsubDoc = onSnapshot(doc(db, 'agents', user.uid), (snap) => {
        if (!snap.exists()) { signOutAgent(); navigate('/agent/login'); return; }
        setAgentInfo(mapAgentInfo({ id: snap.id, ...snap.data() }));
        setAuthLoading(false);
      });
    });
    return () => { unsubAuth(); if (unsubDoc) unsubDoc(); };
  }, [navigate]);

  const handleLogout = async () => {
    await signOutAgent();
    navigate('/agent/login');
  };

  const handleTabClick = (tabId, requiresApproval = true) => {
    if (requiresApproval && !isApproved) return;
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New password and confirmation do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setPwError('New password must be different from your current password.');
      return;
    }

    setPwLoading(true);
    try {
      await setAgentPasswordOnce(agentInfo.uid, agentInfo.id, currentPassword, newPassword);
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message =
        err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
          ? 'Current password is incorrect.'
          : err.code === 'auth/weak-password'
            ? 'Password is too weak. Use at least 8 characters.'
            : err.message || 'Failed to set password. Please try again.';
      setPwError(message);
    } finally {
      setPwLoading(false);
    }
  };

  if (authLoading || !agentInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f4f7fb] to-[#eef2f7] gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-[#1174d6]" />
        <p className="text-sm text-slate-400">Loading your portal...</p>
      </div>
    );
  }

  const initials = agentInfo.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, requiresApproval: false },
    { id: 'profile', name: 'My Profile', icon: User, requiresApproval: true },
    { id: 'kyc', name: 'KYC Documents', icon: Shield, requiresApproval: true },
    { id: 'digital-card', name: 'Digital Card', icon: IdCard, requiresApproval: true },
    { id: 'settings', name: 'Settings', icon: Settings, requiresApproval: false, badge: !hasSetPassword ? '!' : null },
  ];

  const pageTitle = {
    dashboard: 'Dashboard',
    profile: 'My Profile',
    kyc: 'KYC Documents',
    'digital-card': 'Digital Agent Card',
    settings: 'Settings',
  }[activeTab] || 'Agent Portal';

  const StatusBadge = ({ status }) => {
    const approved = status === 'Approved';
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${
        approved ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80' : 'bg-amber-500/10 text-amber-700 border-amber-200/80'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${approved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
        {status}
      </span>
    );
  };

  const kycDocs = [
    { name: 'Photograph', url: agentInfo.photographUrl, number: 'Profile Photo' },
    { name: 'PAN Card', url: agentInfo.panCardUrl, number: agentInfo.panCardNo },
    { name: 'Aadhaar Card', url: agentInfo.aadhaarCardUrl, number: agentInfo.aadhaarCardNo },
  ];

  const onboardingSteps = [
    { label: 'Registration Submitted', done: true },
    { label: 'Credentials Sent via Email', done: true },
    { label: 'Set Your Login Password', done: hasSetPassword, pending: !hasSetPassword },
    { label: 'HR Document Review', done: isApproved, pending: !isApproved && hasSetPassword },
    { label: 'Full Portal Access', done: isApproved },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7fb] via-[#f8faff] to-[#eef2f7] font-sans text-slate-800">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 bg-[#0A2540]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-[72px] flex items-center justify-between px-5 border-b border-slate-100/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/img/logo.jpeg" alt="Logo" className="h-10 w-10 rounded-xl object-cover ring-2 ring-[#1174d6]/10" />
            <div className="min-w-0">
              <span className="font-bold text-[#0A2540] text-sm block truncate">SOS INFRABULLS</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Agent Portal</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = item.requiresApproval && !isApproved;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id, item.requiresApproval)}
                disabled={isLocked}
                title={isLocked ? 'Available after HR approval' : item.name}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isLocked
                    ? 'text-slate-300 cursor-not-allowed bg-slate-50/50'
                    : isActive
                      ? 'bg-gradient-to-r from-[#1174d6] to-[#0d5fb3] text-white shadow-lg shadow-[#1174d6]/25'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#0A2540]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-[18px] h-[18px] ${isLocked ? 'text-slate-300' : isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isLocked && <Lock className="w-3.5 h-3.5 text-slate-300" />}
                {!isLocked && item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-[280px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-200/40">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 h-[68px]">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-[#0A2540] truncate">{pageTitle}</h1>
                <p className="text-[11px] text-slate-400 hidden sm:block truncate">{agentInfo.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <StatusBadge status={agentInfo.status} />
              <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
                {agentInfo.photographUrl ? (
                  <S3Image src={agentInfo.photographUrl} alt="" className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#1174d6]/10" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1174d6] to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {initials}
                  </div>
                )}
                <span className="hidden md:block text-sm font-semibold text-[#0A2540] max-w-[120px] truncate">{agentInfo.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-5xl w-full mx-auto pb-8">
          {!isApproved && (
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/60 p-5 sm:p-6 shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 shrink-0">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 text-base">Awaiting HR Approval</h3>
                  <p className="text-sm text-amber-800/80 mt-1 leading-relaxed">
                    Your registration is under review. Profile, KYC, and Digital Card will unlock once HR approves your application.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0d3a6b] to-[#1174d6] p-6 sm:p-8 text-white shadow-xl shadow-[#1174d6]/10">
                <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold tracking-wider uppercase mb-3">Partner Portal</span>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Welcome, <span className="font-light">{agentInfo.name.split(' ')[0]}</span>
                    </h2>
                    <p className="text-blue-100/70 text-sm mt-2 font-mono truncate">{agentInfo.id}</p>
                  </div>
                  {agentInfo.photographUrl && (
                    <S3Image src={agentInfo.photographUrl} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl self-start sm:self-center" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Account Status', value: agentInfo.status, icon: Shield, gradient: 'from-emerald-500 to-teal-600' },
                  { title: 'Profile Complete', value: `${agentInfo.profileCompletion}%`, icon: User, gradient: 'from-[#1174d6] to-indigo-600' },
                  { title: 'Applied On', value: agentInfo.joiningDate, icon: CheckCircle, gradient: 'from-violet-500 to-purple-600' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className={`bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all ${i === 2 ? 'xs:col-span-2 sm:col-span-1' : ''}`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <span className="text-xl sm:text-2xl font-extrabold text-[#0A2540] block truncate">{stat.value}</span>
                      {stat.title === 'Profile Complete' && (
                        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#1174d6] to-indigo-500 rounded-full transition-all" style={{ width: `${agentInfo.profileCompletion}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!hasSetPassword && (
                <button
                  onClick={() => handleTabClick('settings', false)}
                  className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1174d6]/5 to-indigo-50 border border-[#1174d6]/20 hover:border-[#1174d6]/40 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#1174d6]/10">
                      <KeyRound className="w-5 h-5 text-[#1174d6]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0A2540]">Set your login password</p>
                      <p className="text-xs text-slate-500 mt-0.5">Go to Settings — one-time password setup</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#1174d6] shrink-0" />
                </button>
              )}

              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 p-5 sm:p-6 shadow-sm">
                <h3 className="font-bold text-[#0A2540] mb-5 text-base">Onboarding Progress</h3>
                <div className="space-y-3">
                  {onboardingSteps.map((step, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                      step.done ? 'bg-emerald-50/50 border-emerald-100/80' : step.pending ? 'bg-amber-50/50 border-amber-100/80' : 'bg-slate-50/50 border-slate-100'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        step.done ? 'bg-emerald-500 text-white' : step.pending ? 'bg-amber-100' : 'bg-slate-100'
                      }`}>
                        {step.done ? <CheckCircle className="w-4 h-4" /> : <Clock className={`w-4 h-4 ${step.pending ? 'text-amber-600 animate-pulse' : 'text-slate-300'}`} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-semibold block ${step.done ? 'text-emerald-800' : step.pending ? 'text-amber-800' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                      {step.done && <span className="text-[10px] font-bold text-emerald-600 uppercase shrink-0">Done</span>}
                      {step.pending && <span className="text-[10px] font-bold text-amber-600 uppercase shrink-0 animate-pulse">In Review</span>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'profile' && isApproved && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-[#1174d6]/5">
                <h3 className="text-lg font-bold text-[#0A2540]">My Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Your registered information</p>
              </div>
              <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-[#1174d6] tracking-widest">Personal</h4>
                  <div className="space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                    {[
                      { icon: User, label: 'Full Name', value: agentInfo.name },
                      { icon: Calendar, label: 'Date of Birth', value: agentInfo.dob },
                      { icon: Phone, label: 'Mobile', value: agentInfo.mobile },
                      { icon: Mail, label: 'Email', value: agentInfo.email },
                      { icon: MapPin, label: 'Address', value: `${agentInfo.address}, ${agentInfo.city}, ${agentInfo.state} - ${agentInfo.pincode}` },
                    ].map((row) => {
                      const Icon = row.icon;
                      return (
                        <div key={row.label} className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-white border border-slate-100 shrink-0">
                            <Icon className="w-4 h-4 text-[#1174d6]" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block">{row.label}</span>
                            <span className="text-sm font-semibold text-[#0A2540] break-words">{row.value}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-[#1174d6] tracking-widest">Account</h4>
                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block">Login ID</span>
                      <span className="text-sm font-mono font-bold text-[#0A2540] break-all">{agentInfo.id}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block">Status</span>
                      <div className="mt-1"><StatusBadge status={agentInfo.status} /></div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block">Application Date</span>
                      <span className="text-sm font-semibold text-[#0A2540]">{agentInfo.joiningDate}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block">Password Status</span>
                      <span className={`text-sm font-semibold ${hasSetPassword ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {hasSetPassword ? 'Custom password set' : 'Using email password — set in Settings'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kyc' && isApproved && (
            <div className="space-y-5">
              <div className="bg-white px-5 sm:px-8 py-5 rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm">
                <h3 className="text-lg font-bold text-[#0A2540]">KYC Documents</h3>
                <p className="text-xs text-slate-400 mt-0.5">Your uploaded identity documents</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kycDocs.map((doc, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {doc.url ? (
                      <S3Image src={doc.url} alt={doc.name} className="w-full h-36 object-cover bg-slate-100" />
                    ) : (
                      <div className="w-full h-36 bg-slate-100 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-[#0A2540]">{doc.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          doc.url ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'
                        }`}>
                          {doc.url ? 'Uploaded' : 'Missing'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-500 truncate">{doc.number}</p>
                      {doc.url && (
                        <button
                          type="button"
                          onClick={async () => {
                            const url = await getImageViewUrl(doc.url);
                            if (url) window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-[#1174d6] hover:underline font-semibold mt-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Document
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-5 sm:px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-[#1174d6]/5">
                  <h3 className="text-lg font-bold text-[#0A2540]">Settings</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage your account security</p>
                </div>

                <div className="p-5 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-[#1174d6]/10">
                      <KeyRound className="w-5 h-5 text-[#1174d6]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0A2540]">Password Settings</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Set a custom login password (one-time only)</p>
                    </div>
                  </div>

                  {!hasSetPassword ? (
                    <form onSubmit={handleSetPassword} className="space-y-4 max-w-md">
                      {pwError && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{pwError}</span>
                        </div>
                      )}
                      {pwSuccess && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>Password set successfully. This cannot be changed again.</span>
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Current Password (from email)</label>
                        <div className="relative">
                          <input
                            type={showCurrentPw ? 'text' : 'password'}
                            className={`${inputClass} pr-11`}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter password received via email"
                            required
                            disabled={pwLoading}
                          />
                          <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPw ? 'text' : 'password'}
                            className={`${inputClass} pr-11`}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                            required
                            minLength={8}
                            disabled={pwLoading}
                          />
                          <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          className={inputClass}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          required
                          minLength={8}
                          disabled={pwLoading}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={pwLoading}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1174d6] to-[#0d5fb3] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#1174d6]/20 hover:shadow-lg disabled:opacity-60 transition-all"
                      >
                        {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting...</> : <><KeyRound className="w-4 h-4" /> Set Password (One Time)</>}
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md">
                      <div className="p-2 rounded-xl bg-emerald-500/10 shrink-0">
                        <Lock className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0A2540]">Password already configured</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Your custom login password was set and cannot be changed again. Contact HR if you need assistance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'digital-card' && isApproved && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 p-5 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#0A2540] mb-6">Digital Agent Card</h3>
              <div className="max-w-sm mx-auto">
                <div className="relative bg-gradient-to-br from-[#0A2540] via-[#1174d6] to-indigo-800 rounded-3xl p-6 sm:p-7 text-white shadow-2xl shadow-[#1174d6]/30 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/4" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start pb-5 border-b border-white/10 mb-5">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-blue-200 uppercase block">SOS INFRABULLS</span>
                        <span className="text-[9px] text-white/50 uppercase tracking-wider">Authorized Agent</span>
                      </div>
                      <span className="bg-emerald-400 text-emerald-950 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
                    </div>

                    <div className="flex gap-4 items-center">
                      {agentInfo.photographUrl ? (
                        <S3Image src={agentInfo.photographUrl} alt="Agent" className="w-[72px] h-[88px] sm:w-20 sm:h-24 object-cover rounded-xl border-2 border-white/20 shadow-lg shrink-0" />
                      ) : (
                        <div className="w-[72px] h-[88px] sm:w-20 sm:h-24 bg-white/10 rounded-xl border-2 border-white/20 flex items-center justify-center text-xs text-white/40 shrink-0">No Photo</div>
                      )}
                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div>
                          <span className="text-[9px] text-blue-200 uppercase tracking-wider block">Agent Name</span>
                          <span className="text-base font-bold block truncate">{agentInfo.name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-blue-200 uppercase tracking-wider block">Agent ID</span>
                          <span className="text-[11px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded-lg block truncate">{agentInfo.id}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-blue-200 uppercase tracking-wider block">Mobile</span>
                          <span className="text-xs font-medium">{agentInfo.mobile}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10 flex justify-between text-[10px] text-white/50">
                      <span>Issued: {agentInfo.joiningDate}</span>
                      <span>Verified ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AgentDashboard;
