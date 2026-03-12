"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function JoinInfoPage() {
  const requirements = [
    "Currently enrolled as an active university student",
    "Strong passion for robotics, programming, or engineering",
    "Commitment to attend weekly workshops and meetings",
    "Motivation letter explaining why you want to join",
    "Proof of registration fee payment (Rp. 35.000)"
  ];

  const steps = [
    {
      icon: <ClipboardList className="w-6 h-6 text-blue-400" />,
      title: "1. Fill the Form",
      description: "Submit your personal details, division preference, and motivation letter through our portal.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: "2. Verification",
      description: "Our admin team will review your submitted data and payment proof within 3-5 business days.",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-orange-400" />,
      title: "3. Interview",
      description: "Shortlisted candidates will be invited for a brief interview to discuss their motivation and skills.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
      title: "4. Final Announcement",

      description: "Successful applicants will be officially welcomed into the OrionUnhaz family.",
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-16">
      <Navbar />

      {/* Background gradients */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-emerald-100/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gray-400 font-mono tracking-wider text-sm mb-4 block">/// JOIN THE CREW</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 glow-text">Become a Member</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ready to build the future? Review the requirements and recruitment process below before submitting your application.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 glass-card p-8 rounded-3xl h-fit border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-sm">!</span>
              Requirements
            </h2>
            <ul className="space-y-4">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 relative group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-3 relative"
          >
            <h2 className="text-2xl font-bold mb-8">Registration Flow</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {steps.map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#050505] glass shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    {step.icon}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-card p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-colors">
                    <h3 className="font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center justify-center pt-8 border-t border-white/10"
        >
          <p className="text-gray-400 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            I have read and understood the requirements and process.
          </p>
          <Link
            href="/register"
            className="group relative px-10 py-4 rounded-full bg-white text-black font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Proceed to Registration <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
