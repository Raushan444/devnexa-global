"use client";
import { API_BASE_URL } from "@/config/api";
import React, { useState } from "react";
import { Sparkles, Globe, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";
import AuditWidget from "@/components/AuditWidget";

export default function WebsiteAuditor() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setReport(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/ai/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        setErrorMsg("Failed to scan website. Make sure the backend server is active.");
      }
    } catch (err) {
      setErrorMsg(`Failed to connect to backend server. Make sure Spring Boot (${API_BASE_URL}) is running!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background radial highlights */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 text-xs text-[#00E5FF]">
            <Globe className="w-3.5 h-3.5" />
            <span>SEO Crawler</span>
          </div>
          <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Website Audit Engine
          </h1>
          <p className="font-sans text-slate-400 text-sm md:text-base">
            Type any URL to analyze performance, search engine meta descriptions, and check accessibility tags.
          </p>
        </div>

        {/* Input box */}
        <div className="glass-card border border-white/10 p-6 md:p-8 mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="url"
              required
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-[#070B16] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none placeholder-slate-600 w-full"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-sans font-bold text-white shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Auditing site...
                </>
              ) : (
                "Scan Site"
              )}
            </button>
          </form>
          {errorMsg && (
            <p className="text-red-400 text-xs mt-4 text-center">{errorMsg}</p>
          )}
        </div>

        {/* Dynamic Performance Scoping Audit Widget */}
        <div className="max-w-2xl mx-auto mb-16">
          <AuditWidget />
        </div>

        {/* Result view */}
        {report && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Scores summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card border border-white/5 p-6 text-center">
                <span className="font-sans text-[10px] uppercase text-slate-500">Performance Score</span>
                <div className="font-jakarta text-5xl font-extrabold text-[#00E5FF] mt-2 mb-2">
                  {report.performanceScore}%
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3 h-3" /> Excellent
                </div>
              </div>

              <div className="glass-card border border-white/5 p-6 text-center">
                <span className="font-sans text-[10px] uppercase text-slate-500">SEO Index Score</span>
                <div className="font-jakarta text-5xl font-extrabold text-purple-400 mt-2 mb-2">
                  {report.seoScore}%
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  <ShieldAlert className="w-3 h-3" /> Needs Tweaks
                </div>
              </div>
            </div>

            {/* Recommendations detail report */}
            <div className="lg:col-span-8 glass-card border border-white/10 p-8 md:p-10">
              <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-6">
                <Sparkles className="w-5 h-5 text-[#00E5FF] animate-pulse" />
                <h3 className="font-grotesk text-xl font-bold text-white">Recommendations Summary</h3>
              </div>

              <div className="prose prose-invert max-w-none font-sans text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                {report.recommendations}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
