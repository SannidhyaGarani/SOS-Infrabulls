import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const GradientText = ({ children, className = '' }) => (
    <span className={`bg-gradient-to-r from-blue-600 via-cyan-500 to-fuchsia-500 bg-clip-text text-transparent ${className}`}>
        {children}
    </span>
);

export const SectionEyebrow = ({ children }) => (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-600 mb-5">
        <span className="w-8 h-px bg-gradient-to-r from-blue-600 to-fuchsia-500" />
        {children}
    </span>
);

export const SectionTitle = ({ eyebrow, title, highlight, subtitle, align = 'left', className = '' }) => (
    <div className={`${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
        {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-[1.15]">
            {title}{' '}
            {highlight && <GradientText>{highlight}</GradientText>}
        </h2>
        {subtitle && (
            <p className={`mt-5 text-gray-500 text-base md:text-lg font-light leading-relaxed ${align === 'center' ? 'mx-auto' : ''} max-w-2xl`}>
                {subtitle}
            </p>
        )}
    </div>
);

export const Reveal = ({ children, className = '', delay = 0 }) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.transitionDelay = `${delay}ms`;
                    el.classList.add('hp-reveal--visible');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`hp-reveal ${className}`}>
            {children}
        </div>
    );
};

export const BtnPrimary = ({ children, to, onClick, className = '' }) => {
    const classes = `group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white text-xs font-semibold tracking-[0.18em] uppercase rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300 ${className}`;

    if (to) {
        return (
            <Link to={to} className={classes}>
                {children}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={classes}>
            {children}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
    );
};

export const BtnOutline = ({ children, to, onClick, className = '' }) => {
    const classes = `inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-gray-700 text-xs font-semibold tracking-[0.18em] uppercase rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors duration-300 ${className}`;

    if (to) {
        return <Link to={to} className={classes}>{children}</Link>;
    }

    return <button type="button" onClick={onClick} className={classes}>{children}</button>;
};

export const DividerGradient = () => (
    <div className="w-16 h-px bg-gradient-to-r from-blue-600 via-cyan-400 to-fuchsia-500 mt-6" />
);
