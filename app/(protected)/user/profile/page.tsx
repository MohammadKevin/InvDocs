"use client";
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  ShieldCheck,
  Key,
  Activity,
  MapPin,
  Calendar,
  Edit3,
  Camera,
  Lock,
  LogOut,
  ChevronRight,
  Fingerprint,
  Smartphone,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto space-y-10 pb-20"
    >
      {/* Profile Header Section */}
      <div className="relative group">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-slate-900 rounded-[3.5rem] overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-44 h-44 rounded-[3rem] border-8 border-white/10 overflow-hidden shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
              <img 
                src="https://ui-avatars.com/api/?name=Mohammad+Kevin&background=2563eb&color=fff&size=256" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-900 z-20 hover:text-blue-600 transition-colors border border-slate-100"
            >
              <Camera size={20} />
            </motion.button>
          </div>

          {/* Identity Text */}
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <h2 className="text-4xl font-black text-white tracking-tighter">Mohammad Kevin</h2>
              <div className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Verified Professional</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-blue-100/60 font-bold text-xs uppercase tracking-widest mb-8">
              <span className="flex items-center gap-2"><MapPin size={14} className="text-blue-400" /> Malang, East Java</span>
              <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-400" /> Joined May 2026</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <button className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40">
                 Edit Identity
               </button>
               <button className="px-8 py-3.5 bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all backdrop-blur-md">
                 Account Audit
               </button>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="hidden xl:grid grid-cols-1 gap-3">
             <div className="p-5 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm min-w-[160px]">
                <p className="text-2xl font-black text-white leading-none mb-1">1.2k</p>
                <p className="text-[9px] font-black text-blue-300/50 uppercase tracking-widest">Docs Processed</p>
             </div>
             <div className="p-5 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm min-w-[160px]">
                <p className="text-2xl font-black text-white leading-none mb-1">99%</p>
                <p className="text-[9px] font-black text-blue-300/50 uppercase tracking-widest">Health Score</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: General Information */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm shadow-slate-100/50">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
              <User size={16} className="text-blue-600" /> User Credentials
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Full Legal Name', value: 'Mohammad Kevin A. Rudianto', icon: User },
                { label: 'Primary Email', value: 'kevin@invdocs.enterprise', icon: Mail },
                { label: 'System Role', value: 'Lead System Architect', icon: ShieldCheck },
                { label: 'Digital Identity', value: 'ID-9920384-KEV', icon: Fingerprint },
              ].map((info) => (
                <div key={info.label} className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{info.label}</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors">
                      <info.icon size={18} />
                    </div>
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 transition-all group-hover:bg-white group-hover:border-blue-100 group-hover:ring-4 group-hover:ring-blue-500/5">
                      {info.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log Card */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm shadow-slate-100/50">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                 <Activity size={16} className="text-blue-600" /> Access History
               </h3>
               <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Download Full Log</button>
            </div>
            
            <div className="space-y-6">
              {[
                { event: 'Authorized Login', time: '2 minutes ago', device: 'Chrome on MacOS (192.168.1.1)' },
                { event: 'Bulk Export (Finance)', time: '1 hour ago', device: 'Dashboard Export Tool' },
                { event: 'Password Update', time: 'May 04, 2026', device: 'Security Preferences' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{log.event}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{log.time} • {log.device}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Security & Actions */}
        <div className="space-y-8">
           {/* Security Status Card */}
           <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Security Strength</h3>
                 <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                       <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path className="text-white/10" strokeDasharray="100, 100" strokeWidth="3" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-blue-500" strokeDasharray="85, 100" strokeWidth="3" strokeLinecap="round" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center font-black text-xl tracking-tighter">85%</div>
                    </div>
                    <div className="space-y-1">
                       <p className="text-sm font-bold">Strong Shield</p>
                       <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Your account uses Multi-Factor Auth and is monitored by AI-Threat Detection.</p>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                   Manage Security
                 </button>
              </div>
           </div>

           {/* Quick Settings Card */}
           <div className="bg-white border border-slate-100 rounded-[3rem] p-8 space-y-4 shadow-sm shadow-slate-100/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Quick Preferences</h3>
              {[
                { label: '2FA Authentication', icon: Smartphone, status: 'Active', color: 'text-emerald-500' },
                { label: 'Master Password', icon: Key, status: 'Change', color: 'text-blue-600' },
                { label: 'Privacy Mode', icon: Lock, status: 'Enabled', color: 'text-emerald-500' },
              ].map((item) => (
                <button key={item.label} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                </button>
              ))}
           </div>

           {/* Logout Button */}
           <button className="w-full py-5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out from System
           </button>
        </div>
      </div>
    </motion.div>
  );
}