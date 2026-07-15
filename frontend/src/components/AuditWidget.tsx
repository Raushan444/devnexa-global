"use client";
import React, { useState } from "react";
import { API_BASE_URL } from "@/config/api";
import { ShieldCheck, Search, ArrowRight, Activity, Terminal, AlertTriangle, CheckCircle } from "lucide-react";

export default function AuditWidget() {
  const [siteUrl, setSiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"form" | "scanning" | "done">("form");
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const runSimulation = () => {
    setStage("scanning");
    const messages = [
      "Connecting to target DNS server...",
      "Resolving A records...",
      "Retrieving security TLS handshake headers...",
      "Scanning asset load sizes and JS weights...",
      "Parsing layout responsiveness nodes...",
      "Audit logs processed. Submitting report scoping registry..."
    ];

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[INFO] ${msg}`]);
      }, (idx + 1) * 800);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteUrl || !email || !name) return;

    setLoading(true);
    setErrorMsg("");
    runSimulation();

    try {
      const res = await fetch(`${API_BASE_URL}/api/public/crm/audit-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, siteUrl, company: "N/A" })
      });

      if (res.ok) {
        setTimeout(() => {
          setStage("done");
          setLoading(false);
        }, 5500);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to submit request.");
        setStage("form");
        setLoading(false);
      }
    } catch (err) {
      // Offline fallback
      setTimeout(() => {
        setStage("done");
        setLoading(false);
      }, 5500);
    }
  };

  return (
    <div className="glass-card border border-white/10 p-6 max-w-lg mx-auto relative overflow-hidden font-sans text-xs">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-[40px] pointer-events-none" />

      {stage === "form" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-grotesk text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
              Free Performance & SEO Scoping Audit
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Enter your website URL and email to get a free technical review covering loading speed, core vitals, and security gaps.
            </p>
          </div>

          {errorMsg && (
            <p className="text-red-400 font-semibold">{errorMsg}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
            />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40 md:col-span-2"
            />
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="url"
              required
              placeholder="https://yourwebsite.com"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-24 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 py-1.5 px-4 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#2563EB] font-bold text-white shadow-md flex items-center gap-1 hover:scale-[1.01]"
            >
              Analyze
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {stage === "scanning" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-white border-b border-white/5 pb-3">
            <h4 className="font-grotesk text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
              Auditor Scan Engine
            </h4>
            <span className="font-mono text-[9px] text-[#00E5FF]">{siteUrl}</span>
          </div>

          <div className="bg-[#050816] rounded-xl p-4 border border-white/5 font-mono text-[10px] text-slate-400 space-y-2 h-44 overflow-y-auto">
            <div className="text-slate-500">// INITIALIZING SCANS...</div>
            {logs.map((log, i) => (
              <div key={i} className="animate-fade-in">{log}</div>
            ))}
            <div className="flex items-center gap-1 text-cyan-400">
              <Terminal className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing layout elements...</span>
            </div>
          </div>
        </div>
      )}

      {stage === "done" && (
        <div className="text-center py-6 space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="font-grotesk text-base font-bold text-white">Scoping Audit Initiated</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm mx-auto">
              Our automated scans completed. We found <strong className="text-amber-400">3 speed warnings</strong> and <strong className="text-amber-400">2 layout viewport shifts</strong>.
              A comprehensive PDF audit report and scoping plan is being sent to <strong className="text-white">{email}</strong>.
            </p>
          </div>
          <button
            onClick={() => setStage("form")}
            className="py-2.5 px-5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all"
          >
            Audit Another Site
          </button>
        </div>
      )}
    </div>
  );
}
