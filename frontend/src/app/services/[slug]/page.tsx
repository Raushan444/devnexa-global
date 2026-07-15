"use client";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Cpu, Code, Database, Sparkles, CheckCircle2 } from "lucide-react";

interface ServiceData {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  techStack: string[];
  gradient: string;
}

const servicePages: Record<string, ServiceData> = {
  "web-development": {
    title: "Enterprise Web Development",
    tagline: "Next-generation web applications engineered for speed, scale, and custom microservice pipelines.",
    description: "Our core engineering methodology utilizes decoupled server layouts (Next.js 15 App Router) matching secure database backings (Spring Boot 3 + PostgreSQL). We prioritize responsive rendering, static generation caching, and secure API gateways.",
    features: ["Decoupled Frontend Architectures", "Secure JWT & OAuth 2.0 Auth Integrations", "Database Optimizations & Query Tuning", "Uptime Monitoring & SLA Guarantees"],
    techStack: ["Next.js 15", "React 19", "Spring Boot", "Docker", "PostgreSQL"],
    gradient: "from-[#00E5FF] to-[#2563EB]"
  },
  "mobile-apps": {
    title: "Mobile App Engineering",
    tagline: "High-performance iOS and Android applications built cross-platform.",
    description: "We deploy unified React Native layouts backed by robust REST API pipelines. Live telemetry tracking, FCM push warnings, and offline syncing are integrated natively.",
    features: ["Real-time Geo-location Tracking", "Firebase Push Notification Systems", "Biometric Authentication Security", "Offline-first Local Sync Registries"],
    techStack: ["React Native", "Java", "FCM Hubs", "Redux Toolkit", "SQLite"],
    gradient: "from-[#10B981] to-[#00E5FF]"
  },
  "ai-solutions": {
    title: "AI Integration & Machine Learning",
    tagline: "Empower business automation pipelines with customized LLM integrations and private data guardrails.",
    description: "We integrate Gemini, OpenAI, and custom fine-tuned transformer networks. We build token auditing ledgers, document ingestion parsers, and custom analytics calculators.",
    features: ["Automated Document Analysis", "Smart Recommendation Engines", "Private Data Masking Guardrails", "Token Allocation Auditing dashboards"],
    techStack: ["Python", "FastAPI", "Gemini API", "Langchain", "TensorFlow"],
    gradient: "from-[#7C3AED] to-[#EC4899]"
  },
  "saas": {
    title: "SaaS Platform Construction",
    tagline: "Scalable multi-tenant SaaS structures built to maximize customer retention and recurring billing.",
    description: "Architecting cloud-native multi-tenant setups matching strict client separations, Stripe integration subscription engines, and modular client portal workspaces.",
    features: ["Stripe Recurring Subscription Engines", "Role-based Tenant Data Isolation", "Custom Workspace Client Dashboards", "Telemetry Audits & Performance Metrics"],
    techStack: ["Next.js 15", "Spring Boot", "Stripe API", "Redis", "AWS Cloud"],
    gradient: "from-[#2563EB] to-[#7C3AED]"
  },
  "crm": {
    title: "Custom CRM Integrations",
    tagline: "Unify leads, sales transactions, and client portal tracking under a custom private dashboard.",
    description: "Customized CRM databases mapped to lead intake forms, custom calendars, custom booking triggers, and visual project pipelines.",
    features: ["Visual Kanban Sales Pipelines", "Custom Consultation Schedulers", "Lead Scoring & Lead Source Audits", "Email Trigger Notifications"],
    techStack: ["React", "Spring Boot", "PostgreSQL", "SendGrid", "Redis"],
    gradient: "from-[#F59E0B] to-[#EF4444]"
  },
  "erp": {
    title: "Enterprise Resource Planning (ERP)",
    tagline: "Align supply chains, project trackers, accounting reports, and staff audits under a secure console.",
    description: "Industrial ERP structures tracking inventory, purchase ledgers, GST calculations, and project milestones. Backed by strict role security.",
    features: ["Inventory & Supply Chain Trackers", "Automated Billing & Invoice Generative tools", "Uptime telemetry logs for compliance", "LDAP/SSO security integrations"],
    techStack: ["Java 21", "Spring Security", "PostgreSQL", "Docker", "Nginx"],
    gradient: "from-[#EF4444] to-[#7C3AED]"
  },
  "cloud": {
    title: "Cloud Infrastructure & DevOps",
    tagline: "Deploy highly-resilient, containerized clusters with automatic scaling and zero-downtime.",
    description: "Deploying microservices to AWS, Render, and GCP. Setting up Kubernetes namespaces, CI/CD automated test pipelines, and Prometheus alerts.",
    features: ["CI/CD GitHub Actions Automation", "Kubernetes & Docker Container Orchestration", "Zero-downtime Blue/Green Deployments", "Uptime & Traffic Telemetry Audits"],
    techStack: ["Docker", "Kubernetes", "AWS EKS", "Terraform", "Nginx"],
    gradient: "from-[#06B6D4] to-[#10B981]"
  },
  "ui-ux": {
    title: "Premium UI/UX Design System",
    tagline: "Luxury UI layouts designed to captivate visitors and lower conversion friction.",
    description: "Design-first web prototyping in Figma. Translated into production utilizing fluid grid alignments, Framer Motion transitions, and glassmorphism elements.",
    features: ["High-Fidelity Interactive Prototyping", "Curated HSL Color Tokens", "Micro-interactions & Spring Physics Animations", "Responsive Mobile-first Design Audits"],
    techStack: ["Figma", "Tailwind CSS", "Framer Motion", "Next.js", "Adobe Suite"],
    gradient: "from-[#EC4899] to-[#F59E0B]"
  },
  "ecommerce": {
    title: "High-Performance Headless E-Commerce",
    tagline: "Fast loading times and secure checkout gateways engineered to boost store conversions.",
    description: "Decoupled web storefront architectures loading under 1.5 seconds. Integration of payment webhooks for instant order updates.",
    features: ["Sub-second Catalog Filter Latencies", "Stripe & Razorpay Payment Integrations", "Multi-vendor Inventory Registries", "AI-driven Product Recommendation models"],
    techStack: ["Next.js 15", "Node.js", "MongoDB", "Stripe", "Redis"],
    gradient: "from-[#00E5FF] to-[#10B981]"
  },
  "api": {
    title: "High-Throughput API Gateway Architectures",
    tagline: "Secure, rate-limited integration interfaces designed to manage millions of daily calls.",
    description: "Building scalable RESTful API entry points matching custom JWT access validations, Redis caching blocks, and system audit logs.",
    features: ["Redis API Key Rate Limiting", "JWT Validation Filter Middleware", "Comprehensive Swagger/OpenAPI docs", "Real-time Telemetry Alert monitors"],
    techStack: ["Spring Boot", "Redis", "Nginx Proxy", "Prometheus", "Swagger"],
    gradient: "from-[#06B6D4] to-[#7C3AED]"
  }
};

export default function ServiceLandingPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const service = servicePages[slug];

  if (!service) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Glow background */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#00E5FF]/5 rounded-full blur-[100px] pointer-events-none`} />

      <div className="max-w-4xl mx-auto relative z-10 space-y-16">
        {/* Navigation Breadcrumb */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          &larr; View All Services
        </Link>

        {/* Hero Section */}
        <div className="space-y-6">
          <span className="font-mono text-xs text-[#00E5FF] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md uppercase tracking-widest">
            Service Blueprint
          </span>
          <h1 className="font-grotesk text-4xl md:text-6xl font-black text-white leading-tight">
            {service.title}
          </h1>
          <p className="font-sans text-slate-300 text-lg leading-relaxed">
            {service.tagline}
          </p>
        </div>

        {/* Dynamic Detail Card */}
        <div className="glass-card p-8 border border-white/10 space-y-6">
          <h3 className="font-grotesk text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Code className="w-5 h-5 text-[#00E5FF]" />
            Architecture & Core Design
          </h3>
          <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Features & Deliverables Checklist */}
        <div className="space-y-6">
          <h3 className="font-grotesk text-lg font-bold text-white">Deliverables & Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
            {service.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack Details */}
        <div className="space-y-6">
          <h3 className="font-grotesk text-lg font-bold text-white">Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="font-sans text-xs text-white bg-white/5 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-[#00E5FF]" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Cost Estimator CTA */}
        <div className="glass-card-glow border border-white/10 p-8 text-center space-y-6 relative overflow-hidden bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-[40px] pointer-events-none" />
          <h3 className="font-grotesk text-xl font-bold text-white">Need an Instant Cost Estimate?</h3>
          <p className="font-sans text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Use our interactive Cost Calculator to outline your requirements and get a detailed quote range instantly.
          </p>
          <div className="flex justify-center">
            <Link
              href="/estimator"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] text-xs font-bold text-white shadow-lg flex items-center gap-2 hover:scale-[1.01] transition-all"
            >
              Launch Estimator Wizard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
