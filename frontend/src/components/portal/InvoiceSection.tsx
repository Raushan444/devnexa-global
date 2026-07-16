"use client";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // Inject Razorpay checkout script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceNumber}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Plus Jakarta Sans', sans-serif; 
              color: #1E293B; 
              padding: 50px; 
              background-color: #FFFFFF;
              line-height: 1.5;
            }
            .invoice-card {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #E2E8F0;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
            }
            .header-bar {
              background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
              padding: 40px;
              color: #FFFFFF;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .brand-name {
              font-family: 'Outfit', sans-serif;
              font-size: 26px;
              font-weight: 900;
              letter-spacing: 0.1em;
              color: #00E5FF;
            }
            .brand-sub {
              font-size: 11px;
              color: #94A3B8;
              margin-top: 3px;
              letter-spacing: 0.05em;
            }
            .invoice-label {
              font-family: 'Outfit', sans-serif;
              font-size: 32px;
              font-weight: 700;
              text-align: right;
              letter-spacing: -0.02em;
            }
            .content-pane {
              padding: 40px;
            }
            .meta-grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            .party-details h4 {
              font-family: 'Outfit', sans-serif;
              font-size: 11px;
              color: #64748B;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              margin-bottom: 8px;
            }
            .party-details p {
              font-size: 13px;
              color: #334155;
              margin: 0;
              line-height: 1.6;
            }
            .table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
            }
            .table th { 
              background: #F8FAFC; 
              border-bottom: 2px solid #E2E8F0; 
              text-align: left; 
              padding: 14px; 
              font-family: 'Outfit', sans-serif;
              font-size: 11px; 
              font-weight: 600;
              color: #475569;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .table td { 
              border-bottom: 1px solid #F1F5F9; 
              padding: 16px 14px; 
              font-size: 13px; 
              color: #334155;
            }
            .totals-section {
              display: flex;
              justify-content: flex-end;
              margin-top: 40px;
            }
            .totals-box {
              width: 300px;
              border-top: 2px solid #E2E8F0;
              padding-top: 20px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              color: #64748B;
              margin-bottom: 8px;
            }
            .totals-row.grand-total {
              font-family: 'Outfit', sans-serif;
              font-size: 18px;
              font-weight: 700;
              color: #0F172A;
              border-top: 1px solid #E2E8F0;
              padding-top: 12px;
              margin-top: 12px;
            }
            .totals-row.grand-total span {
              color: #2563EB;
            }
            .footer-bar {
              background-color: #F8FAFC;
              border-top: 1px solid #E2E8F0;
              padding: 30px 40px;
              text-align: center;
              font-size: 11px;
              color: #64748B;
              line-height: 1.6;
            }
            .status-badge {
              display: inline-block;
              font-family: 'Outfit', sans-serif;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              padding: 4px 10px;
              border-radius: 6px;
              margin-top: 10px;
            }
            .status-badge.paid {
              background-color: #DCFCE7;
              color: #15803D;
              border: 1px solid #BBF7D0;
            }
            .status-badge.unpaid {
              background-color: #FEF3C7;
              color: #B45309;
              border: 1px solid #FDE68A;
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header-bar">
              <div>
                <div class="brand-name">DEVNEXA GLOBAL</div>
                <div class="brand-sub">ENTERPRISE SOFTWARE SOLUTIONS</div>
              </div>
              <div>
                <div class="invoice-label">INVOICE</div>
                <div style="font-size: 11px; color: #94A3B8; text-align: right; margin-top: 4px;">
                  Code: ${invoice.invoiceNumber}
                </div>
              </div>
            </div>

            <div class="content-pane">
              <div class="meta-grid">
                <div class="party-details">
                  <h4>Sender</h4>
                  <p>
                    <strong>DevNexa Global Ltd.</strong><br/>
                    Noida Regional Office (Sector 62)<br/>
                    Delhi NCR, India<br/>
                    Email: contact@devnexa.global
                  </p>
                </div>
                <div class="party-details" style="text-align: right;">
                  <h4>Billing & Timing</h4>
                  <p>
                    <strong>Date Issued:</strong> ${invoice.issueDate}<br/>
                    <strong>Due Date:</strong> ${invoice.dueDate}<br/>
                    <span class="status-badge ${invoice.status === "PAID" ? "paid" : "unpaid"}">
                      Status: ${invoice.status}
                    </span>
                  </p>
                </div>
              </div>

              <div class="meta-grid" style="border-top: 1px solid #F1F5F9; padding-top: 30px;">
                <div class="party-details">
                  <h4>Bill To</h4>
                  <p>
                    <strong>DevNexa Partner Client Account</strong><br/>
                    Corporate Registration Hub<br/>
                    India Workspace Registry<br/>
                    GST Registration: 09AAACD9981K1Z2
                  </p>
                </div>
              </div>

              <table class="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Rate</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Enterprise Software Implementation</strong><br/>
                      <span style="font-size: 11px; color: #64748B;">Milestone Release Delivery and Server Layout Deployments</span>
                    </td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right;">$${invoice.amount.toLocaleString()}</td>
                    <td style="text-align: right;">$${invoice.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div class="totals-section">
                <div class="totals-box">
                  <div class="totals-row">
                    <span>Subtotal</span>
                    <span>$${invoice.amount.toLocaleString()}</span>
                  </div>
                  <div class="totals-row">
                    <span>GST (Integrated 18%)</span>
                    <span>$${(invoice.amount * 0.18).toLocaleString()}</span>
                  </div>
                  <div class="totals-row grand-total">
                    <span>Total Amount</span>
                    <span>$${(invoice.amount * 1.18).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer-bar">
              Thank you for partnering with DevNexa Global. For transactional issues, reach out to contact@devnexa.global.<br/>
              <strong>Terms:</strong> Payment is strictly due within 15 days from invoice issuance date.
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCheckout = async (invoice: Invoice, provider: 'stripe' | 'razorpay' = 'stripe') => {
    setLoadingInvoiceId(invoice.id);
    setErrorMsg("");
    setPaymentSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingInvoiceId(null);
      return;
    }

    if (provider === 'stripe') {
      try {
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
          if (data.clientSecret && data.clientSecret.includes("mock")) {
            setTimeout(() => {
              setPaymentSuccess(true);
              setLoadingInvoiceId(null);
              onRefresh();
            }, 1500);
          } else {
            alert("Stripe keys not fully configured. Simulating mock payment succeeded.");
            setPaymentSuccess(true);
            setLoadingInvoiceId(null);
            onRefresh();
          }
        } else {
          setErrorMsg("Failed to initiate Stripe payment gateway intent.");
          setLoadingInvoiceId(null);
        }
      } catch (err) {
        setErrorMsg("Gateway error. Make sure backend Spring Boot is online.");
        setLoadingInvoiceId(null);
      }
    } else {
      // Razorpay checkout flow
      try {
        const res = await fetch(`${API_BASE_URL}/api/payments/razorpay/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ invoiceId: invoice.id })
        });

        const data = await res.json();
        if (res.ok && data.orderId) {
          const options = {
            key: data.keyId || "rzp_test_mockkey", // Production API key passed down from properties
            amount: data.amount,
            currency: data.currency || "INR",
            name: "DevNexa Global",
            description: `Payment for Invoice #${invoice.invoiceNumber}`,
            order_id: data.orderId,
            handler: async function (response: any) {
              setLoadingInvoiceId(invoice.id);
              try {
                const verifyRes = await fetch(`${API_BASE_URL}/api/payments/razorpay/verify`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature
                  })
                });
                const verifyData = await verifyRes.json();
                if (verifyRes.ok && verifyData.success) {
                  setPaymentSuccess(true);
                  onRefresh();
                } else {
                  setErrorMsg(verifyData.message || "Razorpay signature verification failed.");
                }
              } catch (e) {
                setErrorMsg("Error communicating with payment verification endpoint.");
              } finally {
                setLoadingInvoiceId(null);
              }
            },
            prefill: {
              name: "Client Account",
              email: "client@devnexa.global"
            },
            theme: {
              color: "#7C3AED"
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          setLoadingInvoiceId(null);
        } else {
          setErrorMsg(data.message || "Failed to generate Razorpay order. Ensure Razorpay is configured on backend.");
          setLoadingInvoiceId(null);
        }
      } catch (err) {
        setErrorMsg("Razorpay order creation failed. Make sure backend is running.");
        setLoadingInvoiceId(null);
      }
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCheckout(inv, 'stripe')}
                      disabled={loadingInvoiceId === inv.id}
                      className="py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer hover:scale-[1.01] transition-all disabled:opacity-50"
                    >
                      <CreditCard className="w-3 h-3" />
                      Stripe
                    </button>
                    <button
                      onClick={() => handleCheckout(inv, 'razorpay')}
                      disabled={loadingInvoiceId === inv.id}
                      className="py-2 px-3 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#2563EB] text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer hover:scale-[1.01] transition-all disabled:opacity-50"
                    >
                      <CreditCard className="w-3 h-3" />
                      Razorpay
                    </button>
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
