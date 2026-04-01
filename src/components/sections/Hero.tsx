"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cpu, CircuitBoard, Wrench, Code } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-100/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

      {/* Floating Nodes (simulating the design inspiration) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-[20%] left-[15%] hidden md:flex items-center gap-3 text-sm text-gray-400"
      >
        <div className="w-8 h-8 rounded-full border border-gray-800 glass flex items-center justify-center">
          <Code className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="text-white text-xs font-semibold">Programming</div>
          <div className="text-[10px]">Division</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute bottom-[30%] left-[20%] hidden md:flex items-center gap-3 text-sm text-gray-400"
      >
        <div className="w-8 h-8 rounded-full border border-gray-800 glass flex items-center justify-center">
          <CircuitBoard className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <div className="text-white text-xs font-semibold">Electronics</div>
          <div className="text-[10px]">Division</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute top-[30%] right-[15%] hidden md:flex flex-row-reverse items-center gap-3 text-sm text-gray-400 text-right"
      >
        <div className="w-8 h-8 rounded-full border border-gray-800 glass flex items-center justify-center">
          <Wrench className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <div className="text-white text-xs font-semibold">Mechanics</div>
          <div className="text-[10px]">Division</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-[20%] right-[25%] hidden md:flex flex-row-reverse items-center gap-3 text-sm text-gray-400 text-right"
      >
        <div className="w-8 h-8 rounded-full border border-gray-800 glass flex items-center justify-center">
          <Cpu className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <div className="text-white text-xs font-semibold">Embedded</div>
          <div className="text-[10px]">Systems</div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
          <span className="text-xs font-medium tracking-wide text-gray-400">Unlock your potential in robotics →</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Engineering the Future <br className="hidden md:block" /> of Robotics
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
        >
          Dive into the world of mechatronics, where innovative hardware design meets intelligent software architecture. Join OrionUnhaz and build something extraordinary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a href="/join" className="group relative px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold overflow-hidden transition-all hover:bg-white/20">
            <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
              Join Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <button className="px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors">
            Discover More
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-10 flex items-center gap-4 hidden md:flex"
      >
        <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400">
          ↓
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll down</span>
      </motion.div>
    </section>
  );
}
