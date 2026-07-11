"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Code, Cpu, Layers, Shield, Zap, Sparkles, Clock, Globe, BarChart, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Services() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Custom Software Engineering",
      subtitle: "Scalable APIs & Distributed Backends",
      icon: <Code className="w-6 h-6 text-[#00E5FF]" />,
      duration: "4 - 12 Weeks",
      techStack: ["Java 21/26", "Spring Boot", "PostgreSQL", "Redis", "Docker", "Nginx"],
      benefits: [
        "Stateless JWT authorization architecture",
        "Sub-second API response caching with Redis",
        "SOLID enterprise architecture code patterns",
        "Comprehensive integration tests coverage"
      ],
      description: "We construct reliable, high-performance backends capable of powering consumer apps, SaaS portals, and transactional databases. Our systems are engineered using Spring Boot for strict security policies and multi-threaded throughput."
    },
    {
      title: "Interactive Web Interfaces",
      subtitle: "Next.js 15 & Motion Graphics",
      icon: <Layers className="w-6 h-6 text-[#7C3AED]" />,
      duration: "3 - 8 Weeks",
      techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "GSAP"],
      benefits: [
        "Turbopack-boosted static & dynamic rendering",
        "Lighthouse score optimized to exceed 95+",
        "Fluid mouse glows and interactive scroll timeline graphics",
        "Completely responsive grids for mobile, foldable, and 4K viewports"
      ],
      description: "First impressions are vital. We design and compile award-winning, luxury-styled web apps utilizing Next.js 15 App Router structures. We specialize in glassmorphic layouts, fluid animations, and custom styling systems."
    },
    {
      title: "AI Integration & Automation",
      subtitle: "LLMs, Prompt Architecture & Agents",
      icon: <Cpu className="w-6 h-6 text-[#2563EB]" />,
      duration: "4 - 10 Weeks",
      techStack: ["Gemini Pro", "LangChain", "Spring AI", "Vector Databases", "Python stubs"],
      benefits: [
        "Custom context retrieval (RAG) implementation",
        "Rule/AI based cost estimation modules",
        "Structured XML/JSON outputs matching schema",
        "Automated PDF proposal generation"
      ],
      description: "Supercharge your business with artificial intelligence. We build custom API gateways connecting your databases and portals to advanced LLMs. We deploy cost estimators, website metadata audit scanners, and smart proposal drafters."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 text-xs text-[#00E5FF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Capabilities</span>
          </div>
          <h1 className="font-grotesk text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Immersive Digital Solutions
          </h1>
          <p className="font-sans text-slate-400 text-lg">
            We avoid standard templates. We build custom software solutions engineered for performance, security, and scalability.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Navigation panel */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-grotesk text-xs uppercase tracking-widest text-slate-500 font-bold mb-6">
              Solutions Directory
            </h4>
            {services.map((svc, i) => (
              <button
                key={i}
                onClick={() => setActiveService(i)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border ${
                  activeService === i
                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-white"
                    : "bg-white/0 border-transparent text-slate-400 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${activeService === i ? "bg-blue-500/20 text-[#00E5FF]" : "bg-white/5 text-slate-400"}`}>
                    {svc.icon}
                  </div>
                  <div>
                    <h3 className="font-grotesk font-bold text-sm md:text-base">
                      {svc.title}
                    </h3>
                    <span className="font-sans text-[11px] text-slate-500">
                      {svc.subtitle}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Detail Showcase Panel */}
          <div className="lg:col-span-8 glass-card border border-white/10 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-full blur-[40px]" />
            
            {/* Top Detail bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-[#00E5FF]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-wider">Duration: {services[activeService].duration}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#070B16] px-3 py-1.5 rounded-lg border border-white/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-widest font-bold">Ready to Deploy</span>
              </div>
            </div>

            {/* Core Description */}
            <h2 className="font-grotesk text-2xl md:text-4xl font-bold text-white mb-4">
              {services[activeService].title}
            </h2>
            <p className="font-sans text-slate-300 leading-relaxed text-sm md:text-base mb-8">
              {services[activeService].description}
            </p>

            {/* Tech Stack Pills */}
            <div className="mb-8">
              <h4 className="font-grotesk text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">
                Frameworks & Technologies
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {services[activeService].techStack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs text-[#00E5FF] bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Value/Benefits */}
            <div className="mb-10">
              <h4 className="font-grotesk text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">
                Technical Highlights & Benefits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services[activeService].benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#00E5FF] flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-xs text-slate-400 leading-normal">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-sans font-bold text-white shadow-lg hover:shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              Consult On This Solution
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dynamic Project Timeline Progress Graph */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="font-grotesk text-2xl md:text-3xl font-bold text-white mb-4">
              Our Collaborative Architecture Process
            </h3>
            <p className="font-sans text-slate-400 text-sm max-w-md mx-auto">
              From contract scoping to final deployment validation, we align our engineers with your core business timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-[#7C3AED]/30 via-[#2563EB]/30 to-[#00E5FF]/30 z-0" />
            
            {[
              { step: "01", name: "Scoping & Blueprinting", desc: "Detailed requirements mapping, UI wireframes, and API contract design." },
              { step: "02", name: "Parallel Sprint Cycles", desc: "Decoupled frontend UI build and Spring Boot backend controller coding." },
              { step: "03", name: "Integration Testing", desc: "E2E security credentials auditing, unit testing coverage, and caching optimization." },
              { step: "04", name: "Launch Validation", desc: "Docker staging verification, DNS Cloudflare mapping, and live deployment." }
            ].map((step, idx) => (
              <div key={idx} className="glass-card p-6 border border-white/5 text-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#070B16] border border-white/10 text-white font-jakarta font-bold text-sm flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-[#7C3AED]/20 to-[#00E5FF]/20">
                  {step.step}
                </div>
                <h4 className="font-grotesk text-sm font-bold text-white mb-2">
                  {step.name}
                </h4>
                <p className="font-sans text-slate-500 text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
