"use client";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowRight, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";

interface LocationData {
  city: string;
  tagline: string;
  description: string;
  phone: string;
  address: string;
  services: string[];
}

const locationPages: Record<string, LocationData> = {
  "noida": {
    city: "Noida Office (NCR Hub)",
    tagline: "Premium software development services in Noida and surrounding technology parks.",
    description: "Our Noida regional office provides high-scale enterprise engineering, backend Spring Boot Java development pipelines, cloud architecture designs, and local dedicated developer hires.",
    phone: "+91 95082 17351",
    address: "Sec 62, Noida, Uttar Pradesh, India - 201301",
    services: ["Backend Spring Boot Rest APIs", "Next.js 15 Web Applications", "Docker & Kubernetes DevOps pipelines", "Consultation Booking Schedulers"]
  },
  "delhi": {
    city: "Delhi Hub (Capital Region)",
    tagline: "Software and custom digital design services for corporate accounts across New Delhi.",
    description: "Our Delhi regional consulting team handles workflow scannings, premium UI/UX Figma design prototyping, SaaS recurring billing gateways, and mobile app developments.",
    phone: "+91 95082 17351",
    address: "Connaught Place, New Delhi, India - 110001",
    services: ["Premium UI/UX design layouts", "Headless E-commerce marketplaces", "Stripe & Razorpay payment pipelines", "Support Ticket system chat integrations"]
  },
  "gurugram": {
    city: "Gurugram Office (Cyber City)",
    tagline: "AI integration, LLMs and automation development for Cyber City tech firms.",
    description: "Our Gurugram engineering division handles deep AI summarizations, private document processors, FastAPI Python connectors, and microservices integrations.",
    phone: "+91 95082 17351",
    address: "Cyber City, Phase 3, Gurugram, Haryana, India - 122002",
    services: ["Gemini API private integrations", "FastAPI Python backend structures", "Redis query cache systems", "Token limit auditor dashboards"]
  },
  "bangalore": {
    city: "Bangalore Hub (Silicon Valley)",
    tagline: "High-scale SaaS platforms and enterprise ERP architectures for Bangalore startups.",
    description: "Our Bangalore regional division designs multi-tenant SaaS structures, double-entry ledgers, database indexing queries, and Nginx reverse proxies.",
    phone: "+91 95082 17351",
    address: "Indiranagar, Bangalore, Karnataka, India - 560038",
    services: ["Multi-tenant SaaS cloud setups", "Spring Security LDAP SSO integrations", "PostgreSQL database optimizations", "CI/CD automated testing integrations"]
  },
  "india": {
    city: "National Headquarters (India Corporate)",
    tagline: "Full-scale custom software development services across all states and remote workspace networks.",
    description: "We are India's premium digital agency partner. We engineer high-performance systems for businesses nationwide, combining robust architectures with modern design aesthetics.",
    phone: "+91 95082 17351",
    address: "Sec 62, Noida & CP, New Delhi, India",
    services: ["Next.js & React Frontend layouts", "Spring Boot & Python Backend microservices", "PCI-DSS Stripe & Razorpay Payments", "HIPAA Compliant Patient portals"]
  }
};

export default function LocationLandingPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const loc = locationPages[slug];

  if (!loc) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background radial underglow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-16">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          &larr; Back to Home
        </Link>

        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-[#00E5FF]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Regional Development Center</span>
          </div>
          <h1 className="font-grotesk text-4xl md:text-6xl font-black text-white leading-tight">
            {loc.city}
          </h1>
          <p className="font-sans text-slate-300 text-lg leading-relaxed">
            {loc.tagline}
          </p>
        </div>

        {/* Overview detail card */}
        <div className="glass-card p-8 border border-white/10 space-y-4">
          <h3 className="font-grotesk text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
            Local Engineering Alignment
          </h3>
          <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
            {loc.description}
          </p>
        </div>

        {/* Localized Services checklist */}
        <div className="space-y-6">
          <h3 className="font-grotesk text-lg font-bold text-white">Target Offerings & Specializations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
            {loc.services.map((srv, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                <span className="text-slate-300 font-medium">{srv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Local Office Details */}
        <div className="glass-card p-6 border border-white/5 space-y-4 font-sans text-xs">
          <h3 className="font-grotesk text-sm font-bold text-white uppercase tracking-wider">Contact Noida/Delhi Desk</h3>
          <div className="space-y-3 text-slate-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#00E5FF]" />
              <span>Tel: <strong className="text-white font-semibold">{loc.phone}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00E5FF]" />
              <span>Email: <strong className="text-white font-semibold">contact@devnexa.global</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#00E5FF] mt-0.5 flex-shrink-0" />
              <span>Address: <strong className="text-white font-semibold">{loc.address}</strong></span>
            </div>
          </div>
        </div>

        {/* Consultation Call CTA */}
        <div className="glass-card-glow border border-white/10 p-8 text-center space-y-6 relative overflow-hidden bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-[40px] pointer-events-none" />
          <h3 className="font-grotesk text-xl font-bold text-white">Scoping a Project in {loc.city.split(" ")[0]}?</h3>
          <p className="font-sans text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Schedule an expert strategy consultation meeting. We'll map out resources, architectures, databases, and estimations.
          </p>
          <div className="flex justify-center">
            <Link
              href="/booking"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] text-xs font-bold text-white shadow-lg flex items-center gap-2 hover:scale-[1.01] transition-all"
            >
              <Calendar className="w-4 h-4" />
              Book Scoping Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
