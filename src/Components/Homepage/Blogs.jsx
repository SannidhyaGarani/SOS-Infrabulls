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
        <section className="py-24 md:py-32 bg-gray-50/80">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog, idx) => (
                            <Reveal key={blog.id} delay={idx * 70}>
                                <article className="hp-card-lift group bg-white rounded-2xl overflow-hidden border border-gray-100 h-full flex flex-col">
                                    <Link to={`/blog/${blog.id}`} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
                                        <img
                                            src={blog.image || '/images/blog/blog-1.jpg'}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        {blog.category && (
                                            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-semibold tracking-wide uppercase text-gray-600">
                                                {blog.category}
                                            </span>
                                        )}
                                        <span className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowUpRight className="w-4 h-4 text-gray-700" />
                                        </span>
                                    </Link>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                {blog.date || 'Recent'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5 text-fuchsia-500" />
                                                {blog.author || 'SOS Infrabulls'}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-semibold text-gray-900 leading-snug mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                                        </h3>

                                        <Link
                                            to={`/blog/${blog.id}`}
                                            className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:gap-2.5 transition-all"
                                        >
                                            Read Article <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
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
