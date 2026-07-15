"use client";
import { API_BASE_URL } from "@/config/api";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Key, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");
    if (token && cachedUser) {
      const userObj = JSON.parse(cachedUser);
      if (userObj.roles && userObj.roles.includes("ROLE_ADMIN")) {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usernameOrEmail: email,
          password: password
        })
      });

      const data = await response.json();
      if (response.ok && data.accessToken) {
        if (data.roles && data.roles.includes("ROLE_ADMIN")) {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("user", JSON.stringify(data));
          router.push("/admin/dashboard");
        } else {
          setErrorMsg("Access Denied! You must be an Administrator.");
        }
      } else {
        setErrorMsg(data.message || "Invalid credentials! Use admin / admin123.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to backend api. Make sure Spring Boot (${API_BASE_URL}) is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-[#070B16] text-[#F8FAFC] py-20 px-6">
      {/* Background radial blobs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6 text-xs text-red-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrative Console</span>
          </div>
          <h2 className="font-grotesk text-3xl font-bold text-white mb-2">
            Admin Portal
          </h2>
          <p className="font-sans text-xs text-slate-500">
            Enter administrative credentials to manage clients, CMS contents, and appointments.
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card border border-white/10 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Admin Username or Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Password</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 font-sans font-bold text-white shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? "Authenticating..." : "Sign In to Console"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Info panel */}
        <div className="text-center mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
          <p className="font-sans text-[11px] text-slate-400 leading-normal">
            <strong>Testing Account:</strong> Use username <code className="text-red-400 font-mono">admin</code> and password <code className="text-red-400 font-mono">admin123</code> to access administrative views!
          </p>
        </div>
      </div>
    </div>
  );
}
