"use client";
import { API_BASE_URL } from "@/config/api";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Key, ArrowRight, Sparkles } from "lucide-react";

export default function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect straight to dashboard
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/portal/dashboard");
      return;
    }

    // Load Google GSI script dynamically
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Set callback on window
    (window as any).handleGoogleCredentialResponse = async (response: any) => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/social-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "GOOGLE",
            id: response.credential, // Google JWT token acts as OAuth ID
            email: "google_user@devnexa.global", // Fallback, normally verified from backend JWT claims
            name: "Google Connected User"
          })
        });
        const data = await res.json();
        if (res.ok && data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("user", JSON.stringify(data));
          router.push("/portal/dashboard");
        } else {
          setErrorMsg("Failed to authenticate with Google oauth token.");
        }
      } catch (err) {
        setErrorMsg("Failed to connect to backend for Google authentication.");
      } finally {
        setLoading(false);
      }
    };
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
        // Save to LocalStorage
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/portal/dashboard");
      } else {
        setErrorMsg(data.message || "Invalid credentials! Use client@devnexa.global / client123.");
      }
    } catch (err) {
      setErrorMsg(`Failed to connect to backend api. Make sure Spring Boot (${API_BASE_URL}) is running!`);
    } finally {
      setLoading(false);
    }
  };

  const handleMockOauth = async (provider: string) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/social-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          provider: provider.toUpperCase(),
          email: `${provider.toLowerCase()}_mock@devnexa.global`,
          name: `Mock ${provider} User`,
          id: `oauth_${provider.toLowerCase()}_12345`
        })
      });

      const data = await response.json();
      if (response.ok && data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/portal/dashboard");
      } else {
        setErrorMsg(data.message || "Failed to complete social login redirect mock.");
      }
    } catch (err) {
      setErrorMsg(`Failed to connect to backend api. Make sure Spring Boot (${API_BASE_URL}) is running!`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId) {
      try {
        const google = (window as any).google;
        if (google) {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: (window as any).handleGoogleCredentialResponse
          });
          google.accounts.id.prompt(); // Show One Tap login dialog
        } else {
          handleMockOauth("Google");
        }
      } catch (e) {
        handleMockOauth("Google");
      }
    } else {
      handleMockOauth("Google");
    }
  };

  const handleGitHubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (clientId) {
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
    } else {
      handleMockOauth("GitHub");
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-[#070B16] text-[#F8FAFC] py-20 px-6">
      {/* Background visual elements */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#00E5FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand details */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 text-xs text-[#00E5FF]">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Access Gateway</span>
          </div>
          <h2 className="font-grotesk text-3xl font-bold text-white mb-2">
            Client Workspace
          </h2>
          <p className="font-sans text-xs text-slate-500">
            Log in to manage active projects, check invoices, and chat with team members.
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
              <label className="font-sans text-xs text-slate-400 font-semibold block mb-2">Username or Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  required
                  placeholder="client@devnexa.global"
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#00E5FF] font-sans font-bold text-white shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? "Logging in..." : "Access Workspace"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Sign-In */}
          <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <p className="font-sans text-[10px] text-center text-slate-500 uppercase tracking-widest">
              Or connect via OAUTH SSO
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 font-sans text-xs text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Google
              </button>
              <button
                onClick={handleGitHubLogin}
                disabled={loading}
                className="py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 font-sans text-xs text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="text-center mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
          <p className="font-sans text-[11px] text-slate-400 leading-normal">
            <strong>Testing Account:</strong> Use username <code className="text-[#00E5FF] font-mono">client</code> and password <code className="text-[#00E5FF] font-mono">client123</code> to access mock database seed data!
          </p>
        </div>
      </div>
    </div>
  );
}
