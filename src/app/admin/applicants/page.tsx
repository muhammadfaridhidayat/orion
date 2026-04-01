"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check, X, Trash2, UserCheck, Clock, ShieldAlert, Search, ChevronLeft, ChevronRight, Loader2, FileText } from "lucide-react";
import { getMembers, updateMemberStatus, deleteMember, NewMember, Status, getBatches, Batch, API_URL } from "@/lib/api";

const PAGE_LIMIT = 15;

export default function ApplicantsPage() {
  const [members, setMembers] = useState<NewMember[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentUrl, setSelectedPaymentUrl] = useState("");
  const [selectedPaymentLoading, setSelectedPaymentLoading] = useState(false);
  
  const [motivationModalOpen, setMotivationModalOpen] = useState(false);
  const [selectedMotivation, setSelectedMotivation] = useState("");

  // ── Debounce the search input ──────────────────────────────────────────────
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(value);
      setCurrentPage(1); // reset to first page on new search
    }, 400);
  };

  // ── Fetch batches once on mount, then auto-select the active one ────────────
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const batchesRes = await getBatches().catch(() => null);
        if (batchesRes?.batches) {
          setBatches(batchesRes.batches);
          // Auto-select the active batch as the default view
          const activeBatch = batchesRes.batches.find((b) => b.is_active);
          if (activeBatch) {
            setSelectedBatchId(activeBatch.id);
          }
        }
      } catch {
        // non-critical; batches just won't be listed
      }
    };
    fetchBatches();
  }, []);

  // ── Fetch members whenever page / search query changes ────────────────────
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setSearchLoading(true);
      setError("");

      const batchIdParam = selectedBatchId === "all" ? undefined : selectedBatchId;
      const res = await getMembers(currentPage, PAGE_LIMIT, debouncedQuery, batchIdParam);

      if (res?.members) {
        setMembers(res.members);
        // If the backend returns a total count field, use it; otherwise infer from results
        const total = (res as any).total ?? (res as any).count ?? null;
        if (total !== null) {
          setTotalCount(total);
        } else {
          // fallback: if we got a full page assume more may exist
          if (res.members.length === PAGE_LIMIT) {
            setTotalCount(currentPage * PAGE_LIMIT + 1);
          } else {
            setTotalCount((currentPage - 1) * PAGE_LIMIT + res.members.length);
          }
        }
      } else {
        setMembers([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load applicants");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [currentPage, debouncedQuery, selectedBatchId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // ── Status / delete actions ────────────────────────────────────────────────
  const handleStatusChange = async (id: number, newStatus: Status) => {
    try {
      await updateMemberStatus(id, newStatus);
      setMembers((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err: any) {
      alert(err.message || "Status update failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this applicant?")) return;
    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((app) => app.id !== id));
      setTotalCount((c) => Math.max(0, c - 1));
    } catch (err: any) {
      alert(err.message || "Failed to delete applicant");
    }
  };

  // Client-side filter as safety net (server-side batch_id param is the primary filter)
  const displayedMembers =
    selectedBatchId === "all"
      ? members
      : members.filter((m) => m.batch_id === selectedBatchId);

  const openPaymentModal = (url: string) => {
    setSelectedPaymentUrl(url.startsWith("http") ? url : API_URL + url);
    setSelectedPaymentLoading(true);
    setPaymentModalOpen(true);
  };

  const openMotivationModal = (motivation: string) => {
    setSelectedMotivation(motivation || "No motivation provided.");
    setMotivationModalOpen(true);
  };

  const getBatchName = (batchId: number | null) => {
    if (!batchId) return "—";
    const batch = batches.find((b) => b.id === batchId);
    return batch ? batch.name : `Batch #${batchId}`;
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));
  const isSearchActive = debouncedQuery.trim() !== "";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Applicants</h1>
          <p className="text-gray-400 text-sm mt-1">
            Review and manage all applicant registrations.
          </p>
        </div>

        {/* Batch Filter (client-side, on current page) */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-xl">
          <select
            value={selectedBatchId}
            onChange={(e) => {
              setSelectedBatchId(e.target.value === "all" ? "all" : Number(e.target.value));
              setCurrentPage(1); // reset to page 1 when switching batches
            }}
            className="bg-transparent text-sm text-gray-200 outline-none px-2 py-1.5 cursor-pointer max-w-[200px]"
          >
            <option value="all" className="bg-[#111111]">All Batches</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id} className="bg-[#111111]">
                {batch.name} {batch.is_active ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Main Card ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Card header + Search */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-white">
            All Applicants
            {isSearchActive && (
              <span className="ml-2 text-sm font-normal text-blue-400">
                — searching "{debouncedQuery}"
              </span>
            )}
          </h2>

          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name…"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Applicant</th>
                <th className="p-4 font-semibold">Division</th>
                <th className="p-4 font-semibold">Batch</th>
                <th className="p-4 font-semibold">Contact / Document</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading applicants…
                    </span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-red-500">{error}</td>
                </tr>
              ) : displayedMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Search className="w-8 h-8 opacity-40" />
                      <p className="text-sm">
                        {isSearchActive
                          ? `No applicants found for "${debouncedQuery}".`
                          : "No applicants found."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedMembers.map((app) => (
                  <tr
                    key={app.id}
                    className={`hover:bg-white/[0.02] transition-colors ${searchLoading ? "opacity-50" : ""}`}
                  >
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
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-white/5 text-gray-300 border-white/10">
                        {app.devision}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{getBatchName(app.batch_id)}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-gray-400 mb-1">{app.phone_number}</p>
                      <div className="flex flex-col gap-1.5">
                        {app.payment && (
                          <button
                            onClick={() => openPaymentModal(app.payment)}
                            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors focus:outline-none"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Document
                          </button>
                        )}
                        {app.motivation && (
                          <button
                            onClick={() => openMotivationModal(app.motivation)}
                            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors focus:outline-none"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Motivation
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                          ${app.status === "VERIFIED" ? "text-green-400 bg-green-500/10" : ""}
                          ${app.status === "PENDING" ? "text-yellow-400 bg-yellow-500/10" : ""}
                          ${app.status === "REJECTED" ? "text-red-400 bg-red-500/10" : ""}
                        `}
                      >
                        {app.status === "VERIFIED" && <UserCheck className="w-3.5 h-3.5" />}
                        {app.status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
                        {app.status === "REJECTED" && <ShieldAlert className="w-3.5 h-3.5" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app.id, "VERIFIED")}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                              title="Verify"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, "REJECTED")}
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

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {!loading && !error && totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
              {isSearchActive && ` · results for "${debouncedQuery}"`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || searchLoading}
                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page number pills */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  totalPages <= 5
                    ? i + 1
                    : currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={searchLoading}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors disabled:cursor-not-allowed
                      ${page === currentPage
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || searchLoading}
                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Payment Proof Modal ───────────────────────────────────────────── */}
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
              <div className="flex-1 w-full bg-black/20 flex items-center justify-center p-6 relative">
                {selectedPaymentLoading && (
                  <div className="absolute inset-0 flex flex-col gap-3 items-center justify-center text-blue-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-sm font-medium animate-pulse">Loading Document...</span>
                  </div>
                )}
                {selectedPaymentUrl.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={selectedPaymentUrl}
                    onLoad={() => setSelectedPaymentLoading(false)}
                    className={`w-full h-[60vh] rounded-lg bg-white relative z-10 transition-opacity duration-300 ${selectedPaymentLoading ? "opacity-0" : "opacity-100"}`}
                  />
                ) : (
                  <img
                    src={selectedPaymentUrl}
                    alt="Payment Proof"
                    onLoad={() => setSelectedPaymentLoading(false)}
                    className={`max-h-[60vh] object-contain rounded-lg shadow-xl relative z-10 transition-opacity duration-300 ${selectedPaymentLoading ? "opacity-0" : "opacity-100"}`}
                  />
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
      {/* ── Motivation Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {motivationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMotivationModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
                <h3 className="font-semibold text-white">Applicant Motivation</h3>
                <button
                  onClick={() => setMotivationModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 text-gray-300 text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto w-full break-words">
                {selectedMotivation}
              </div>
              <div className="p-4 border-t border-white/10 bg-black/50 flex justify-end">
                <button
                  onClick={() => setMotivationModalOpen(false)}
                  className="text-sm font-medium px-4 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
