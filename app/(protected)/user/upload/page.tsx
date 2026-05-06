"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Secure Ingestion</h2>
        <p className="text-slate-500 font-medium">Digitalize and archive your assets with AES-256 encryption.</p>
      </div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center group hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 mb-8 group-hover:rotate-12 transition-transform">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Drag and drop files</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Support PDF, JPG, PNG up to 50MB</p>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
            Browse Documents
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-600" /> Upload Properties
          </h4>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Document Title</label>
              <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-medium outline-none focus:ring-4 ring-blue-500/5 transition-all" placeholder="e.g. Finance_Q1_2026" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Archive Location</label>
              <select className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-medium outline-none appearance-none cursor-pointer">
                <option>Personal Vault</option>
                <option>Enterprise Storage</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white relative overflow-hidden flex flex-col justify-between">
           <div className="relative z-10">
              <div className="flex gap-4 items-center mb-6">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <h4 className="text-lg font-black tracking-tight leading-tight">Instant Verification <br/>Active</h4>
              </div>
              <p className="text-emerald-200/60 text-xs font-medium leading-relaxed">Files will be scanned for malware and indexed using AI-OCR for instant searchability.</p>
           </div>
           <button className="mt-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/40 hover:bg-emerald-400 transition-colors">
              Commit Upload
           </button>
           <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-emerald-500/20 blur-[60px] rounded-full" />
        </div>
      </div>
    </div>
  );
}