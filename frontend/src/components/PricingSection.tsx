"use client";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$999",
    description: "Perfect for small businesses and landing pages",
    features: [
      "Landing Page (up to 5 sections)",
      "Mobile Responsive Design",
      "Contact Form Integration",
      "Basic SEO Optimization",
      "2 Revision Rounds",
      "14-day Delivery",
    ],
    color: "#00E5FF",
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Growth",
    price: "$2,499",
    description: "For startups and growing businesses",
    features: [
      "Full Web Application",
      "User Authentication (JWT)",
      "Admin Dashboard",
      "REST API Integration",
      "Payment Gateway Setup",
      "6-month Support & Updates",
    ],
    color: "#7C3AED",
    popular: true,
    cta: "Start Project",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale platforms and enterprises",
    features: [
      "Custom Architecture & Microservices",
      "AI / LLM Integration",
      "CI/CD Pipeline & Docker",
      "SLA Uptime Guarantee",
      "Dedicated Support Team",
      "Unlimited Revisions",
    ],
    color: "#10B981",
    popular: false,
    cta: "Contact Us",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-500/5 to-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            Investment
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Transparent{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#00E5FF] bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Fixed-scope projects with no hidden fees. Clear deliverables,
            on-time delivery.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 ${
                plan.popular
                  ? "border-[#7C3AED]/60 bg-[#7C3AED]/5 shadow-2xl shadow-[#7C3AED]/10"
                  : "border-white/5 bg-white/[0.02] hover:border-white/10"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white shadow-lg shadow-[#7C3AED]/25">
                  Most Popular
                </div>
              )}

              {/* Plan info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                <div
                  className="text-4xl font-black"
                  style={{ color: plan.color }}
                >
                  {plan.price}
                </div>
                {plan.price !== "Custom" && (
                  <span className="text-slate-500 text-sm">starting from</span>
                )}
              </div>

              {/* Divider */}
              <div
                className="h-px w-full mb-6 opacity-20"
                style={{ backgroundColor: plan.color }}
              />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-slate-300 text-sm"
                  >
                    <CheckCircle
                      size={16}
                      className="shrink-0 mt-0.5"
                      style={{ color: plan.color }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/contact"
                className="block w-full text-center py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 text-sm hover:scale-[1.02]"
                style={
                  plan.popular
                    ? {
                        background: `linear-gradient(135deg, #7C3AED, #2563EB)`,
                        color: "white",
                        boxShadow: `0 8px 24px rgba(124, 58, 237, 0.3)`,
                      }
                    : {
                        border: `1px solid ${plan.color}40`,
                        color: plan.color,
                        backgroundColor: `${plan.color}08`,
                      }
                }
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-600 text-xs mt-10"
        >
          All projects include free consultation, milestone-based payments, and
          post-launch support.
        </motion.p>
      </div>
    </section>
  );
}
