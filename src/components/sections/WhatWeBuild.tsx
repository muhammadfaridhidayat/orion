"use client";

import { motion } from "framer-motion";
import { Cpu, Terminal, Zap, Wrench } from "lucide-react";

export function WhatWeBuildSection() {
  const projects = [
    {
      id: "embedded",
      title: "Embedded Systems",
      icon: <Cpu className="w-10 h-10 text-gray-300" />,
      description: "Designing and programming microcontroller-based systems (STM32, ESP32, Arduino) that serve as the brain of our robotics applications, ensuring real-time response and reliability.",
      color: "from-white/[0.05] to-transparent",
      borderColor: "border-white/10",
    },
    {
      id: "software",
      title: "Software & AI",
      icon: <Terminal className="w-10 h-10 text-gray-300" />,
      description: "Developing complex software solutions, from robot control systems using ROS to computer vision models and AI pathfinding algorithms for autonomous navigation.",
      color: "from-white/[0.05] to-transparent",
      borderColor: "border-white/10",
    },
    {
      id: "electronics",
      title: "Electronics",
      icon: <Zap className="w-10 h-10 text-gray-300" />,
      description: "Building robust electronic circuits from scratch. This includes power distribution, sensor integration, actuator control, and custom custom PCB layout design.",
      color: "from-white/[0.05] to-transparent",
      borderColor: "border-white/10",
    },
    {
      id: "mechanics",
      title: "Mechanics",
      icon: <Wrench className="w-10 h-10 text-gray-300" />,
      description: "Engineering durable structural frameworks. We utilize 3D computer-aided design (CAD), simulation, and fabrication to build chassis, motor mounts, and moving components.",
      color: "from-white/[0.05] to-transparent",
      borderColor: "border-white/10",
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#050505]">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white glow-text">What We Build</h2>
            <div className="w-24 h-px bg-gradient-to-r from-gray-500 to-transparent mb-6 rounded-full" />
            <p className="text-gray-400 text-lg">
              Our projects encompass all core pillars of robotics. Our teams collaborate closely across these domains to bring fully functional, autonomous robots to life.
            </p>
          </div>
          <button className="px-6 py-2 rounded-full border border-white/10 bg-[#050505] text-gray-300 hover:text-white hover:border-white/20 transition-all shrink-0 text-sm">
            View Project Gallery
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-1 rounded-2xl bg-gradient-to-br ${item.color}`}
            >
              <div className={`h-full glass-card border rounded-xl p-8 ${item.borderColor} hover:bg-white/[0.03] transition-colors`}>
                <div className="mb-6 w-20 h-20 rounded-2xl bg-[#000] border border-gray-800 flex items-center justify-center shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
