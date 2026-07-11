import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockBlogs, BlogPost } from "@/data/blogs";
import { ArrowLeft, Clock, Calendar, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetails({ params }: PageProps) {
  const { slug } = await params;
  
  let blog: BlogPost | null = null;

  try {
    const response = await fetch(`http://localhost:8080/api/public/blogs/${slug}`, {
      next: { revalidate: 60 }
    });
    if (response.ok) {
      const b = await response.json();
      blog = {
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
      };
    }
  } catch (e) {
    console.warn("Unable to fetch blog detail from API. Falling back to local mock blogs.");
  }

  // Fallback
  if (!blog) {
    const staticBlog = mockBlogs.find((b) => b.slug === slug);
    if (staticBlog) {
      blog = staticBlog;
    }
  }

  if (!blog) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background glowing blob */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Insights
        </Link>

        {/* Article Meta */}
        <div className="flex items-center gap-6 text-xs text-slate-500 mb-6">
          <span className="font-mono text-[10px] text-[#00E5FF] uppercase bg-blue-500/10 px-2.5 py-1 rounded-md">
            {blog.category}
          </span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{blog.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-grotesk text-3xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-tight">
          {blog.title}
        </h1>

        {/* Author details */}
        <div className="flex items-center gap-3 py-6 border-y border-white/5 mb-12">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] flex items-center justify-center font-bold text-xs text-white">
            {blog.author[0]}
          </div>
          <div>
            <h4 className="font-grotesk text-sm font-bold text-white leading-none">
              {blog.author}
            </h4>
            <span className="font-sans text-[10px] text-slate-500">
              Senior Software Architect
            </span>
          </div>
        </div>

        {/* Markdown content container */}
        <article className="prose prose-invert prose-slate max-w-none font-sans text-slate-300 leading-relaxed text-sm md:text-base space-y-6">
          <h2 className="font-grotesk text-2xl font-bold text-white mt-10 mb-4">Architecture Highlights</h2>
          <p>
            {blog.content ? blog.content : "Decoupled monorepos create a unified framework where teams work on front-facing visual structures and robust backends separately. It provides high code security and speeds up compilation build pipelines."}
          </p>

          <blockquote className="border-l-2 border-[#00E5FF] pl-4 py-1 my-6 italic text-slate-400 bg-white/5 rounded-r-lg">
            &ldquo;Decoupled architectures allow microservices to deploy on different container networks, mitigating system-wide single point of failures.&rdquo;
          </blockquote>

          <h3 className="font-grotesk text-lg font-semibold text-white mt-6 mb-2">Token-Based Security</h3>
          <p>
            By transmitting stateful authorizations inside client Authorization Bearer headers, Spring Boot controllers verify security cryptographically without hitting secondary Redis session caches, minimizing query delays.
          </p>
          
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 font-mono text-xs text-slate-400 mt-8">
            <span className="text-[#00E5FF]">Authorization:</span> Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxN...
          </div>
        </article>

        {/* Related Tags */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-[10px] font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
