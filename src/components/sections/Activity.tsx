"use client";

import { motion } from "framer-motion";

export function ActivitySection() {
  const images = [
    { src: "https://images.unsplash.com/photo-1581090464733-5c8e762c2f70?q=80&w=600&auto=format&fit=crop", alt: "Students working on robot", span: "md:col-span-2 md:row-span-2" },
    { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop", alt: "Robot component", span: "md:col-span-1 md:row-span-1" },
    { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop", alt: "Soldering circuit board", span: "md:col-span-1 md:row-span-1" },
    { src: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=600&auto=format&fit=crop", alt: "Computer vision analysis", span: "md:col-span-1 md:row-span-1" },
    { src: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=600&auto=format&fit=crop", alt: "Team discussion", span: "md:col-span-1 md:row-span-1" },
  ];

  return (
    <section className="py-24 relative bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white glow-text">Life at OrionUnhaz</h2>
            <p className="text-gray-400 max-w-lg">
              Moments from our workshops, hackathons, and national competitions.
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="px-6 py-2 rounded-full border border-white/10 bg-[#050505] text-gray-300 hover:text-white hover:border-white/20 transition-all text-sm"
          >
            Follow our Instagram
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 h-[600px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden group ${img.span}`}
            >
              {/* Using standard img tags since images might not be configured in Next.js config for next/image */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white font-medium">{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
