"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 100 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  if (isAuthOrAdmin) return null; // Don't show public navbar on admin pages

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled ? "bg-black/50 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo container */}
          <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden">
            <img src="/logo.jpeg" alt="OrionUnhaz Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight ml-1">OrionUnhaz</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/#about" className="text-gray-300 hover:text-white transition-colors">About</Link>
          <Link href="/#divisions" className="text-gray-300 hover:text-white transition-colors">Divisions</Link>
          <Link href="/#gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</Link>
          <Link href="/login" className="text-gray-500 hover:text-white transition-colors">Admin Login</Link>
        </div>

        <Link
          href="/join"
          className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Join Members
        </Link>
      </div>
    </motion.nav>
  );
}
