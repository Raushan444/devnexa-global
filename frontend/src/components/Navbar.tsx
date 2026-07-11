"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("dark");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Cost Estimator", href: "/estimator" },
    { name: "SEO Auditor", href: "/auditor" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 max-w-5xl mx-auto w-[92%] sm:w-full`}
    >
      <div
        className={`rounded-full border transition-all duration-300 ${
          scrolled
            ? "bg-[#050816]/75 backdrop-blur-xl border-white/10 py-3 px-6 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6)] animate-wobble-nav"
            : "bg-transparent border-transparent py-4 px-6"
        } flex items-center justify-between`}
      >
        {/* Logo */}
        <Link href="/" className="hover:scale-98 transition-transform">
          <Logo />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7 bg-white/5 border border-white/5 rounded-full px-5 py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-sans text-xs font-semibold uppercase tracking-wider transition-colors hover:text-[#00E5FF] nav-link-liquid ${
                  isActive ? "text-[#00E5FF]" : "text-slate-400"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white/5 border border-white/5 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          <Link
            href="/contact"
            className="relative px-5 py-2.5 rounded-full font-sans text-xs font-bold text-white overflow-hidden group shadow-lg hover:shadow-cyan-500/10 transition-shadow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0.5 bg-[#050816] rounded-full group-hover:opacity-0 transition-opacity duration-300" />
            <span className="relative flex items-center gap-1.5 z-10 text-[#00E5FF] group-hover:text-white transition-colors">
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white/5 text-slate-300 hover:text-white cursor-pointer"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-full bg-white/5 text-slate-300 hover:text-white"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 z-40 bg-[#050816]/95 backdrop-blur-xl border border-white/10 rounded-2xl md:hidden animate-fade-in p-6 shadow-2xl">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-sans text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-[#00E5FF] py-1"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-white/5 my-1" />
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-sans font-bold text-white text-xs"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
