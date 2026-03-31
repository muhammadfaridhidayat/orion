"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Batch, getBatches, createBatch, updateBatch, setActiveBatch, deleteBatch } from "@/lib/api";

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const data = await getBatches();
      setBatches(data.batches || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch batches");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({ name: "", start_date: "", end_date: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (batch: Batch) => {
    setModalMode("edit");
    setSelectedBatch(batch);
    setFormData({
      name: batch.name,
      start_date: batch.start_date ? new Date(batch.start_date).toISOString().slice(0, 16) : "",
      end_date: batch.end_date ? new Date(batch.end_date).toISOString().slice(0, 16) : "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBatch(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = {
        name: formData.name,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      if (modalMode === "create") {
        await createBatch(payload);
      } else if (modalMode === "edit" && selectedBatch) {
        await updateBatch(selectedBatch.id, payload);
      }
      
      await fetchBatches();
      closeModal();
    } catch (err: any) {
      alert(err.message || "Failed to save batch");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSetActive = async (id: number, currentActive: boolean) => {
    if (currentActive) return; // Already active
    if (!confirm("Are you sure you want to set this batch as active? Other batches will be deactivated.")) return;
    
    try {
      await setActiveBatch(id, true);
      await fetchBatches();
    } catch (err: any) {
      alert(err.message || "Failed to set active batch");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this batch? This action cannot be undone.")) return;
    
    try {
      await deleteBatch(id);
      await fetchBatches();
    } catch (err: any) {
      alert(err.message || "Failed to delete batch");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Batch Management</h1>
          <p className="text-gray-400 text-sm mt-1">Create and manage registration batches.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Batch
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Timeline</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">Loading batches...</td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">No batches found. Create one to get started.</td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-200">{batch.name}</p>
                      <p className="text-xs text-gray-500 font-mono">ID: {batch.id}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      <div>{new Date(batch.start_date).toLocaleDateString()} - {new Date(batch.end_date).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                        ${batch.is_active 
                          ? 'border-green-500/30 text-green-400 bg-green-500/10' 
                          : 'border-white/10 text-gray-400 bg-white/5'}`}
                      >
                        {batch.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {batch.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {!batch.is_active && (
                          <button
                            onClick={() => handleSetActive(batch.id, Boolean(batch.is_active))}
                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors font-medium border border-blue-500/20"
                          >
                            Set Active
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(batch)}
                          className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(batch.id)}
                          className="p-1.5 rounded-lg bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                {modalMode === "create" ? "Create New Batch" : "Edit Batch"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Batch Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="e.g. Batch 2026"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Start Date</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">End Date</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {submitLoading ? "Saving..." : "Save Batch"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
