"use client";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, DollarSign, Sparkles, Shield, Cpu, ChevronRight, CheckCircle } from "lucide-react";

// Mock portfolio details data
const caseStudies: Record<string, any> = {
  "fintrack-pro": {
    title: "FinTrack Pro",
    category: "Web App",
    description: "Enterprise-grade financial tracking dashboard with real-time analytics, Stripe invoicing, and AI-powered expense categorization.",
    duration: "8 weeks",
    budget: "$28,000",
    client: "FinTrack Corp, NY",
    challenge: "The client was struggling with slow manual expense matching and sluggish report generation across their 5,000 corporate clients, leading to high processing times and billing friction.",
    solution: "We engineered a decoupled Next.js + Spring Boot microservice pipeline. We implemented a background job scheduler with Redis queueing to process and categorize invoices asynchronously. Stripe billing triggers automatically sync ledgers.",
    metrics: [
      { metric: "Billing Automation", before: "25% manual", after: "100% automated" },
      { metric: "Report Generation", before: "45 seconds", after: "0.8 seconds" },
      { metric: "Expense Match Rate", before: "70% accuracy", after: "98% accuracy" }
    ],
    techStack: [
      { name: "Next.js 15", role: "Fast SSR layout rendering and secure dashboard workspace views" },
      { name: "Spring Boot 3", role: "Type-safe financial controller APIs and background scheduler pipelines" },
      { name: "PostgreSQL", role: "Strict relational schema storage mapping balances and audit logs" },
      { name: "Stripe", role: "Direct customer billing portals, subscription lifecycles, and webhooks" }
    ],
    testimonial: "DevNexa rebuilt our core ledger matching logic in 8 weeks, lowering processing overhead by 80% on day one.",
    author: "James Vance, CTO at FinTrack Corp"
  },
  "mediconnect": {
    title: "MediConnect",
    category: "Web App",
    description: "HIPAA-compliant healthcare patient portal with appointment scheduling, telemedicine integration, and EHR data pipelines.",
    duration: "12 weeks",
    budget: "$45,000",
    client: "MediConnect Health Systems",
    challenge: "The healthcare system lacked a unified portal for patient EHR access and scheduled bookings, leading to high administrative load and doctor schedule overlaps.",
    solution: "We delivered a secure patient hub with medical-grade data encryption at rest. Integrations include Twilio Telehealth API for secure client calls, alongside automated double-booking prevention calendars.",
    metrics: [
      { metric: "Scheduling Overlaps", before: "12% average", after: "0%" },
      { metric: "Patient Intake Speed", before: "20 minutes", after: "4 minutes" },
      { metric: "Telehealth Uptime", before: "N/A", after: "99.98%" }
    ],
    techStack: [
      { name: "React 19", role: "Dynamic EHR tables and calendar layout rendering" },
      { name: "Java Spring Data", role: "Strict JPA transaction mapping patient records securely" },
      { name: "MySQL", role: "Optimized patient database schema hosting encrypted fields" },
      { name: "Docker", role: "Containerized deployments making staging HIPAA-audit-ready" }
    ],
    testimonial: "The administrative relief was instantaneous. Patient satisfaction scores jumped from 3.2 to 4.9 stars.",
    author: "Dr. Sarah Lin, Managing Director"
  },
  "shopnova": {
    title: "ShopNova",
    category: "E-Commerce",
    description: "High-performance e-commerce platform with AI-powered product recommendations, multi-vendor support, and Razorpay integration.",
    duration: "10 weeks",
    budget: "$32,000",
    client: "ShopNova Retail",
    challenge: "With rising traffic, their legacy PHP e-commerce framework was slowing down under load, causing page load times of 6+ seconds and cart abandonments of 75%.",
    solution: "We designed a headless Next.js fronting and Node.js microservices. Integrated cache strategies ensure that static product catalogs load instantly while Razorpay processes payouts dynamically.",
    metrics: [
      { metric: "Page Load Time", before: "6.2 seconds", after: "1.1 seconds" },
      { metric: "Cart Abandonment", before: "75%", after: "38%" },
      { metric: "Recommendation Conversions", before: "N/A", after: "+24% increase" }
    ],
    techStack: [
      { name: "Next.js 15", role: "Static Site Generation (SSG) with on-demand incremental regeneration" },
      { name: "Node.js / Express", role: "High-throughput API microservices managing catalog filters" },
      { name: "Razorpay", role: "Native checkout workflows supporting cards, UPI, and wallets" },
      { name: "Redis Caching", role: "In-memory database cache lowering heavy catalog database hits" }
    ],
    testimonial: "DevNexa Global slashed our load times to 1.1s. Our checkout conversion rate shot up by 38% almost immediately.",
    author: "Vikram Mehta, Founder"
  },
  "neuralassist": {
    title: "NeuralAssist",
    category: "AI/ML",
    description: "Enterprise AI assistant platform integrating GPT-4 and Gemini for automated document analysis, code review, and business insights.",
    duration: "6 weeks",
    budget: "$22,000",
    client: "NeuralAssist AI Solutions",
    challenge: "The client needed to securely process large corporate files (PDFs, PPTs) and extract key metrics without exposing patient/client data to public AI models.",
    solution: "We implemented an enterprise security gateway routing tokenized payloads through private API keys. The solution applies Gemini AI analysis tools for auto-tagging reports in real-time.",
    metrics: [
      { metric: "Document Analysis Speed", before: "4 hours", after: "12 seconds" },
      { metric: "Data Leakage Incident Rate", before: "Risk-Prone", after: "0% Leakage" },
      { metric: "Automated Accuracy", before: "65%", after: "94%" }
    ],
    techStack: [
      { name: "FastAPI / Python", role: "High-performance processing engines for heavy file analysis" },
      { name: "Gemini API", role: "Intelligent summarization and context extraction models" },
      { name: "Next.js 15", role: "Glassmorphism UI layouts showing AI process tracking graphs" },
      { name: "PostgreSQL", role: "Auditing records mapping token usages and processing times" }
    ],
    testimonial: "We now audit corporate reports in 12 seconds instead of hours. The data leak security guards are flawless.",
    author: "Elena Rostova, Lead Engineer"
  },
  "deliverflow": {
    title: "DeliverFlow",
    category: "Mobile",
    description: "Real-time logistics tracking app with driver management, route optimization, and live push notifications for 50k+ daily orders.",
    duration: "14 weeks",
    budget: "$55,000",
    client: "DeliverFlow Logistics",
    challenge: "Legacy route calculation systems was leading to route mismatches, fuel waste, and late delivery complaints from corporate warehouse accounts.",
    solution: "We designed a cross-platform React Native solution incorporating Google Maps Directions APIs to auto-calculate optimized routes dynamically based on active load balances.",
    metrics: [
      { metric: "Late Deliveries", before: "18% average", after: "2%" },
      { metric: "Average Delivery Time", before: "45 minutes", after: "29 minutes" },
      { metric: "Driver Route Efficiency", before: "Poor", after: "+35% optimized" }
    ],
    techStack: [
      { name: "React Native", role: "Cross-platform mobile application supporting live geolocation tracking" },
      { name: "Spring Boot 3", role: "Backend system dispatching notifications and managing drivers" },
      { name: "Google Maps API", role: "Calculates live route alignments and traffic projections" },
      { name: "Firebase (FCM)", role: "Dispatches push alerts within milliseconds to active driver apps" }
    ],
    testimonial: "Our late deliveries plummeted from 18% to 2% within weeks. Driver feedback is highly positive.",
    author: "Rajesh Kumar, Operations Director"
  },
  "databridge-api": {
    title: "DataBridge API",
    category: "API",
    description: "High-throughput REST API gateway handling 2M+ daily requests with custom rate limiting, caching, and schema validation.",
    duration: "5 weeks",
    budget: "$18,000",
    client: "DataBridge Systems",
    challenge: "Their API services crashed during peak hourly syncs, causing severe downstream downtime for their SaaS platform consumers.",
    solution: "We architected a Spring Boot gateway mapping Redis rate-limiting filters. Nginx proxy settings route requests dynamically to prevent overload issues.",
    metrics: [
      { metric: "Gateway Downtime", before: "2.5 hours/month", after: "0% downtime" },
      { metric: "Response Latency", before: "380ms", after: "25ms" },
      { metric: "Successful Sync Rate", before: "88% avg", after: "99.99%" }
    ],
    techStack: [
      { name: "Spring Boot 3", role: "Gateway handling request interception and JSON validations" },
      { name: "Redis Caching", role: "Stores API access keys and client rate limits instantly" },
      { name: "Docker & Nginx", role: "Load balancing proxies routing and caching secure traffic" },
      { name: "Prometheus", role: "Real-time metrics tracking routing requests and error rates" }
    ],
    testimonial: "Our API gateway is now rock-solid under high traffic loads. Latency is down to 25ms.",
    author: "Marc DuPont, Director of Infrastructure"
  }
};

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const project = caseStudies[slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background radial underglow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back link */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        {/* Hero details */}
        <div className="mb-12">
          <span className="font-mono text-[10px] text-[#00E5FF] uppercase bg-blue-500/10 px-2.5 py-1 rounded-md">
            {project.category}
          </span>
          <h1 className="font-grotesk text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            {project.title}
          </h1>
          <p className="font-sans text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Quick parameters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/5 mb-12 font-sans text-xs">
          <div>
            <span className="text-slate-500 block mb-1">CLIENT</span>
            <span className="text-white font-bold">{project.client}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">TIMELINE</span>
            <span className="text-white font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
              {project.duration}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">BUDGET</span>
            <span className="text-white font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#00E5FF]" />
              {project.budget}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">VERIFICATION</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Fully Verified
            </span>
          </div>
        </div>

        {/* Challenge & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-6 border border-white/10">
            <h3 className="font-grotesk text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              The Business Challenge
            </h3>
            <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="glass-card p-6 border border-white/10">
            <h3 className="font-grotesk text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00E5FF]" />
              The Engineering Solution
            </h3>
            <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Before & After metrics */}
        <div className="mb-16">
          <h3 className="font-grotesk text-lg font-bold text-white mb-6">Performance & Business Outcomes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.metrics.map((m: any, i: number) => (
              <div key={i} className="glass-card p-5 border border-white/5 text-center space-y-2">
                <span className="font-sans text-[10px] text-slate-500 uppercase tracking-widest">{m.metric}</span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-xs text-slate-500 line-through">{m.before}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="font-mono text-base font-bold text-[#00E5FF]">{m.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack used */}
        <div className="mb-16">
          <h3 className="font-grotesk text-lg font-bold text-white mb-6">Case Study Technology Breakdown</h3>
          <div className="grid grid-cols-1 gap-4 font-sans text-xs">
            {project.techStack.map((tech: any, i: number) => (
              <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                <span className="font-bold text-white font-mono">{tech.name}</span>
                <span className="text-slate-400 text-[11px] md:text-right">{tech.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="glass-card p-8 border border-white/10 relative overflow-hidden bg-gradient-to-tr from-purple-500/5 to-blue-500/5">
          <div className="absolute top-4 left-4 text-slate-700 font-serif text-6xl select-none leading-none">“</div>
          <p className="font-sans text-slate-300 italic text-sm md:text-base leading-relaxed pl-6 mb-6">
            {project.testimonial}
          </p>
          <div className="pl-6 font-sans text-xs">
            <h4 className="font-bold text-white">{project.author}</h4>
            <span className="text-[#00E5FF] text-[10px] uppercase font-mono tracking-widest">DevNexa Partner Client</span>
          </div>
        </div>
      </div>
    </div>
  );
}
