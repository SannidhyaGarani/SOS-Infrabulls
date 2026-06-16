import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import { signInAgent } from '../Firebase/agentHelpers';

const inputClass =
  'w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all';

const AgentLogin = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInAgent(loginId, password);
      navigate('/agent/dashboard');
    } catch (err) {
      const message =
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Invalid login ID or password.'
          : err.code === 'auth/user-not-found'
            ? 'No account found with this login ID.'
            : err.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8faff] to-[#eef2f7] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/img/logo.jpeg"
            alt="Mahanta Group Logo"
            className="h-24 w-auto mx-auto mb-4"
          />
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#1174d6] bg-[#1174d6]/10">
            AGENT PORTAL
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A2540] mt-3">
            Agent Login
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Use the Login ID and Password sent to your registered email address.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[#e1e8f0] p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Login ID (Email)
              </label>
              <input
                type="email"
                className={inputClass}
                placeholder="your.email@example.com"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputClass} pr-12`}
                  placeholder="8-digit password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-12 bg-[#1174d6] hover:bg-[#0d5fb3] text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Login to Agent Panel
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Credentials are sent to your registered email after partner registration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;
