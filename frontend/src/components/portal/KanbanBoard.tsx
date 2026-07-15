"use client";
import React from "react";
import { CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react";

interface Milestone {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface KanbanBoardProps {
  milestones: Milestone[];
}

export default function KanbanBoard({ milestones }: KanbanBoardProps) {
  // Categorize milestones
  const completed = milestones.filter((m) => m.completed);
  const pending = milestones.filter((m) => !m.completed);

  // Active milestone is the first uncompleted milestone
  const active = pending.slice(0, 1);
  const upcoming = pending.slice(1);

  const columns = [
    {
      title: "Completed",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      color: "border-emerald-500/20 bg-emerald-500/5",
      items: completed
    },
    {
      title: "Active",
      icon: <AlertCircle className="w-4 h-4 text-[#00E5FF]" />,
      color: "border-[#00E5FF]/20 bg-[#00E5FF]/5",
      items: active
    },
    {
      title: "Upcoming",
      icon: <Clock className="w-4 h-4 text-slate-500" />,
      color: "border-slate-500/20 bg-slate-500/5",
      items: upcoming
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-grotesk text-xl font-bold text-white">Live Project Tracking</h3>
          <p className="font-sans text-xs text-slate-500">Track current achievements and sprint progress in real-time.</p>
        </div>
      </div>

      {milestones.length === 0 ? (
        <div className="border border-dashed border-white/5 rounded-2xl p-12 text-center text-slate-500 font-sans text-xs">
          No tracking milestones assigned to this project yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col, idx) => (
            <div key={idx} className={`rounded-2xl border ${col.color} p-5 flex flex-col min-h-[300px]`}>
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                {col.icon}
                <h4 className="font-grotesk text-sm font-bold text-white">{col.title}</h4>
                <span className="ml-auto text-[10px] font-mono font-bold bg-white/5 px-2 py-0.5 rounded-full text-slate-400">
                  {col.items.length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {col.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#050816] border border-white/10 rounded-xl space-y-3 hover:border-white/20 transition-all"
                  >
                    <div>
                      <h5 className="font-grotesk text-xs font-bold text-white leading-tight">
                        {item.title}
                      </h5>
                      <p className="font-sans text-[10px] text-slate-400 leading-normal mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-2 border-t border-white/5 font-sans">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        <span>Due: {item.dueDate}</span>
                      </div>
                      {item.completed ? (
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">DONE</span>
                      ) : col.title === "Active" ? (
                        <span className="text-[#00E5FF] font-bold bg-[#00E5FF]/10 px-2 py-0.5 rounded-md animate-pulse">IN PROGRESS</span>
                      ) : (
                        <span className="text-slate-400 font-bold bg-white/5 px-2 py-0.5 rounded-md">PENDING</span>
                      )}
                    </div>
                  </div>
                ))}

                {col.items.length === 0 && (
                  <div className="flex-grow flex items-center justify-center border border-dashed border-white/5 rounded-xl py-8 text-center text-[10px] text-slate-600 font-sans">
                    No milestones in this stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
