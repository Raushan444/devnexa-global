"use client";
import { useState } from "react";
import Link from "next/link";
import { ExternalLink, GitBranch, Clock, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Web App", "Mobile", "AI/ML", "API", "E-Commerce"];

const projects = [
  {
    title: "FinTrack Pro",
    category: "Web App",
    slug: "fintrack-pro",
    description: "Enterprise-grade financial tracking dashboard with real-time analytics, Stripe invoicing, and AI-powered expense categorization.",
    tech: ["Next.js", "Spring Boot", "PostgreSQL", "Stripe", "Redis"],
    duration: "8 weeks",
    budget: "$28,000",
    gradient: "from-[#00E5FF] to-[#7C3AED]",
    live: "#",
    github: "#",
  },
  {
    title: "MediConnect",
    category: "Web App",
    slug: "mediconnect",
    description: "HIPAA-compliant healthcare patient portal with appointment scheduling, telemedicine integration, and EHR data pipelines.",
    tech: ["React", "Java", "MySQL", "Docker", "WebSocket"],
    duration: "12 weeks",
    budget: "$45,000",
    gradient: "from-[#10B981] to-[#00E5FF]",
    live: "#",
    github: "#",
  },
  {
    title: "ShopNova",
    category: "E-Commerce",
    slug: "shopnova",
    description: "High-performance e-commerce platform with AI-powered product recommendations, multi-vendor support, and Razorpay integration.",
    tech: ["Next.js", "Node.js", "MongoDB", "Razorpay", "Redis"],
    duration: "10 weeks",
    budget: "$32,000",
    gradient: "from-[#F59E0B] to-[#EF4444]",
    live: "#",
    github: "#",
  },
  {
    title: "NeuralAssist",
    category: "AI/ML",
    slug: "neuralassist",
    description: "Enterprise AI assistant platform integrating GPT-4 and Gemini for automated document analysis, code review, and business insights.",
    tech: ["Python", "FastAPI", "Gemini API", "Next.js", "PostgreSQL"],
    duration: "6 weeks",
    budget: "$22,000",
    gradient: "from-[#7C3AED] to-[#EC4899]",
    live: "#",
    github: "#",
  },
  {
    title: "DeliverFlow",
    category: "Mobile",
    slug: "deliverflow",
    description: "Real-time logistics tracking app with driver management, route optimization, and live push notifications for 50k+ daily orders.",
    tech: ["React Native", "Spring Boot", "PostgreSQL", "Google Maps", "FCM"],
    duration: "14 weeks",
    budget: "$55,000",
    gradient: "from-[#EF4444] to-[#F59E0B]",
    live: "#",
    github: "#",
  },
  {
    title: "DataBridge API",
    category: "API",
    slug: "databridge-api",
    description: "High-throughput REST API gateway handling 2M+ daily requests with custom rate limiting, caching, and schema validation.",
    tech: ["Spring Boot", "Redis", "Docker", "Nginx", "Prometheus"],
    duration: "5 weeks",
    budget: "$18,000",
    gradient: "from-[#06B6D4] to-[#10B981]",
    live: "#",
    github: "#",
  },
];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-[0.3em] mb-4">Our Work</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Featured <span className="text-[#7C3AED]">Portfolio</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">Enterprise solutions delivered with precision, built to scale.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/25'
                  : 'border border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Gradient header */}
                <Link href={`/portfolio/${project.slug}`}>
                  <div className={`h-32 bg-gradient-to-r ${project.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500 flex items-center justify-center cursor-pointer`}>
                    <span className="text-white/30 text-5xl font-black select-none">{project.category[0]}</span>
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link href={`/portfolio/${project.slug}`}>
                        <h3 className="text-lg font-bold text-white hover:text-[#00E5FF] transition-colors cursor-pointer">{project.title}</h3>
                      </Link>
                      <span className="text-xs text-[#00E5FF] font-medium">{project.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/portfolio/${project.slug}`} className="p-2 rounded-lg border border-white/5 hover:border-[#00E5FF]/30 hover:text-[#00E5FF] text-slate-400 transition-all">
                        <ExternalLink size={14} />
                      </Link>
                      <a href={project.github} className="p-2 rounded-lg border border-white/5 hover:border-white/20 text-slate-400 hover:text-white transition-all">
                        <GitBranch size={14} />
                      </a>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5">{t}</span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={11}/>{project.duration}</span>
                    <span className="flex items-center gap-1"><DollarSign size={11}/>{project.budget}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
