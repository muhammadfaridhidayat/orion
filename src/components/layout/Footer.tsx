"use client";

import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-16 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden">
                <img src="/logo.jpeg" alt="OrionUnhaz Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight ml-1">OrionUnhaz</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Pioneering the future of robotics at the university level. We design, build, and program autonomous systems.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Divisions</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Programming</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Electronic</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mechanic</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="/join" className="hover:text-white transition-colors">Join Club</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Admin Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                <span>Student Center Building, Floor 2<br />University Campus</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <span>contact@orionunhaz.edu</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 OrionUnhaz Robotics Club. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
