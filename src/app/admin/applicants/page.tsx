"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check, X, Trash2, UserCheck, Clock, ShieldAlert } from "lucide-react";
import { getMembers, updateMemberStatus, deleteMember, NewMember, Status, getActiveBatch, Batch } from "@/lib/api";

export default function ApplicantsPage() {
  const [members, setMembers] = useState<NewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentUrl, setSelectedPaymentUrl] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const batchRes = await getActiveBatch().catch(() => null);
      let activeBatch: Batch | null = null;
      if (batchRes && batchRes.batch) {
        activeBatch = batchRes.batch;
      }

      const membersRes = await getMembers(1, 1000);
      if (membersRes && membersRes.members) {
        let _members = membersRes.members || [];
        
        if (activeBatch) {
          _members = _members.filter((m) => m.batch_id === activeBatch.id);
        }
        
        setMembers(_members);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: number, newStatus: Status) => {
    try {
      await updateMemberStatus(id, newStatus);
      setMembers(members.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (err: any) {
      alert(err.message || "Status update failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this applicant?")) return;
    try {
      await deleteMember(id);
      setMembers(members.filter(app => app.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete applicant");
    }
  };

  const openPaymentModal = (url: string) => {
    setSelectedPaymentUrl((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + url);
    setPaymentModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Applicants</h1>
          <p className="text-gray-400 text-sm mt-1">
            Review and manage all applicant registrations.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">All Applicants</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Applicant</th>
                <th className="p-4 font-semibold">Division</th>
                <th className="p-4 font-semibold">Contact / Document</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">Loading applicants...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-red-500">{error}</td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">No applicants found.</td>
                </tr>
              ) : (
                members.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm font-mono text-gray-500">{app.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-xs text-white">
                          {app.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-200">{app.full_name}</p>
                          <p className="text-xs text-gray-500">{app.nim} • Sem {app.semester}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-white/5 text-gray-300 border-white/10`}>
                        {app.devision}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-gray-400 mb-1">{app.phone_number}</p>
                      {app.payment && (
                        <button
                          onClick={() => openPaymentModal(app.payment)}
                          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Document
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                        ${app.status === 'VERIFIED' ? 'text-green-400 bg-green-500/10' : ''}
                        ${app.status === 'PENDING' ? 'text-yellow-400 bg-yellow-500/10' : ''}
                        ${app.status === 'REJECTED' ? 'text-red-400 bg-red-500/10' : ''}
                      `}>
                        {app.status === 'VERIFIED' && <UserCheck className="w-3.5 h-3.5" />}
                        {app.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {app.status === 'REJECTED' && <ShieldAlert className="w-3.5 h-3.5" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app.id, 'VERIFIED')}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                              title="Verify"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, 'REJECTED')}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-1.5 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Applicant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Payment Proof Modal */}
      <AnimatePresence>
        {paymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPaymentModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
                <h3 className="font-semibold text-white">Payment Proof Document</h3>
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 w-full bg-black/20 flex items-center justify-center p-6">
                {selectedPaymentUrl.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={selectedPaymentUrl} className="w-full h-[60vh] rounded-lg bg-white" />
                ) : (
                  <img src={selectedPaymentUrl} alt="Payment Proof" className="max-h-[60vh] object-contain rounded-lg shadow-xl" />
                )}
              </div>
              <div className="p-4 border-t border-white/10 bg-black/50 flex justify-end">
                <a
                  href={selectedPaymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  Open in New Tab
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
