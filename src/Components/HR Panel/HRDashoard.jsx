import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, LogOut, Search, Menu, X,
  Eye, CheckCircle2, XCircle, Clock, Loader2, RefreshCw, ExternalLink,
  ChevronRight, Mail, Phone, Calendar
} from 'lucide-react';
import {
  fetchAllAgents,
  approveAgent,
  unapproveAgent,
  formatAgentName,
  formatDate,
} from '../Firebase/hrHelpers';
import S3Image from '../S3Image';
import { getImageViewUrl } from '../Firebase/s3UploadService';
import { signOutAdmin } from '../Firebase/authHelpers';

const statusStyle = (status) => {
  if (status === 'Approved') return 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80';
  if (status === 'Rejected') return 'bg-rose-500/10 text-rose-700 border-rose-200/80';
  return 'bg-amber-500/10 text-amber-700 border-amber-200/80';
};

const DetailRow = ({ label, value }) => (
  <div className="min-w-0">
    <span className="text-slate-400 block mb-1 text-[11px] font-medium uppercase tracking-wide">{label}</span>
    <span className="font-semibold text-[#0A2540] text-sm break-words">{value || '—'}</span>
  </div>
);

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllAgents();
      setAgents(data);
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAgents(); }, [loadAgents]);

  const stats = {
    total: agents.length,
    pending: agents.filter((a) => a.status !== 'Approved').length,
    approved: agents.filter((a) => a.status === 'Approved').length,
  };

  const filteredAgents = agents.filter((a) => {
    const q = searchQuery.toLowerCase();
    const name = formatAgentName(a).toLowerCase();
    return name.includes(q) || (a.email || '').toLowerCase().includes(q) || (a.mobile1 || '').includes(q);
  });

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setSelectedAgent(null);
    setSidebarOpen(false);
  };

  const handleView = (agent) => {
    setSelectedAgent(agent);
    setActiveTab('details');
    setSidebarOpen(false);
  };

  const handleApprove = async (agent) => {
    setActionLoading(true);
    try {
      await approveAgent(agent.id, agent.partnerRequestId);
      await loadAgents();
      if (selectedAgent?.id === agent.id) setSelectedAgent((prev) => ({ ...prev, status: 'Approved' }));
    } catch {
      alert('Failed to approve. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnapprove = async (agent) => {
    setActionLoading(true);
    try {
      await unapproveAgent(agent.id, agent.partnerRequestId);
      await loadAgents();
      if (selectedAgent?.id === agent.id) setSelectedAgent((prev) => ({ ...prev, status: 'Pending' }));
    } catch {
      alert('Failed to unapprove. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'registrations', name: 'Registrations', icon: UserCheck, badge: stats.pending || null },
    { id: 'approved', name: 'Approved Agents', icon: Users },
  ];

  const listAgents =
    activeTab === 'approved'
      ? filteredAgents.filter((a) => a.status === 'Approved')
      : activeTab === 'registrations'
        ? filteredAgents
        : [];

  const pageTitle = {
    dashboard: 'Dashboard',
    registrations: 'Partner Registrations',
    approved: 'Approved Agents',
    details: 'Applicant Details',
  }[activeTab] || 'HR Portal';

  const AgentActions = ({ agent, compact = false }) => (
    <div className={`flex ${compact ? 'flex-col w-full gap-2' : 'items-center gap-2'}`}>
      <button
        onClick={() => handleView(agent)}
        className={`${compact ? 'w-full justify-center' : ''} inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:border-[#1174d6]/30 hover:text-[#1174d6] hover:bg-[#1174d6]/5 text-xs font-semibold transition-all`}
      >
        <Eye className="w-3.5 h-3.5" /> View
      </button>
      {agent.status === 'Approved' ? (
        <button
          onClick={() => handleUnapprove(agent)}
          disabled={actionLoading}
          className={`${compact ? 'w-full justify-center' : ''} inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-200/80 text-amber-700 hover:bg-amber-500/20 text-xs font-semibold disabled:opacity-50 transition-all`}
        >
          Unapprove
        </button>
      ) : (
        <button
          onClick={() => handleApprove(agent)}
          disabled={actionLoading}
          className={`${compact ? 'w-full justify-center' : ''} inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1174d6] text-white hover:bg-[#0d5fb3] text-xs font-semibold shadow-sm shadow-[#1174d6]/20 disabled:opacity-50 transition-all`}
        >
          Approve
        </button>
      )}
    </div>
  );

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
              <span className="text-[10px] text-[#1174d6] font-bold uppercase tracking-widest">HR Portal</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'details' && item.id === 'registrations');
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1174d6] to-[#0d5fb3] text-white shadow-lg shadow-[#1174d6]/25'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0A2540]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0 space-y-2">
          <Link 
            to="/admin"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#1174d6] transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Content Admin</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-[280px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-200/40">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 h-[68px]">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-[#0A2540] truncate">{pageTitle}</h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">Manage partner onboarding & approvals</p>
              </div>
            </div>
            <button
              onClick={loadAgents}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-[#1174d6] bg-[#1174d6]/5 hover:bg-[#1174d6]/10 rounded-xl border border-[#1174d6]/10 transition-all shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Refresh</span>
            </button>
          </div>
          {(activeTab === 'registrations' || activeTab === 'approved') && (
            <div className="px-4 sm:px-6 lg:px-8 pb-4">
              <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#1174d6]/20 focus-within:border-[#1174d6]/40 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search name, email, or mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
                />
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {loading && agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-9 h-9 animate-spin text-[#1174d6]" />
              <p className="text-sm text-slate-400">Loading registrations...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0d3a6b] to-[#1174d6] p-6 sm:p-8 text-white shadow-xl shadow-[#1174d6]/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1174d6]/30 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
                    <div className="relative z-10">
                      <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold tracking-wider uppercase mb-3">HR Command Center</span>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome, HR Team</h2>
                      <p className="text-blue-100/80 text-sm sm:text-base mt-2 max-w-lg">Review partner applications, verify documents, and manage agent approvals from one place.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: 'Total Registrations', value: stats.total, icon: Users, gradient: 'from-blue-500 to-indigo-600' },
                      { title: 'Pending Approval', value: stats.pending, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
                      { title: 'Approved Agents', value: stats.approved, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-600' },
                    ].map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <div key={i} className="group bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                          <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.title}</span>
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-lg`}>
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                          <span className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-4 block tracking-tight">{s.value}</span>
                        </div>
                      );
                    })}
                  </div>

                  {stats.pending > 0 && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 shrink-0">
                          <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-900 text-sm">Action Required</p>
                          <p className="text-sm text-amber-800/80 mt-0.5">
                            <strong>{stats.pending}</strong> registration{stats.pending > 1 ? 's' : ''} awaiting your review.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigateTo('registrations')}
                        className="inline-flex items-center justify-center gap-1 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0"
                      >
                        Review Now <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {(activeTab === 'registrations' || activeTab === 'approved') && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm sm:text-base font-bold text-[#0A2540]">
                      {activeTab === 'approved' ? 'Approved Agents' : 'All Partner Registrations'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{listAgents.length} record{listAgents.length !== 1 ? 's' : ''} found</p>
                  </div>

                  {listAgents.length === 0 ? (
                    <div className="p-12 text-center">
                      <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No registrations found.</p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="bg-slate-50/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                              <th className="px-6 py-4 font-bold">Applicant</th>
                              <th className="px-4 py-4 font-bold">Contact</th>
                              <th className="px-4 py-4 font-bold">Applied On</th>
                              <th className="px-4 py-4 font-bold">Status</th>
                              <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {listAgents.map((agent) => (
                              <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <p className="font-semibold text-[#0A2540]">{formatAgentName(agent)}</p>
                                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{agent.email}</p>
                                </td>
                                <td className="px-4 py-4 text-slate-600 text-sm">{agent.mobile1}</td>
                                <td className="px-4 py-4 text-slate-500 text-sm">{formatDate(agent.createdAt)}</td>
                                <td className="px-4 py-4">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle(agent.status)}`}>
                                    {agent.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <AgentActions agent={agent} />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="md:hidden p-4 space-y-3">
                        {listAgents.map((agent) => (
                          <div key={agent.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-[#0A2540] truncate">{formatAgentName(agent)}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                                  <Mail className="w-3 h-3 shrink-0" /> {agent.email}
                                </p>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3 shrink-0" /> {agent.mobile1}
                                </p>
                              </div>
                              <span className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-bold border ${statusStyle(agent.status)}`}>
                                {agent.status || 'Pending'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Applied {formatDate(agent.createdAt)}
                            </p>
                            <AgentActions agent={agent} compact />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'details' && selectedAgent && (
                <div className="space-y-5">
                  <button
                    onClick={() => navigateTo('registrations')}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#1174d6] hover:text-[#0d5fb3] transition-colors"
                  >
                    ← Back to Registrations
                  </button>

                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="relative bg-gradient-to-r from-[#0A2540] to-[#1174d6] px-5 sm:px-8 py-6 sm:py-8 text-white">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        {selectedAgent.photographUrl ? (
                          <S3Image src={selectedAgent.photographUrl} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl" />
                        ) : (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-bold ring-4 ring-white/20">
                            {formatAgentName(selectedAgent).charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl sm:text-2xl font-bold truncate">{formatAgentName(selectedAgent)}</h2>
                          <p className="text-blue-100/80 text-sm mt-1 truncate">{selectedAgent.email}</p>
                          <p className="text-blue-100/60 text-sm">{selectedAgent.mobile1}</p>
                        </div>
                        <span className={`self-start px-4 py-1.5 rounded-full text-sm font-bold border bg-white/10 backdrop-blur-sm ${statusStyle(selectedAgent.status)}`}>
                          {selectedAgent.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-8 space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <div className="space-y-5">
                          <h3 className="text-xs font-bold uppercase text-[#1174d6] tracking-widest">Personal Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                            <DetailRow label="First Name" value={selectedAgent.firstName} />
                            <DetailRow label="Middle Name" value={selectedAgent.middleName} />
                            <DetailRow label="Last Name" value={selectedAgent.lastName} />
                            <DetailRow label="Date of Birth" value={selectedAgent.dob} />
                            <DetailRow label="Application Date" value={selectedAgent.date} />
                            <DetailRow label="Mobile 1" value={selectedAgent.mobile1} />
                            <DetailRow label="Mobile 2" value={selectedAgent.mobile2} />
                            <DetailRow label="Email" value={selectedAgent.email} />
                            <DetailRow label="PAN Number" value={selectedAgent.panCardNo} />
                            <DetailRow label="Aadhaar Number" value={selectedAgent.aadhaarCardNo} />
                          </div>

                          <h3 className="text-xs font-bold uppercase text-[#1174d6] tracking-widest">Father / Husband</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                            <DetailRow label="First" value={selectedAgent.fatherHusbandName} />
                            <DetailRow label="Middle" value={selectedAgent.fatherHusbandMiddleName} />
                            <DetailRow label="Last" value={selectedAgent.fatherHusbandLastName} />
                          </div>
                        </div>

                        <div className="space-y-5">
                          <h3 className="text-xs font-bold uppercase text-[#1174d6] tracking-widest">Local Address</h3>
                          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-sm leading-relaxed">
                            <p className="font-medium text-[#0A2540]">{selectedAgent.localAddressLine2 || '—'}</p>
                            <p className="text-slate-500 mt-1">{selectedAgent.localCity}, {selectedAgent.localState} — {selectedAgent.localPinCode}</p>
                          </div>

                          <h3 className="text-xs font-bold uppercase text-[#1174d6] tracking-widest">Permanent Address</h3>
                          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-sm leading-relaxed">
                            <p className="font-medium text-[#0A2540]">{selectedAgent.permanentAddressLine1 || '—'}</p>
                            <p className="text-slate-500 mt-1">{selectedAgent.permanentCity}, {selectedAgent.permanentState} — {selectedAgent.permanentPinCode}</p>
                          </div>

                          <h3 className="text-xs font-bold uppercase text-[#1174d6] tracking-widest">Uploaded Documents</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { label: 'Photograph', url: selectedAgent.photographUrl },
                              { label: 'PAN Card', url: selectedAgent.panCardUrl },
                              { label: 'Aadhaar Card', url: selectedAgent.aadhaarCardUrl },
                            ].map((doc) => (
                              <div key={doc.label} className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                                {doc.url ? (
                                  <S3Image src={doc.url} alt={doc.label} className="w-full h-28 object-cover bg-slate-100" />
                                ) : (
                                  <div className="w-full h-28 bg-slate-100 flex items-center justify-center text-xs text-slate-400">No file</div>
                                )}
                                <div className="p-3">
                                  <span className="text-xs font-bold text-[#0A2540] block mb-2">{doc.label}</span>
                                  {doc.url ? (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const url = await getImageViewUrl(doc.url);
                                        if (url) window.open(url, '_blank', 'noopener,noreferrer');
                                      }}
                                      className="inline-flex items-center gap-1 text-xs text-[#1174d6] hover:underline font-semibold"
                                    >
                                      <ExternalLink className="w-3 h-3" /> Open
                                    </button>
                                  ) : (
                                    <span className="text-xs text-slate-400">Not uploaded</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                        {selectedAgent.status === 'Approved' ? (
                          <button
                            onClick={() => handleUnapprove(selectedAgent)}
                            disabled={actionLoading}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-200 text-amber-700 rounded-2xl text-sm font-bold hover:bg-amber-500/20 disabled:opacity-50 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            {actionLoading ? 'Processing...' : 'Unapprove Agent'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(selectedAgent)}
                            disabled={actionLoading}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1174d6] to-[#0d5fb3] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#1174d6]/25 hover:shadow-xl disabled:opacity-50 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {actionLoading ? 'Processing...' : 'Approve Agent'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;
