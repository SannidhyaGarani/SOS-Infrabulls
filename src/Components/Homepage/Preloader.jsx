import React, { useEffect, useState } from 'react';
import './homepage.css';

const PremiumPreloader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 15));
        }, 60);

        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setShowContent(true), 600);
        }, 1600);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(loadingTimer);
        };
    }, []);

    if (showContent) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700 ${
                isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div className="flex flex-col items-center max-w-sm w-full px-6">
                <div className="relative mb-8">
                    <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
                        <img
                            src="images/logo/logo@2x.png"
                            alt="SOS Infrabulls"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div
                        className="absolute -inset-2 border-2 border-transparent border-t-blue-600 border-r-fuchsia-500 rounded-full animate-spin"
                        style={{ animationDuration: '2.5s' }}
                    />
                </div>

                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                        SOS <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">Infrabulls</span>
                    </h1>
                    <p className="text-gray-400 text-[10px] tracking-[0.25em] uppercase">
                        Premium Real Estate
                    </p>
                </div>

                <div className="w-full max-w-[200px]">
                    <div className="h-px w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-fuchsia-500 transition-all duration-200"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumPreloader;
