"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, TrendingUp, ShieldCheck, Clock, Award, BarChart2 } from "lucide-react";

export default function RoiCalculatorPage() {
  const [hourlyRate, setHourlyRate] = useState(50);
  const [teamSize, setTeamSize] = useState(10);
  const [hoursWasted, setHoursWasted] = useState(2);
  const [projectBudget, setProjectBudget] = useState(25000);

  const stats = useMemo(() => {
    const dailyHoursWasted = teamSize * hoursWasted;
    const weeklyWaste = dailyHoursWasted * hourlyRate * 5;
    const annualLoss = weeklyWaste * 52;
    
    // DevNexa upgrades reduce waste by 85% on average
    const annualSavings = Math.round(annualLoss * 0.85);
    const monthlySavings = annualSavings / 12;
    
    const paybackPeriod = Math.max(0.5, Math.round((projectBudget / (monthlySavings || 1)) * 10) / 10);
    const threeYearSavings = Math.round((annualSavings * 3) - projectBudget);

    return {
      dailyHoursWasted,
      annualLoss,
      annualSavings,
      paybackPeriod,
      threeYearSavings
    };
  }, [hourlyRate, teamSize, hoursWasted, projectBudget]);

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC] py-24 px-6">
      {/* Background blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-[#00E5FF]">
            <Calculator className="w-3.5 h-3.5" />
            <span>Investment Value Tool</span>
          </div>
          <h1 className="font-grotesk text-4xl md:text-5xl font-black text-white leading-tight">
            Automation & ROI Calculator
          </h1>
          <p className="font-sans text-slate-400 text-sm md:text-base">
            Find out how much time and money your team will save by replacing manual tasks with DevNexa automated architectures.
          </p>
        </div>

        {/* Dynamic ROI Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders Input Panel (5/12 cols) */}
          <div className="lg:col-span-5 glass-card border border-white/10 p-6 space-y-6 font-sans text-xs">
            <h3 className="font-grotesk text-base font-bold text-white mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#00E5FF]" />
              Calculator Parameters
            </h3>

            {/* Parameter 1 */}
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Average Hourly Rate</span>
                <span className="text-white font-bold">${hourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min="15"
                max="200"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                className="w-full accent-[#00E5FF] bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>$15/hr</span>
                <span>$200/hr</span>
              </div>
            </div>

            {/* Parameter 2 */}
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Team Size (Impacted)</span>
                <span className="text-white font-bold">{teamSize} members</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                className="w-full accent-[#00E5FF] bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>1 member</span>
                <span>100 members</span>
              </div>
            </div>

            {/* Parameter 3 */}
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Hours Wasted Daily per Person</span>
                <span className="text-white font-bold">{hoursWasted} hrs/day</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={hoursWasted}
                onChange={(e) => setHoursWasted(parseFloat(e.target.value))}
                className="w-full accent-[#00E5FF] bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>1 hr</span>
                <span>8 hrs</span>
              </div>
            </div>

            {/* Parameter 4 */}
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Estimated Project Budget</span>
                <span className="text-white font-bold">${projectBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="150000"
                step="5000"
                value={projectBudget}
                onChange={(e) => setProjectBudget(parseInt(e.target.value))}
                className="w-full accent-[#00E5FF] bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>$5,000</span>
                <span>$150,000</span>
              </div>
            </div>
          </div>

          {/* Results dashboard (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Return Output Callout */}
            <div className="glass-card-glow border border-white/10 p-8 rounded-2xl relative overflow-hidden bg-gradient-to-tr from-[#00E5FF]/5 to-[#7C3AED]/5 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Annual Savings</span>
                  <span className="text-3xl font-black text-[#00E5FF] block">${stats.annualSavings.toLocaleString()}</span>
                  <span className="text-[9px] text-emerald-400 font-bold block">85% efficiency gain</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Break-Even / Payback</span>
                  <span className="text-3xl font-black text-white block">{stats.paybackPeriod} months</span>
                  <span className="text-[9px] text-slate-500 block">estimated return</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">3-Yr Net Profit</span>
                  <span className="text-3xl font-black text-purple-400 block">${stats.threeYearSavings.toLocaleString()}</span>
                  <span className="text-[9px] text-purple-300 block">after investment</span>
                </div>
              </div>

              {/* Graphic Bar Chart representing Waste vs Savings */}
              <div className="space-y-3 pt-4 border-t border-white/5 font-sans text-xs">
                <span className="font-semibold text-white block">Cost Comparison Analysis</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Legacy Cost (Annual manual waste)</span>
                    <span className="text-red-400 font-mono font-bold">${stats.annualLoss.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 h-full w-full rounded-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[#00E5FF] font-semibold">Post-Upgrade Cost (With Automation)</span>
                    <span className="text-[#00E5FF] font-mono font-bold">${Math.round(stats.annualLoss * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#00E5FF] to-[#2563EB] h-full rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Scoping value highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                <Clock className="w-5 h-5 text-[#00E5FF]" />
                <h4 className="font-bold text-white leading-tight">Time Reclaimed</h4>
                <p className="text-slate-400 text-[11px]">Reclaim up to <strong>{stats.dailyHoursWasted} hours/day</strong> of manual operations.</p>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white leading-tight">Eliminate Mistakes</h4>
                <p className="text-slate-400 text-[11px]">System integration drops booking errors and billing slip-ups to 0%.</p>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                <Award className="w-5 h-5 text-purple-400" />
                <h4 className="font-bold text-white leading-tight">Modern Stack</h4>
                <p className="text-slate-400 text-[11px]">Decoupled SSR structures ensure lightning fast customer interactions.</p>
              </div>
            </div>

            {/* Custom Scope CTA */}
            <div className="glass-card p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 font-sans text-xs">
              <div>
                <h4 className="font-grotesk text-sm font-bold text-white">Let's Scoping Your Automation Pipeline</h4>
                <p className="text-slate-400 text-[11px]">Request an online quote request or launch our scoping audit widgets.</p>
              </div>
              <Link
                href="/planner"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2563EB] text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-all hover:scale-[1.01]"
              >
                Plan Automation Project
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
