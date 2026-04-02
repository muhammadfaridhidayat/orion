"use client";

import { motion } from "framer-motion";

export function ActivitySection() {
  const images = [
    { src: "https://res.cloudinary.com/dxrxewurm/image/upload/v1775073438/DSCF6536_-_Copy_ssjxp8.jpg", alt: "All Together", span: "md:col-span-2 md:row-span-2" },
    { src: "https://res.cloudinary.com/dxrxewurm/image/upload/v1775072324/sumo1_vodhfc.jpg", alt: "Sumo Robot", span: "md:col-span-1 md:row-span-1" },
    { src: "https://res.cloudinary.com/dxrxewurm/image/upload/v1775072325/sumo_oo45zi.jpg", alt: "Robot Component", span: "md:col-span-1 md:row-span-1" },
    { src: "https://res.cloudinary.com/dxrxewurm/image/upload/v1775072324/pnbrc_bali_prztfd.jpg", alt: "PNBRC Bali 2025", span: "md:col-span-1 md:row-span-1" },
    { src: "https://res.cloudinary.com/dxrxewurm/image/upload/v1775072581/eltion3_1_qypk0w.jpg", alt: "Competition Preparation", span: "md:col-span-1 md:row-span-1" },
    { src: "https://res.cloudinary.com/dxrxewurm/image/upload/v1775073529/DSCF9005_tqzioq.jpg", alt: "Eltion Unram 2025", span: "md:col-span-1 md:row-span-1" },
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Life at OrionUnhaz</h2>
            {/* <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white glow-text">Kehidupan di OrionUnhaz</h2> */}
            {/* <p className="text-gray-400 max-w-lg">
              Moments from our workshops, hackathons, and national competitions.
            </p> */}
            <p className="text-gray-400 max-w-lg">
              Momen-momen dari lokakarya dan kompetisi tingkat nasional kami.
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="px-6 py-2 rounded-full border border-white/10 bg-[#050505] text-gray-300 hover:text-white hover:border-white/20 transition-all text-sm"
          >
            {/* Follow our Instagram */}
            Ikuti Instagram kami
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
