"use client";
import { API_BASE_URL } from "@/config/api";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";

const businessTypes = [
  { label: "Agency", icon: "🏢" },
  { label: "Startup", icon: "🚀" },
  { label: "Enterprise", icon: "🏦" },
  { label: "SME", icon: "🏪" },
  { label: "NGO", icon: "🌍" },
  { label: "Government", icon: "🏛️" },
  { label: "E-Commerce", icon: "🛒" },
  { label: "Healthcare", icon: "⚕️" },
  { label: "EdTech", icon: "🎓" },
  { label: "FinTech", icon: "📹" },
];

const suggestedGoals = [
  "Launch new product",
  "Redesign existing website",
  "Build client portal",
  "Create e-commerce store",
  "Automate business processes",
];

const featureOptions = [
  "E-Commerce", "User Auth", "Admin Panel", "AI Integration",
  "Payment Gateway", "Blog", "CRM", "API Integration",
  "Mobile App", "Real-time Features", "Multilingual", "Analytics",
];

const designStyles = [
  { label: "Minimal & Clean", color: "from-slate-400 to-slate-600" },
  { label: "Bold & Modern", color: "from-orange-400 to-red-600" },
  { label: "Luxury & Premium", color: "from-amber-400 to-yellow-600" },
  { label: "Corporate & Professional", color: "from-blue-400 to-blue-600" },
  { label: "Creative & Artistic", color: "from-pink-400 to-purple-600" },
  { label: "Dark & Tech", color: "from-cyan-400 to-indigo-600" },
];

const budgetRanges = ["Under $5K", "$5K–$15K", "$15K–$30K", "$30K–$60K", "$60K–$100K", "$100K+"];
const timelines = ["ASAP (< 4 weeks)", "Short (1–2 months)", "Medium (2–4 months)", "Long (4–6 months)", "Flexible"];

const TOTAL_STEPS = 8;

interface FormData {
  businessType: string;
  projectGoal: string;
  features: string[];
  designStyle: string;
  budget: string;
  timeline: string;
  notes: string;
  name: string;
  email: string;
  company: string;
  phone: string;
}

export default function PlannerPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    businessType: "",
    projectGoal: "",
    features: [],
    designStyle: "",
    budget: "",
    timeline: "",
    notes: "",
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 1)); };

  const toggleFeature = (f: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/crm/project-planner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
      else setError("Submission failed. Please try again.");
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-glow p-12 text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-grotesk text-3xl font-bold text-white mb-3">Plan Submitted!</h2>
          <p className="text-slate-400 text-sm">Our team will review your project plan and get back to you within 24 hours with a tailored proposal.</p>
        </motion.div>
      </div>
    );
  }

  const stepTitles = [
    "Business Type", "Project Goal", "Required Features",
    "Design Style", "Budget Range", "Timeline",
    "Additional Notes", "Contact Info"
  ];

  return (
    <div className="relative min-h-screen bg-[#050816] text-white py-12 px-4">
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 text-xs text-[#00E5FF] font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Smart Project Planner
          </div>
          <h1 className="font-grotesk text-4xl font-bold mb-3">
            <span className="text-gradient-purple-cyan">Plan Your Project</span>
          </h1>
          <p className="text-slate-400 text-sm">Tell us about your vision in 8 simple steps</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const n = i + 1;
            const isDone = n < step;
            const isActive = n === step;
            return (
              <React.Fragment key={n}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isActive ? "wizard-step-active" : isDone ? "wizard-step-done" : "wizard-step-idle"
                }`}>
                  {isDone ? <Check className="w-3.5 h-3.5 text-white" /> : n}
                </div>
                {i < TOTAL_STEPS - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${isDone ? "bg-gradient-to-r from-cyan-400 to-blue-500" : "bg-white/10"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-center text-xs text-slate-500 mb-8">Step {step} of {TOTAL_STEPS}: <span className="text-slate-300 font-medium">{stepTitles[step - 1]}</span></p>

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card-glow p-8"
          >
            {/* Step 1: Business Type */}
            {step === 1 && (
              <div>
                <h2 className="font-grotesk text-2xl font-bold mb-6">What type of business are you?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {businessTypes.map(b => (
                    <button
                      key={b.label}
                      onClick={() => setForm(p => ({ ...p, businessType: b.label }))}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        form.businessType === b.label
                          ? "border-[#00E5FF] bg-[#00E5FF]/10 text-white"
                          : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="text-2xl mb-1">{b.icon}</div>
                      <div className="text-xs font-medium">{b.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Project Goal */}
            {step === 2 && (
              <div>
                <h2 className="font-grotesk text-2xl font-bold mb-2">What is your main project goal?</h2>
                <p className="text-slate-400 text-sm mb-4">Describe your goal or pick from suggestions below</p>
                <textarea
                  value={form.projectGoal}
                  onChange={e => setForm(p => ({ ...p, projectGoal: e.target.value }))}
                  rows={4}
                  placeholder="Describe your project goal..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40 mb-4"
                />
                <div className="flex flex-wrap gap-2">
                  {suggestedGoals.map(g => (
                    <button
                      key={g}
                      onClick={() => setForm(p => ({ ...p, projectGoal: g }))}
                      className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-400 hover:border-[#00E5FF]/40 hover:text-[#00E5FF] transition-all"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Features */}
            {step === 3 && (
              <div>
                <h2 className="font-grotesk text-2xl font-bold mb-2">Required Features</h2>
                <p className="text-slate-400 text-sm mb-6">Select all features your project needs</p>
                <div className="flex flex-wrap gap-2">
                  {featureOptions.map(f => (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${
                        form.features.includes(f)
                          ? "border-[#00E5FF] bg-[#00E5FF]/10 text-white"
                          : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {form.features.includes(f) && <span className="mr-1">✓</span>}{f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Design Style */}
            {step === 4 && (
              <div>
                <h2 className="font-grotesk text-2xl font-bold mb-6">Preferred Design Style</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {designStyles.map(d => (
                    <button
                      key={d.label}
                      onClick={() => setForm(p => ({ ...p, designStyle: d.label }))}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.designStyle === d.label
                          ? "border-[#00E5FF] bg-[#00E5FF]/10 text-white"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className={`w-full h-2 rounded-full bg-gradient-to-r ${d.color} mb-3`} />
                      <span className="text-sm font-medium">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Budget */}
            {step === 5 && (
              <div>
                <h2 className="font-grotesk text-2xl font-bold mb-6">Budget Range</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {budgetRanges.map(b => (
                    <button
                      key={b}
                      onClick={() => setForm(p => ({ ...p, budget: b }))}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                        form.budget === b
                          ? "border-[#00E5FF] bg-[#00E5FF]/10 text-white"
                          : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Timeline */}
            {step === 6 && (
              <div>
                <h2 className="font-grotesk text-2xl font-bold mb-6">Project Timeline</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {timelines.map(t => (
                    <button
                      key={t}
                      onClick={() => setForm(p => ({ ...p, timeline: t }))}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                        form.timeline === t
                          ? "border-[#00E5FF] bg-[#00E5FF]/10 text-white"
                          : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Notes */}
            {step === 7 && (
              <div>
                <h2 className="font-grotesk text-2xl font-bold mb-2">Additional Notes</h2>
                <p className="text-slate-400 text-sm mb-4">Any specific requirements, integrations, or details we should know?</p>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={6}
                  placeholder="Tell us anything else about your project..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>
            )}

            {/* Step 8: Contact */}
            {step === 8 && (
              <div>
                <h2 className="font-grotesk text-2xl font-bold mb-2">Contact Information</h2>
                <p className="text-slate-400 text-sm mb-6">We&apos;ll use this to send you your personalized project plan</p>
                {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", placeholder: "John Doe" },
                    { key: "email", label: "Business Email", placeholder: "john@company.com", type: "email" },
                    { key: "company", label: "Company Name", placeholder: "Acme Corp" },
                    { key: "phone", label: "Phone Number", placeholder: "+1 234 567 8900" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs text-slate-400 font-semibold block mb-2">{f.label}</label>
                      <input
                        type={f.type || "text"}
                        placeholder={f.placeholder}
                        value={form[f.key as keyof FormData] as string}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              <button
                onClick={goBack}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              {step < TOTAL_STEPS ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] text-white font-semibold text-sm"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] text-white font-semibold text-sm disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit Plan"}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
