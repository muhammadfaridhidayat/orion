"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_APPLICANTS, MOCK_STATS, CHART_DATA } from "@/lib/mockData";
import { Code2, Cpu, Wrench, Users, UserCheck, Clock, ShieldAlert, Check, X, Building2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [regOpen, setRegOpen] = useState(true);

  const handleStatusChange = (id: string, newStatus: "Verified" | "Rejected") => {
    setApplicants(applicants.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const statsCards = [
    { title: "Total Applicants", value: "115", icon: <Users className="text-blue-400 w-6 h-6" />, color: "from-blue-500/20 to-transparent", border: "border-blue-500/20" },
    { title: "Programming Div", value: MOCK_STATS.totalProgramming, icon: <Code2 className="text-indigo-400 w-6 h-6" />, color: "from-indigo-500/20 to-transparent", border: "border-indigo-500/20" },
    { title: "Electronic Div", value: MOCK_STATS.totalElectronic, icon: <Cpu className="text-purple-400 w-6 h-6" />, color: "from-purple-500/20 to-transparent", border: "border-purple-500/20" },
    { title: "Mechanic Div", value: MOCK_STATS.totalMechanic, icon: <Wrench className="text-orange-400 w-6 h-6" />, color: "from-orange-500/20 to-transparent", border: "border-orange-500/20" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back. Here is the latest registration data.</p>
        </div>
        
        <div className="flex items-center gap-4 p-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-sm font-medium text-gray-300 pl-2">Registration Status:</span>
          <button 
            onClick={() => setRegOpen(!regOpen)}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${regOpen ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className="sr-only">Toggle registration</span>
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${regOpen ? 'translate-x-3.5' : '-translate-x-3.5'}`} />
          </button>
          <span className={`text-xs px-2 py-1 flex items-center gap-1 rounded font-semibold ${regOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {regOpen ? "OPEN" : "CLOSED"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} glass-card relative overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-400">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl glass-card border border-white/10"
        >
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Registration Trend (Last 7 Days)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorElc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#e5e5e5' }}
                />
                <Area type="monotone" dataKey="programming" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorPrg)" />
                <Area type="monotone" dataKey="electronic" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorElc)" />
                <Area type="monotone" dataKey="mechanic" stroke="#fb923c" strokeWidth={2} fillOpacity={1} fill="url(#colorMec)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl shadow-xl glass-card border border-white/10"
        >
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">New Application Received</p>
                  <p className="text-xs text-gray-500">{Math.floor(Math.random() * 60)} minutes ago • Programming</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Applicants</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Applicant</th>
                <th className="p-4 font-semibold">Division</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-500">{app.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-xs text-white">
                        {app.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-200">{app.fullName}</p>
                        <p className="text-xs text-gray-500">{app.nim} • Sem {app.semester}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                      ${app.division === 'Programming' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : ''}
                      ${app.division === 'Electronic' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                      ${app.division === 'Mechanic' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                    `}>
                      {app.division}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${app.status === 'Verified' ? 'text-green-400 bg-green-500/10' : ''}
                      ${app.status === 'Pending' ? 'text-yellow-400 bg-yellow-500/10' : ''}
                      ${app.status === 'Rejected' ? 'text-red-400 bg-red-500/10' : ''}
                    `}>
                      {app.status === 'Verified' && <UserCheck className="w-3.5 h-3.5" />}
                      {app.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {app.status === 'Rejected' && <ShieldAlert className="w-3.5 h-3.5" />}
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {app.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(app.id, 'Verified')}
                            className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                            title="Verify"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(app.id, 'Rejected')}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {app.status !== 'Pending' && (
                        <button className="text-xs text-gray-500 hover:text-white transition-colors underline underline-offset-2">
                          View details
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
