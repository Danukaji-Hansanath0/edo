'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  DollarSign,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Package,
  Receipt,
  Send,
  Home,
  AlertCircle,
  Info,
  Shield
} from 'lucide-react';

interface Invoice {
  id: number;
  fRegNo?: string;
  invoiceNo?: string;
  gradeNo?: number;
  packingCode?: string;
  packages?: string;
  fullHalf?: string;
  sample?: string;
  sampleQty?: number;
  netWeight?: number;
  netQty?: number;
  totalNetWeight?: number;
  manufacturedOn?: string;
  lotNo?: number;
  categoryCode?: number;
  buyerCode?: string;
  price?: number;
  quantity?: number;
  catelogNo?: string;
  saleDate?: string;
  packedDate?: string;
  delivered?: boolean;
  approvalStatus?: number;
  approvalStatusString?: string;
  buyerName?: string;
  categoryDescription?: string;
  gradeDescription?: string;
}

export default function InvoicesDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<number>>(new Set());
  const [userType, setUserType] = useState<string>('Buyer');
  const [submitting, setSubmitting] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Redirect if no auth token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const type = localStorage.getItem('userType');
      if (type) setUserType(type);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch('http://51.75.119.133:8080/api/Sales', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        window.location.href = '/login';
        return;
      }

      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        setInvoices(json.data);
      } else if (Array.isArray(json)) {
        setInvoices(json);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  };

  const navigateToDashboard = () => {
    window.location.href = '/buyer/dashboard';
  };

  const toggleInvoiceSelection = (id: number) => {
    const updated = new Set(selectedInvoices);
    if (updated.has(id)) updated.delete(id);
    else updated.add(id);
    setSelectedInvoices(updated);
  };

  const selectedInvoicesList = invoices.filter(inv => selectedInvoices.has(inv.id));
  const totalSelected = selectedInvoicesList.reduce((sum, inv) => {
    const price = parseFloat(String(inv.price ?? 0)) || 0;
    const quantity = parseFloat(String(inv.quantity ?? 0)) || 0;
    return sum + price * quantity;
  }, 0);

  const handleSubmitForApproval = async () => {
    if (selectedInvoices.size === 0) {
      alert("⚠️ Please select at least one invoice");
      return;
    }

    const confirmMsg = 
      `📤 REQUEST APPROVAL\n\n` +
      `Selected: ${selectedInvoices.size} invoice${selectedInvoices.size > 1 ? 's' : ''}\n` +
      `Total: LKR ${totalSelected.toLocaleString()}\n\n` +
      `This will submit invoices for admin approval.\n` +
      `Status will change to "Pending".\n\n` +
      `Continue?`;

    if (!confirm(confirmMsg)) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('❌ Session expired. Please login again.');
      window.location.href = '/login';
      return;
    }

    setSubmitting(true);
    const results: { invoiceNo: string; success: boolean; error?: string }[] = [];

    for (const invoiceId of selectedInvoices) {
      const invoice = invoices.find(i => i.id === invoiceId);
      if (!invoice) continue;

      try {
        // Minimal payload for POST according to API spec
        const payload = {
          fRegNo: invoice.fRegNo || "",
          invoiceNo: invoice.invoiceNo || "",
          gradeNo: invoice.gradeNo ?? 0,
          packingCode: invoice.packingCode || "",
          packages: invoice.packages || "",
          fullHalf: invoice.fullHalf || "",
          sample: invoice.sample || "",
          sampleQty: invoice.sampleQty ?? 0,
          netWeight: invoice.netWeight ?? 0,
          netQty: invoice.netQty ?? 0,
          totalNetWeight: invoice.totalNetWeight ?? 0,
          manufacturedOn: invoice.manufacturedOn || new Date().toISOString(),
          lotNo: invoice.lotNo ?? 0,
          categoryCode: invoice.categoryCode ?? 0,
          buyerCode: invoice.buyerCode || "",
          price: invoice.price ?? 0,
          quantity: invoice.quantity ?? 0,
          catelogNo: invoice.catelogNo || "",
          saleDate: invoice.saleDate || new Date().toISOString(),
          packedDate: invoice.packedDate || new Date().toISOString(),
          delivered: invoice.delivered ?? false
        };

        const res = await fetch(`http://51.75.119.133:8080/api/Sales`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          results.push({ invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, success: true });
        } else if (res.status === 403) {
          results.push({ invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, success: false, error: "Forbidden – you don't have permission" });
        } else {
          const errText = await res.text();
          results.push({ invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, success: false, error: errText });
        }
      } catch (err: any) {
        results.push({ invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, success: false, error: err.message });
      }
    }

    setSubmitting(false);
    alert(results.map(r => r.success ? `✅ ${r.invoiceNo}` : `❌ ${r.invoiceNo}: ${r.error}`).join('\n'));
    setSelectedInvoices(new Set());
    fetchInvoices();
  };

  const pendingInvoices = invoices.filter(inv => inv.approvalStatusString === "Pending");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="p-6 flex justify-between items-center bg-slate-800/20 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Receipt className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">Invoice Management</h1>
            <p className="text-gray-400 text-sm">Welcome, {userType}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            className="px-5 py-2.5 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all flex items-center gap-2"
            onClick={navigateToDashboard}
          >
            <Home className="w-4 h-4" /> Dashboard
          </button>
          <button 
            className="px-5 py-2.5 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2"
            onClick={fetchInvoices}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button 
            className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 p-4 text-red-300 mb-6 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm">
                <p className="text-gray-400 text-sm mb-1">Total Invoices</p>
                <p className="text-4xl font-bold text-white">{invoices.length}</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm">
                <p className="text-gray-400 text-sm mb-1">Selected</p>
                <p className="text-4xl font-bold text-cyan-400">{selectedInvoices.size}</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-600 to-purple-600 shadow-lg">
                <p className="text-cyan-100 text-sm mb-1">Total Amount</p>
                <p className="text-3xl text-white font-bold">
                  LKR {totalSelected.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/40 rounded-2xl border border-purple-500/20 overflow-hidden backdrop-blur-sm shadow-xl">
              <div className="px-6 py-4 border-b border-purple-500/20 bg-slate-900/30 flex justify-between items-center">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Available Invoices
                </h2>
                <button
                  onClick={() => setDebugMode(!debugMode)}
                  className="text-xs px-3 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  {debugMode ? '🔍 Debug ON' : '🔍 Debug OFF'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead className="bg-slate-900/50 text-gray-400 text-sm">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer"
                          checked={selectedInvoices.size === invoices.length && invoices.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInvoices(new Set(invoices.map(inv => inv.id)));
                            } else {
                              setSelectedInvoices(new Set());
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-3 text-left">Lot No</th>
                      <th className="px-4 py-3 text-left">Invoice No</th>
                      <th className="px-4 py-3 text-left">Buyer</th>
                      <th className="px-4 py-3 text-left">Grade</th>
                      <th className="px-4 py-3 text-right">Net Wt</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-purple-500/10">
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          No invoices found
                        </td>
                      </tr>
                    ) : (
                      invoices.map(inv => {
                        const price = parseFloat(String(inv.price ?? 0)) || 0;
                        const qty = parseFloat(String(inv.quantity ?? 0)) || 0;

                        return (
                          <tr
                            key={inv.id}
                            className={`transition-colors ${
                              selectedInvoices.has(inv.id) 
                                ? "bg-purple-500/20 border-l-4 border-l-purple-500" 
                                : "hover:bg-purple-500/10"
                            }`}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                className="w-5 h-5 cursor-pointer"
                                checked={selectedInvoices.has(inv.id)}
                                onChange={() => toggleInvoiceSelection(inv.id)}
                              />
                            </td>
                            <td className="px-4 py-3 font-medium">{inv.lotNo || '-'}</td>
                            <td className="px-4 py-3">
                              <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono">
                                {inv.invoiceNo || '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-gray-200">{inv.buyerName || '-'}</div>
                              <div className="text-gray-500 text-xs font-mono">{inv.buyerCode || '-'}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-300">{inv.gradeDescription || '-'}</td>
                            <td className="px-4 py-3 text-right font-mono">{inv.netWeight || '-'}</td>
                            <td className="px-4 py-3 text-right font-mono">{price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-mono">{qty}</td>
                            <td className="px-4 py-3 text-right font-bold font-mono">
                              {(price * qty).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                inv.approvalStatusString === 'Approved' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : inv.approvalStatusString === 'Pending'
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  : inv.approvalStatusString === 'Rejected'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}>
                                {inv.approvalStatusString || "N/A"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Approval Request Panel */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
              <h2 className="text-white font-semibold mb-2 text-lg flex items-center gap-2">
                <Send className="w-5 h-5" />
                Request Approval
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Submit selected invoices for admin approval. Status will change to "Pending".
              </p>
              <button
                className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold shadow-lg hover:opacity-90 transition-all"
                onClick={handleSubmitForApproval}
                disabled={submitting || selectedInvoices.size === 0}
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
              {pendingInvoices.length > 0 && (
                <p className="text-gray-400 text-xs mt-3">
                  Pending invoices: {pendingInvoices.length}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
