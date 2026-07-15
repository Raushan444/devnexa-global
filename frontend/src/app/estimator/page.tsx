"use client";
import { API_BASE_URL } from "@/config/api";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Download, Mail, FileText, Calendar, Zap, Clock, Package } from "lucide-react";
import Link from "next/link";

// Suppress unused import warning - API_BASE_URL kept for consistency
void API_BASE_URL;

const steps = [
  { id: 1, title: "Project Type", options: ["Landing Page", "Business Website", "E-Commerce", "SaaS Platform", "Mobile App", "Enterprise Portal", "AI/ML Platform", "Custom Solution"] },
  { id: 2, title: "Number of Pages", type: "range" as const, min: 1, max: 50 },
  { id: 3, title: "UI/UX Design Level", options: ["Basic Template", "Custom Design", "Premium Design", "Luxury Enterprise Design"] },
  { id: 4, title: "Responsive Design", options: ["Desktop Only", "Desktop + Mobile", "All Devices (Desktop + Tablet + Mobile)"] },
  { id: 5, title: "CMS Integration", options: ["None", "WordPress", "Custom CMS", "Headless CMS (Contentful/Sanity)"] },
  { id: 6, title: "Authentication System", options: ["None", "Basic Login/Register", "Social OAuth", "Enterprise SSO"] },
  { id: 7, title: "Payment Gateway", options: ["None", "Razorpay", "Stripe", "Both Razorpay + Stripe", "PayPal"] },
  { id: 8, title: "Admin Dashboard", options: ["None", "Basic Analytics", "Full Admin Panel", "Enterprise Admin + Analytics"] },
  { id: 9, title: "API Integrations", options: ["None", "1-3 APIs", "4-7 APIs", "8+ APIs / Microservices"] },
  { id: 10, title: "SEO Package", options: ["None", "Basic On-Page SEO", "Advanced SEO + Schema", "Enterprise SEO Suite"] },
  { id: 11, title: "Blog / Content Module", options: ["None", "Simple Blog", "Full CMS Blog", "Multi-Author Platform"] },
  { id: 12, title: "Maintenance Plan", options: ["None", "3 Months", "6 Months", "12 Months Annual"] },
  { id: 13, title: "Delivery Timeline", options: ["Rush (2-4 weeks)", "Standard (4-8 weeks)", "Extended (8-16 weeks)", "Flexible (16+ weeks)"] },
];

function calculatePrice(selections: Record<number, number>): number {
  const typePrice = [3000, 5000, 12000, 25000, 30000, 50000, 60000, 20000];
  let base = typePrice[selections[1]] ?? 5000;
  base += Math.min((selections[2] ?? 5) * 200, 8000);
  base += ([0, 1500, 4000, 8000][selections[3]] ?? 0);
  if (selections[4] === 2) base *= 1.2;
  base += ([0, 500, 1200, 3000][selections[6]] ?? 0);
  base += ([0, 800, 1200, 1800, 900][selections[7]] ?? 0);
  base += ([0, 1500, 4000, 8000][selections[8]] ?? 0);
  base += ([0, 1200, 3000, 6000][selections[9]] ?? 0);
  base += ([0, 500, 1500, 4000][selections[10]] ?? 0);
  if (selections[13] === 0) base *= 1.35;
  return Math.round(base);
}

function calculateTimeline(selections: Record<number, number>): number {
  const base = [2, 4, 8, 16, 20, 24, 28, 12];
  let weeks = base[selections[1]] ?? 8;
  if ((selections[8] ?? 0) >= 2) weeks += 2;
  if ((selections[9] ?? 0) >= 2) weeks += 2;
  return weeks;
}

function getPackage(price: number): string {
  if (price < 8000) return "Starter";
  if (price < 20000) return "Business";
  if (price < 45000) return "Professional";
  return "Enterprise";
}

function getTechStack(selections: Record<number, number>): string[] {
  const stacks: string[] = [];
  if ([4, 5, 6, 7].includes(selections[1])) stacks.push("Next.js 15", "Spring Boot 3", "PostgreSQL");
  else stacks.push("Next.js 15", "Node.js");
  if ((selections[7] ?? 0) > 0) stacks.push("Razorpay/Stripe");
  if ((selections[9] ?? 0) >= 2) stacks.push("REST APIs", "Redis");
  if ((selections[6] ?? 0) >= 2) stacks.push("OAuth 2.0", "JWT");
  stacks.push("Docker", "Render/Vercel");
  return stacks;
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const packageColors: Record<string, string> = {
  Starter: "text-cyan-400",
  Business: "text-blue-400",
  Professional: "text-purple-400",
  Enterprise: "text-amber-400",
};

export default function CostEstimator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, number>>({ 2: 5 });
  const [direction, setDirection] = useState(1);

  const price = useMemo(() => calculatePrice(selections), [selections]);
  const timeline = useMemo(() => calculateTimeline(selections), [selections]);
  const pkg = useMemo(() => getPackage(price), [price]);
  const techStack = useMemo(() => getTechStack(selections), [selections]);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isOnSummary = currentStep === steps.length;

  const isSelectionValid = step ? (step.type === "range" || selections[step.id] !== undefined) : true;

  const goNext = () => {
    if (!isSelectionValid) return;
    setDirection(1);
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };
  const goBack = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const selectOption = (stepId: number, idx: number) => {
    setSelections(prev => ({ ...prev, [stepId]: idx }));
  };

  const emailSummary = () => {
    const subject = encodeURIComponent("DevNexa Project Estimate");
    const body = encodeURIComponent(
      `Project Estimate\n\nEstimated Price: ${formatPrice(Math.round(price * 0.85))} – ${formatPrice(Math.round(price * 1.15))}\nTimeline: ${timeline} weeks\nPackage: ${pkg}\nTech Stack: ${techStack.join(", ")}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="relative min-h-screen bg-[#050816] text-white py-12 px-4">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-xs text-[#00E5FF] font-semibold">
            <Zap className="w-3.5 h-3.5" />
            Smart Cost Calculator
          </div>
          <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-gradient-purple-cyan">Project Cost</span> Estimator
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Answer 13 questions about your project and get an instant, detailed cost estimate with tech stack recommendations.
          </p>
        </div>

        {/* Step Progress Bar */}
        {!isOnSummary && (
          <div className="mb-10 max-w-4xl mx-auto overflow-x-auto pb-2">
            <div className="flex items-center justify-between min-w-max mx-auto">
              {steps.map((s, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <React.Fragment key={s.id}>
                    <button
                      onClick={() => { setDirection(i > currentStep ? 1 : -1); setCurrentStep(i); }}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                        isActive ? "wizard-step-active shadow-lg shadow-blue-500/30" :
                        isDone ? "wizard-step-done" :
                        "wizard-step-idle"
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 text-white" /> : s.id}
                    </button>
                    {i < steps.length - 1 && (
                      <div className={`w-6 h-0.5 mx-0.5 transition-all duration-500 ${
                        isDone ? "bg-gradient-to-r from-cyan-400 to-blue-500" : "bg-white/10"
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="text-center mt-3 text-xs text-slate-500">
              Step {currentStep + 1} of {steps.length}: <span className="text-slate-300 font-medium">{step?.title}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait" custom={direction}>
              {!isOnSummary ? (
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card-glow p-8"
                >
                  <h2 className="font-grotesk text-2xl font-bold text-white mb-2">{step.title}</h2>
                  <p className="text-slate-400 text-sm mb-8">
                    {step.type === "range"
                      ? `Drag to select number of pages`
                      : "Select the option that best fits your project"}
                  </p>

                  {step.type === "range" ? (
                    <div className="space-y-4">
                      <input
                        type="range"
                        min={step.min}
                        max={step.max}
                        value={selections[step.id] ?? step.min ?? 1}
                        onChange={e => selectOption(step.id, parseInt(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{step.min} pages</span>
                        <span className="text-2xl font-bold text-white">{selections[step.id] ?? step.min} pages</span>
                        <span>{step.max} pages</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {step.options?.map((opt, idx) => {
                        const isSelected = selections[step.id] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => selectOption(step.id, idx)}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 text-sm font-medium ${
                              isSelected
                                ? "border-[#00E5FF] bg-[#00E5FF]/10 text-white shadow-lg shadow-cyan-500/10"
                                : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                                isSelected ? "border-[#00E5FF] bg-[#00E5FF]" : "border-white/30"
                              }`} />
                              {opt}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                    <button
                      onClick={goBack}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={goNext}
                      disabled={!isSelectionValid}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      {isLastStep ? "View Summary" : "Next"} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Summary Screen */
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card-glow p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-grotesk text-2xl font-bold text-white">Your Project Estimate</h2>
                      <p className="text-slate-400 text-xs">Based on your selections</p>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 mb-6">
                    <p className="text-slate-400 text-xs mb-1">Estimated Price Range</p>
                    <p className="font-grotesk text-4xl font-bold text-white">
                      {formatPrice(Math.round(price * 0.85))} – {formatPrice(Math.round(price * 1.15))}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">±15% variance based on final scope</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <Clock className="w-5 h-5 text-[#00E5FF] mb-2" />
                      <p className="text-slate-400 text-xs">Timeline</p>
                      <p className="text-white font-bold">{timeline} weeks</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <Package className="w-5 h-5 text-purple-400 mb-2" />
                      <p className="text-slate-400 text-xs">Package</p>
                      <p className={`font-bold ${packageColors[pkg] ?? "text-white"}`}>{pkg}</p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-8">
                    <p className="text-slate-400 text-xs mb-3">Recommended Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Feature Summary */}
                  <div className="mb-8">
                    <p className="text-slate-400 text-xs mb-3">Selected Features</p>
                    <div className="space-y-2">
                      {steps.map(s => {
                        const sel = selections[s.id];
                        if (sel === undefined) return null;
                        const label = s.type === "range" ? `${sel} pages` : s.options?.[sel];
                        if (!label || label === "None") return null;
                        return (
                          <div key={s.id} className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">{s.title}</span>
                            <span className="text-white font-medium">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-xs font-medium transition-all"
                    >
                      <Download className="w-4 h-4" /> Download Estimate
                    </button>
                    <button
                      onClick={emailSummary}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-xs font-medium transition-all"
                    >
                      <Mail className="w-4 h-4" /> Email Estimate
                    </button>
                    <Link
                      href={`/quote?package=${pkg}&budget=${price}`}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white text-xs font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <FileText className="w-4 h-4" /> Request Official Quote
                    </Link>
                    <Link
                      href="/booking"
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00E5FF] text-white text-xs font-semibold transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      <Calendar className="w-4 h-4" /> Book a Call
                    </Link>
                  </div>

                  <button
                    onClick={() => { setCurrentStep(0); setSelections({ 2: 5 }); }}
                    className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Start Over
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Price Card - Desktop */}
          {!isOnSummary && (
            <div className="lg:w-72 xl:w-80 flex-shrink-0">
              <div className="glass-card-glow p-6 lg:sticky lg:top-24">
                <p className="text-slate-400 text-xs mb-1 font-medium uppercase tracking-wider">Current Estimate</p>
                <p className="font-grotesk text-3xl font-bold text-white mb-1">{formatPrice(price)}</p>
                <p className="text-slate-500 text-xs mb-5">±15% final variance</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Timeline</span>
                    <span className="text-white font-semibold">{timeline} weeks</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Package</span>
                    <span className={`font-semibold ${packageColors[pkg] ?? "text-white"}`}>{pkg}</span>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-white/5">
                  <p className="text-slate-500 text-xs mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {techStack.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px]">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-white/5 space-y-2">
                  <Link
                    href="/quote"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white text-xs font-semibold"
                  >
                    Request Quote
                  </Link>
                  <Link
                    href="/booking"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs hover:border-white/20 hover:text-white transition-all"
                  >
                    Book a Call
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile sticky price bar */}
        {!isOnSummary && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050816]/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Estimate</p>
              <p className="font-grotesk text-xl font-bold text-white">{formatPrice(price)}</p>
            </div>
            <div className="text-xs text-slate-400">
              {timeline} wks · <span className={packageColors[pkg] ?? "text-white"}>{pkg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
