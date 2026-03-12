"use client";

import { motion } from "framer-motion";
import { Users, Target, Rocket } from "lucide-react";

export function AboutSection() {
  const cards = [
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: "Our Community",
      description: "A passionate group of students dedicated to pushing the boundaries of robotics and AI at OrionUnhaz.",
    },
    {
      icon: <Target className="w-8 h-8 text-purple-400" />,
      title: "Our Mission",
      description: "To foster innovation, provide hands-on engineering experience, and compete at the highest levels of collegiate robotics.",
    },
    {
      icon: <Rocket className="w-8 h-8 text-orange-400" />,
      title: "Our Vision",
      description: "To be the premier university robotics hub that shapes the next generation of engineers and technologists.",
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 glow-text text-white">About OrionUnhaz</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full" />
          <p className="text-gray-400 text-lg">
            We are the official robotics club of the university, acting as a bridge between theoretical learning and practical engineering. Since our inception, we have been building autonomous systems, participating in national competitions, and sharing our knowledge with the community.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="mb-6 w-16 h-16 rounded-full border border-gray-700 glass flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
