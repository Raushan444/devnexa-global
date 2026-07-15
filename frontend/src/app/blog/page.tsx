"use client";
import { API_BASE_URL } from "@/config/api";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mockBlogs, BlogPost } from "@/data/blogs";
import { Search, Sparkles, BookOpen, Clock, Calendar, ArrowRight } from "lucide-react";

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Architecture", "UI/UX Design"];

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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBlog = blogs[0];

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background blobs */}
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
        {featuredBlog && activeCategory === "All" && searchQuery === "" && (
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

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  activeCategory === category
                    ? "bg-[#00E5FF] border-[#00E5FF] text-[#070B16]"
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070B16] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]/40"
            />
          </div>
        </div>

        {/* Blog Post Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="glass-card p-6 border border-white/5 glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-[#00E5FF] uppercase bg-blue-500/10 px-2.5 py-1 rounded-md">
                    {blog.category}
                  </span>
                  <h3 className="font-grotesk text-xl font-bold text-white mt-4 mb-3 hover:text-[#00E5FF] transition-colors">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>
                  <p className="font-sans text-slate-400 text-xs md:text-sm leading-relaxed mb-6">
                    {blog.summary}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-white/5">
                    <span>{blog.date}</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            {loading ? "Loading articles..." : "No articles found matching your query."}
          </div>
        )}
      </div>
    </div>
  );
}
