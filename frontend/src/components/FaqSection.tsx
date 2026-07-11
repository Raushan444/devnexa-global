"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How long does a typical project take?",
    a: "Timeline depends on scope. A landing page takes 1–2 weeks, a full web app typically 6–12 weeks, and enterprise platforms 3–6 months. We provide exact timelines after the discovery call.",
  },
  {
    q: "Do you offer ongoing maintenance and support?",
    a: "Yes — all projects include 30-day post-launch support at no extra cost. Long-term maintenance contracts are available starting at $500/month, covering updates, bug fixes, and performance monitoring.",
  },
  {
    q: "What technologies do you specialize in?",
    a: "Our core stack is Next.js, React, Spring Boot, and PostgreSQL. We also work with Python, Node.js, React Native, Docker, Redis, and all major cloud platforms (AWS, GCP, Vercel).",
  },
  {
    q: "How do payments work?",
    a: "We use a milestone-based payment model: 30% upfront to begin, 40% at the mid-project milestone, and 30% on final delivery. We accept bank transfer, Stripe, and Razorpay.",
  },
  {
    q: "Can you work with our existing in-house development team?",
    a: "Absolutely. We integrate seamlessly with your dev team via GitHub, Jira, Linear, or any tool you prefer. Code reviews, architecture guidance, and pair programming sessions are all available.",
  },
  {
    q: "Do you sign NDAs and provide IP ownership?",
    a: "Yes. We sign NDAs before any project discussion upon request. Full intellectual property ownership is transferred to you upon final payment — we retain no rights to your codebase.",
  },
  {
    q: "What is your revision and change request policy?",
    a: "Each plan includes a defined number of revision rounds. Additional change requests beyond scope are billed at an hourly rate agreed upon in the contract. We aim to be flexible and transparent.",
  },
  {
    q: "Can I see examples of your previous work?",
    a: "Yes! Visit our Portfolio page to see case studies across fintech, healthcare, e-commerce, and AI/ML projects. We can also share private demos under NDA for enterprise clients.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Common{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#00E5FF] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${
                  isOpen
                    ? "border-[#7C3AED]/40 bg-[#7C3AED]/5"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-white text-sm md:text-base pr-4">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="shrink-0 text-[#00E5FF]"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
