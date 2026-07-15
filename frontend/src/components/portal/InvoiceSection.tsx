"use client";
import React, { useState } from "react";
import { API_BASE_URL } from "@/config/api";
import { DollarSign, FileText, CheckCircle2, AlertCircle, Printer, CreditCard } from "lucide-react";

interface Invoice {
  id: number;
  invoiceNumber: string;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  paymentUrl: string;
}

interface InvoiceSectionProps {
  invoices: Invoice[];
  onRefresh: () => void;
}

export default function InvoiceSection({ invoices, onRefresh }: InvoiceSectionProps) {
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .title { font-size: 28px; font-weight: bold; color: #1E293B; }
            .meta { font-size: 12px; text-align: right; line-height: 1.6; }
            .billto { margin-top: 30px; line-height: 1.6; font-size: 14px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            .table th { background: #F8FAFC; border-bottom: 2px solid #E2E8F0; text-align: left; padding: 12px; font-size: 12px; }
            .table td { border-bottom: 1px solid #E2E8F0; padding: 12px; font-size: 14px; }
            .totals { text-align: right; margin-top: 30px; font-size: 14px; line-height: 2; }
            .totals strong { font-size: 18px; color: #2563EB; }
            .footer { margin-top: 60px; font-size: 11px; color: #94A3B8; border-top: 1px solid #eee; padding-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">DEVNEXA GLOBAL</div>
              <div style="font-size:12px;color:#64748B;margin-top:5px;">Premium Software Engineering & AI Solutions</div>
            </div>
            <div class="meta">
              <strong>Invoice Code:</strong> ${invoice.invoiceNumber}<br/>
              <strong>Date Issued:</strong> ${invoice.issueDate}<br/>
              <strong>Due Date:</strong> ${invoice.dueDate}
            </div>
          </div>

          <div class="billto">
            <strong>BILL TO:</strong><br/>
            DevNexa Partner Client Account<br/>
            India Workspace Registry<br/>
            GST Registration: 09AAACD9981K1Z2
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Enterprise Software Implementation - Milestone Release</td>
                <td>1</td>
                <td>$${invoice.amount.toLocaleString()}</td>
                <td>$${invoice.amount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            Subtotal: $${invoice.amount.toLocaleString()}<br/>
            GST Integrated (18%): $${(invoice.amount * 0.18).toLocaleString()}<br/>
            <strong>Total Amount: $${(invoice.amount * 1.18).toLocaleString()}</strong>
          </div>

          <div class="footer">
            Thank you for choosing DevNexa Global. For billing inquiries, email contact@devnexa.global.<br/>
            Terms: Payment due within 15 days of issue.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCheckout = async (invoice: Invoice) => {
    setLoadingInvoiceId(invoice.id);
    setErrorMsg("");
    setPaymentSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/payments/create-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ invoiceId: invoice.id })
      });

      const data = await res.json();
      if (res.ok) {
        // If clientSecret is mock, simulate mock completion for sandbox testing
        if (data.clientSecret && data.clientSecret.includes("mock")) {
          // Trigger a fake succeed simulation call or alert
          setTimeout(() => {
            setPaymentSuccess(true);
            setLoadingInvoiceId(null);
            // Simulate webhook status updates locally by hitting state
            onRefresh();
          }, 1500);
        } else {
          // Open mock checkout page or stripe checkout
          alert("Stripe keys not fully configured. Simulating mock payment succeeded.");
          setPaymentSuccess(true);
          setLoadingInvoiceId(null);
          onRefresh();
        }
      } else {
        setErrorMsg("Failed to initiate payment gateway intent.");
        setLoadingInvoiceId(null);
      }
    } catch (err) {
      setErrorMsg("Gateway error. Make sure backend Spring Boot is online.");
      setLoadingInvoiceId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-grotesk text-xl font-bold text-white">Invoices & Billing</h3>
        <p className="font-sans text-xs text-slate-500">Track outstanding balances, milestone releases, and download PDF invoices.</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {paymentSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Payment simulation completed successfully! Status updated.</span>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="border border-dashed border-white/5 rounded-2xl p-12 text-center text-slate-500 font-sans text-xs">
          No billing entries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="glass-card border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#00E5FF]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="font-sans text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{inv.invoiceNumber}</span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        inv.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-slate-400">Milestone amount: <strong className="text-white text-sm font-semibold">${inv.amount.toLocaleString()}</strong></p>
                  <p className="text-slate-500 text-[10px]">Due date: {inv.dueDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePrint(inv)}
                  className="py-2.5 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print PDF
                </button>

                {inv.status !== "PAID" && (
                  <button
                    onClick={() => handleCheckout(inv)}
                    disabled={loadingInvoiceId === inv.id}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2563EB] text-xs font-bold text-white shadow-lg flex items-center gap-2 cursor-pointer hover:scale-[1.01] transition-all disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    {loadingInvoiceId === inv.id ? "Processing..." : "Pay Now"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
