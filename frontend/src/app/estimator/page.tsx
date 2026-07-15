"use client";
import { API_BASE_URL } from "@/config/api";

import React, { useState } from "react";
import { Cpu, DollarSign, Clock, ListChecks, RefreshCw, Sparkles, ArrowRight } from "lucide-react";

export default function CostEstimator() {
  const [serviceType, setServiceType] = useState("web");
  const [complexity, setComplexity] = useState("medium");
  const [details, setDetails] = useState("");
  const [estimation, setEstimation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setEstimation("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/ai/estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType, complexity, details })
      });

      if (response.ok) {
        const data = await response.json();
        setEstimation(data.estimation);
      } else {
        setErrorMsg("Failed to generate cost breakdown. Make sure Spring Boot backend is active.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to backend server. Make sure Spring Boot (${API_BASE_URL}) is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background glowing particles */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 text-xs text-[#00E5FF]">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Cost Engine</span>
          </div>
          <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Project Cost Estimator
          </h1>
          <p className="font-sans text-slate-400 text-sm md:text-base">
            Select your software configurations and requirements to generate a detailed cost, timeline, and tech stack report.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Options Column */}
          <div className="lg:col-span-5 glass-card border border-white/5 p-6 md:p-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Service Type */}
              <div>
                <label className="font-sans text-xs text-slate-400 font-semibold block mb-2.5">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                >
                  <option value="web">Web Interface (Next.js 15)</option>
                  <option value="custom">Custom Software Backends (Spring Boot)</option>
                  <option value="ai">AI LLM Integrations (Gemini API)</option>
                </select>
              </div>

              {/* Complexity */}
              <div>
                <label className="font-sans text-xs text-slate-400 font-semibold block mb-2.5">Project Complexity</label>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                >
                  <option value="simple">Startup MVP Scale</option>
                  <option value="medium">Mid-Market Growth Scale</option>
                  <option value="complex">Enterprise Production Scale</option>
                </select>
              </div>

              {/* Details */}
              <div>
                <label className="font-sans text-xs text-slate-400 font-semibold block mb-2.5">Brief description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your user stories, dashboard needs, database schema rules..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Calculate */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-sans font-bold text-white shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculating Estimate...
                  </>
                ) : (
                  <>
                    Calculate Budget Report
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Report Column */}
          <div className="lg:col-span-7 glass-card border border-white/10 p-8 flex flex-col justify-between min-h-[400px]">
            {estimation ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                  <Sparkles className="w-5 h-5 text-[#00E5FF] animate-pulse" />
                  <h3 className="font-grotesk text-xl font-bold text-white">AI Scoping Report</h3>
                </div>

                <div className="prose prose-invert max-w-none font-sans text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                  {estimation}
                </div>

                <div className="p-4 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/10 text-slate-400 text-xs leading-normal">
                  💡 This estimation is model-generated. Schedule a call on our Contact Page to lock in real developer timelines.
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 gap-4 text-slate-500">
                <DollarSign className="w-12 h-12 text-[#2563EB]/40 animate-pulse" />
                <h4 className="font-grotesk font-bold text-sm text-slate-400">Scoping Results</h4>
                <p className="font-sans text-xs max-w-xs leading-relaxed">
                  Enter details and select parameters on the left to trigger the AI budgeting calculations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
