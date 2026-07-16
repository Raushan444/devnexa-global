"use client";
import { API_BASE_URL } from "@/config/api";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FileText, HelpCircle, LogOut, CheckCircle, Clock, AlertCircle, Send, Plus, RefreshCw, BarChart, ArrowUpRight, Sparkles, Folder, ArrowLeft } from "lucide-react";
import KanbanBoard from "@/components/portal/KanbanBoard";
import FileExplorer from "@/components/portal/FileExplorer";
import InvoiceSection from "@/components/portal/InvoiceSection";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  paymentUrl: string;
}

interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface TicketMessage {
  id: number;
  sender: {
    username: string;
    email: string;
  };
  message: string;
  createdAt: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  
  // States
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  
  // Selected ticket chat states
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  
  // New ticket state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketDesc, setNewTicketDesc] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState("MEDIUM");
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Proposal modal states
  const [proposalContent, setProposalContent] = useState("");
  const [proposalProjectTitle, setProposalProjectTitle] = useState("");
  const [generatingProposalId, setGeneratingProposalId] = useState<number | null>(null);

  // Sprint 2 Project Tracking states
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loadingMilestones, setLoadingMilestones] = useState(false);

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !cachedUser) {
      router.push("/portal");
      return;
    }

    setUser(JSON.parse(cachedUser));
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Parallel fetches
      const [resProj, resInv, resTick] = await Promise.all([
        fetch(`${API_BASE_URL}/api/portal/projects`, { headers }),
        fetch(`${API_BASE_URL}/api/portal/invoices`, { headers }),
        fetch(`${API_BASE_URL}/api/portal/tickets`, { headers })
      ]);

      if (resProj.status === 401 || resInv.status === 401 || resTick.status === 401 ||
          resProj.status === 403 || resInv.status === 403 || resTick.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/portal");
        return;
      }

      if (resProj.ok && resInv.ok && resTick.ok) {
        const projData = await resProj.json();
        const invData = await resInv.json();
        const tickData = await resTick.json();

        setProjects(projData);
        setInvoices(invData);
        setTickets(tickData);

        // Auto select first ticket if available
        if (tickData.length > 0) {
          setSelectedTicketId(tickData[0].id);
          fetchTicketMessages(token, tickData[0].id);
        }
      } else {
        setErrorMsg("Failed to load dashboard data. API returned bad response.");
      }
    } catch (err) {
      setErrorMsg(`Failed to connect to backend server. Make sure Spring Boot (${API_BASE_URL}) is running!`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async (projectId: number) => {
    setLoadingMilestones(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/portal/projects/${projectId}/milestones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMilestones(data);
      }
    } catch (e) {
      console.error("Failed to load milestones");
    } finally {
      setLoadingMilestones(false);
    }
  };

  const fetchTicketMessages = async (token: string, ticketId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/portal/tickets/${ticketId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load support chat messages.");
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedTicketId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/portal/tickets/${selectedTicketId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: chatMessage })
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages((prev) => [...prev, newMsg]);
        setChatMessage("");
      }
    } catch (err) {
      console.error("Failed to submit support message.");
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketDesc.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/portal/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: newTicketSubject,
          description: newTicketDesc,
          priority: newTicketPriority
        })
      });

      if (response.ok) {
        const newTicket = await response.json();
        setTickets((prev) => [...prev, newTicket]);
        setShowNewTicketModal(false);
        setNewTicketSubject("");
        setNewTicketDesc("");
        // Select new ticket and load messages
        setSelectedTicketId(newTicket.id);
        fetchTicketMessages(token, newTicket.id);
      }
    } catch (err) {
      console.error("Failed to submit support ticket.");
    }
  };

  const handleGenerateProposal = async (projectId: number, projectTitle: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setGeneratingProposalId(projectId);
    setProposalContent("");
    setProposalProjectTitle(projectTitle);

    try {
      const response = await fetch(`${API_BASE_URL}/api/portal/ai/proposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ projectId })
      });

      if (response.ok) {
        const data = await response.json();
        setProposalContent(data.proposal);
      } else {
        setProposalContent("Failed to generate proposal blueprint. Make sure the backend server is running and has access to Gemini model keys.");
      }
    } catch (e) {
      setProposalContent(`Failed to connect to backend server. Make sure Spring Boot (${API_BASE_URL}) is running!`);
    } finally {
      setGeneratingProposalId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/portal");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B16] text-[#F8FAFC] flex flex-col justify-center items-center gap-4">
        <RefreshCw className="w-8 h-8 text-[#00E5FF] animate-spin" />
        <span className="font-sans text-xs text-slate-500">Loading client workspace...</span>
      </div>
    );
  }

  // Derived stats
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const unpaidAmount = invoices.filter(i => i.status === "UNPAID").reduce((acc, i) => acc + i.amount, 0);
  const openTickets = tickets.filter(t => t.status !== "CLOSED").length;

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 pb-8 border-b border-white/5">
          <div>
            <span className="font-mono text-xs text-[#00E5FF] uppercase tracking-wider">Workspace Dashboard</span>
            <h1 className="font-grotesk text-3xl md:text-4xl font-bold text-white mt-1">
              Welcome Back, {user?.username}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchDashboardData(localStorage.getItem("token") || "")}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl mb-8">
            {errorMsg}
          </div>
        )}

        {/* Highlight Stats Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Active Projects */}
          <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-wider text-slate-500">Active Engagements</span>
              <h3 className="font-jakarta text-2xl font-bold text-white mt-1">{projects.length} Projects</h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/15 text-[#00E5FF]">
              <LayoutDashboard className="w-5 h-5" />
            </div>
          </div>

          {/* Pending Bills */}
          <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-wider text-slate-500">Unsettled Invoices</span>
              <h3 className="font-jakarta text-2xl font-bold text-white mt-1">${unpaidAmount.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/15 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          {/* Support Tickets */}
          <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-wider text-slate-500">Open Tickets</span>
              <h3 className="font-jakarta text-2xl font-bold text-[#7C3AED] mt-1">{openTickets} Active</h3>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/15 text-purple-400">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/5 gap-6 mb-8">
          {[
            { id: "overview", name: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: "billing", name: "Invoices & Billing", icon: <FileText className="w-4 h-4" /> },
            { id: "support", name: "Support & Chat", icon: <HelpCircle className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#00E5FF] text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Overview Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-8">
            {selectedProjectId ? (
              (() => {
                const proj = projects.find((p) => p.id === selectedProjectId);
                if (!proj) return null;
                return (
                  <div className="space-y-8 animate-fade-in">
                    {/* Project Header card */}
                    <div className="glass-card p-6 border border-white/10 relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <button
                          onClick={() => {
                            setSelectedProjectId(null);
                            setMilestones([]);
                          }}
                          className="py-1.5 px-3 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          Back to Projects
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[#00E5FF] text-[10px] font-mono font-bold uppercase tracking-wider">
                            {proj.status}
                          </span>
                          <span className="font-jakarta text-xs text-slate-400 font-bold">${proj.budget.toLocaleString()}</span>
                        </div>
                      </div>

                      <h2 className="font-grotesk text-2xl font-bold text-white mb-2">{proj.title}</h2>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">{proj.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-white font-bold">{proj.progress}%</span>
                          </div>
                          <div className="w-full bg-[#070B16] rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] h-full"
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Proposal CTA */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleGenerateProposal(proj.id, proj.title)}
                            disabled={generatingProposalId === proj.id}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-300 hover:from-purple-500 hover:to-indigo-500 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                          >
                            {generatingProposalId === proj.id ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Drafting blueprint...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                Generate AI Proposal Blueprint
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Proposal Display */}
                    {proposalContent && proposalProjectTitle === proj.title && (
                      <div className="glass-card p-6 border border-white/10 animate-fade-in">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                          <h4 className="font-grotesk text-sm font-bold text-purple-400 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            AI Generated Proposal Specification
                          </h4>
                          <button
                            onClick={() => setProposalContent("")}
                            className="text-xs text-slate-500 hover:text-white"
                          >
                            Clear
                          </button>
                        </div>
                        <pre className="font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto bg-black/30 p-4 rounded-xl border border-white/5">
                          {proposalContent}
                        </pre>
                      </div>
                    )}

                    {/* Kanban Tracking Section */}
                    <div className="glass-card p-6 border border-white/5">
                      {loadingMilestones ? (
                        <div className="h-48 skeleton w-full" />
                      ) : (
                        <KanbanBoard milestones={milestones} />
                      )}
                    </div>

                    {/* Shared File Explorer */}
                    <div className="glass-card p-6 border border-white/5">
                      <FileExplorer projectId={proj.id} />
                    </div>
                  </div>
                );
              })()
            ) : (
              <div>
                <h3 className="font-grotesk text-xl font-bold text-white mb-6">Active Projects Trackers</h3>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {projects.map((proj) => (
                      <div key={proj.id} className="glass-card p-6 border border-white/10 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[#00E5FF] text-[10px] font-mono font-bold uppercase tracking-wider">
                            {proj.status}
                          </span>
                          <span className="font-jakarta text-xs text-slate-400 font-bold">${proj.budget.toLocaleString()}</span>
                        </div>

                        <h4 className="font-grotesk text-lg font-bold text-white mb-2">{proj.title}</h4>
                        <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">{proj.description}</p>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-white font-bold">{proj.progress}%</span>
                          </div>
                          <div className="w-full bg-[#070B16] rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] h-full"
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                          <button
                            onClick={() => {
                              setSelectedProjectId(proj.id);
                              fetchMilestones(proj.id);
                            }}
                            className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-xs font-bold text-blue-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Folder className="w-3.5 h-3.5" />
                            Open Tracker & Files
                          </button>

                          <button
                            onClick={() => handleGenerateProposal(proj.id, proj.title)}
                            disabled={generatingProposalId === proj.id}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-300 hover:from-purple-500 hover:to-indigo-500 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                          >
                            {generatingProposalId === proj.id ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Drafting blueprint...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                Generate AI Proposal
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">No active projects assigned to your account.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Billing Tab Content */}
        {activeTab === "billing" && (
          <div className="animate-fade-in">
            <InvoiceSection
              invoices={invoices}
              onRefresh={() => fetchDashboardData(localStorage.getItem("token") || "")}
            />
          </div>
        )}

        {/* Support Tab Content */}
        {activeTab === "support" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tickets Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-grotesk text-xs uppercase tracking-wider text-slate-500 font-bold">Ticket Registry</h4>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#070B16] text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  New Ticket
                </button>
              </div>

              {tickets.length > 0 ? (
                tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTicketId(t.id);
                      fetchTicketMessages(localStorage.getItem("token") || "", t.id);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedTicketId === t.id
                        ? "bg-white/5 border-purple-500/30 text-white"
                        : "bg-transparent border-white/5 text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h5 className="font-grotesk font-bold text-xs truncate max-w-[150px]">{t.subject}</h5>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        t.priority === "HIGH" || t.priority === "CRITICAL"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-slate-500/20 text-slate-400"
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Status: {t.status}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-slate-600 text-xs">No support tickets found.</div>
              )}
            </div>

            {/* Support chat window */}
            <div className="lg:col-span-8 glass-card border border-white/10 flex flex-col min-h-[500px] justify-between relative overflow-hidden">
              {selectedTicketId ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="font-grotesk font-bold text-sm text-white">
                        {tickets.find(t => t.id === selectedTicketId)?.subject}
                      </h4>
                      <p className="font-sans text-[10px] text-slate-500 mt-1">
                        {tickets.find(t => t.id === selectedTicketId)?.description}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      {tickets.find(t => t.id === selectedTicketId)?.status}
                    </span>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 p-6 space-y-4 max-h-[300px] overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map((msg) => {
                        const isAdminMsg = msg.sender.username === "member" || msg.sender.username === "admin";
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col max-w-[70%] ${isAdminMsg ? "mr-auto items-start" : "ml-auto items-end"}`}
                          >
                            <span className="font-sans text-[9px] text-slate-500 mb-1">{msg.sender.username}</span>
                            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isAdminMsg ? "bg-white/5 text-slate-300 rounded-tl-none" : "bg-[#2563EB] text-white rounded-tr-none"
                            }`}>
                              {msg.message}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 text-slate-500 text-xs">No chat logs recorded yet. Send a message to start conversation!</div>
                    )}
                  </div>

                  {/* Message Input Box */}
                  <form onSubmit={handleSendChatMessage} className="p-4 border-t border-white/5 bg-slate-900/40 flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="Type your reply to support..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                    />
                    <button
                      type="submit"
                      className="p-3 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] text-white hover:scale-105 transition-all flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 p-12 text-slate-500 text-xs">
                  <AlertCircle className="w-8 h-8 opacity-40 text-purple-400" />
                  Please select or create a support ticket to start conversation.
                </div>
              )}
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg glass-card border border-white/10 p-8 space-y-6">
            <h3 className="font-grotesk text-xl font-bold text-white">Create Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Issue configuring webhook endpoints"
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>

              <div>
                <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Details & Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your technical difficulty or requests..."
                  value={newTicketDesc}
                  onChange={(e) => setNewTicketDesc(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>

              <div>
                <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Priority</label>
                <select
                  value={newTicketPriority}
                  onChange={(e) => setNewTicketPriority(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="w-1/2 py-3 rounded-xl border border-white/10 font-sans text-xs font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-sans font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Proposal Blueprint Modal */}
      {proposalProjectTitle && (proposalContent || generatingProposalId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-card border border-white/10 p-8 space-y-6 max-h-[85vh] flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-4 justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00E5FF] animate-pulse" />
                  <h3 className="font-grotesk text-xl font-bold text-white">AI Blueprint Proposal: {proposalProjectTitle}</h3>
                </div>
                <button
                  onClick={() => {
                    setProposalContent("");
                    setProposalProjectTitle("");
                  }}
                  className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="overflow-y-auto max-h-[55vh] pr-2 space-y-4">
                {proposalContent ? (
                  <div className="prose prose-invert max-w-none font-sans text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {proposalContent}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500 text-xs">
                    <RefreshCw className="w-8 h-8 text-[#00E5FF] animate-spin" />
                    <span>Engines are drafting your custom architectural proposal blueprints...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  setProposalContent("");
                  setProposalProjectTitle("");
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-sans text-xs font-bold cursor-pointer"
              >
                Accept & Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
