"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, Calendar, Clock, MapPin, CheckCircle, ArrowRight, MessageSquare } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";

// Form Validation Schema using Zod
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  meetingType: z.enum(["CONSULTATION", "AUDIT", "PARTNERSHIP"]),
  scheduledTime: z.string().min(1, "Please pick a date and time"),
  description: z.string().min(10, "Please provide a brief details (at least 10 chars)")
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      meetingType: "CONSULTATION"
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setErrorMsg("");
    try {
      const response = await fetch("http://localhost:8080/api/public/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const resJson = await response.json();
      if (response.ok && resJson.success) {
        setIsSubmitted(true);
        reset();
      } else {
        setErrorMsg(resJson.message || "Failed to schedule meeting. Make sure the backend server is running!");
      }
    } catch (e) {
      setErrorMsg("Failed to connect to backend server. Make sure Spring Boot (localhost:8080) is running!");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background glow highlights */}
      <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="font-grotesk text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Get in Touch
          </h1>
          <p className="font-sans text-slate-400 text-sm md:text-base">
            Have a project in mind? Complete the form to schedule a live video consultation with our software architects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Information & Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card p-8 border border-white/5 space-y-6">
              <h3 className="font-grotesk text-xl font-bold text-white mb-6">
                Agency Directory
              </h3>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 text-[#00E5FF]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-grotesk font-bold text-sm text-white">Global Headquarters</h4>
                  <p className="font-sans text-xs text-slate-400 mt-1">{COMPANY_INFO.address}, {COMPANY_INFO.city}, {COMPANY_INFO.country}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 text-[#7C3AED]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-grotesk font-bold text-sm text-white">Business Hours</h4>
                  <p className="font-sans text-xs text-slate-400 mt-1">{COMPANY_INFO.businessHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 text-[#2563EB]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-grotesk font-bold text-sm text-white">WhatsApp Channels</h4>
                  <a
                    href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-xs text-[#00E5FF] hover:underline block mt-1"
                  >
                    {COMPANY_INFO.phone} (Live Sales Chat)
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Mockup */}
            <div className="glass-card border border-white/5 p-4 aspect-video flex flex-col items-center justify-center relative overflow-hidden bg-slate-900/60">
              <div className="absolute inset-0 bg-[#070B16]/20 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:16px_16px]" />
              <div className="text-center relative z-10 space-y-4">
                <MapPin className="w-8 h-8 text-rose-500 mx-auto mb-2 animate-bounce" />
                <span className="font-mono text-xs text-white block">{COMPANY_INFO.city}, {COMPANY_INFO.state}</span>
                <a
                  href={COMPANY_INFO.googleMaps}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2 bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-[#070B16] font-sans text-xs font-bold rounded-lg transition-all"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Booking Form Column */}
          <div className="lg:col-span-7 glass-card border border-white/10 p-8 md:p-10">
            {isSubmitted ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-grotesk text-2xl font-bold text-white">
                  Meeting Booked Successfully!
                </h3>
                <p className="font-sans text-slate-400 text-sm max-w-sm mx-auto">
                  Our coordinator will review your request and send a Google Meet calendar invitation to your email.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 font-sans text-xs font-semibold hover:bg-white/5"
                >
                  Schedule Another Meeting
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h3 className="font-grotesk text-xl font-bold text-white mb-6">
                  Schedule Project Consultation
                </h3>

                {errorMsg && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Name</label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="Your Full Name"
                      className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                    />
                    {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Email Address</label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="you@company.com"
                      className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                    />
                    {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Company */}
                  <div>
                    <label className="font-sans text-xs text-slate-400 block mb-2">Company Name (Optional)</label>
                    <input
                      type="text"
                      {...register("company")}
                      placeholder="Your Company LLC"
                      className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                    />
                  </div>

                  {/* Meeting Type */}
                  <div>
                    <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Consultation Scope</label>
                    <select
                      {...register("meetingType")}
                      className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40"
                    >
                      <option value="CONSULTATION">General Consultation</option>
                      <option value="AUDIT">Website Technical Audit</option>
                      <option value="PARTNERSHIP">Strategic Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Scheduled Time */}
                  <div>
                    <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Select Date & Time</label>
                    <input
                      type="datetime-local"
                      {...register("scheduledTime")}
                      className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none focus:border-[#00E5FF]/40"
                    />
                    {errors.scheduledTime && <p className="text-red-400 text-[10px] mt-1">{errors.scheduledTime.message}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Project Brief & Details</label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Provide details about your project scope, timeline, and goals..."
                    className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                  />
                  {errors.description && <p className="text-red-400 text-[10px] mt-1">{errors.description.message}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-sans font-bold text-white shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  {isSubmitting ? "Submitting Request..." : "Schedule Meeting"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
