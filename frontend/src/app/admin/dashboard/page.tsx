"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, BookOpen, Calendar, Users, LogOut, CheckCircle, Clock, Trash2, Plus, RefreshCw, BarChart2, DollarSign, XCircle, TrendingUp, Kanban, FileText, Download } from "lucide-react";

interface Analytics {
  totalUsers: number;
  totalProjects: number;
  totalAppointments: number;
  totalBlogs: number;
  totalBudgets: number;
}

interface Appointment {
  id: number;
  name: string;
  email: string;
  company: string;
  meetingType: string;
  scheduledTime: string;
  description: string;
  status: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string;
  published: boolean;
  createdAt: string;
}

interface UserAccount {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  oauthProvider: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("analytics");

  // State data list
  const [analytics, setAnalytics] = useState<Analytics>({ totalUsers: 0, totalProjects: 0, totalAppointments: 0, totalBlogs: 0, totalBudgets: 0 });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: number; action: string; performedBy: string; timestamp: string; details: string }>>([]);

  // Mock revenue data
  const revenueData = [
    { month: 'Jan', revenue: 18000 },
    { month: 'Feb', revenue: 24000 },
    { month: 'Mar', revenue: 21000 },
    { month: 'Apr', revenue: 32000 },
    { month: 'May', revenue: 28000 },
    { month: 'Jun', revenue: 45000 },
    { month: 'Jul', revenue: 38000 },
    { month: 'Aug', revenue: 52000 },
    { month: 'Sep', revenue: 41000 },
    { month: 'Oct', revenue: 60000 },
    { month: 'Nov', revenue: 55000 },
    { month: 'Dec', revenue: 72000 },
  ];
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  // Mock CRM leads
  const crmLeads: Record<string, Array<{ name: string; company: string; value: string }>> = {
    NEW: [
      { name: 'Jordan Lee', company: 'TechVentures Inc.', value: '$25,000' },
      { name: 'Mia Chen', company: 'HealthFlow AI', value: '$40,000' },
    ],
    CONTACTED: [
      { name: 'Ryan Park', company: 'FinEdge Capital', value: '$18,000' },
    ],
    QUALIFIED: [
      { name: 'Aisha Kumar', company: 'EduScale Global', value: '$55,000' },
      { name: 'Tom Brandt', company: 'LogiCorp Ltd.', value: '$30,000' },
    ],
    WON: [
      { name: 'Sara Novak', company: 'MediConnect Plc', value: '$45,000' },
    ],
  };

  // Create Blog state modal
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("Architecture");
  const [blogTags, setBlogTags] = useState("");
  const [blogPublished, setBlogPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");

    if (!token || !cachedUser) {
      router.push("/admin");
      return;
    }

    const userObj = JSON.parse(cachedUser);
    if (!userObj.roles || !userObj.roles.includes("ROLE_ADMIN")) {
      router.push("/admin");
      return;
    }

    setAdmin(userObj);
    fetchAdminData(token);
  }, [router]);

  const fetchAdminData = async (token: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch admin databases
      const [resAnal, resAppt, resBlog, resUser] = await Promise.all([
        fetch("http://localhost:8080/api/admin/analytics", { headers }),
        fetch("http://localhost:8080/api/admin/appointments", { headers }),
        fetch("http://localhost:8080/api/admin/blogs", { headers }),
        fetch("http://localhost:8080/api/admin/users", { headers })
      ]);

      // Fetch audit logs (non-blocking)
      fetch("http://localhost:8080/api/admin/audit-logs", { headers })
        .then(r => r.ok ? r.json() : [])
        .then(data => setAuditLogs(data))
        .catch(() => {});

      if (resAnal.status === 401 || resAppt.status === 401 || resBlog.status === 401 || resUser.status === 401 ||
          resAnal.status === 403 || resAppt.status === 403 || resBlog.status === 403 || resUser.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin");
        return;
      }

      if (resAnal.ok && resAppt.ok && resBlog.ok && resUser.ok) {
        setAnalytics(await resAnal.json());
        setAppointments(await resAppt.json());
        setBlogs(await resBlog.json());
        setUsers(await resUser.json());
      } else {
        setErrorMsg("Failed to read administrative datasets. API response check failed.");
      }
    } catch (e) {
      setErrorMsg("Failed to connect to backend server. Make sure Spring Boot (localhost:8080) is running!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointmentStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/api/admin/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const updated = await response.json();
        setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      }
    } catch (err) {
      console.error("Failed to update appointment status.");
    }
  };

  const handleDeleteBlog = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/admin/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete blog post.");
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/api/admin/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: blogTitle,
          content: blogContent,
          summary: blogSummary,
          category: blogCategory,
          tags: blogTags,
          published: blogPublished
        })
      });

      if (response.ok) {
        const newPost = await response.json();
        setBlogs((prev) => [...prev, newPost]);
        setShowBlogModal(false);
        setBlogTitle("");
        setBlogSummary("");
        setBlogContent("");
        setBlogTags("");
        setBlogPublished(false);
      }
    } catch (err) {
      console.error("Failed to publish blog post.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B16] text-[#F8FAFC] flex flex-col justify-center items-center gap-4">
        <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin" />
        <span className="font-sans text-xs text-slate-500">Loading admin console...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070B16] text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 pb-8 border-b border-white/5">
          <div>
            <span className="font-mono text-xs text-red-400 uppercase tracking-wider">Administrative Console</span>
            <h1 className="font-grotesk text-3xl md:text-4xl font-bold text-white mt-1">
              Admin Control Center
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchAdminData(localStorage.getItem("token") || "")}
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

        {/* Tab Controls */}
        <div className="flex flex-wrap border-b border-white/5 gap-6 mb-8">
          {[
            { id: "analytics", name: "Analytics Metrics", icon: <BarChart2 className="w-4 h-4" /> },
            { id: "appointments", name: "Appointments & Bookings", icon: <Calendar className="w-4 h-4" /> },
            { id: "blogs", name: "Insights CMS", icon: <BookOpen className="w-4 h-4" /> },
            { id: "users", name: "Users & Clients", icon: <Users className="w-4 h-4" /> },
            { id: "revenue", name: "Revenue Analytics", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "crm", name: "CRM Leads", icon: <Kanban className="w-4 h-4" /> },
            { id: "audit", name: "Audit Logs", icon: <FileText className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-red-500 text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Analytics tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Users */}
              <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-sans text-[10px] uppercase text-slate-500">System Users</span>
                  <h3 className="font-jakarta text-2xl font-bold text-white mt-1">{analytics.totalUsers}</h3>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Total Projects */}
              <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-sans text-[10px] uppercase text-slate-500">Active Projects</span>
                  <h3 className="font-jakarta text-2xl font-bold text-white mt-1">{analytics.totalProjects}</h3>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 text-[#00E5FF]">
                  <BarChart2 className="w-5 h-5" />
                </div>
              </div>

              {/* Budget pool */}
              <div className="glass-card p-6 border border-white/5 flex items-center justify-between col-span-2">
                <div>
                  <span className="font-sans text-[10px] uppercase text-slate-500">Aggregate Budget Under Management</span>
                  <h3 className="font-jakarta text-2xl font-bold text-emerald-400 mt-1">${analytics.totalBudgets.toLocaleString()}</h3>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appointments Count */}
              <div className="glass-card p-6 border border-white/5 flex justify-between items-center">
                <div>
                  <h4 className="font-grotesk font-bold text-sm text-white">Consultations Requests</h4>
                  <p className="font-sans text-xs text-slate-500 mt-1">Total scheduled meetings booked by potential clients.</p>
                </div>
                <span className="font-jakarta text-4xl font-extrabold text-white">{analytics.totalAppointments}</span>
              </div>

              {/* Blog posts count */}
              <div className="glass-card p-6 border border-white/5 flex justify-between items-center">
                <div>
                  <h4 className="font-grotesk font-bold text-sm text-white">Published CMS Articles</h4>
                  <p className="font-sans text-xs text-slate-500 mt-1">Insights, tech guides, and architectural designs posted.</p>
                </div>
                <span className="font-jakarta text-4xl font-extrabold text-white">{analytics.totalBlogs}</span>
              </div>
            </div>
          </div>
        )}

        {/* Appointments tab */}
        {activeTab === "appointments" && (
          <div className="space-y-8">
            <h3 className="font-grotesk text-xl font-bold text-white">Scheduled Client Consultations</h3>
            {appointments.length > 0 ? (
              <div className="glass-card border border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 font-grotesk text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/5">
                      <th className="p-4 pl-6">Client Info</th>
                      <th className="p-4">Scope</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Approve Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans text-xs text-slate-300">
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-white">{appt.name}</div>
                          <div className="text-[10px] text-slate-500">{appt.email} | {appt.company || "No Company"}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono px-2 py-0.5 rounded bg-white/5 text-[#00E5FF] text-[10px]">{appt.meetingType}</span>
                        </td>
                        <td className="p-4">{appt.scheduledTime.replace("T", " ")}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold ${
                            appt.status === "APPROVED"
                              ? "bg-green-500/10 text-green-400"
                              : appt.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-red-500/10 text-red-400"
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          {appt.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleUpdateAppointmentStatus(appt.id, "APPROVED")}
                                className="px-3 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all text-[10px] font-bold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateAppointmentStatus(appt.id, "CANCELLED")}
                                className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">No appointments submitted yet.</div>
            )}
          </div>
        )}

        {/* CMS Blogs tab */}
        {activeTab === "blogs" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-grotesk text-xl font-bold text-white">Insights Articles</h3>
              <button
                onClick={() => setShowBlogModal(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-sans text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Publish Article
              </button>
            </div>

            {blogs.length > 0 ? (
              <div className="glass-card border border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 font-grotesk text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/5">
                      <th className="p-4 pl-6">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Tags</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Delete Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans text-xs text-slate-300">
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-bold text-white">{blog.title}</td>
                        <td className="p-4">{blog.category}</td>
                        <td className="p-4 font-mono text-[10px] text-slate-500">{blog.tags}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold ${
                            blog.published
                              ? "bg-green-500/10 text-green-400"
                              : "bg-slate-500/10 text-slate-400"
                          }`}>
                            {blog.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">No blog posts found.</div>
            )}
          </div>
        )}

        {/* Users tab */}
        {activeTab === "users" && (
          <div className="space-y-8">
            <h3 className="font-grotesk text-xl font-bold text-white font-bold">Registered Users Accounts</h3>
            {users.length > 0 ? (
              <div className="glass-card border border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 font-grotesk text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/5">
                      <th className="p-4 pl-6">Username</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Login Type</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans text-xs text-slate-300">
                    {users.map((userAcc) => (
                      <tr key={userAcc.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-bold text-white">{userAcc.username}</td>
                        <td className="p-4">{userAcc.email}</td>
                        <td className="p-4 font-mono text-[10px] text-slate-500">{userAcc.oauthProvider}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold ${
                            userAcc.enabled
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}>
                            {userAcc.enabled ? "Active" : "Disabled"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">No users found.</div>
            )}
          </div>
        )}

        {/* Revenue Analytics tab */}
        {activeTab === "revenue" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-grotesk text-xl font-bold text-white">Monthly Revenue Analytics</h3>
              <div className="flex gap-3">
                <a
                  href="/api/admin/export/revenue?format=pdf"
                  className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </a>
                <a
                  href="/api/admin/export/revenue?format=excel"
                  className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </a>
              </div>
            </div>
            <div className="glass-card border border-white/5 p-8">
              <div className="flex items-end gap-3 h-48">
                {revenueData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[9px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">${(d.revenue / 1000).toFixed(0)}k</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#7C3AED] to-[#00E5FF] transition-all duration-300 group-hover:opacity-90"
                      style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                    />
                    <span className="text-[9px] text-slate-500">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 border border-white/5">
                <span className="text-[10px] uppercase text-slate-500">Total Annual Revenue</span>
                <h3 className="font-jakarta text-2xl font-bold text-emerald-400 mt-1">${revenueData.reduce((a, d) => a + d.revenue, 0).toLocaleString()}</h3>
              </div>
              <div className="glass-card p-6 border border-white/5">
                <span className="text-[10px] uppercase text-slate-500">Best Month</span>
                <h3 className="font-jakarta text-2xl font-bold text-[#00E5FF] mt-1">{revenueData.reduce((a, d) => d.revenue > a.revenue ? d : a).month} — ${revenueData.reduce((a, d) => d.revenue > a.revenue ? d : a).revenue.toLocaleString()}</h3>
              </div>
              <div className="glass-card p-6 border border-white/5">
                <span className="text-[10px] uppercase text-slate-500">Monthly Average</span>
                <h3 className="font-jakarta text-2xl font-bold text-white mt-1">${Math.round(revenueData.reduce((a, d) => a + d.revenue, 0) / revenueData.length).toLocaleString()}</h3>
              </div>
            </div>
          </div>
        )}

        {/* CRM Leads tab */}
        {activeTab === "crm" && (
          <div className="space-y-8">
            <h3 className="font-grotesk text-xl font-bold text-white">CRM Pipeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {(['NEW', 'CONTACTED', 'QUALIFIED', 'WON'] as const).map((stage) => (
                <div key={stage} className="space-y-4">
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center ${
                    stage === 'WON' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : stage === 'QUALIFIED' ? 'bg-blue-500/10 text-[#00E5FF] border border-blue-500/20'
                    : stage === 'CONTACTED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}>
                    {stage} · {crmLeads[stage].length}
                  </div>
                  {crmLeads[stage].map((lead, idx) => (
                    <div key={idx} className="glass-card border border-white/5 p-4 hover:border-white/10 transition-all">
                      <div className="font-grotesk font-bold text-sm text-white mb-1">{lead.name}</div>
                      <div className="text-xs text-slate-500 mb-2">{lead.company}</div>
                      <div className="text-sm font-bold text-emerald-400">{lead.value}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Logs tab */}
        {activeTab === "audit" && (
          <div className="space-y-8">
            <h3 className="font-grotesk text-xl font-bold text-white">Audit Logs</h3>
            {auditLogs.length > 0 ? (
              <div className="glass-card border border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 font-grotesk text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/5">
                      <th className="p-4 pl-6">Action</th>
                      <th className="p-4">Performed By</th>
                      <th className="p-4">Details</th>
                      <th className="p-4 pr-6">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans text-xs text-slate-300">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-mono text-[#00E5FF] font-bold">{log.action}</td>
                        <td className="p-4 font-bold text-white">{log.performedBy}</td>
                        <td className="p-4 text-slate-400">{log.details}</td>
                        <td className="p-4 pr-6 text-slate-500">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No audit logs available. This panel fetches from <code className="text-[#00E5FF] font-mono">/api/admin/audit-logs</code>.</p>
                <p className="text-xs mt-2">Ensure the backend endpoint exists and is accessible.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Publish Blog Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-card border border-white/10 p-8 space-y-6">
            <h3 className="font-grotesk text-xl font-bold text-white">Publish CMS Article</h3>
            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Article Title"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-sans text-xs text-slate-400 block mb-2">Category</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Summary</label>
                <input
                  type="text"
                  required
                  placeholder="Short one-line summary..."
                  value={blogSummary}
                  onChange={(e) => setBlogSummary(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Content (Markdown supported)</label>
                <textarea
                  required
                  rows={6}
                  placeholder="# Article Heading... Write contents here."
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="font-sans text-xs text-slate-400 block mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Next.js,Tailwind,Design"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    className="w-full bg-[#070B16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="published"
                    checked={blogPublished}
                    onChange={(e) => setBlogPublished(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 text-red-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor="published" className="font-sans text-xs text-slate-400">Publish immediately</label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBlogModal(false)}
                  className="w-1/2 py-3 rounded-xl border border-white/10 font-sans text-xs font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 text-white font-sans font-bold"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
