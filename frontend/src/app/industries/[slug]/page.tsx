"use client";
import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shield, ArrowRight, CheckCircle2, Star, Target, Server } from "lucide-react";

interface IndustryData {
  title: string;
  tagline: string;
  description: string;
  solutions: string[];
  metrics: string[];
}

const industryPages: Record<string, IndustryData> = {
  "healthcare": {
    title: "Healthcare Digital Solutions",
    tagline: "HIPAA-compliant software systems engineered to secure patient data and streamline clinic workloads.",
    description: "We deploy medical-grade patient portals, encrypted electronic health records (EHR) data warehouses, telemedicine integrations, and prevention schedules. Security protocols are fully audited.",
    solutions: ["HIPAA-compliant EHR database vaults", "Telemedicine video integration pipelines", "Smart doctor shift-prevention schedulers", "Encrypted HL7 patient record transfers"],
    metrics: ["100% HIPAA Audit Ready", "98% Booking Accuracy", "4.9/5 Patient Satisfaction Rating"]
  },
  "education": {
    title: "EdTech & LMS Solutions",
    tagline: "Scalable virtual learning portals designed to manage millions of concurrent student sessions.",
    description: "Unified learning management platforms tracking student enrollment, interactive quizzes, automated grading systems, and real-time screen sharing feeds.",
    solutions: ["Multi-tenant virtual learning spaces", "Online exam lock-prevention pipelines", "Interactive student progress trackers", "Video live-broadcasting APIs"],
    metrics: ["25k+ Active Student Portals", "Sub-100ms Video Feeds Latencies", "94% Student Retention Increase"]
  },
  "real-estate": {
    title: "Real Estate Platforms",
    tagline: "Interactive booking marketplaces, virtual map explorations, and unified CRM management dashboards.",
    description: "We build property listings portals integrating Mapbox map navigation overlays, virtual tour video pipelines, and customer booking logs.",
    solutions: ["Mapbox interactive location mappings", "Virtual video property tour components", "Buyer broker lead intake systems", "Property lease document generators"],
    metrics: ["+45% Property Leads Boost", "Zero Listing Sync Latencies", "92% Agent Retention Rates"]
  },
  "fintech": {
    title: "FinTech & Transaction Engines",
    tagline: "PCI-DSS compliant double-entry ledger platforms backed by token security validations.",
    description: "Highly secure transaction processors routing Stripe payments, custom invoice generation pipelines, and AI-driven fraud tracking filters.",
    solutions: ["PCI-DSS compliant transaction bridges", "AI-powered transaction audit trails", "Direct Stripe/Razorpay payout routes", "Double-entry accounting databases"],
    metrics: ["$12M+ Secured Inbound Billings", "0% Fraud Event Incidents", "25ms API Transaction Processing"]
  },
  "logistics": {
    title: "Logistics & Fleet Telemetry",
    tagline: "Real-time dispatch consoles, route optimization calculators, and driver alert dispatch systems.",
    description: "Cross-platform mobile applications matching driver routes to cargo weights, geo-location coordinate maps, and warehouse inventory databases.",
    solutions: ["Google Maps dynamic routing optimization", "Real-time driver location telemetries", "Warehouse inventory catalog registers", "Firebase dispatch alert triggers"],
    metrics: ["18% Fuel Overhead Reductions", "2% Late Delivery Incident Rates", "50k+ Monitored Cargo Orders"]
  },
  "restaurants": {
    title: "Restaurant Order Platforms",
    tagline: "Online food ordering dashboards, table seat schedulers, and payment payout pipelines.",
    description: "Speedy consumer menu systems, kitchen dispatch screens, SMS/WhatsApp order updates, and localized delivery configurations.",
    solutions: ["Headless restaurant catalog storefronts", "Kitchen order status ticket monitors", "WhatsApp order dispatch gateways", "Stripe payment payout automations"],
    metrics: ["Sub-second Catalog Filter loads", "+28% Direct Delivery Orders", "99.9% Order Routing Uptimes"]
  },
  "manufacturing": {
    title: "Smart Manufacturing ERPs",
    tagline: "Track production milestones, equipment uptimes, and supply order lists in one console.",
    description: "Align assembly lines, warehouse logs, and quality check sheets under a role-secured ERP workspace to prevent delays.",
    solutions: ["Assembly line progress timelines", "Equipment uptime telemetry reports", "Supply order and purchase records", "LDAP role security configurations"],
    metrics: ["15% Manufacturing Waste drops", "99.98% Equipment Uptime tracking", "30% Administrative Speedups"]
  },
  "retail": {
    title: "Retail E-Commerce Channels",
    tagline: "Omnichannel inventory logs, high-performance checkout storefronts, and catalog filters.",
    description: "Headless shopping carts loading in milliseconds, custom CRM analytics to study customer actions, and Razorpay payment triggers.",
    solutions: ["Omnichannel inventory sync catalogs", "Headless fast-checkout shopping carts", "Customer behavior CRM analytics", "Stripe/Razorpay payment routes"],
    metrics: ["1.1 seconds Catalog Load Speed", "+38% Store Checkout Conversions", "92% Customer Returning Rates"]
  }
};

export default function IndustryLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const industry = industryPages[slug];

  if (!industry) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background radial underglow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-16">
        {/* Navigation Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          &larr; Back to Home
        </Link>

        {/* Hero Section */}
        <div className="space-y-6">
          <span className="font-mono text-xs text-[#00E5FF] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md uppercase tracking-widest">
            Industry Solution
          </span>
          <h1 className="font-grotesk text-4xl md:text-6xl font-black text-white leading-tight">
            {industry.title}
          </h1>
          <p className="font-sans text-slate-300 text-lg leading-relaxed">
            {industry.tagline}
          </p>
        </div>

        {/* Overview Detail Card */}
        <div className="glass-card p-8 border border-white/10 space-y-4">
          <h3 className="font-grotesk text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-5 h-5 text-[#00E5FF]" />
            Overview & Business Impact
          </h3>
          <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
            {industry.description}
          </p>
        </div>

        {/* Custom Solutions Features */}
        <div className="space-y-6">
          <h3 className="font-grotesk text-lg font-bold text-white">Targeted Systems & Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
            {industry.solutions.map((sol, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300 font-medium">{sol}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics Outcomes */}
        <div className="space-y-6">
          <h3 className="font-grotesk text-lg font-bold text-white">Proven Outcomes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs text-center">
            {industry.metrics.map((metric, i) => (
              <div key={i} className="glass-card p-5 border border-white/5 space-y-2">
                <Target className="w-5 h-5 text-[#00E5FF] mx-auto opacity-75" />
                <span className="font-bold text-white block text-sm">{metric}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Consultation Call CTA */}
        <div className="glass-card-glow border border-white/10 p-8 text-center space-y-6 relative overflow-hidden bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-[40px] pointer-events-none" />
          <h3 className="font-grotesk text-xl font-bold text-white">Ready to Upgrade Your Sector Operations?</h3>
          <p className="font-sans text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Book a 30-minute expert scoping consultation to map out requirements, workflows, databases, and secure layouts.
          </p>
          <div className="flex justify-center">
            <Link
              href="/booking"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] text-xs font-bold text-white shadow-lg flex items-center gap-2 hover:scale-[1.01] transition-all"
            >
              Book Strategy Session
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
