// // 'use client';
// // import { useState, useEffect } from 'react';
// // import {
// //   Calendar,
// //   DollarSign,
// //   RefreshCw,
// //   LogOut,
// //   CheckCircle2,
// //   Package,
// //   Receipt,
// //   Send,
// //   Home,
// //   AlertCircle,
// //   Info,
// //   Shield,
// //   CreditCard,
// //   Plus,
// //   X
// // } from 'lucide-react';

// // interface Invoice {
// //   id: number;
// //   fRegNo?: string;
// //   invoiceNo?: string;
// //   gradeNo?: number;
// //   packingCode?: string;
// //   packages?: string;
// //   fullHalf?: string;
// //   sample?: string;
// //   sampleQty?: number;
// //   netWeight?: number;
// //   netQty?: number;
// //   totalNetWeight?: number;
// //   manufacturedOn?: string;
// //   lotNo?: number;
// //   categoryCode?: number;
// //   buyerCode?: string;
// //   price?: number;
// //   quantity?: number;
// //   catelogNo?: string;
// //   saleDate?: string;
// //   packedDate?: string;
// //   delivered?: boolean;
// //   approvalStatus?: number;
// //   approvalStatusString?: string;
// //   buyerName?: string;
// //   categoryDescription?: string;
// //   gradeDescription?: string;
// // }

// // interface PaymentDetail {
// //   bankName: string;
// //   remainingAmount: number;
// //   payment: number;
// //   modeOfPayment: string;
// //   chequeRefNo: string;
// //   attachment: File | null;
// // }

// // export default function InvoicesDashboard() {
// //   const [invoices, setInvoices] = useState<Invoice[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [selectedInvoices, setSelectedInvoices] = useState<Set<number>>(new Set());
// //   const [userType, setUserType] = useState<string>('Buyer');
// //   const [submitting, setSubmitting] = useState(false);
// //   const [debugMode, setDebugMode] = useState(false);
  
// //   const [showPaymentModal, setShowPaymentModal] = useState(false);
// //   const [payWithAdvance, setPayWithAdvance] = useState(false);
// //   const [totalPayment, setTotalPayment] = useState(0);
// //   const [paidDate, setPaidDate] = useState('');
// //   const [reference, setReference] = useState('');
// //   const [comment, setComment] = useState('');
// //   const [bankDetails, setBankDetails] = useState<PaymentDetail[]>([]);

// //   useEffect(() => {
// //     if (typeof window !== 'undefined') {
// //       const token = localStorage.getItem('authToken');
// //       if (!token) {
// //         window.location.href = '/login';
// //         return;
// //       }
// //       const type = localStorage.getItem('userType');
// //       if (type) setUserType(type);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchInvoices();
// //   }, []);

// //   const fetchInvoices = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const token = localStorage.getItem('authToken');
// //       if (!token) {
// //         window.location.href = '/login';
// //         return;
// //       }

// //       const res = await fetch('http://51.75.119.133:5001/api/Sales', {
// //         method: 'GET',
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'application/json',
// //           Accept: 'application/json'
// //         }
// //       });

// //       if (res.status === 401 || res.status === 403) {
// //         localStorage.removeItem('authToken');
// //         localStorage.removeItem('userType');
// //         window.location.href = '/login';
// //         return;
// //       }

// //       const json = await res.json();
// //       if (json && json.success && Array.isArray(json.data)) {
// //         setInvoices(json.data);
// //       } else if (Array.isArray(json)) {
// //         setInvoices(json);
// //       } else {
// //         setInvoices([]);
// //       }
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('authToken');
// //     localStorage.removeItem('userType');
// //     window.location.href = '/login';
// //   };

// //   const navigateToDashboard = () => {
// //     window.location.href = '/buyer/dashboard';
// //   };

// //   const toggleInvoiceSelection = (id: number) => {
// //     const updated = new Set(selectedInvoices);
// //     if (updated.has(id)) updated.delete(id);
// //     else updated.add(id);
// //     setSelectedInvoices(updated);
// //   };

// //   const selectedInvoicesList = invoices.filter(inv => selectedInvoices.has(inv.id));
  
// //   const totalSelected = selectedInvoicesList.reduce((sum, inv) => {
// //     const price = parseFloat(String(inv.price ?? 0)) || 0;
// //     return sum + price;
// //   }, 0);

// //   const handleSubmitForApproval = async () => {
// //     if (selectedInvoices.size === 0) {
// //       alert("⚠️ Please select at least one invoice");
// //       return;
// //     }

// //     const confirmMsg = 
// //       `📤 REQUEST APPROVAL\n\n` +
// //       `Selected: ${selectedInvoices.size} invoice${selectedInvoices.size > 1 ? 's' : ''}\n` +
// //       `Total: LKR ${totalSelected.toLocaleString()}\n\n` +
// //       `This will submit invoices for admin approval.\n` +
// //       `Status will change to "Pending".\n\n` +
// //       `Continue?`;

// //     if (!confirm(confirmMsg)) return;

// //     const token = localStorage.getItem('authToken');
// //     if (!token) {
// //       alert('❌ Session expired. Please login again.');
// //       window.location.href = '/login';
// //       return;
// //     }

// //     setSubmitting(true);
// //     const results: { invoiceNo: string; success: boolean; error?: string }[] = [];

// //     for (const invoiceId of selectedInvoices) {
// //       const invoice = invoices.find(i => i.id === invoiceId);
// //       if (!invoice) continue;

// //       try {
// //         const res = await fetch(`http://51.75.119.133:5001/api/Approval/sales/${invoice.id}`, {
// //           method: 'GET',
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Accept': 'application/json'
// //           }
// //         });

// //         const responseClone = res.clone();
        
// //         if (res.ok) {
// //           try {
// //             const responseData = await res.json();
// //             if (debugMode) {
// //               console.log('✅ Success response:', responseData);
// //             }
// //             results.push({ 
// //               invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
// //               success: true 
// //             });
// //           } catch (parseError) {
// //             results.push({ 
// //               invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
// //               success: true 
// //             });
// //           }
// //         } else if (res.status === 403) {
// //           results.push({ 
// //             invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
// //             success: false, 
// //             error: "Forbidden – insufficient permissions" 
// //           });
// //         } else if (res.status === 401) {
// //           results.push({ 
// //             invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
// //             success: false, 
// //             error: "Unauthorized – please login again" 
// //           });
// //         } else {
// //           let errorMessage = `HTTP ${res.status}`;
// //           try {
// //             const errorData = await responseClone.json();
// //             errorMessage = errorData.message || errorData.details || errorMessage;
// //             if (debugMode) {
// //               console.error('❌ Error response:', errorData);
// //             }
// //           } catch {
// //             try {
// //               const errText = await res.text();
// //               errorMessage = errText || errorMessage;
// //             } catch {
// //               errorMessage = `HTTP ${res.status}`;
// //             }
// //           }
// //           results.push({ 
// //             invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
// //             success: false, 
// //             error: errorMessage 
// //           });
// //         }
// //       } catch (err: any) {
// //         console.error('❌ Request failed:', err);
// //         results.push({ 
// //           invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
// //           success: false, 
// //           error: err.message || 'Network error' 
// //         });
// //       }
// //     }

// //     setSubmitting(false);
    
// //     const successCount = results.filter(r => r.success).length;
// //     const failCount = results.length - successCount;
    
// //     const resultMessage = 
// //       `📊 SUBMISSION COMPLETE\n\n` +
// //       `✅ Success: ${successCount}\n` +
// //       `❌ Failed: ${failCount}\n\n` +
// //       `${results.map(r => r.success ? `✅ ${r.invoiceNo}` : `❌ ${r.invoiceNo}: ${r.error}`).join('\n')}`;
    
// //     alert(resultMessage);
// //     setSelectedInvoices(new Set());
    
// //     await fetchInvoices();
// //   };

// //   const openPaymentModal = () => {
// //     if (selectedInvoices.size === 0) {
// //       alert("⚠️ Please select at least one invoice");
// //       return;
// //     }
    
// //     const today = new Date().toISOString().split('T')[0];
// //     setPaidDate(today);
// //     setTotalPayment(0);
// //     setReference('');
// //     setComment('');
// //     setPayWithAdvance(false);
// //     setBankDetails([{
// //       bankName: 'COMMERCIAL BANK',
// //       remainingAmount: totalSelected,
// //       payment: 0,
// //       modeOfPayment: 'CHEQUE',
// //       chequeRefNo: '',
// //       attachment: null
// //     }]);
// //     setShowPaymentModal(true);
// //   };

// //   const addBankDetail = () => {
// //     const remainingTotal = totalSelected - bankDetails.reduce((sum, bd) => sum + bd.payment, 0);
// //     setBankDetails([...bankDetails, {
// //       bankName: 'COMMERCIAL BANK',
// //       remainingAmount: remainingTotal,
// //       payment: 0,
// //       modeOfPayment: 'CHEQUE',
// //       chequeRefNo: '',
// //       attachment: null
// //     }]);
// //   };

// //   const removeBankDetail = (index: number) => {
// //     setBankDetails(bankDetails.filter((_, i) => i !== index));
// //   };

// //   const updateBankDetail = (index: number, field: keyof PaymentDetail, value: any) => {
// //     const updated = [...bankDetails];
// //     updated[index] = { ...updated[index], [field]: value };
// //     setBankDetails(updated);
// //   };

// //   const handlePaymentSubmit = async () => {
// //     if (!paidDate) {
// //       alert('⚠️ Please select a payment date');
// //       return;
// //     }

// //     if (selectedInvoices.size === 0) {
// //       alert('⚠️ No invoices selected');
// //       return;
// //     }

// //     const confirmMsg = 
// //       `💳 CONFIRM PAYMENT\n\n` +
// //       `Selected Invoices: ${selectedInvoices.size}\n` +
// //       `Total Amount: LKR ${totalSelected.toLocaleString()}\n` +
// //       `Payment Date: ${paidDate}\n` +
// //       `Reference: ${reference || 'N/A'}\n\n` +
// //       `Continue with payment submission?`;

// //     if (!confirm(confirmMsg)) return;

// //     const token = localStorage.getItem('authToken');
// //     if (!token) {
// //       alert('❌ Session expired. Please login again.');
// //       window.location.href = '/login';
// //       return;
// //     }

// //     setSubmitting(true);
// //     const results: { invoiceId: number; success: boolean; error?: string }[] = [];

// //     for (const invoiceId of selectedInvoices) {
// //       const invoice = invoices.find(i => i.id === invoiceId);
// //       if (!invoice) continue;

// //       const paymentData = {
// //         salesRequestId: invoiceId,
// //         amount: parseFloat(String(invoice.price ?? 0)) || 0,
// //         paymentMethod: "CHEQUE",
// //         transactionId: reference || `TXN-${Date.now()}-${invoiceId}`,
// //         paymentReference: reference || `REF-${invoiceId}`,
// //         bankDetails: "COMMERCIAL BANK",
// //         remarks: comment || `Payment for invoice ${invoice.invoiceNo || invoiceId}`
// //       };

// //       try {
// //         const res = await fetch('http://51.75.119.133:5001/api/Payment', {
// //           method: 'POST',
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json'
// //           },
// //           body: JSON.stringify(paymentData)
// //         });

// //         if (res.ok) {
// //           const responseData = await res.json();
// //           if (debugMode) {
// //             console.log('✅ Payment success:', responseData);
// //           }
// //           results.push({ 
// //             invoiceId, 
// //             success: true 
// //           });
// //         } else if (res.status === 403) {
// //           results.push({ 
// //             invoiceId, 
// //             success: false, 
// //             error: "Forbidden – insufficient permissions" 
// //           });
// //         } else if (res.status === 401) {
// //           results.push({ 
// //             invoiceId, 
// //             success: false, 
// //             error: "Unauthorized – please login again" 
// //           });
// //         } else {
// //           let errorMessage = `HTTP ${res.status}`;
// //           try {
// //             const errorData = await res.json();
// //             errorMessage = errorData.message || errorData.details || errorMessage;
// //             if (debugMode) {
// //               console.error('❌ Payment error:', errorData);
// //             }
// //           } catch {
// //             const errText = await res.text();
// //             errorMessage = errText || errorMessage;
// //           }
// //           results.push({ 
// //             invoiceId, 
// //             success: false, 
// //             error: errorMessage 
// //           });
// //         }
// //       } catch (err: any) {
// //         console.error('❌ Payment request failed:', err);
// //         results.push({ 
// //           invoiceId, 
// //           success: false, 
// //           error: err.message || 'Network error' 
// //         });
// //       }
// //     }

// //     setSubmitting(false);
    
// //     const successCount = results.filter(r => r.success).length;
// //     const failCount = results.length - successCount;
    
// //     const resultMessage = 
// //       `💳 PAYMENT SUBMISSION COMPLETE\n\n` +
// //       `✅ Success: ${successCount}\n` +
// //       `❌ Failed: ${failCount}\n` +
// //       `Total Amount: LKR ${totalSelected.toLocaleString()}\n\n` +
// //       `${results.map(r => {
// //         const inv = invoices.find(i => i.id === r.invoiceId);
// //         const invNo = inv?.invoiceNo || `ID-${r.invoiceId}`;
// //         return r.success ? `✅ ${invNo}` : `❌ ${invNo}: ${r.error}`;
// //       }).join('\n')}`;
    
// //     alert(resultMessage);
// //     setShowPaymentModal(false);
// //     setSelectedInvoices(new Set());
    
// //     await fetchInvoices();
// //   };

// //   const pendingInvoices = invoices.filter(inv => inv.approvalStatusString === "Pending");

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
// //         <div className="text-center">
// //           <RefreshCw className="animate-spin w-12 h-12 text-cyan-400 mx-auto mb-4" />
// //           <p className="text-white text-lg">Loading invoices...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
// //       <div className="p-6 flex justify-between items-center bg-slate-800/20 border-b border-purple-500/20 backdrop-blur-sm">
// //         <div className="flex items-center gap-4">
// //           <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
// //             <Receipt className="text-white" />
// //           </div>
// //           <div>
// //             <h1 className="text-2xl font-bold text-cyan-400">Invoice Management</h1>
// //             <p className="text-gray-400 text-sm">Welcome, {userType}</p>
// //           </div>
// //         </div>

// //         <div className="flex gap-3">
// //           <button 
// //             className="px-5 py-2.5 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all flex items-center gap-2"
// //             onClick={navigateToDashboard}
// //           >
// //             <Home className="w-4 h-4" /> Approved Invoices
// //           </button>
// //           <button 
// //             className="px-5 py-2.5 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2"
// //             onClick={fetchInvoices}
// //             disabled={loading}
// //           >
// //             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
// //           </button>
// //           <button 
// //             className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
// //             onClick={logout}
// //           >
// //             <LogOut className="w-4 h-4" /> Logout
// //           </button>
// //         </div>
// //       </div>

// //       <div className="p-6">
// //         {error && (
// //           <div className="bg-red-500/10 border border-red-400/30 p-4 text-red-300 mb-6 rounded-lg flex items-start gap-3">
// //             <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
// //             <div>
// //               <p className="font-semibold">Error</p>
// //               <p className="text-sm">{error}</p>
// //             </div>
// //           </div>
// //         )}

// //         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
// //           <div className="xl:col-span-2 space-y-6">
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               <div className="p-6 rounded-2xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm">
// //                 <p className="text-gray-400 text-sm mb-1">Total Invoices</p>
// //                 <p className="text-4xl font-bold text-white">{invoices.length}</p>
// //               </div>
// //               <div className="p-6 rounded-2xl bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm">
// //                 <p className="text-gray-400 text-sm mb-1">Selected</p>
// //                 <p className="text-4xl font-bold text-cyan-400">{selectedInvoices.size}</p>
// //               </div>
// //               <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-600 to-purple-600 shadow-lg">
// //                 <p className="text-cyan-100 text-sm mb-1">Total Amount</p>
// //                 <p className="text-3xl text-white font-bold">
// //                   LKR {totalSelected.toLocaleString(undefined, {minimumFractionDigits: 2})}
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="bg-slate-800/40 rounded-2xl border border-purple-500/20 overflow-hidden backdrop-blur-sm shadow-xl">
// //               <div className="px-6 py-4 border-b border-purple-500/20 bg-slate-900/30 flex justify-between items-center">
// //                 <h2 className="text-white font-semibold text-lg flex items-center gap-2">
// //                   <Package className="w-5 h-5" />
// //                   Available Invoices
// //                 </h2>
// //                 <button
// //                   onClick={() => setDebugMode(!debugMode)}
// //                   className="text-xs px-3 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
// //                 >
// //                   {debugMode ? '🔍 Debug ON' : '🔍 Debug OFF'}
// //                 </button>
// //               </div>

// //               <div className="overflow-x-auto">
// //                 <table className="w-full text-white">
// //                   <thead className="bg-slate-900/50 text-gray-400 text-sm">
// //                     <tr>
// //                       <th className="px-4 py-3 text-left">
// //                         <input
// //                           type="checkbox"
// //                           className="w-5 h-5 cursor-pointer"
// //                           checked={selectedInvoices.size === invoices.length && invoices.length > 0}
// //                           onChange={(e) => {
// //                             if (e.target.checked) {
// //                               setSelectedInvoices(new Set(invoices.map(inv => inv.id)));
// //                             } else {
// //                               setSelectedInvoices(new Set());
// //                             }
// //                           }}
// //                         />
// //                       </th>
// //                       <th className="px-4 py-3 text-left">F-Reg No</th>
// //                       <th className="px-4 py-3 text-left">Lot No</th>
// //                       <th className="px-4 py-3 text-left">Invoice No</th>
// //                       <th className="px-4 py-3 text-left">Buyer</th>
// //                       <th className="px-4 py-3 text-left">Grade</th>
// //                       <th className="px-4 py-3 text-right">Net Wt</th>
// //                       <th className="px-4 py-3 text-right">Price</th>
// //                       <th className="px-4 py-3 text-right">Qty</th>
// //                       <th className="px-4 py-3 text-center">Status</th>
// //                     </tr>
// //                   </thead>

// //                   <tbody className="divide-y divide-purple-500/10">
// //                     {invoices.length === 0 ? (
// //                       <tr>
// //                         <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
// //                           <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
// //                           No invoices found
// //                         </td>
// //                       </tr>
// //                     ) : (
// //                       invoices.map(inv => {
// //                         const price = parseFloat(String(inv.price ?? 0)) || 0;
// //                         const qty = parseFloat(String(inv.quantity ?? 0)) || 0;

// //                         return (
// //                           <tr
// //                             key={inv.id}
// //                             className={`transition-colors ${
// //                               selectedInvoices.has(inv.id) 
// //                                 ? "bg-purple-500/20 border-l-4 border-l-purple-500" 
// //                                 : "hover:bg-purple-500/10"
// //                             }`}
// //                           >
// //                             <td className="px-4 py-3">
// //                               <input
// //                                 type="checkbox"
// //                                 className="w-5 h-5 cursor-pointer"
// //                                 checked={selectedInvoices.has(inv.id)}
// //                                 onChange={() => toggleInvoiceSelection(inv.id)}
// //                               />
// //                             </td>
// //                             <td className="px-4 py-3">
// //                               <span className="px-2 py-1 rounded text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono">
// //                                 {inv.fRegNo || '-'}
// //                               </span>
// //                             </td>
// //                             <td className="px-4 py-3 font-medium">{inv.lotNo || '-'}</td>
// //                             <td className="px-4 py-3">
// //                               <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono">
// //                                 {inv.invoiceNo || '-'}
// //                               </span>
// //                             </td>
// //                             <td className="px-4 py-3">
// //                               <div className="text-gray-200">{inv.buyerName || '-'}</div>
// //                               <div className="text-gray-500 text-xs font-mono">{inv.buyerCode || '-'}</div>
// //                             </td>
// //                             <td className="px-4 py-3 text-gray-300">{inv.gradeDescription || '-'}</td>
// //                             <td className="px-4 py-3 text-right font-mono">{inv.netWeight || '-'}</td>
// //                             <td className="px-4 py-3 text-right font-mono">{price.toFixed(2)}</td>
// //                             <td className="px-4 py-3 text-right font-mono">{qty}</td>
// //                             <td className="px-4 py-3 text-center">
// //                               <span className={`px-3 py-1 rounded-full text-xs font-medium ${
// //                                 inv.approvalStatusString === 'Approved' 
// //                                   ? 'bg-green-500/20 text-green-400 border border-green-500/30'
// //                                   : inv.approvalStatusString === 'Pending'
// //                                   ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
// //                                   : inv.approvalStatusString === 'Rejected'
// //                                   ? 'bg-red-500/20 text-red-400 border border-red-500/30'
// //                                   : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
// //                               }`}>
// //                                 {inv.approvalStatusString || "N/A"}
// //                               </span>
// //                             </td>
// //                           </tr>
// //                         );
// //                       })
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="space-y-6">
// //             <div className="bg-slate-800/50 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
// //               <h2 className="text-white font-semibold mb-2 text-lg flex items-center gap-2">
// //                 <Send className="w-5 h-5" />
// //                 Request Approval
// //               </h2>
// //               <p className="text-gray-400 text-sm mb-6">
// //                 Submit selected invoices for admin approval. Status will change to "Pending".
// //               </p>
// //               <button
// //                 className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
// //                 onClick={handleSubmitForApproval}
// //                 disabled={submitting || selectedInvoices.size === 0}
// //               >
// //                 {submitting ? 'Submitting...' : 'Submit for Approval'}
// //               </button>
// //               {pendingInvoices.length > 0 && (
// //                 <p className="text-gray-400 text-xs mt-3">
// //                   Pending invoices: {pendingInvoices.length}
// //                 </p>
// //               )}
// //             </div>

// //             <div className="bg-slate-800/50 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm shadow-xl">
// //               <h2 className="text-white font-semibold mb-2 text-lg flex items-center gap-2">
// //                 <CreditCard className="w-5 h-5" />
// //                 Payment Details
// //               </h2>
// //               <p className="text-gray-400 text-sm mb-6">
// //                 Process payment for selected invoices with bank details.
// //               </p>
// //               <button
// //                 className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
// //                 onClick={openPaymentModal}
// //                 disabled={selectedInvoices.size === 0}
// //               >
// //                 Process Payment
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {showPaymentModal && (
// //         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// //           <div className="bg-slate-800 rounded-2xl border border-purple-500/30 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
// //             <div className="px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-green-600 to-emerald-600 flex justify-between items-center">
// //               <h2 className="text-white font-bold text-xl flex items-center gap-2">
// //                 <CreditCard className="w-6 h-6" />
// //                 Payment Details
// //               </h2>
// //               <button 
// //                 onClick={() => setShowPaymentModal(false)}
// //                 className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
// //               >
// //                 <X className="w-5 h-5" />
// //               </button>
// //             </div>

// //             <div className="overflow-y-auto flex-1 p-6 space-y-6">
// //               <div className="bg-gradient-to-br from-cyan-600 to-purple-600 p-4 rounded-xl text-white">
// //                 <p className="text-sm text-cyan-100">Total Amount Selected</p>
// //                 <p className="text-3xl font-bold">LKR {totalSelected.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
// //               </div>

// //               <div className="flex items-center gap-2 bg-slate-700/50 p-3 rounded-lg">
// //                 <input
// //                   type="checkbox"
// //                   id="payAdvance"
// //                   checked={payWithAdvance}
// //                   onChange={(e) => setPayWithAdvance(e.target.checked)}
// //                   className="w-5 h-5"
// //                 />
// //                 <label htmlFor="payAdvance" className="text-white cursor-pointer">
// //                   Pay with Advance
// //                 </label>
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="text-gray-300 text-sm mb-2 block">Total Payment</label>
// //                   <input
// //                     type="number"
// //                     value={totalPayment}
// //                     onChange={(e) => setTotalPayment(parseFloat(e.target.value) || 0)}
// //                     className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
// //                     placeholder="0"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="text-gray-300 text-sm mb-2 block">Paid Date</label>
// //                   <input
// //                     type="date"
// //                     value={paidDate}
// //                     onChange={(e) => setPaidDate(e.target.value)}
// //                     className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="text-gray-300 text-sm mb-2 block">Reference</label>
// //                   <div className="relative">
// //                     <input
// //                       type="text"
// //                       value={reference}
// //                       onChange={(e) => setReference(e.target.value)}
// //                       className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none pr-10"
// //                       placeholder="RF-23/038/25104"
// //                     />
// //                     <button className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300">
// //                       <RefreshCw className="w-4 h-4" />
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="text-gray-300 text-sm mb-2 block">Comment</label>
// //                   <textarea
// //                     value={comment}
// //                     onChange={(e) => setComment(e.target.value)}
// //                     className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
// //                     rows={1}
// //                     placeholder="Add comment..."
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="px-6 py-4 border-t border-purple-500/20 bg-slate-800/50 flex justify-end gap-3">
// //               <button
// //                 onClick={() => setShowPaymentModal(false)}
// //                 className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handlePaymentSubmit}
// //                 disabled={submitting}
// //                 className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg font-medium disabled:opacity-50"
// //               >
// //                 {submitting ? 'Processing...' : 'Submit Payment'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// 'use client';
// import { useState, useEffect } from 'react';
// import {
//   Calendar,
//   DollarSign,
//   RefreshCw,
//   LogOut,
//   CheckCircle2,
//   Package,
//   Receipt,
//   Send,
//   Home,
//   AlertCircle,
//   Info,
//   Shield,
//   CreditCard,
//   Plus,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight
// } from 'lucide-react';

// interface Invoice {
//   id: number;
//   fRegNo?: string;
//   invoiceNo?: string;
//   gradeNo?: number;
//   packingCode?: string;
//   packages?: string;
//   fullHalf?: string;
//   sample?: string;
//   sampleQty?: number;
//   netWeight?: number;
//   netQty?: number;
//   totalNetWeight?: number;
//   manufacturedOn?: string;
//   lotNo?: number;
//   categoryCode?: number;
//   buyerCode?: string;
//   price?: number;
//   quantity?: number;
//   catelogNo?: string;
//   saleDate?: string;
//   packedDate?: string;
//   delivered?: boolean;
//   approvalStatus?: number;
//   approvalStatusString?: string;
//   buyerName?: string;
//   categoryDescription?: string;
//   gradeDescription?: string;
// }

// interface PaymentDetail {
//   bankName: string;
//   remainingAmount: number;
//   payment: number;
//   modeOfPayment: string;
//   chequeRefNo: string;
//   attachment: File | null;
// }

// export default function InvoicesDashboard() {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedInvoices, setSelectedInvoices] = useState<Set<number>>(new Set());
//   const [userType, setUserType] = useState<string>('Buyer');
//   const [submitting, setSubmitting] = useState(false);
//   const [debugMode, setDebugMode] = useState(false);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
  
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [payWithAdvance, setPayWithAdvance] = useState(false);
//   const [totalPayment, setTotalPayment] = useState(0);
//   const [paidDate, setPaidDate] = useState('');
//   const [reference, setReference] = useState('');
//   const [comment, setComment] = useState('');
//   const [bankDetails, setBankDetails] = useState<PaymentDetail[]>([]);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         window.location.href = '/login';
//         return;
//       }
//       const type = localStorage.getItem('userType');
//       if (type) setUserType(type);
//     }
//   }, []);

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   const fetchInvoices = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         window.location.href = '/login';
//         return;
//       }

//       const res = await fetch('http://51.75.119.133:5001/api/Sales', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           Accept: 'application/json'
//         }
//       });

//       if (res.status === 401 || res.status === 403) {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         window.location.href = '/login';
//         return;
//       }

//       const json = await res.json();
//       if (json && json.success && Array.isArray(json.data)) {
//         setInvoices(json.data);
//       } else if (Array.isArray(json)) {
//         setInvoices(json);
//       } else {
//         setInvoices([]);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
//     window.location.href = '/login';
//   };

//   const navigateToDashboard = () => {
//     window.location.href = '/buyer/dashboard';
//   };

//   const toggleInvoiceSelection = (id: number) => {
//     const updated = new Set(selectedInvoices);
//     if (updated.has(id)) updated.delete(id);
//     else updated.add(id);
//     setSelectedInvoices(updated);
//   };

//   // Pagination calculations
//   const totalPages = Math.ceil(invoices.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentInvoices = invoices.slice(startIndex, endIndex);

//   // Get selected invoices from ALL pages (not just current page)
//   const selectedInvoicesList = invoices.filter(inv => selectedInvoices.has(inv.id));
  
//   const totalSelected = selectedInvoicesList.reduce((sum, inv) => {
//     const price = parseFloat(String(inv.price ?? 0)) || 0;
//     return sum + price;
//   }, 0);

//   // Check if all invoices on current page are selected
//   const allCurrentPageSelected = currentInvoices.length > 0 && 
//     currentInvoices.every(inv => selectedInvoices.has(inv.id));

//   const toggleAllCurrentPage = () => {
//     const updated = new Set(selectedInvoices);
//     if (allCurrentPageSelected) {
//       currentInvoices.forEach(inv => updated.delete(inv.id));
//     } else {
//       currentInvoices.forEach(inv => updated.add(inv.id));
//     }
//     setSelectedInvoices(updated);
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   const handleItemsPerPageChange = (newItemsPerPage: number) => {
//     setItemsPerPage(newItemsPerPage);
//     setCurrentPage(1); // Reset to first page when changing items per page
//   };

//   const handleSubmitForApproval = async () => {
//     if (selectedInvoices.size === 0) {
//       alert("⚠️ Please select at least one invoice");
//       return;
//     }

//     const confirmMsg = 
//       `📤 REQUEST APPROVAL\n\n` +
//       `Selected: ${selectedInvoices.size} invoice${selectedInvoices.size > 1 ? 's' : ''}\n` +
//       `Total: LKR ${totalSelected.toLocaleString()}\n\n` +
//       `This will submit invoices for admin approval.\n` +
//       `Status will change to "Pending".\n\n` +
//       `Continue?`;

//     if (!confirm(confirmMsg)) return;

//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       alert('❌ Session expired. Please login again.');
//       window.location.href = '/login';
//       return;
//     }

//     setSubmitting(true);
//     const results: { invoiceNo: string; success: boolean; error?: string }[] = [];

//     for (const invoiceId of selectedInvoices) {
//       const invoice = invoices.find(i => i.id === invoiceId);
//       if (!invoice) continue;

//       try {
//         const res = await fetch(`http://51.75.119.133:5001/api/Approval/sales/${invoice.id}`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           }
//         });

//         const responseClone = res.clone();
        
//         if (res.ok) {
//           try {
//             const responseData = await res.json();
//             if (debugMode) {
//               console.log('✅ Success response:', responseData);
//             }
//             results.push({ 
//               invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
//               success: true 
//             });
//           } catch (parseError) {
//             results.push({ 
//               invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
//               success: true 
//             });
//           }
//         } else if (res.status === 403) {
//           results.push({ 
//             invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
//             success: false, 
//             error: "Forbidden – insufficient permissions" 
//           });
//         } else if (res.status === 401) {
//           results.push({ 
//             invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
//             success: false, 
//             error: "Unauthorized – please login again" 
//           });
//         } else {
//           let errorMessage = `HTTP ${res.status}`;
//           try {
//             const errorData = await responseClone.json();
//             errorMessage = errorData.message || errorData.details || errorMessage;
//             if (debugMode) {
//               console.error('❌ Error response:', errorData);
//             }
//           } catch {
//             try {
//               const errText = await res.text();
//               errorMessage = errText || errorMessage;
//             } catch {
//               errorMessage = `HTTP ${res.status}`;
//             }
//           }
//           results.push({ 
//             invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
//             success: false, 
//             error: errorMessage 
//           });
//         }
//       } catch (err: any) {
//         console.error('❌ Request failed:', err);
//         results.push({ 
//           invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
//           success: false, 
//           error: err.message || 'Network error' 
//         });
//       }
//     }

//     setSubmitting(false);
    
//     const successCount = results.filter(r => r.success).length;
//     const failCount = results.length - successCount;
    
//     const resultMessage = 
//       `📊 SUBMISSION COMPLETE\n\n` +
//       `✅ Success: ${successCount}\n` +
//       `❌ Failed: ${failCount}\n\n` +
//       `${results.map(r => r.success ? `✅ ${r.invoiceNo}` : `❌ ${r.invoiceNo}: ${r.error}`).join('\n')}`;
    
//     alert(resultMessage);
//     setSelectedInvoices(new Set());
    
//     await fetchInvoices();
//   };

//   const openPaymentModal = () => {
//     if (selectedInvoices.size === 0) {
//       alert("⚠️ Please select at least one invoice");
//       return;
//     }
    
//     const today = new Date().toISOString().split('T')[0];
//     setPaidDate(today);
//     setTotalPayment(0);
//     setReference('');
//     setComment('');
//     setPayWithAdvance(false);
//     setBankDetails([{
//       bankName: 'COMMERCIAL BANK',
//       remainingAmount: totalSelected,
//       payment: 0,
//       modeOfPayment: 'CHEQUE',
//       chequeRefNo: '',
//       attachment: null
//     }]);
//     setShowPaymentModal(true);
//   };

//   const handlePaymentSubmit = async () => {
//     if (!paidDate) {
//       alert('⚠️ Please select a payment date');
//       return;
//     }

//     if (selectedInvoices.size === 0) {
//       alert('⚠️ No invoices selected');
//       return;
//     }

//     const confirmMsg = 
//       `💳 CONFIRM PAYMENT\n\n` +
//       `Selected Invoices: ${selectedInvoices.size}\n` +
//       `Total Amount: LKR ${totalSelected.toLocaleString()}\n` +
//       `Payment Date: ${paidDate}\n` +
//       `Reference: ${reference || 'N/A'}\n\n` +
//       `Continue with payment submission?`;

//     if (!confirm(confirmMsg)) return;

//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       alert('❌ Session expired. Please login again.');
//       window.location.href = '/login';
//       return;
//     }

//     setSubmitting(true);
//     const results: { invoiceId: number; success: boolean; error?: string }[] = [];

//     for (const invoiceId of selectedInvoices) {
//       const invoice = invoices.find(i => i.id === invoiceId);
//       if (!invoice) continue;

//       const paymentData = {
//         salesRequestId: invoiceId,
//         amount: parseFloat(String(invoice.price ?? 0)) || 0,
//         paymentMethod: "CHEQUE",
//         transactionId: reference || `TXN-${Date.now()}-${invoiceId}`,
//         paymentReference: reference || `REF-${invoiceId}`,
//         bankDetails: "COMMERCIAL BANK",
//         remarks: comment || `Payment for invoice ${invoice.invoiceNo || invoiceId}`
//       };

//       try {
//         const res = await fetch('http://51.75.119.133:5001/api/Payment', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           body: JSON.stringify(paymentData)
//         });

//         if (res.ok) {
//           const responseData = await res.json();
//           if (debugMode) {
//             console.log('✅ Payment success:', responseData);
//           }
//           results.push({ 
//             invoiceId, 
//             success: true 
//           });
//         } else if (res.status === 403) {
//           results.push({ 
//             invoiceId, 
//             success: false, 
//             error: "Forbidden – insufficient permissions" 
//           });
//         } else if (res.status === 401) {
//           results.push({ 
//             invoiceId, 
//             success: false, 
//             error: "Unauthorized – please login again" 
//           });
//         } else {
//           let errorMessage = `HTTP ${res.status}`;
//           try {
//             const errorData = await res.json();
//             errorMessage = errorData.message || errorData.details || errorMessage;
//             if (debugMode) {
//               console.error('❌ Payment error:', errorData);
//             }
//           } catch {
//             const errText = await res.text();
//             errorMessage = errText || errorMessage;
//           }
//           results.push({ 
//             invoiceId, 
//             success: false, 
//             error: errorMessage 
//           });
//         }
//       } catch (err: any) {
//         console.error('❌ Payment request failed:', err);
//         results.push({ 
//           invoiceId, 
//           success: false, 
//           error: err.message || 'Network error' 
//         });
//       }
//     }

//     setSubmitting(false);
    
//     const successCount = results.filter(r => r.success).length;
//     const failCount = results.length - successCount;
    
//     const resultMessage = 
//       `💳 PAYMENT SUBMISSION COMPLETE\n\n` +
//       `✅ Success: ${successCount}\n` +
//       `❌ Failed: ${failCount}\n` +
//       `Total Amount: LKR ${totalSelected.toLocaleString()}\n\n` +
//       `${results.map(r => {
//         const inv = invoices.find(i => i.id === r.invoiceId);
//         const invNo = inv?.invoiceNo || `ID-${r.invoiceId}`;
//         return r.success ? `✅ ${invNo}` : `❌ ${invNo}: ${r.error}`;
//       }).join('\n')}`;
    
//     alert(resultMessage);
//     setShowPaymentModal(false);
//     setSelectedInvoices(new Set());
    
//     await fetchInvoices();
//   };

//   const pendingInvoices = invoices.filter(inv => inv.approvalStatusString === "Pending");

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="animate-spin w-12 h-12 text-cyan-400 mx-auto mb-4" />
//           <p className="text-white text-lg">Loading invoices...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <div className="p-6 flex justify-between items-center bg-slate-800/20 border-b border-purple-500/20 backdrop-blur-sm">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//             <Receipt className="text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-cyan-400">Invoice Management</h1>
//             <p className="text-gray-400 text-sm">Welcome, {userType}</p>
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <button 
//             className="px-5 py-2.5 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all flex items-center gap-2"
//             onClick={navigateToDashboard}
//           >
//             <Home className="w-4 h-4" /> Approved Invoices
//           </button>
//           <button 
//             className="px-5 py-2.5 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2"
//             onClick={fetchInvoices}
//             disabled={loading}
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
//           </button>
//           <button 
//             className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
//             onClick={logout}
//           >
//             <LogOut className="w-4 h-4" /> Logout
//           </button>
//         </div>
//       </div>

//       <div className="p-6">
//         {error && (
//           <div className="bg-red-500/10 border border-red-400/30 p-4 text-red-300 mb-6 rounded-lg flex items-start gap-3">
//             <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//             <div>
//               <p className="font-semibold">Error</p>
//               <p className="text-sm">{error}</p>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           <div className="xl:col-span-2 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="p-6 rounded-2xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm">
//                 <p className="text-gray-400 text-sm mb-1">Total Invoices</p>
//                 <p className="text-4xl font-bold text-white">{invoices.length}</p>
//               </div>
//               <div className="p-6 rounded-2xl bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm">
//                 <p className="text-gray-400 text-sm mb-1">Selected</p>
//                 <p className="text-4xl font-bold text-cyan-400">{selectedInvoices.size}</p>
//               </div>
//               <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-600 to-purple-600 shadow-lg">
//                 <p className="text-cyan-100 text-sm mb-1">Total Amount</p>
//                 <p className="text-3xl text-white font-bold">
//                   LKR {totalSelected.toLocaleString(undefined, {minimumFractionDigits: 2})}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-slate-800/40 rounded-2xl border border-purple-500/20 overflow-hidden backdrop-blur-sm shadow-xl">
//               <div className="px-6 py-4 border-b border-purple-500/20 bg-slate-900/30 flex justify-between items-center">
//                 <h2 className="text-white font-semibold text-lg flex items-center gap-2">
//                   <Package className="w-5 h-5" />
//                   Available Invoices
//                 </h2>
//                 <div className="flex items-center gap-3">
//                   <select
//                     value={itemsPerPage}
//                     onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//                     className="bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-600 text-sm focus:outline-none focus:border-cyan-500"
//                   >
//                     <option value={5}>5 per page</option>
//                     <option value={10}>10 per page</option>
//                     <option value={25}>25 per page</option>
//                     <option value={50}>50 per page</option>
//                     <option value={100}>100 per page</option>
//                   </select>
//                   <button
//                     onClick={() => setDebugMode(!debugMode)}
//                     className="text-xs px-3 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
//                   >
//                     {debugMode ? '🔍 Debug ON' : '🔍 Debug OFF'}
//                   </button>
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full text-white">
//                   <thead className="bg-slate-900/50 text-gray-400 text-sm">
//                     <tr>
//                       <th className="px-4 py-3 text-left">
//                         <input
//                           type="checkbox"
//                           className="w-5 h-5 cursor-pointer"
//                           checked={allCurrentPageSelected}
//                           onChange={toggleAllCurrentPage}
//                           title="Select all on this page"
//                         />
//                       </th>
//                       <th className="px-4 py-3 text-left">F-Reg No</th>
//                       <th className="px-4 py-3 text-left">Lot No</th>
//                       <th className="px-4 py-3 text-left">Invoice No</th>
//                       <th className="px-4 py-3 text-left">Buyer</th>
//                       <th className="px-4 py-3 text-left">Grade</th>
//                       <th className="px-4 py-3 text-right">Net Wt</th>
//                       <th className="px-4 py-3 text-right">Price</th>
//                       <th className="px-4 py-3 text-right">Qty</th>
//                       <th className="px-4 py-3 text-center">Status</th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-purple-500/10">
//                     {currentInvoices.length === 0 ? (
//                       <tr>
//                         <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
//                           <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
//                           No invoices found
//                         </td>
//                       </tr>
//                     ) : (
//                       currentInvoices.map(inv => {
//                         const price = parseFloat(String(inv.price ?? 0)) || 0;
//                         const qty = parseFloat(String(inv.quantity ?? 0)) || 0;

//                         return (
//                           <tr
//                             key={inv.id}
//                             className={`transition-colors ${
//                               selectedInvoices.has(inv.id) 
//                                 ? "bg-purple-500/20 border-l-4 border-l-purple-500" 
//                                 : "hover:bg-purple-500/10"
//                             }`}
//                           >
//                             <td className="px-4 py-3">
//                               <input
//                                 type="checkbox"
//                                 className="w-5 h-5 cursor-pointer"
//                                 checked={selectedInvoices.has(inv.id)}
//                                 onChange={() => toggleInvoiceSelection(inv.id)}
//                               />
//                             </td>
//                             <td className="px-4 py-3">
//                               <span className="px-2 py-1 rounded text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono">
//                                 {inv.fRegNo || '-'}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3 font-medium">{inv.lotNo || '-'}</td>
//                             <td className="px-4 py-3">
//                               <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono">
//                                 {inv.invoiceNo || '-'}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3">
//                               <div className="text-gray-200">{inv.buyerName || '-'}</div>
//                               <div className="text-gray-500 text-xs font-mono">{inv.buyerCode || '-'}</div>
//                             </td>
//                             <td className="px-4 py-3 text-gray-300">{inv.gradeDescription || '-'}</td>
//                             <td className="px-4 py-3 text-right font-mono">{inv.netWeight || '-'}</td>
//                             <td className="px-4 py-3 text-right font-mono">{price.toFixed(2)}</td>
//                             <td className="px-4 py-3 text-right font-mono">{qty}</td>
//                             <td className="px-4 py-3 text-center">
//                               <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                 inv.approvalStatusString === 'Approved' 
//                                   ? 'bg-green-500/20 text-green-400 border border-green-500/30'
//                                   : inv.approvalStatusString === 'Pending'
//                                   ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
//                                   : inv.approvalStatusString === 'Rejected'
//                                   ? 'bg-red-500/20 text-red-400 border border-red-500/30'
//                                   : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
//                               }`}>
//                                 {inv.approvalStatusString || "N/A"}
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination Controls */}
//               {invoices.length > 0 && (
//                 <div className="px-6 py-4 border-t border-purple-500/20 bg-slate-900/30">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-400">
//                       Showing <span className="text-white font-medium">{startIndex + 1}</span> to{' '}
//                       <span className="text-white font-medium">{Math.min(endIndex, invoices.length)}</span> of{' '}
//                       <span className="text-white font-medium">{invoices.length}</span> invoices
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => goToPage(1)}
//                         disabled={currentPage === 1}
//                         className="p-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                         title="First page"
//                       >
//                         <ChevronsLeft className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => goToPage(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="p-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                         title="Previous page"
//                       >
//                         <ChevronLeft className="w-4 h-4" />
//                       </button>

//                       <div className="flex items-center gap-1">
//                         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                           let pageNum;
//                           if (totalPages <= 5) {
//                             pageNum = i + 1;
//                           } else if (currentPage <= 3) {
//                             pageNum = i + 1;
//                           } else if (currentPage >= totalPages - 2) {
//                             pageNum = totalPages - 4 + i;
//                           } else {
//                             pageNum = currentPage - 2 + i;
//                           }

//                           return (
//                             <button
//                               key={pageNum}
//                               onClick={() => goToPage(pageNum)}
//                               className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                                 currentPage === pageNum
//                                   ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
//                                   : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
//                               }`}
//                             >
//                               {pageNum}
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <button
//                         onClick={() => goToPage(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="p-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                         title="Next page"
//                       >
//                         <ChevronRight className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => goToPage(totalPages)}
//                         disabled={currentPage === totalPages}
//                         className="p-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                         title="Last page"
//                       >
//                         <ChevronsRight className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div className="bg-slate-800/50 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
//               <h2 className="text-white font-semibold mb-2 text-lg flex items-center gap-2">
//                 <Send className="w-5 h-5" />
//                 Request Approval
//               </h2>
//               <p className="text-gray-400 text-sm mb-6">
//                 Submit selected invoices for admin approval. Status will change to "Pending".
//               </p>
//               <button
//                 className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
//                 onClick={handleSubmitForApproval}
//                 disabled={submitting || selectedInvoices.size === 0}
//               >
//                 {submitting ? 'Submitting...' : 'Submit for Approval'}
//               </button>
//               {pendingInvoices.length > 0 && (
//                 <p className="text-gray-400 text-xs mt-3">
//                   Pending invoices: {pendingInvoices.length}
//                 </p>
//               )}
//             </div>

//             <div className="bg-slate-800/50 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm shadow-xl">
//               <h2 className="text-white font-semibold mb-2 text-lg flex items-center gap-2">
//                 <CreditCard className="w-5 h-5" />
//                 Payment Details
//               </h2>
//               <p className="text-gray-400 text-sm mb-6">
//                 Process payment for selected invoices with bank details.
//               </p>
//               <button
//                 className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
//                 onClick={openPaymentModal}
//                 disabled={selectedInvoices.size === 0}
//               >
//                 Process Payment
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showPaymentModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-slate-800 rounded-2xl border border-purple-500/30 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//             <div className="px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-green-600 to-emerald-600 flex justify-between items-center">
//               <h2 className="text-white font-bold text-xl flex items-center gap-2">
//                 <CreditCard className="w-6 h-6" />
//                 Payment Details
//               </h2>
//               <button 
//                 onClick={() => setShowPaymentModal(false)}
//                 className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="overflow-y-auto flex-1 p-6 space-y-6">
//               <div className="bg-gradient-to-br from-cyan-600 to-purple-600 p-4 rounded-xl text-white">
//                 <p className="text-sm text-cyan-100">Total Amount Selected</p>
//                 <p className="text-3xl font-bold">LKR {totalSelected.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
//               </div>

//               <div className="flex items-center gap-2 bg-slate-700/50 p-3 rounded-lg">
//                 <input
//                   type="checkbox"
//                   id="payAdvance"
//                   checked={payWithAdvance}
//                   onChange={(e) => setPayWithAdvance(e.target.checked)}
//                   className="w-5 h-5"
//                 />
//                 <label htmlFor="payAdvance" className="text-white cursor-pointer">
//                   Pay with Advance
//                 </label>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-gray-300 text-sm mb-2 block">Total Payment</label>
//                   <input
//                     type="number"
//                     value={totalPayment}
//                     onChange={(e) => setTotalPayment(parseFloat(e.target.value) || 0)}
//                     className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
//                     placeholder="0"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-gray-300 text-sm mb-2 block">Paid Date</label>
//                   <input
//                     type="date"
//                     value={paidDate}
//                     onChange={(e) => setPaidDate(e.target.value)}
//                     className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-gray-300 text-sm mb-2 block">Reference</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={reference}
//                       onChange={(e) => setReference(e.target.value)}
//                       className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none pr-10"
//                       placeholder="RF-23/038/25104"
//                     />
//                     <button className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300">
//                       <RefreshCw className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-gray-300 text-sm mb-2 block">Comment</label>
//                   <textarea
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
//                     rows={1}
//                     placeholder="Add comment..."
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="px-6 py-4 border-t border-purple-500/20 bg-slate-800/50 flex justify-end gap-3">
//               <button
//                 onClick={() => setShowPaymentModal(false)}
//                 className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePaymentSubmit}
//                 disabled={submitting}
//                 className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg font-medium disabled:opacity-50"
//               >
//                 {submitting ? 'Processing...' : 'Submit Payment'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
  Shield,
  CreditCard,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
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

interface PaymentDetail {
  bankName: string;
  remainingAmount: number;
  payment: number;
  modeOfPayment: string;
  chequeRefNo: string;
  attachment: File | null;
}

export default function InvoicesDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<number>>(new Set());
  const [userType, setUserType] = useState<string>('Buyer');
  const [submitting, setSubmitting] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payWithAdvance, setPayWithAdvance] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);
  const [paidDate, setPaidDate] = useState('');
  const [reference, setReference] = useState('');
  const [comment, setComment] = useState('');
  const [bankDetails, setBankDetails] = useState<PaymentDetail[]>([]);

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

      const res = await fetch('http://51.75.119.133:5001/api/Sales', {
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

  // Pagination calculations
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  // Get selected invoices from ALL pages (not just current page)
  const selectedInvoicesList = invoices.filter(inv => selectedInvoices.has(inv.id));
  
  const totalSelected = selectedInvoicesList.reduce((sum, inv) => {
    const price = parseFloat(String(inv.price ?? 0)) || 0;
    return sum + price;
  }, 0);

  // Check if all invoices on current page are selected
  const allCurrentPageSelected = currentInvoices.length > 0 && 
    currentInvoices.every(inv => selectedInvoices.has(inv.id));

  const toggleAllCurrentPage = () => {
    const updated = new Set(selectedInvoices);
    if (allCurrentPageSelected) {
      currentInvoices.forEach(inv => updated.delete(inv.id));
    } else {
      currentInvoices.forEach(inv => updated.add(inv.id));
    }
    setSelectedInvoices(updated);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

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
        const res = await fetch(`http://51.75.119.133:5001/api/Approval/sales/${invoice.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const responseClone = res.clone();
        
        if (res.ok) {
          try {
            const responseData = await res.json();
            if (debugMode) {
              console.log('✅ Success response:', responseData);
            }
            results.push({ 
              invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
              success: true 
            });
          } catch (parseError) {
            results.push({ 
              invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
              success: true 
            });
          }
        } else if (res.status === 403) {
          results.push({ 
            invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
            success: false, 
            error: "Forbidden – insufficient permissions" 
          });
        } else if (res.status === 401) {
          results.push({ 
            invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
            success: false, 
            error: "Unauthorized – please login again" 
          });
        } else {
          let errorMessage = `HTTP ${res.status}`;
          try {
            const errorData = await responseClone.json();
            errorMessage = errorData.message || errorData.details || errorMessage;
            if (debugMode) {
              console.error('❌ Error response:', errorData);
            }
          } catch {
            try {
              const errText = await res.text();
              errorMessage = errText || errorMessage;
            } catch {
              errorMessage = `HTTP ${res.status}`;
            }
          }
          results.push({ 
            invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
            success: false, 
            error: errorMessage 
          });
        }
      } catch (err: any) {
        console.error('❌ Request failed:', err);
        results.push({ 
          invoiceNo: invoice.invoiceNo || `ID-${invoiceId}`, 
          success: false, 
          error: err.message || 'Network error' 
        });
      }
    }

    setSubmitting(false);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;
    
    const resultMessage = 
      `📊 SUBMISSION COMPLETE\n\n` +
      `✅ Success: ${successCount}\n` +
      `❌ Failed: ${failCount}\n\n` +
      `${results.map(r => r.success ? `✅ ${r.invoiceNo}` : `❌ ${r.invoiceNo}: ${r.error}`).join('\n')}`;
    
    alert(resultMessage);
    setSelectedInvoices(new Set());
    
    await fetchInvoices();
  };

  const openPaymentModal = () => {
    if (selectedInvoices.size === 0) {
      alert("⚠️ Please select at least one invoice");
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    setPaidDate(today);
    setTotalPayment(0);
    setReference('');
    setComment('');
    setPayWithAdvance(false);
    setBankDetails([{
      bankName: 'COMMERCIAL BANK',
      remainingAmount: totalSelected,
      payment: 0,
      modeOfPayment: 'CHEQUE',
      chequeRefNo: '',
      attachment: null
    }]);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!paidDate) {
      alert('⚠️ Please select a payment date');
      return;
    }

    if (selectedInvoices.size === 0) {
      alert('⚠️ No invoices selected');
      return;
    }

    const confirmMsg = 
      `💳 CONFIRM PAYMENT\n\n` +
      `Selected Invoices: ${selectedInvoices.size}\n` +
      `Total Amount: LKR ${totalSelected.toLocaleString()}\n` +
      `Payment Date: ${paidDate}\n` +
      `Reference: ${reference || 'N/A'}\n\n` +
      `Continue with payment submission?`;

    if (!confirm(confirmMsg)) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('❌ Session expired. Please login again.');
      window.location.href = '/login';
      return;
    }

    setSubmitting(true);
    const results: { invoiceId: number; success: boolean; error?: string }[] = [];

    for (const invoiceId of selectedInvoices) {
      const invoice = invoices.find(i => i.id === invoiceId);
      if (!invoice) continue;

      const paymentData = {
        salesRequestId: invoiceId,
        amount: parseFloat(String(invoice.price ?? 0)) || 0,
        paymentMethod: "CHEQUE",
        transactionId: reference || `TXN-${Date.now()}-${invoiceId}`,
        paymentReference: reference || `REF-${invoiceId}`,
        bankDetails: "COMMERCIAL BANK",
        remarks: comment || `Payment for invoice ${invoice.invoiceNo || invoiceId}`
      };

      try {
        const res = await fetch('http://51.75.119.133:5001/api/Payment', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(paymentData)
        });

        if (res.ok) {
          const responseData = await res.json();
          if (debugMode) {
            console.log('✅ Payment success:', responseData);
          }
          results.push({ 
            invoiceId, 
            success: true 
          });
        } else if (res.status === 403) {
          results.push({ 
            invoiceId, 
            success: false, 
            error: "Forbidden – insufficient permissions" 
          });
        } else if (res.status === 401) {
          results.push({ 
            invoiceId, 
            success: false, 
            error: "Unauthorized – please login again" 
          });
        } else {
          let errorMessage = `HTTP ${res.status}`;
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.details || errorMessage;
            if (debugMode) {
              console.error('❌ Payment error:', errorData);
            }
          } catch {
            const errText = await res.text();
            errorMessage = errText || errorMessage;
          }
          results.push({ 
            invoiceId, 
            success: false, 
            error: errorMessage 
          });
        }
      } catch (err: any) {
        console.error('❌ Payment request failed:', err);
        results.push({ 
          invoiceId, 
          success: false, 
          error: err.message || 'Network error' 
        });
      }
    }

    setSubmitting(false);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;
    
    const resultMessage = 
      `💳 PAYMENT SUBMISSION COMPLETE\n\n` +
      `✅ Success: ${successCount}\n` +
      `❌ Failed: ${failCount}\n` +
      `Total Amount: LKR ${totalSelected.toLocaleString()}\n\n` +
      `${results.map(r => {
        const inv = invoices.find(i => i.id === r.invoiceId);
        const invNo = inv?.invoiceNo || `ID-${r.invoiceId}`;
        return r.success ? `✅ ${invNo}` : `❌ ${invNo}: ${r.error}`;
      }).join('\n')}`;
    
    alert(resultMessage);
    setShowPaymentModal(false);
    setSelectedInvoices(new Set());
    
    await fetchInvoices();
  };

  const pendingInvoices = invoices.filter(inv => inv.approvalStatusString === "Pending");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <p className="text-white text-lg">Loading invoices...</p>
          </div>
        </div>
        <footer className="py-4 text-center text-gray-400 text-sm border-t border-purple-500/20 bg-slate-800/30">
          <div className="footer-logo">Orysone Technologies</div>
          <p>© {new Date().getFullYear()} All rights reserved by Orysone Technologies</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="flex-grow">
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
              <Home className="w-4 h-4" /> Approved Invoices
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
                    LKR {totalSelected.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/40 rounded-2xl border border-purple-500/20 overflow-hidden backdrop-blur-sm shadow-xl">
                <div className="px-6 py-4 border-b border-purple-500/20 bg-slate-900/30 flex justify-between items-center">
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Available Invoices
                  </h2>
                  <div className="flex items-center gap-3">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                    <button
                      onClick={() => setDebugMode(!debugMode)}
                      className="text-xs px-3 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                    >
                      {debugMode ? '🔍 Debug ON' : '🔍 Debug OFF'}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead className="bg-slate-900/50 text-gray-400 text-sm">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer"
                            checked={allCurrentPageSelected}
                            onChange={toggleAllCurrentPage}
                            title="Select all on this page"
                          />
                        </th>
                        <th className="px-4 py-3 text-left">F-Reg No</th>
                        <th className="px-4 py-3 text-left">Lot No</th>
                        <th className="px-4 py-3 text-left">Invoice No</th>
                        <th className="px-4 py-3 text-left">Buyer</th>
                        <th className="px-4 py-3 text-left">Grade</th>
                        <th className="px-4 py-3 text-right">Net Wt</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3 text-right">Qty</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-purple-500/10">
                      {currentInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            No invoices found
                          </td>
                        </tr>
                      ) : (
                        currentInvoices.map(inv => {
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
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 rounded text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono">
                                  {inv.fRegNo || '-'}
                                </span>
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

                {/* Pagination Controls */}
                {invoices.length > 0 && (
                  <div className="px-6 py-4 border-t border-purple-500/20 bg-slate-900/30">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Showing <span className="text-white font-medium">{startIndex + 1}</span> to{' '}
                        <span className="text-white font-medium">{Math.min(endIndex, invoices.length)}</span> of{' '}
                        <span className="text-white font-medium">{invoices.length}</span> invoices
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => goToPage(1)}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          title="First page"
                        >
                          <ChevronsLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          title="Previous page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  currentPage === pageNum
                                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          title="Next page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => goToPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          title="Last page"
                        >
                          <ChevronsRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
                <h2 className="text-white font-semibold mb-2 text-lg flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Request Approval
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Submit selected invoices for admin approval. Status will change to "Pending".
                </p>
                <button
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
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

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm shadow-xl">
                <h2 className="text-white font-semibold mb-2 text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Process payment for selected invoices with bank details.
                </p>
                <button
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                  onClick={openPaymentModal}
                  disabled={selectedInvoices.size === 0}
                >
                  Process Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-gray-400 text-sm border-t border-purple-500/20 bg-slate-800/30">
        <div className="footer-logo">Orysone Technologies</div>
        <p>© {new Date().getFullYear()} All rights reserved by Orysone Technologies</p>
      </footer>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-purple-500/30 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-green-600 to-emerald-600 flex justify-between items-center">
              <h2 className="text-white font-bold text-xl flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Payment Details
              </h2>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              <div className="bg-gradient-to-br from-cyan-600 to-purple-600 p-4 rounded-xl text-white">
                <p className="text-sm text-cyan-100">Total Amount Selected</p>
                <p className="text-3xl font-bold">LKR {totalSelected.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-700/50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  id="payAdvance"
                  checked={payWithAdvance}
                  onChange={(e) => setPayWithAdvance(e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="payAdvance" className="text-white cursor-pointer">
                  Pay with Advance
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Total Payment</label>
                  <input
                    type="number"
                    value={totalPayment}
                    onChange={(e) => setTotalPayment(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Paid Date</label>
                  <input
                    type="date"
                    value={paidDate}
                    onChange={(e) => setPaidDate(e.target.value)}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Reference</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none pr-10"
                      placeholder="RF-23/038/25104"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
                    rows={1}
                    placeholder="Add comment..."
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-purple-500/20 bg-slate-800/50 flex justify-end gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg font-medium disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Submit Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}