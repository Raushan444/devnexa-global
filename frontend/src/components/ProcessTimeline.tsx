"use client";
import { useEffect, useRef, useState } from "react";
import { Search, Palette, Code2, TestTube, Rocket } from "lucide-react";

const steps = [
  { icon: Search, label: "Discovery", color: "#00E5FF", description: "Deep-dive into your goals, users, and technical constraints to map the perfect solution architecture." },
  { icon: Palette, label: "Design", color: "#7C3AED", description: "Wireframes, UI prototypes, and design system creation — approved before a single line of code is written." },
  { icon: Code2, label: "Development", color: "#10B981", description: "Sprint-based delivery with weekly demos. Clean, documented, scalable code following SOLID principles." },
  { icon: TestTube, label: "Testing", color: "#F59E0B", description: "Automated testing, performance audits, security scans, and cross-device QA before launch." },
  { icon: Rocket, label: "Launch & Support", color: "#EF4444", description: "Docker deployment, CI/CD pipeline, monitoring setup, and 30-day post-launch support included." },
];

export default function ProcessTimeline() {
  const [visible, setVisible] = useState<number[]>([]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible((prev) => [...prev, i]), i * 150);
            obs.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-[0.3em] mb-4">How We Work</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Our <span className="text-[#7C3AED]">Process</span></h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7C3AED]/50 via-[#00E5FF]/50 to-transparent" />

          <div className="space-y-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isRight = i % 2 === 0;
              const isVisible = visible.includes(i);
              return (
                <div
                  key={step.label}
                  ref={(el) => { refs.current[i] = el; }}
                  className={`flex items-center gap-8 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  } ${isRight ? 'flex-row' : 'flex-row'}`}
                >
                  {/* Content left (alternate) */}
                  <div className={`flex-1 hidden md:block ${isRight ? 'text-right' : 'invisible'}`}>
                    {isRight && (
                      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300">
                        <h3 className="text-xl font-bold text-white mb-2">{step.label}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500"
                      style={{ borderColor: step.color, backgroundColor: step.color + '15', boxShadow: isVisible ? `0 0 20px ${step.color}30` : 'none' }}
                    >
                      <Icon size={24} style={{ color: step.color }} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#050816] border-2 flex items-center justify-center text-xs font-bold" style={{ borderColor: step.color, color: step.color }}>
                      {i + 1}
                    </div>
                  </div>

                  {/* Content right side */}
                  <div className="flex-1">
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300">
                      <h3 className="text-xl font-bold text-white mb-2 md:hidden">{step.label}</h3>
                      {!isRight && <h3 className="text-xl font-bold text-white mb-2 hidden md:block">{step.label}</h3>}
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
