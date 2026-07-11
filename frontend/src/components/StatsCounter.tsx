"use client";
import { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { label: "Projects Delivered", value: 48, suffix: "+" },
  { label: "Happy Clients", value: 35, suffix: "+" },
  { label: "Years Experience", value: 5, suffix: "+" },
  { label: "Uptime Guarantee", value: 99, suffix: ".9%" },
];

function Counter({ value, suffix, prefix }: { value: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 2000;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-[#00E5FF]/20 transition-all duration-500 group"
            >
              <div className="text-4xl md:text-5xl font-bold text-[#00E5FF] mb-3 group-hover:scale-110 transition-transform duration-300">
                <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-slate-400 text-sm font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
