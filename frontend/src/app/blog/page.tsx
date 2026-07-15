"use client";
import { API_BASE_URL } from "@/config/api";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mockBlogs, BlogPost } from "@/data/blogs";
import { Search, Sparkles, BookOpen, Clock, Calendar, ArrowRight, Mail, Tag, User } from "lucide-react";

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const categories = ["All", "Architecture", "UI/UX Design", "AI", "Cloud"];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/public/blogs`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const formatted = data.map((b: any) => ({
            id: b.id.toString(),
            title: b.title,
            slug: b.slug,
            summary: b.summary,
            content: b.content,
            category: b.category,
            author: b.author?.username || "Admin",
            date: b.publishedAt ? b.publishedAt.split("T")[0] : b.createdAt.split("T")[0],
            readTime: "5 min read",
            tags: b.tags ? b.tags.split(",") : [],
            imageUrl: b.featuredImageUrl || "/blog-arch.jpg"
          }));
          setBlogs(formatted);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Unable to fetch blogs from API. Using local mock blogs fallback.");
    }
    setBlogs(mockBlogs);
    setLoading(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitting(true);
    setNewsletterError("");
    setNewsletterSuccess(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/public/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail, name: newsletterName || "Subscriber" })
      });
      if (res.ok) {
        setNewsletterSuccess(true);
        setNewsletterEmail("");
        setNewsletterName("");
      } else {
        const data = await res.json();
        setNewsletterError(data.message || "Subscription failed.");
      }
    } catch (err) {
      setNewsletterError("Unable to connect to newsletter service API.");
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  // Get all unique tags dynamically
  const allTags = Array.from(new Set(blogs.flatMap((b) => b.tags || [])));

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || blog.category === activeCategory;
    const matchesTag =
      !activeTag || (blog.tags && blog.tags.includes(activeTag));
    return matchesSearch && matchesCategory && matchesTag;
  });

  const featuredBlog = blogs[0];

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background decoration */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 text-xs text-[#00E5FF]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>DevNexa Insights</span>
          </div>
          <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Insights, Architectures & Design
          </h1>
          <p className="font-sans text-slate-400 text-sm md:text-base">
            Expert articles from our engineers covering Next.js 15, Spring Boot, security, and UI/UX animation design patterns.
          </p>
        </div>

        {/* Featured Post Banner */}
        {featuredBlog && activeCategory === "All" && searchQuery === "" && !activeTag && (
          <div className="glass-card border border-white/10 p-6 md:p-10 mb-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-full blur-[60px]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="font-mono text-xs text-[#00E5FF] uppercase bg-blue-500/15 border border-blue-500/20 px-3 py-1 rounded-md">
                  {featuredBlog.category}
                </span>
                <h2 className="font-grotesk text-2xl md:text-4xl font-bold text-white mt-6 mb-4 group-hover:text-[#00E5FF] transition-colors leading-tight">
                  <Link href={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                </h2>
                <p className="font-sans text-slate-400 text-sm md:text-base mb-8 leading-relaxed">
                  {featuredBlog.summary}
                </p>
                <div className="flex items-center gap-6 mb-8 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredBlog.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{featuredBlog.readTime}</span>
                  </div>
                  <span>By {featuredBlog.author}</span>
                </div>
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00E5FF] hover:underline"
                >
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Graphic container represent post */}
              <div className="relative aspect-video rounded-xl bg-white/5 border border-white/5 flex flex-col justify-center items-center p-8 overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#7C3AED]/20 rounded-full blur-[40px]" />
                <Sparkles className="w-12 h-12 text-[#00E5FF] mb-4 opacity-40" />
                <div className="font-mono text-[10px] text-slate-500 text-center max-w-xs space-y-2">
                  <p className="text-white">// Next.js + Spring Boot decoupled template</p>
                  <p>const secureAccess = jwt.verifyToken(authHeader);</p>
                  <p className="text-emerald-400">Response status: 200 OK</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Main Blog List (8/12 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="glass-card p-6 border border-white/5 glass-card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-mono text-[10px] text-[#00E5FF] uppercase bg-blue-500/10 px-2.5 py-1 rounded-md">
                          {blog.category}
                        </span>
                        {blog.tags && blog.tags.length > 0 && (
                          <span className="text-[9px] text-slate-500 flex items-center gap-1 font-mono">
                            <Tag className="w-2.5 h-2.5" />
                            {blog.tags[0]}
                          </span>
                        )}
                      </div>
                      <h3 className="font-grotesk text-lg font-bold text-white mt-2 mb-3 hover:text-[#00E5FF] transition-colors leading-tight">
                        <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>
                      <p className="font-sans text-slate-400 text-xs leading-relaxed mb-6">
                        {blog.summary}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-4 border-t border-white/5">
                        <span>{blog.date}</span>
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 font-sans text-xs">
                {loading ? "Loading articles..." : "No articles found matching your query."}
              </div>
            )}

            {/* Inline Newsletter Block */}
            <div className="glass-card-glow border border-white/10 p-8 relative overflow-hidden bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-[40px] pointer-events-none" />
              <div className="max-w-xl space-y-4">
                <h4 className="font-grotesk text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#00E5FF]" />
                  Subscribe to DevNexa Dispatch
                </h4>
                <p className="font-sans text-xs text-slate-400 leading-relaxed">
                  Join 10k+ subscribers getting weekly deep-dives on decoupled Next.js architectures, secure JVM microservices, and modern UI engineering guides.
                </p>

                {newsletterSuccess ? (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
                    Subscription confirmed! Check your inbox for confirmation links.
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      className="bg-[#050816] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40 sm:w-1/3"
                    />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="bg-[#050816] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40 flex-1"
                    />
                    <button
                      type="submit"
                      disabled={newsletterSubmitting}
                      className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2563EB] text-xs font-bold text-white shadow-md disabled:opacity-50"
                    >
                      {newsletterSubmitting ? "Subscribing..." : "Join Dispatch"}
                    </button>
                  </form>
                )}
                {newsletterError && (
                  <p className="text-red-400 text-[10px]">{newsletterError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Sidebar Filters & Info (4/12 cols) */}
          <div className="lg:col-span-4 space-y-8 font-sans">
            {/* Search widget */}
            <div className="glass-card-glow p-5 border border-white/5 space-y-3">
              <h4 className="font-grotesk text-xs uppercase tracking-wider text-slate-500 font-bold">Search Articles</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  placeholder="Type keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>
            </div>

            {/* Categories sidebar list */}
            <div className="glass-card-glow p-5 border border-white/5 space-y-3">
              <h4 className="font-grotesk text-xs uppercase tracking-wider text-slate-500 font-bold">Categories</h4>
              <div className="flex flex-col gap-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setActiveTag(null); // Clear tag when shifting categories
                    }}
                    className={`text-left py-2 px-3 rounded-lg transition-all flex justify-between items-center ${
                      activeCategory === cat
                        ? "bg-[#00E5FF]/10 text-[#00E5FF] font-bold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded-full text-slate-500">
                      {cat === "All"
                        ? blogs.length
                        : blogs.filter((b) => b.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Tag Cloud */}
            {allTags.length > 0 && (
              <div className="glass-card-glow p-5 border border-white/5 space-y-3">
                <h4 className="font-grotesk text-xs uppercase tracking-wider text-slate-500 font-bold">Trending Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-md border ${
                      !activeTag
                        ? "border-[#00E5FF] bg-[#00E5FF]/5 text-[#00E5FF] font-bold"
                        : "border-white/5 bg-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    #all
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md border ${
                        activeTag === tag
                          ? "border-[#00E5FF] bg-[#00E5FF]/5 text-[#00E5FF] font-bold"
                          : "border-white/5 bg-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meet the Authors */}
            <div className="glass-card-glow p-5 border border-white/5 space-y-4">
              <h4 className="font-grotesk text-xs uppercase tracking-wider text-slate-500 font-bold">Editorial Board</h4>
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] flex items-center justify-center font-bold text-white text-[10px]">
                    AK
                  </div>
                  <div>
                    <h5 className="font-bold text-white leading-tight">Aniket K.</h5>
                    <span className="text-[10px] text-slate-500">Lead Cloud Architect</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#10B981] to-[#00E5FF] flex items-center justify-center font-bold text-white text-[10px]">
                    RK
                  </div>
                  <div>
                    <h5 className="font-bold text-white leading-tight">Raushan K.</h5>
                    <span className="text-[10px] text-slate-500">Principal Security Engineer</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
