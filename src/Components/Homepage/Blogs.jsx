import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../Firebase';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, ArrowUpRight } from 'lucide-react';
import { SectionTitle, Reveal } from './ui';

const BlogsSpotlight = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const blogQuery = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(3));

        const unsubscribe = onSnapshot(blogQuery, (snapshot) => {
            setBlogs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (!loading && blogs.length === 0) return null;

    return (
        <section className="py-10 md:py-14 bg-gray-50/80">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <Reveal>
                        <SectionTitle
                            eyebrow="Latest Insights"
                            title="From our"
                            highlight="journal"
                            subtitle="Expert perspectives on real estate trends, investment strategies, and market opportunities."
                        />
                    </Reveal>

                    <Reveal delay={80}>
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-xs font-semibold tracking-wide text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors shrink-0"
                        >
                            View All Posts
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Reveal>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog, idx) => (
                                <Reveal key={blog.id} delay={idx * 100}>
                                    <article className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 h-full flex flex-col relative">
                                        {/* Image wrapper with zoom effect */}
                                        <Link to={`/blog/${blog.id}`} className="block relative aspect-[16/11] overflow-hidden">
                                            <img
                                                src={blog.image || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80`}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                            
                                            {blog.category && (
                                                <div className="absolute top-5 left-5">
                                                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-bold tracking-[0.15em] uppercase text-gray-900 shadow-sm">
                                                        {blog.category}
                                                    </span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Content Area */}
                                        <div className="p-8 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                    {blog.date || 'Recent'}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                <span className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-fuchsia-500" />
                                                    {blog.author || 'Editorial'}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                                            </h3>

                                            <p className="text-gray-500 text-[15px] font-light leading-relaxed line-clamp-2 mb-6">
                                                {blog.excerpt || 'Discover the latest trends and insights in the premium real estate market.'}
                                            </p>

                                            <div className="mt-auto pt-6 border-t border-gray-50">
                                                <Link
                                                    to={`/blog/${blog.id}`}
                                                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-900 group-hover:text-blue-600 tracking-widest uppercase transition-all"
                                                >
                                                    Read Full Insight <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                )}
            </div>
        </section>
    );
};

export default BlogsSpotlight;
