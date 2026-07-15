"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, Cpu } from "lucide-react";
import Logo from "@/components/Logo";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  const loadingMessages = [
    "Initializing Experience",
    "Loading 3D WebGL Assets",
    "Optimizing Graphics Interface",
    "Preparing Portfolio Workspace"
  ];

  useEffect(() => {
    const duration = 2800; // 2.8 seconds loading experience
    const steps = 100;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      setProgress(current);

      // Rotate messages based on progress
      if (current === 25) setMsgIndex(1);
      if (current === 50) setMsgIndex(2);
      if (current === 75) setMsgIndex(3);

      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 900); // Allow fade & blur reveal to complete
        }, 400);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // SVG Circular progress math
  const strokeRadius = 45;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(30px) scale(1.05)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-[#050816] flex flex-col justify-center items-center select-none"
        >
          {/* Animated gradient wave backgrounds */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff]/20 to-transparent animate-pulse" />

          {/* Central 3D Holographic Cube */}
          <div className="relative w-44 h-44 mb-8 flex justify-center items-center">
            {/* Spinning background geometric rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute w-36 h-36 border border-dashed border-[#7c3aed]/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-40 h-40 border border-dashed border-[#00e5ff]/10 rounded-full"
            />

            {/* Glowing exact logo icon */}
            <motion.div
              animate={{
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 flex items-center justify-center relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.25)_0%,transparent_70%)] blur-md pointer-events-none" />
              <Logo iconOnly={true} className="scale-[1.3] relative z-10" />
            </motion.div>

            {/* Circular Progress Overlay */}
            <svg className="absolute w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={strokeRadius}
                className="stroke-white/5 fill-transparent"
                strokeWidth="2.5"
              />
              <motion.circle
                cx="56"
                cy="56"
                r={strokeRadius}
                className="stroke-[#00e5ff] fill-transparent"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.1s ease" }}
              />
            </svg>
          </div>

          {/* Asset loading details */}
          <div className="text-center space-y-3 z-10">
            <h3 className="font-grotesk text-sm font-extrabold uppercase tracking-[0.25em] text-white">
              DEVNEXA <span className="text-[#00e5ff]">GLOBAL</span>
            </h3>
            
            {/* Dynamic Loading Message */}
            <div className="h-6 flex items-center justify-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#00e5ff] animate-spin" />
              <span className="font-mono text-[9px] text-[#00e5ff] uppercase tracking-widest font-bold">
                {loadingMessages[msgIndex]}...
              </span>
            </div>

            {/* Percent Text */}
            <div className="font-mono text-xs font-extrabold text-slate-400">
              {progress}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
