"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { UploadCloud, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    nim: "",
    semester: "",
    division: "Programming",
    motivation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call
    console.log("Mock submission:", formData);

    // Simulate API delay
    const btn = document.getElementById("submitBtn");
    if (btn) btn.innerHTML = '<span class="animate-pulse">Submitting...</span>';

    setTimeout(() => {
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#050505] text-white pt-24 pb-16 flex items-center justify-center">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card p-10 rounded-3xl border border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 to-white" />
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
          <p className="text-gray-400 mb-8">
            Thank you for applying to OrionUnhaz. We have received your data and will email you with further instructions once verification is complete.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-medium">
            Return to Home
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-16">
      <Navbar />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">Registration Form</h1>
          <p className="text-gray-400">Please fill out all fields accurately.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-6 md:p-10 border border-white/10 relative"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-400/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">NIM (Student ID)</label>
                <input
                  type="text"
                  required
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-400/50 transition-colors"
                  placeholder="H071231011"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Semester</label>
                <select
                  required
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gray-400/50 transition-colors appearance-none"
                >
                  <option value="" disabled hidden>Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7].map(sem => (
                    <option key={sem} value={sem} className="bg-[#0f0f0f]">Semester {sem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Division</label>
                <select
                  required
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gray-400/50 transition-colors appearance-none"
                >
                  <option value="Programming" className="bg-[#0f0f0f]">Programming Division</option>
                  <option value="Electronic" className="bg-[#0f0f0f]">Electronic Division</option>
                  <option value="Mechanic" className="bg-[#0f0f0f]">Mechanic Division</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Motivation Letter</label>
              <textarea
                required
                rows={4}
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-400/50 transition-colors resize-none"
                placeholder="Why do you want to join OrionUnhaz and this specific division?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Payment Proof (PDF/JPG/PNG)</label>
              <div className="w-full border-2 border-dashed border-white/10 rounded-xl p-8 hover:bg-white/5 hover:border-white/20 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-400 group relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                <UploadCloud className="w-8 h-8 mb-3 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-600 mt-1">Max file size: 5MB</span>
              </div>
            </div>

            <div className="pt-6">
              <button
                id="submitBtn"
                type="submit"
                className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 focus:ring-4 focus:ring-white/20 transition-all flex items-center justify-center gap-2 group"
              >
                Submit Application <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
