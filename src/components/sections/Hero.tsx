"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const collageImages = [
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153256/hero1_a0zjls.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153256/hero2_ik1dpq.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153251/hero3_gwgzwl.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153248/hero4_vndva5.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153250/hero5_nizpwn.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153252/hero6_ezbk9o.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153250/hero7_m2fjb7.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153244/hero8_ngrdr6.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153246/hero9_hypqkf.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775157245/hero10_cymu0n.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775157245/hero11_bkiubm.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775157246/hero12_prfxpl.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775157250/hero13_mhc9rr.jpg",
  "https://res.cloudinary.com/dxrxewurm/image/upload/v1775153248/hero14_mtxmge.jpg",
];

const collageLayout = [
  // Top Left cluster
  { w: "32%", h: "40%", t: "-8%", l: "-5%", r: "-4deg", z: 0 },
  { w: "25%", h: "35%", t: "5%", l: "15%", r: "3deg", z: 20 },
  { w: "20%", h: "28%", t: "25%", l: "-2%", r: "-2deg", z: 10 },

  // Top Right cluster
  { w: "35%", h: "45%", t: "-10%", l: "65%", r: "2deg", z: 0 },
  { w: "24%", h: "33%", t: "10%", l: "45%", r: "-5deg", z: 10 },
  { w: "28%", h: "30%", t: "20%", l: "80%", r: "4deg", z: 20 },

  // Middle Left cluster
  { w: "30%", h: "38%", t: "45%", l: "-10%", r: "5deg", z: 10 },
  { w: "22%", h: "25%", t: "55%", l: "12%", r: "-3deg", z: 30 },

  // Middle Center cluster
  { w: "26%", h: "35%", t: "40%", l: "30%", r: "-1deg", z: 20 },
  { w: "34%", h: "28%", t: "35%", l: "52%", r: "6deg", z: 30 },

  // Middle Right cluster
  { w: "27%", h: "42%", t: "50%", l: "75%", r: "-4deg", z: 10 },

  // Bottom Left cluster
  { w: "38%", h: "33%", t: "80%", l: "-5%", r: "-2deg", z: 20 },
  { w: "23%", h: "26%", t: "72%", l: "20%", r: "4deg", z: 10 },

  // Bottom Right cluster
  { w: "31%", h: "40%", t: "75%", l: "42%", r: "-3deg", z: 20 },
  { w: "29%", h: "35%", t: "85%", l: "70%", r: "2deg", z: 30 },
  { w: "21%", h: "30%", t: "65%", l: "85%", r: "-5deg", z: 0 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Photo Collage */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
        <div className="absolute w-full h-[120%] -top-[10%] left-0 opacity-90">
          {collageImages.map((src, idx) => {
            const layout = collageLayout[idx];
            if (!layout) return null;
            return (
              <div
                key={idx}
                className="absolute overflow-hidden rounded-xl border border-white/20 shadow-2xl"
                style={{
                  width: layout.w,
                  height: layout.h,
                  top: layout.t,
                  left: layout.l,
                  transform: `rotate(${layout.r})`,
                  zIndex: layout.z,
                }}
              >
                <Image
                  src={src}
                  alt={`Background collage image ${idx + 1}`}
                  fill
                  className="object-cover grayscale brightness-90 saturate-50"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  priority={idx < 4}
                />
              </div>
            );
          })}
        </div>

        {/* Overlay overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/30 to-[#050505]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_100%)] opacity-60" />
      </div>

      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-100/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />



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
