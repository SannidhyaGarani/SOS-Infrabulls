import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Home, LogIn } from 'lucide-react';

const ThankYou = () => {
    const { state } = useLocation();
    const loginId = state?.loginId;
    const emailSent = state?.emailSent;

    return (
        <div className="min-h-screen flex items-center bg-gradient-to-br from-[#f8faff] to-[#eef2f7]">
            <div className="max-w-7xl mx-auto px-4 w-full py-12">
                <div className="max-w-lg mx-auto text-center">
                    <div className="bg-white px-6 py-10 md:px-10 md:py-14 rounded-3xl shadow-xl border border-[#e1e8f0] transition-transform duration-300 hover:-translate-y-1">
                        <div className="flex justify-center mb-6">
                            <CheckCircle2
                                size={80}
                                className="text-[#1174d6] animate-[scale-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]"
                            />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A2540] tracking-tight">
                            Thank You!
                        </h1>
                        <p className="text-slate-500 text-base md:text-lg leading-relaxed mt-4 mb-4">
                            Your partner application has been received successfully.
                            Our team will review your documents and get back to you within 24-48 hours.
                        </p>

                        <div className="bg-[#1174d6]/5 border border-[#1174d6]/20 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm font-semibold text-[#0A2540] mb-2">Agent Panel Login Credentials</p>
                            {emailSent !== false ? (
                                <p className="text-sm text-slate-600">
                                    Your Login ID and 8-digit password have been sent to your registered email
                                    {loginId ? ` (${loginId})` : ''}. Please check your inbox and spam folder.
                                </p>
                            ) : (
                                <p className="text-sm text-slate-600">
                                    Your account has been created
                                    {loginId ? ` with Login ID: ${loginId}` : ''}.
                                    Email delivery failed — please contact support to receive your credentials.
                                </p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">
                                Login ID is your registered email address. Use these credentials to access the Agent Panel.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/agent/login"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1174d6] hover:bg-[#0d5fb3] text-white font-semibold rounded-xl transition-colors"
                            >
                                <LogIn size={18} />
                                Go to Agent Login
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-[#e1e8f0] text-slate-600 hover:bg-slate-50 font-semibold rounded-xl transition-colors"
                            >
                                <Home size={18} />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
