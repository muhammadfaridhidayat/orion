"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Cpu, Wrench, Users, Building2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getActiveBatch, getMembers, getRegistrationTrend, Batch, NewMember, TrendData } from "@/lib/api";

export default function AdminDashboardPage() {
  const [members, setMembers] = useState<NewMember[]>([]);
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [stats, setStats] = useState({
    total: 0,
    programming: 0,
    electronic: 0,
    mechanic: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const batchRes = await getActiveBatch().catch(() => null);
      if (batchRes && batchRes.batch) {
        setActiveBatch(batchRes.batch);
      } else {
        setActiveBatch(null);
      }

      const trendRes = await getRegistrationTrend().catch(() => null);
      if (trendRes && trendRes.trends) {
        setTrendData(trendRes.trends);
      }

      const membersRes = await getMembers(1, 100);
      if (membersRes && membersRes.members) {
        let _members = membersRes.members || [];
        
        // Filter members by active batch
        if (batchRes && batchRes.batch) {
          _members = _members.filter((m) => m.batch_id === batchRes.batch.id);
        }

        setMembers(_members);
        
        // Calculate stats
        let p = 0, e = 0, m = 0;
        _members.forEach(member => {
          if (member.devision === "PROGRAMMING") p++;
          else if (member.devision === "ELECTRONICS") e++;
          else if (member.devision === "MECHANICAL") m++;
        });
        setStats({ total: _members.length, programming: p, electronic: e, mechanic: m });
      }

    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const isRegistrationOpen = () => {
    if (!activeBatch) return false;
    const now = new Date();
    const start = new Date(activeBatch.start_date);
    const end = new Date(activeBatch.end_date);
    return now >= start && now <= end && activeBatch.is_active;
  };

  const regOpen = isRegistrationOpen();

  const statsCards = [
    { title: "Total Applicants", value: stats.total, icon: <Users className="text-blue-400 w-6 h-6" />, color: "from-white/[0.05] to-transparent", border: "border-white/10" },
    { title: "Programming Div", value: stats.programming, icon: <Code2 className="text-indigo-400 w-6 h-6" />, color: "from-white/[0.05] to-transparent", border: "border-white/10" },
    { title: "Electronic Div", value: stats.electronic, icon: <Cpu className="text-purple-400 w-6 h-6" />, color: "from-white/[0.05] to-transparent", border: "border-white/10" },
    { title: "Mechanic Div", value: stats.mechanic, icon: <Wrench className="text-orange-400 w-6 h-6" />, color: "from-white/[0.05] to-transparent", border: "border-white/10" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">
            {activeBatch ? `Active Batch: ${activeBatch.name}` : "No active batch selected."}
          </p>
        </div>

        <div className="flex items-center gap-4 p-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-sm font-medium text-gray-300 pl-2">Registration Status:</span>
          <div
            className={`relative inline-flex h-7 w-14 shrink-0 items-center justify-center rounded-full transition-colors ${regOpen ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${regOpen ? 'translate-x-3.5' : '-translate-x-3.5'}`} />
          </div>
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
            Registration Trend
          </h2>
          <div className="h-[300px] w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4d4d8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d4d4d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorElc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#71717a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#e5e5e5' }}
                  />
                  <Area type="monotone" dataKey="programming" stroke="#d4d4d8" strokeWidth={2} fillOpacity={1} fill="url(#colorPrg)" />
                  <Area type="monotone" dataKey="electronic" stroke="#a1a1aa" strokeWidth={2} fillOpacity={1} fill="url(#colorElc)" />
                  <Area type="monotone" dataKey="mechanic" stroke="#71717a" strokeWidth={2} fillOpacity={1} fill="url(#colorMec)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-sm gap-2">
                <Building2 className="w-8 h-8 opacity-50" />
                <p>No trend data available for current active batch.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl shadow-xl glass-card border border-white/10 max-h-[400px] overflow-y-auto"
        >
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {members.slice().reverse().slice(0, 8).map((m, idx) => (
              <div key={m.id} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">{m.full_name} Applied</p>
                  <p className="text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()} • {m.devision}</p>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <div className="text-sm text-gray-400">No recent activity.</div>
            )}
          </div>
        </motion.div>
      </div>


    </div>
  );
}
