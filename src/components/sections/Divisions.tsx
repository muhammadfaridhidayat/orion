"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Wrench } from "lucide-react";

export function DivisionsSection() {
  const divisions = [
    {
      id: "programming",
      title: "Programming Division",
      short: "PRG",
      icon: <Code2 className="w-8 h-8 text-blue-400" />,
      color: "blue",
      focus: ["Algorithms", "ROS/ROS2", "Computer Vision", "App Development"],
      description: "Writing the brain of the robot. From low-level sensor integration to high-level path planning and artificial intelligence models."
    },
    {
      id: "electronic",
      title: "Electronic Division",
      short: "ELC",
      icon: <Cpu className="w-8 h-8 text-purple-400" />,
      color: "purple",
      focus: ["PCB Design", "Power Systems", "Sensors", "Microcontrollers"],
      description: "Designing the nervous system. Connecting the logical brain with the physical world through intricate wiring and custom circuit boards."
    },
    {
      id: "mechanic",
      title: "Mechanic Division",
      short: "MEC",
      icon: <Wrench className="w-8 h-8 text-orange-400" />,
      color: "orange",
      focus: ["CAD Modeling", "3D Printing", "CNC Machining", "Kinematics"],
      description: "Building the body. Creating structural integrity, precision movement, and robust exterior protection for internal components."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#080808] border-y border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-gray-500 font-mono tracking-wider text-sm mb-4 block">/// STRUCTURE</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white glow-text">Club Divisions</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            OrionUnhaz is organized into three specialized divisions that work in harmony to produce competition-winning robotic systems.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {divisions.map((div, index) => (
            <motion.div
              key={div.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent rounded-2xl blur-xl transition-opacity group-hover:opacity-100 opacity-0" />
              <div className="relative h-full glass-card p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-xl bg-black/50 flex flex-col items-center justify-center border border-white/5">
                    {div.icon}
                  </div>
                  <span className="text-sm font-mono text-gray-500 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                    {div.short}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{div.title}</h3>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                  {div.description}
                </p>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">Core Focus</h4>
                  <div className="flex flex-wrap gap-2">
                    {div.focus.map((item, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 border border-white/10">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
