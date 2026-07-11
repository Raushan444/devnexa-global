import type { Metadata } from "next";
import PortfolioSection from "@/components/PortfolioSection";

export const metadata: Metadata = {
  title: "Portfolio | DevNexa Global",
  description: "Explore DevNexa Global's portfolio of premium enterprise software projects, web applications, AI integrations, and digital products.",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Hero */}
      <div className="relative pt-32 pb-16 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15)_0%,transparent_70%)] pointer-events-none" />
        <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-[0.3em] mb-4">Our Work</p>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
          Built with <span className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] bg-clip-text text-transparent">Excellence</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Enterprise solutions, scalable architectures, and premium user experiences — delivered on time.
        </p>
      </div>
      <PortfolioSection />
    </div>
  );
}
