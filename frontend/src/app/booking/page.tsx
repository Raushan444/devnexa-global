"use client";
import { API_BASE_URL } from "@/config/api";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Clock, Globe, Shield, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface Slot {
  time: string;
  available: boolean;
}

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState("STRATEGY_CALL");
  const [platform, setPlatform] = useState("GOOGLE_MEET");
  
  // Details form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  
  // App state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeZone, setTimeZone] = useState("UTC");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    }
  }, []);

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setErrorMsg("");
      const formattedDate = selectedDate.toISOString().split("T")[0];
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/booking/slots?date=${formattedDate}`);
        if (res.ok) {
          const data = await res.json();
          // Map to Slot interface
          if (data && data.length > 0) {
            setSlots(data.map((s: any) => ({ time: s.startTime, available: s.isAvailable })));
          } else {
            setSlots(getDefaultSlots());
          }
        } else {
          setSlots(getDefaultSlots());
        }
      } catch (err) {
        setSlots(getDefaultSlots());
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
    setSelectedSlot(null);
  }, [selectedDate]);

  const getDefaultSlots = (): Slot[] => {
    return [
      { time: "09:00", available: true },
      { time: "10:00", available: true },
      { time: "11:00", available: true },
      { time: "14:00", available: true },
      { time: "15:00", available: true },
      { time: "16:00", available: true },
      { time: "17:00", available: true }
    ];
  };

  // Calendar math
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const { firstDay, totalDays } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;
    // Disable Sundays
    if (date.getDay() === 0) return;
    setSelectedDate(date);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setErrorMsg("Please select a date and a time slot first.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      clientName: name,
      clientEmail: email,
      clientCompany: company,
      phone: phone,
      meetingType: meetingType,
      scheduledDate: selectedDate.toISOString().split("T")[0],
      scheduledTime: selectedSlot,
      timezone: timeZone,
      platform: platform,
      notes: notes
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/public/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.bookingReference) {
        setBookingRef(data.bookingReference);
      } else {
        setErrorMsg(data.message || "Failed to book appointment. Please try again.");
      }
    } catch (err) {
      setErrorMsg(`Failed to connect to backend api. Make sure Spring Boot (${API_BASE_URL}) is running!`);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Render Confirmation Screen
  if (bookingRef) {
    return (
      <div className="relative min-h-[90vh] flex items-center justify-center bg-[#070B16] text-[#F8FAFC] py-24 px-6">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="w-full max-w-xl glass-card-glow p-8 md:p-12 text-center border border-white/10 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#00E5FF] to-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-cyan-500/20">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-grotesk text-3xl md:text-4xl font-bold text-white mb-4">
            Booking Confirmed!
          </h2>
          <p className="font-sans text-sm text-slate-400 max-w-md mx-auto mb-8">
            Your appointment has been successfully scheduled. A confirmation email with meeting details has been sent to <span className="text-white font-semibold">{email}</span>.
          </p>

          <div className="bg-white/5 rounded-2xl border border-white/5 p-6 mb-8 text-left space-y-4 font-sans text-xs">
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-slate-500 font-semibold uppercase tracking-wider">Reference Code</span>
              <span className="text-[#00E5FF] font-mono font-bold text-sm">{bookingRef}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-slate-500 font-semibold uppercase tracking-wider">Date & Time</span>
              <span className="text-white font-medium">{selectedDate?.toDateString()} at {selectedSlot}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-slate-500 font-semibold uppercase tracking-wider">Meeting Type</span>
              <span className="text-white font-medium">{meetingType.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold uppercase tracking-wider">Platform</span>
              <span className="text-white font-medium">{platform.replace("_", " ")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setBookingRef(null);
                setSelectedDate(null);
                setSelectedSlot(null);
                setName("");
                setEmail("");
                setCompany("");
                setPhone("");
                setNotes("");
              }}
              className="py-3 px-6 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
            >
              Book Another Session
            </button>
            <Link
              href="/"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
            >
              Go to Homepage
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-20 px-6">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 text-xs text-[#00E5FF]">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Consultation Scheduler</span>
          </div>
          <h1 className="font-grotesk text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Book a Strategy Call
          </h1>
          <p className="font-sans text-sm md:text-base text-slate-400 leading-relaxed">
            Schedule a 30-minute expert session with our architects to map out your digital roadmap, cloud architecture, or AI integration.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3">
            <span className="font-semibold">Error:</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Date Selection */}
          <div className="glass-card-glow border border-white/10 p-6">
            <h3 className="font-grotesk text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-[#00E5FF] flex items-center justify-center font-bold">1</span>
              Select Date
            </h3>

            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="font-grotesk text-sm font-semibold text-white">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
              <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-slate-500 font-bold mb-2">
              <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isPast = d < today;
                const isSunday = d.getDay() === 0;
                const isDisabled = isPast || isSunday;
                const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => handleDateSelect(day)}
                    disabled={isDisabled}
                    className={`h-9 w-full rounded-lg font-sans text-xs flex items-center justify-center border transition-all ${
                      isSelected
                        ? "calendar-day-selected"
                        : isDisabled
                        ? "calendar-day-disabled text-slate-700 border-transparent"
                        : "border-white/5 text-slate-300 hover:border-blue-500/30 hover:bg-blue-500/10"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2 text-slate-500 font-sans text-[10px]">
              <Globe className="w-4 h-4 text-[#00E5FF]" />
              <span>Timezone: <strong className="text-slate-300 font-medium">{timeZone}</strong></span>
            </div>
          </div>

          {/* Column 2: Slot Selection */}
          <div className="glass-card-glow border border-white/10 p-6">
            <h3 className="font-grotesk text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-[#00E5FF] flex items-center justify-center font-bold">2</span>
              Choose Slot
            </h3>

            {!selectedDate ? (
              <div className="h-48 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-500 font-sans text-xs">
                <CalendarIcon className="w-8 h-8 text-slate-600 mb-2" />
                Select a date to retrieve real-time availability slots
              </div>
            ) : loadingSlots ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 skeleton w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold font-sans transition-all ${
                        selectedSlot === slot.time
                          ? "time-slot-selected"
                          : !slot.available
                          ? "time-slot-taken"
                          : "border-white/5 bg-[#050816] text-slate-300 hover:border-blue-500/40"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div>
                    <label className="font-sans text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Meeting Type</label>
                    <select
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40"
                    >
                      <option value="STRATEGY_CALL">Strategy Call</option>
                      <option value="TECHNICAL_AUDIT">Technical Audit</option>
                      <option value="PARTNERSHIP">Partnership Discussion</option>
                      <option value="SUPPORT">General Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-sans text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40"
                    >
                      <option value="GOOGLE_MEET">Google Meet</option>
                      <option value="ZOOM">Zoom</option>
                      <option value="TEAMS">Microsoft Teams</option>
                      <option value="PHONE">Phone Call</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Confirmation */}
          <div className="glass-card-glow border border-white/10 p-6">
            <h3 className="font-grotesk text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-[#00E5FF] flex items-center justify-center font-bold">3</span>
              Enter Details
            </h3>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Business Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Company Name (Optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>

              <div>
                <textarea
                  placeholder="Additional Notes / Scope Details"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || !selectedDate || !selectedSlot}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-sans font-bold text-white shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Confirming..." : "Schedule Strategy Session"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
