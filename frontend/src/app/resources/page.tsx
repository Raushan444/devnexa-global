"use client";
import React, { useState } from "react";
import { API_BASE_URL } from "@/config/api";
import { FileText, Download, CheckCircle, Lock, Mail, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  fileSize: string;
  fileUrl: string;
}

export default function ResourcesPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resources: ResourceItem[] = [
    {
      id: "website-blueprint",
      title: "Enterprise Website Planning Guide",
      description: "A comprehensive checklist detailing system requirements, server specifications, routing architectures, and mock database schemas.",
      fileSize: "1.4 MB PDF",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // Placeholder link
    },
    {
      id: "seo-audit-checklist",
      title: "Technical SEO Optimization Guide",
      description: "A professional checklist detailing crawl settings, meta tags, schema structures, lazy-load configurations, and responsive checks.",
      fileSize: "950 KB PDF",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
      id: "crm-architecture",
      title: "Custom CRM & ERP Architecture Plan",
      description: "Architectural blueprint mapping database tables, authentication pipelines, Stripe callbacks, and role-based permissions.",
      fileSize: "2.1 MB PDF",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  ];

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/public/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || "Resource User" })
      });

      if (res.ok) {
        setUnlocked(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to confirm subscription.");
      }
    } catch (err) {
      // Offline fallback for development, let user unlock anyway but alert
      console.warn("API offline - unlocking local resource downloads");
      setUnlocked(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background decoration */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 text-xs text-[#00E5FF]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developer & Business Resources</span>
          </div>
          <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            E-Books, Checklists & Blueprints
          </h1>
          <p className="font-sans text-slate-400 text-sm md:text-base">
            Download our curated technical blueprints and planning guides. Free resources, gated by secure email subscription.
          </p>
        </div>

        {/* Gated Lock Screen or Unlocked Items */}
        {!unlocked ? (
          <div className="max-w-md mx-auto glass-card-glow border border-white/10 p-8 text-center relative overflow-hidden bg-gradient-to-tr from-purple-500/5 to-blue-500/5">
            <div className="w-12 h-12 rounded-full bg-[#00E5FF]/10 flex items-center justify-center mx-auto mb-6 text-[#00E5FF]">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-grotesk text-xl font-bold text-white mb-2">Unlock Gated Downloads</h3>
            <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">
              Enter your email below to unlock immediate access to all technical checklists and e-books.
            </p>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded-lg mb-4 flex items-center gap-2 text-left">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUnlock} className="space-y-3 font-sans text-xs text-left">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-bold text-white shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {submitting ? "Confirming..." : "Access Resources Library"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2 justify-center max-w-lg mx-auto mb-8 font-sans">
              <CheckCircle className="w-4 h-4" />
              <span>Library Unlocked! You now have full access to download all specifications.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((item) => (
                <div
                  key={item.id}
                  className="glass-card border border-white/10 p-6 flex flex-col justify-between hover:border-[#00E5FF]/25 transition-all"
                >
                  <div className="space-y-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#00E5FF]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-grotesk text-base font-bold text-white leading-tight">
                        {item.title}
                      </h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed mt-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between font-sans text-xs">
                    <span className="font-mono text-[10px] text-slate-500">{item.fileSize}</span>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
