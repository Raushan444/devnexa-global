"use client";
import { API_BASE_URL } from "@/config/api";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, CheckCircle, Loader2 } from "lucide-react";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Singapore", "UAE", "Japan", "Other"
];

interface UploadedFile {
  name: string;
  size: number;
  url?: string;
  progress: number;
  error?: string;
}

export default function QuotePage() {
  const [form, setForm] = useState({
    projectName: "",
    projectType: "",
    budgetRange: "",
    timeline: "",
    description: "",
    figmaLink: "",
    adobeLink: "",
    referenceLink: "",
    fullName: "",
    email: "",
    company: "",
    phone: "",
    country: "India",
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const uploadFile = async (file: File) => {
    const newFile: UploadedFile = { name: file.name, size: file.size, progress: 0 };
    setFiles(prev => [...prev, newFile]);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const fd = new FormData();
      fd.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/api/files/upload`);
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: pct } : f));
        }
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              setFiles(prev => prev.map(f => f.name === file.name ? { ...f, url: data.url, progress: 100 } : f));
            } catch {
              setFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: 100 } : f));
            }
            resolve();
          } else {
            setFiles(prev => prev.map(f => f.name === file.name ? { ...f, error: "Upload failed", progress: 0 } : f));
            reject();
          }
        };
        xhr.onerror = () => {
          setFiles(prev => prev.map(f => f.name === file.name ? { ...f, error: "Network error", progress: 0 } : f));
          reject();
        };
        xhr.send(fd);
      });
    } catch {
      // error already set in xhr handlers
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(uploadFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) Array.from(e.target.files).forEach(uploadFile);
  };

  const removeFile = (name: string) => setFiles(prev => prev.filter(f => f.name !== name));

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.description.length < 50) { setError("Project description must be at least 50 characters."); return; }
    setSubmitting(true);
    setError("");
    try {
      const fileUrls = files.filter(f => f.url).map(f => f.url!);
      const res = await fetch(`${API_BASE_URL}/api/public/crm/quote-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fileUrls }),
      });
      if (res.ok) setSubmitted(true);
      else setError("Submission failed. Please try again.");
    } catch {
      setError("Could not connect to server.");
    } finally {
      setSubmitting(false);
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
          <CheckCircle className="w-16 h-16 text-[#00E5FF] mx-auto mb-6" />
          <h2 className="font-grotesk text-3xl font-bold text-white mb-3">Quote Request Received!</h2>
          <p className="text-slate-400">Your quote request has been received! We&apos;ll send you a detailed proposal within 24 hours.</p>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40 transition-colors";
  const labelClass = "text-xs text-slate-400 font-semibold block mb-2";

  return (
    <div className="relative min-h-screen bg-[#050816] text-white py-12 px-4">
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 text-xs text-[#00E5FF] font-semibold">
            <FileText className="w-3.5 h-3.5" /> Quote Request
          </div>
          <h1 className="font-grotesk text-4xl font-bold mb-3">
            <span className="text-gradient-purple-cyan">Get a Free</span> Quote
          </h1>
          <p className="text-slate-400 text-sm">Fill in the details below and receive a detailed proposal within 24 hours</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">{error}</div>}

          {/* Section 1: Project Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-glow p-8">
            <h2 className="font-grotesk text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold">1</span>
              Project Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className={labelClass}>Project Name</label>
                <input type="text" placeholder="My Awesome Project" value={form.projectName} onChange={e => set("projectName", e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Project Type</label>
                <select value={form.projectType} onChange={e => set("projectType", e.target.value)} className={inputClass} required>
                  <option value="">Select type...</option>
                  {["Website", "Mobile App", "SaaS", "E-Commerce", "AI Solution", "CRM", "ERP", "Custom"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Budget Range</label>
                <select value={form.budgetRange} onChange={e => set("budgetRange", e.target.value)} className={inputClass} required>
                  <option value="">Select budget...</option>
                  {["Under $5K", "$5K–$15K", "$15K–$30K", "$30K–$60K", "$60K–$100K", "$100K+"].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Timeline</label>
                <select value={form.timeline} onChange={e => set("timeline", e.target.value)} className={inputClass} required>
                  <option value="">Select timeline...</option>
                  {["ASAP", "1–2 months", "2–4 months", "4–6 months", "Flexible"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Project Description <span className="text-slate-500">(min 50 characters)</span></label>
                <textarea
                  rows={4}
                  placeholder="Describe your project goals, key features, target audience..."
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  className={inputClass}
                  required
                />
                <p className={`text-xs mt-1 ${form.description.length >= 50 ? "text-[#00E5FF]" : "text-slate-600"}`}>{form.description.length}/50 characters minimum</p>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Design Assets */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card-glow p-8">
            <h2 className="font-grotesk text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold">2</span>
              Design Assets <span className="text-slate-500 text-sm font-normal">(Optional)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { key: "figmaLink", label: "Figma Link", placeholder: "https://figma.com/file/..." },
                { key: "adobeLink", label: "Adobe XD Link", placeholder: "https://xd.adobe.com/..." },
                { key: "referenceLink", label: "Live Reference Site", placeholder: "https://example.com" },
              ].map(f => (
                <div key={f.key}>
                  <label className={labelClass}>{f.label}</label>
                  <input
                    type="url"
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => set(f.key, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 3: File Upload */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-glow p-8">
            <h2 className="font-grotesk text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold">3</span>
              File Upload <span className="text-slate-500 text-sm font-normal">(Optional)</span>
            </h2>
            <div
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                dragOver ? "border-[#00E5FF] bg-[#00E5FF]/5" : "border-white/10 hover:border-white/20"
              }`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Drop files here or <span className="text-[#00E5FF]">browse</span></p>
              <p className="text-slate-600 text-xs mt-1">PDF, DOCX, ZIP, PNG, JPG, PPT — Max 50MB each</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.zip,.png,.jpg,.jpeg,.ppt,.pptx"
              className="hidden"
              onChange={handleFileInput}
            />

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map(f => (
                  <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">{f.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(f.size)}</p>
                      {f.progress > 0 && f.progress < 100 && (
                        <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                          <div className="bg-[#00E5FF] h-1 rounded-full transition-all" style={{ width: `${f.progress}%` }} />
                        </div>
                      )}
                      {f.error && <p className="text-xs text-red-400">{f.error}</p>}
                    </div>
                    {f.progress === 100 && <CheckCircle className="w-4 h-4 text-[#00E5FF] flex-shrink-0" />}
                    <button type="button" onClick={() => removeFile(f.name)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Section 4: Your Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card-glow p-8">
            <h2 className="font-grotesk text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold">4</span>
              Your Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" placeholder="John Doe" value={form.fullName} onChange={e => set("fullName", e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Business Email</label>
                <input type="email" placeholder="john@company.com" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Company Name</label>
                <input type="text" placeholder="Acme Corp" value={form.company} onChange={e => set("company", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={e => set("phone", e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Country</label>
                <select value={form.country} onChange={e => set("country", e.target.value)} className={inputClass}>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] text-white font-bold text-base hover:shadow-xl hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : "Submit Quote Request →"}
          </button>
        </form>
      </div>
    </div>
  );
}
