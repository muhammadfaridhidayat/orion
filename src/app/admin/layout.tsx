"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, Bell, Search, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!isAdmin && localStorage.getItem("orion_admin_auth") !== "true") {
      router.push("/login");
    }
  }, [isAdmin, router]);

  if (!mounted || !isAdmin) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200 flex overflow-hidden selection:bg-blue-500/30">
      {/* Sidebar background gradient */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 bg-[#0a0a0a] border-r border-white/5 relative z-20 flex flex-col h-screen"
          >
            <div className="h-20 flex items-center px-6 border-b border-white/5">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                  <img src="/logo.jpeg" alt="OrionUnhaz Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden ml-1">Orion Panel</span>
              </Link>
            </div>

            <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto w-full">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 whitespace-nowrap overflow-hidden">Overview</p>

              <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${
                typeof window !== 'undefined' && window.location.pathname === '/admin' 
                  ? 'bg-white/10 text-white font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}>
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span>Dashboard</span>
              </Link>

              <Link href="/admin/applicants" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${
                typeof window !== 'undefined' && window.location.pathname.startsWith('/admin/applicants')
                  ? 'bg-white/10 text-white font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}>
                <Users className="w-5 h-5 shrink-0" />
                <span>Applicants</span>
              </Link>

              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8 whitespace-nowrap overflow-hidden">Configuration</p>
              <Link href="/admin/batches" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${
                typeof window !== 'undefined' && window.location.pathname === '/admin/batches' 
                  ? 'bg-white/10 text-white font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}>
                <Settings className="w-5 h-5 shrink-0" />
                <span>Batches</span>
              </Link>
            </div>

            <div className="p-4 border-t border-white/5 w-full">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 relative z-10">
        {/* Topbar */}
        <header className="h-20 bg-[#0a0a0a]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search applicants..."
                className="bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-400/50 w-64 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-600 to-gray-400 border border-white/10" />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#000000]">
          {children}
        </main>
      </div>
    </div>
  );
}
