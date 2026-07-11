"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Code,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle,
  Zap,
  Monitor,
  Code2,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Cloud,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Lock,
  Globe,
  Database,
  Terminal,
  Server,
  Layers2
} from "lucide-react";
import Logo from "@/components/Logo";
import LoadingScreen from "@/components/LoadingScreen";
import ThreeHero from "@/components/ThreeHero";
import { COMPANY_INFO } from "@/data/company";
import StatsCounter from "@/components/StatsCounter";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import ProcessTimeline from "@/components/ProcessTimeline";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";

// Form validation schema matching backend
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  meetingType: z.enum(["CONSULTATION", "AUDIT", "PARTNERSHIP"]),
  scheduledTime: z.string().min(1, "Please pick a date and time"),
  description: z.string().min(10, "Brief details must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;



export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [typedTitle, setTypedTitle] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [activeTechTab, setActiveTechTab] = useState("frontend");
  
  // Magnetic button coordinates
  const [btnCoords, setBtnCoords] = useState({ x: 0, y: 0 });
  const [isHoveredBtn, setIsHoveredBtn] = useState(false);

  // Scroll Parallax references
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Typewriter effect
  const fullTitle = "Building Digital. Elevating Brands.";
  useEffect(() => {
    if (isLoading) return;
    let index = 0;
    const interval = setInterval(() => {
      setTypedTitle(fullTitle.substring(0, index + 1));
      index++;
      if (index >= fullTitle.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Magnetic button effect handler
  const handleMouseMoveBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnCoords({ x: x * 0.4, y: y * 0.4 });
  };

  const handleMouseLeaveBtn = () => {
    setBtnCoords({ x: 0, y: 0 });
    setIsHoveredBtn(false);
  };

  // 3D Card Hover coordinates tracker
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 20 - 10; // -10 to 10
    const y = -(((e.clientY - rect.top) / rect.height) * 20 - 10); // -10 to 10
    setCardTilt({ x, y });
    setHoveredCardIdx(idx);
  };

  const handleMouseLeaveCard = () => {
    setCardTilt({ x: 0, y: 0 });
    setHoveredCardIdx(null);
  };

  // Hook Form integration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      meetingType: "CONSULTATION"
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setFormErrorMsg("");
    try {
      const response = await fetch("http://localhost:8080/api/public/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const resJson = await response.json();
      if (response.ok && resJson.success) {
        setIsFormSubmitted(true);
        reset();
      } else {
        setFormErrorMsg(resJson.message || "Failed to submit request.");
      }
    } catch (e) {
      setFormErrorMsg("Unable to connect to backend server. Please verify port 8080 is online!");
    }
  };

  const trustValues = [
    { title: "Passion for Quality", desc: "Crafting beautiful layouts with clean SOLID design patterns and zero shortcuts.", icon: <Sparkles className="w-5 h-5 text-[#00E5FF]" /> },
    { title: "Modern Development", desc: "Utilizing Next.js 15, React 19, TypeScript, and Tailwind CSS v4 structures.", icon: <Code className="w-5 h-5 text-[#7C3AED]" /> },
    { title: "Fast Delivery", desc: "Iterating efficiently in structured sprints to compile production-ready apps rapidly.", icon: <Zap className="w-5 h-5 text-amber-400" /> },
    { title: "Transparent Communication", desc: "No middle-men. Collaborate directly with the developer via Slack and live portal logs.", icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
    { title: "Client-First Approach", desc: "Aligning digital solutions exactly with your core customer flow and business goals.", icon: <ShieldCheck className="w-5 h-5 text-[#2563EB]" /> },
    { title: "Scalable Solutions", desc: "Decoupled backend API architectures designed to grow seamlessly as your traffic expands.", icon: <Layers className="w-5 h-5 text-[#D946EF]" /> },
    { title: "Continuous Learning", desc: "Staying ahead of the curve, deploying modern frameworks, LLMs, and vector stores.", icon: <Cpu className="w-5 h-5 text-[#00E5FF]" /> },
    { title: "Latest Technologies", desc: "Utilizing Docker pipelines, H2/PostgreSQL databases, and high-security JWT layers.", icon: <Cloud className="w-5 h-5 text-indigo-400" /> },
  ];

  const services = [
    { title: "Website Development", desc: "Stunning glassmorphic marketing sites and high-performance landing pages optimized for search engines.", icon: <Monitor className="w-6 h-6 text-[#00E5FF]" /> },
    { title: "UI/UX Design", desc: "Premium mobile-responsive user flows, wireframes, and luxury dark layout scheme designs.", icon: <Layers2 className="w-6 h-6 text-[#7C3AED]" /> },
    { title: "Full Stack Development", desc: "Robust web applications powered by decoupled architectures (Next.js & Spring Boot).", icon: <Code2 className="w-6 h-6 text-[#2563EB]" /> },
    { title: "AI API Integration", desc: "Connecting databases and customer chats with Gemini/OpenAI API engines for automation.", icon: <Cpu className="w-6 h-6 text-[#D946EF]" /> },
    { title: "Dashboard Development", desc: "Custom analytical trackers, client portals, and CMS control panels with clean visual grids.", icon: <Layers className="w-6 h-6 text-emerald-400" /> },
    { title: "SEO & Performance", desc: "Gzip asset compression, caching rules, and structured tags to push Lighthouse scores to 95+.", icon: <Rocket className="w-6 h-6 text-amber-400" /> }
  ];

  const processSteps = [
    { phase: "Discovery", desc: "Understanding goals, wireframing pages, and defining REST API contracts." },
    { phase: "Planning", desc: "Structuring milestones and mapping the database entity relationships." },
    { phase: "Design", desc: "Crafting modern, luxury glassmorphic layouts and interactive motion guides." },
    { phase: "Development", desc: "Writing clean Next.js React templates and securing Spring Boot backends." },
    { phase: "Testing", desc: "Running unit checks, validating rate limits, and caching database logs." },
    { phase: "Launch", desc: "Configuring Docker configs, Nginx proxies, and launching live servers." },
    { phase: "Support", desc: "Providing continuous uptime optimization, upgrades, and feature additions." }
  ];

  const techCategories: Record<string, Array<{ name: string; icon: React.ReactNode }>> = {
    frontend: [
      { name: "Next.js 16", icon: <Sparkles className="w-4 h-4 text-[#00E5FF]" /> },
      { name: "React 19", icon: <Code className="w-4 h-4 text-[#00E5FF]" /> },
      { name: "TypeScript", icon: <Globe className="w-4 h-4 text-[#00E5FF]" /> },
      { name: "Tailwind CSS v4", icon: <Layers className="w-4 h-4 text-[#00E5FF]" /> }
    ],
    backend: [
      { name: "Spring Boot", icon: <Server className="w-4 h-4 text-[#7C3AED]" /> },
      { name: "Java 21/26", icon: <Terminal className="w-4 h-4 text-[#7C3AED]" /> },
      { name: "Spring Security", icon: <Lock className="w-4 h-4 text-[#7C3AED]" /> },
      { name: "JWT Authorization", icon: <ShieldCheck className="w-4 h-4 text-[#7C3AED]" /> }
    ],
    database: [
      { name: "PostgreSQL", icon: <Database className="w-4 h-4 text-amber-400" /> },
      { name: "Redis Cache", icon: <Zap className="w-4 h-4 text-amber-400" /> },
      { name: "H2 Database", icon: <Database className="w-4 h-4 text-amber-400" /> }
    ],
    cloud: [
      { name: "Docker Containers", icon: <Cloud className="w-4 h-4 text-emerald-400" /> },
      { name: "Nginx Server", icon: <Server className="w-4 h-4 text-emerald-400" /> },
      { name: "Vercel Deployments", icon: <Rocket className="w-4 h-4 text-emerald-400" /> }
    ]
  };

  const projects = [
    { title: "SaaS Analytics Dashboard", category: "Full Stack Apps", desc: "Interactive charts, invoice pipelines, and client logs synced with H2 database endpoints.", imageText: "React 19 + Spring Boot" },
    { title: "E-Commerce Experience", category: "Websites", desc: "Glassmorphic product grids, rapid loading, Stripe payments, and clean SEO tags.", imageText: "Next.js 15 + Tailwind v4" },
    { title: "AI Auditor Hub", category: "AI Automation", desc: "Metadata analysis and crawl tools powered by Gemini API, offering detailed report overlays.", imageText: "LLM + Vector Index" }
  ];

  return (
    <div
      ref={containerRef}
      className="relative bg-[#050816] text-[#F8FAFC] min-h-screen overflow-hidden selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]"
    >
      {/* Intro Loader screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Static background mesh grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Floating Liquid Glass Blobs for light/dark ambient depth */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#7c3aed]/10 to-[#00e5ff]/10 blur-[120px] pointer-events-none animate-float-blob" />
          <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#d946ef]/10 blur-[130px] pointer-events-none animate-float-blob" style={{ animationDelay: "-5s" }} />
          <div className="absolute top-[40%] left-[20%] w-[45%] h-[45%] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.08)_0%,transparent_60%)] blur-[100px] pointer-events-none animate-float-blob" style={{ animationDelay: "-10s" }} />

          {/* Hero Section (Cinematic 115vh presentation) */}
          <section className="relative min-h-[115vh] flex flex-col justify-between pt-36 pb-12 px-8 max-w-[1550px] mx-auto overflow-hidden z-10">
            {/* Ambient glows behind hero */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-[#00E5FF]/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
              {/* Text column (Col span 7) */}
              <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
                {/* Intro Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white/5 border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                  <span className="font-sans text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-300">
                    Premium Freelance Software Architect
                  </span>
                </motion.div>

                {/* Main Headline */}
                <h1 className="font-grotesk text-5xl md:text-8xl font-black tracking-tight leading-none text-white">
                  {typedTitle}
                  <span className="text-[#00E5FF] animate-pulse">|</span>
                </h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="font-sans text-slate-400 text-sm md:text-xl leading-relaxed max-w-xl"
                >
                  A passionate freelance developer focused on creating modern websites, scalable web applications, and digital solutions for startups, small businesses, and growing brands.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
                >
                  <Link href="#contact" className="w-full sm:w-auto">
                    <motion.button
                      onMouseMove={handleMouseMoveBtn}
                      onMouseLeave={handleMouseLeaveBtn}
                      onMouseEnter={() => setIsHoveredBtn(true)}
                      animate={{ x: btnCoords.x, y: btnCoords.y }}
                      transition={{ type: "spring", stiffness: 150, damping: 15 }}
                      className="w-full sm:w-auto px-9 py-4.5 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-sans font-extrabold text-white text-xs uppercase tracking-wider shadow-2xl hover:shadow-[#00E5FF]/20 transition-shadow cursor-pointer"
                    >
                      Schedule Consultation
                    </motion.button>
                  </Link>
                  <Link
                    href="#services"
                    className="w-full sm:w-auto px-9 py-4.5 rounded-full bg-white/5 border border-white/10 font-sans font-extrabold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Explore Capabilities
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>

              {/* ThreeHero WebGL Column (Col span 5) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                className="lg:col-span-5 relative w-full h-[350px] lg:h-[600px] flex items-center justify-center"
              >
                {/* Embedded Three.js custom renderer */}
                <ThreeHero />
              </motion.div>
            </div>

            {/* Scroll Bounce Guide */}
            <div className="flex flex-col items-center animate-bounce">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600 mb-2">Scroll to explore</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
            </section>

          {/* About Developer Pitch Section */}
          <section className="py-32 px-8 border-b border-white/5 bg-[#050816] relative">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="flex justify-center mb-8">
                <Logo iconOnly className="animate-pulse" />
              </div>
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7C3AED] block mb-4">About Me</span>
              <h2 className="font-grotesk text-3xl md:text-5xl font-extrabold text-white mb-6">
                Direct Collaboration. Premium Craft.
              </h2>
              <p className="font-sans text-slate-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                As a freelance developer, I work directly with you without agency overhead, account managers, or corporate delays. I combine modern aesthetics with high-performance decoupled architectures to turn digital ideas into scalable realities.
              </p>
            </div>
            {/* Glowing rotating 3D glass cubes element background overlay */}
            <div className="absolute right-10 bottom-10 w-24 h-24 border border-white/5 bg-white/5 rounded-2xl rotate-45 blur-[1px] pointer-events-none opacity-30 animate-pulse" />
            <div className="absolute left-10 top-10 w-16 h-16 border border-white/5 bg-white/5 rounded-full blur-[2px] pointer-events-none opacity-30 animate-pulse" />
          </section>

          {/* Trust Section - Authentic Values */}
          <section className="py-32 px-8 border-b border-white/5 bg-[#050816]/50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">Core Philosophy</span>
                <h2 className="font-grotesk text-3xl md:text-6xl font-extrabold text-white mt-3">
                  Commitment to Excellence
                </h2>
                <p className="font-sans text-slate-400 text-xs md:text-sm max-w-md mx-auto mt-4">
                  Honest, transparent metrics built to scale your business with no exaggerated numbers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trustValues.map((val, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-7 border border-white/5 flex flex-col justify-between hover:border-[#00e5ff]/20 hover:bg-white/5 transition-all duration-500 group rounded-2xl"
                  >
                    <div>
                      <div className="mb-5 p-3.5 w-12 h-12 rounded-full liquid-glass-icon inline-flex items-center justify-center">
                        {val.icon}
                      </div>
                      <h3 className="font-grotesk text-base font-bold text-white mb-2">{val.title}</h3>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section (3D Tilt hover experience) */}
          <span id="services" className="block -mt-16 pt-16" />
          <section className="py-32 px-8 border-b border-white/5 bg-[#050816]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-24">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7C3AED]">Capabilities</span>
                <h2 className="font-grotesk text-3xl md:text-6xl font-extrabold text-white mt-3">
                  Solutions I Deliver
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((svc, i) => (
                  <div
                    key={i}
                    onMouseMove={(e) => handleMouseMoveCard(e, i)}
                    onMouseLeave={handleMouseLeaveCard}
                    style={{
                      transform: hoveredCardIdx === i ? `perspective(1000px) rotateY(${cardTilt.x}deg) rotateX(${cardTilt.y}deg) scale(1.03)` : "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)",
                      transition: hoveredCardIdx === i ? "none" : "transform 0.5s ease"
                    }}
                    className="glass-card p-8 border border-white/5 hover:border-[#00E5FF]/20 relative overflow-hidden group rounded-2xl cursor-default hover:shadow-[0_20px_50px_-20px_rgba(0,229,255,0.2)]"
                  >
                    {/* Hover Glow pointer */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="mb-6 p-4.5 w-14 h-14 rounded-full liquid-glass-icon inline-flex items-center justify-center">
                      {svc.icon}
                    </div>
                    <h3 className="font-grotesk text-xl font-bold text-white mb-4">
                      {svc.title}
                    </h3>
                    <p className="font-sans text-slate-400 text-xs md:text-sm leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Timeline Section */}
          <section className="py-32 px-8 border-b border-white/5 bg-[#050816]/50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-24">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">Workflow</span>
                <h2 className="font-grotesk text-3xl md:text-6xl font-extrabold text-white mt-3">
                  Development Timeline
                </h2>
              </div>

              <div className="relative">
                {/* Horizontal line for desktop */}
                <div className="hidden lg:block absolute top-[40px] left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-[#7C3AED]/20 via-[#2563EB]/20 to-[#00E5FF]/20" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
                  {processSteps.map((step, idx) => (
                    <div key={idx} className="glass-card p-5 border border-white/5 rounded-2xl relative z-10 flex flex-col justify-between">
                      <div className="flex items-center gap-3 lg:flex-col lg:items-center lg:text-center mb-4">
                        <div className="w-9 h-9 rounded-full bg-[#050816] border border-white/10 text-white font-jakarta font-bold text-xs flex items-center justify-center bg-gradient-to-br from-[#7C3AED]/10 to-[#00E5FF]/10 shrink-0">
                          {idx + 1}
                        </div>
                        <h4 className="font-grotesk text-xs uppercase tracking-wider font-bold text-white">
                          {step.phase}
                        </h4>
                      </div>
                      <p className="font-sans text-slate-500 text-[10px] lg:text-center leading-normal">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section className="py-32 px-8 border-b border-white/5 bg-[#050816]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7C3AED]">Showcase</span>
                <h2 className="font-grotesk text-3xl md:text-6xl font-extrabold text-white mt-3">
                  Featured Works
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {projects.map((proj, idx) => (
                  <div key={idx} className="glass-card border border-white/5 overflow-hidden flex flex-col justify-between rounded-2xl group hover:border-[#00e5ff]/20 transition-colors">
                    {/* Visual Preview Illustration container */}
                    <div className="aspect-video bg-slate-900/60 relative flex flex-col justify-center items-center overflow-hidden border-b border-white/5">
                      <div className="absolute inset-0 bg-[#050816]/10 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:12px_12px]" />
                      <span className="font-mono text-[9px] text-[#00E5FF] uppercase bg-blue-500/10 px-3.5 py-1.5 rounded-full z-10 border border-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                        {proj.imageText}
                      </span>
                    </div>

                    <div className="p-6">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{proj.category}</span>
                      <h3 className="font-grotesk text-lg font-bold text-white mt-2 mb-3 group-hover:text-[#00E5FF] transition-colors">{proj.title}</h3>
                      <p className="font-sans text-slate-400 text-xs leading-relaxed">{proj.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Technologies Section */}
          <section className="py-32 px-8 border-b border-white/5 bg-[#050816]/50">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">Tech Proficiency</span>
                <h2 className="font-grotesk text-3xl md:text-6xl font-extrabold text-white mt-3">
                  Frameworks & Tools
                </h2>
              </div>

              {/* Tabs list */}
              <div className="flex justify-center border-b border-white/5 gap-6 mb-12">
                {[
                  { id: "frontend", label: "Frontend" },
                  { id: "backend", label: "Backend" },
                  { id: "database", label: "Database" },
                  { id: "cloud", label: "Cloud & Devops" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTechTab(tab.id)}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                      activeTechTab === tab.id
                        ? "border-[#00E5FF] text-white"
                        : "border-transparent text-slate-500 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Active Tab grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {techCategories[activeTechTab].map((tech) => (
                  <div
                    key={tech.name}
                    className="glass-card p-5 border border-white/5 hover:border-white/10 flex items-center justify-between group rounded-xl transition-all duration-300"
                  >
                    <span className="font-grotesk text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{tech.name}</span>
                    <div className="p-2 rounded-lg bg-white/5">
                      {tech.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <StatsCounter />

          {/* Trusted Brands Marquee */}
          <section className="py-16 px-6 border-y border-white/5 overflow-hidden">
            <div className="text-center mb-8">
              <p className="text-slate-500 text-xs uppercase tracking-widest">Trusted Technologies &amp; Platforms</p>
            </div>
            <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
              {["Next.js","Spring Boot","React","TypeScript","PostgreSQL","Redis","Docker","Nginx","Stripe","Google Cloud","Tailwind CSS","Three.js","Framer Motion","GitHub Actions","Gemini AI"].map((tech) => (
                <span key={tech} className="text-slate-500 text-sm font-semibold hover:text-slate-300 transition-colors cursor-default">{tech}</span>
              ))}
              {["Next.js","Spring Boot","React","TypeScript","PostgreSQL","Redis","Docker","Nginx","Stripe","Google Cloud","Tailwind CSS","Three.js","Framer Motion","GitHub Actions","Gemini AI"].map((tech) => (
                <span key={tech + "2"} className="text-slate-500 text-sm font-semibold hover:text-slate-300 transition-colors cursor-default">{tech}</span>
              ))}
            </div>
          </section>

          {/* Portfolio Section */}
          <PortfolioSection />

          {/* Process Timeline */}
          <ProcessTimeline />

          {/* Testimonials */}
          <TestimonialsSlider />

          {/* Pricing Section */}
          <PricingSection />

          {/* FAQ Section */}
          <FaqSection />

          {/* Contact Section */}
          <span id="contact" className="block -mt-16 pt-16" />
          <section className="py-32 px-8 relative overflow-hidden bg-[#050816]">
            {/* Glow backing */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Visual contact details column */}
                <div className="lg:col-span-5 space-y-6">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7C3AED]">Get In Touch</span>
                  <h2 className="font-grotesk text-3xl md:text-6xl font-extrabold text-white">Let's Connect</h2>
                  <p className="font-sans text-slate-400 text-sm leading-relaxed mb-8">
                    Ready to collaborate on a website, application, or custom dashboard solution? Schedule a video session directly.
                  </p>

                  <div className="glass-card p-6 border border-white/5 space-y-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 w-10 h-10 rounded-full liquid-glass-icon text-[#00E5FF]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-sans text-xs text-slate-300">{COMPANY_INFO.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 w-10 h-10 rounded-full liquid-glass-icon text-[#7C3AED]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="font-sans text-xs text-slate-300">{COMPANY_INFO.city}, {COMPANY_INFO.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 w-10 h-10 rounded-full liquid-glass-icon text-[#2563EB]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-sans text-xs text-slate-300">{COMPANY_INFO.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Form column */}
                <div className="lg:col-span-7 glass-card border border-white/10 p-8 md:p-10 rounded-2xl relative">
                  {isFormSubmitted ? (
                    <div className="text-center py-16 space-y-5">
                      <div className="w-14 h-14 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mx-auto border border-green-500/20">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <h3 className="font-grotesk text-xl font-bold text-white">Consultation Booked!</h3>
                      <p className="font-sans text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                        I will review your project brief and email you a calendar invitation.
                      </p>
                      <button
                        onClick={() => setIsFormSubmitted(false)}
                        className="px-6 py-2.5 rounded-full border border-white/10 font-sans text-xs font-bold hover:bg-white/5 cursor-pointer"
                      >
                        Book Another Meeting
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <h3 className="font-grotesk text-lg font-bold text-white mb-4">Book Free Consultation Session</h3>

                      {formErrorMsg && (
                        <p className="text-red-400 text-xs font-mono">{formErrorMsg}</p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-sans text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Name</label>
                          <input
                            type="text"
                            {...register("name")}
                            placeholder="Your Name"
                            className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                          />
                          {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                          <label className="font-sans text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Email</label>
                          <input
                            type="email"
                            {...register("email")}
                            placeholder="you@email.com"
                            className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                          />
                          {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-sans text-[10px] text-slate-500 block mb-1.5">Company (Optional)</label>
                          <input
                            type="text"
                            {...register("company")}
                            placeholder="Company LLC"
                            className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                          />
                        </div>

                        <div>
                          <label className="font-sans text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Scope</label>
                          <select
                            {...register("meetingType")}
                            className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none"
                          >
                            <option value="CONSULTATION">General Scoping</option>
                            <option value="AUDIT">Website Technical Audit</option>
                            <option value="PARTNERSHIP">Strategic Scoping</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-sans text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Select Date & Time</label>
                        <input
                          type="datetime-local"
                          {...register("scheduledTime")}
                          className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none"
                        />
                        {errors.scheduledTime && <p className="text-red-400 text-[10px] mt-1">{errors.scheduledTime.message}</p>}
                      </div>

                      <div>
                        <label className="font-sans text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Project Details</label>
                        <textarea
                          {...register("description")}
                          rows={4}
                          placeholder="Tell me about your user stories, integrations, timelines..."
                          className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                        />
                        {errors.description && <p className="text-red-400 text-[10px] mt-1">{errors.description.message}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-sans font-bold text-white shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isSubmitting ? "Sending Request..." : "Schedule consultation"}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>
          </section>

        </motion.div>
      )}
    </div>
  );
}
