"use client";
import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Alex Morgan",
    role: "CTO, FinTech Startup",
    avatar: "AM",
    text: "DevNexa Global delivered our entire fintech platform in 6 weeks — ahead of schedule. The JWT security implementation was flawless and the Stripe integration worked perfectly on day one.",
    rating: 5,
    project: "Fintech Dashboard",
  },
  {
    name: "Priya Nair",
    role: "Founder, E-Commerce Brand",
    avatar: "PN",
    text: "The Next.js storefront they built loads in under 1 second and our conversion rate doubled. The attention to UI detail and performance optimization is extraordinary.",
    rating: 5,
    project: "E-Commerce Platform",
  },
  {
    name: "David Chen",
    role: "VP Engineering, SaaS Company",
    avatar: "DC",
    text: "We brought in DevNexa to refactor our legacy Spring Boot monolith. They decomposed it into clean microservices with zero downtime migration. Highly recommend.",
    rating: 5,
    project: "Microservices Migration",
  },
  {
    name: "Sarah Williams",
    role: "Product Manager, HealthTech",
    avatar: "SW",
    text: "The AI chatbot integration they built processes over 500 support queries a day with 94% resolution rate. The Gemini API implementation exceeded our expectations.",
    rating: 5,
    project: "AI Support System",
  },
];

export default function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused]);

  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p + 1) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-[0.3em] mb-4">What Clients Say</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Client <span className="text-[#7C3AED]">Testimonials</span></h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -80 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="p-10 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl relative"
            >
              {/* Quote icon */}
              <div className="text-6xl text-[#00E5FF]/20 font-serif leading-none mb-4">&ldquo;</div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-300 text-lg leading-relaxed mb-8">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-slate-400 text-sm">{t.role}</div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-medium px-3 py-1 rounded-full border border-[#00E5FF]/20 text-[#00E5FF]">
                    {t.project}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="p-3 rounded-full border border-white/10 hover:border-[#00E5FF]/40 hover:text-[#00E5FF] text-slate-400 transition-all duration-300">
              <ChevronLeft size={18} />
            </button>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-[#00E5FF] w-6' : 'bg-white/20 hover:bg-white/40 w-2'}`}
              />
            ))}
            <button onClick={next} className="p-3 rounded-full border border-white/10 hover:border-[#00E5FF]/40 hover:text-[#00E5FF] text-slate-400 transition-all duration-300">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
