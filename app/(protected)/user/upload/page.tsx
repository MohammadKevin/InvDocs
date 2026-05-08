"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Loader2,
  Building2,
  Server,
  Archive,
  CheckCircle2,
  ShieldCheck,
  FileText,
  X,
  ChevronRight,
} from "lucide-react";

import { api } from "@/lib/api";

interface Rack {
  id: string;
  name_rack: string;
  divisi: string;
}

interface Box {
  id: string;
  name_box: string;
  rackId: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [divisions, setDivisions] = useState<string[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [division, setDivision] = useState("");
  const [rackId, setRackId] = useState("");
  const [boxId, setBoxId] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInit();
  }, []);

  async function fetchInit() {
    try {
      const res = await api.get("/rack/divisi");
      const data = Array.isArray(res.data) ? res.data : [];
      const uniqueDiv = [...new Set(data.map((r: Rack) => r.divisi))];
      setDivisions(uniqueDiv as string[]);
      setRacks(data);
    } catch (err) {
      console.error("INIT ERROR", err);
    }
  }

  const filteredRacks = racks.filter((r) => r.divisi === division);

  async function handleRackChange(id: string) {
    setRackId(id);
    setBoxId("");
    try {
      const res = await api.get("/boxes");
      const data = Array.isArray(res.data) ? res.data : [];
      setBoxes(data.filter((b: Box) => b.rackId === id));
    } catch (err) {
      setBoxes([]);
    }
  }

  async function handleUpload() {
    if (!file || !title || !boxId) return alert("Please complete all required fields");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("boxId", boxId);
      await api.post("/documents/upload", formData);
      alert("Upload Successful");
      // Reset logic...
      setFile(null); setTitle(""); setDescription(""); setDivision(""); setRackId(""); setBoxId("");
    } catch (err) {
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Archive Manager <span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Securely index and store physical documents into the digital cloud.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-semibold text-slate-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Online
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* MAIN FORM AREA */}
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 1: FILE PICKER */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative group border-2 border-dashed rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center
                ${file ? "border-blue-500 bg-blue-50/30" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"}`}
            >
              <input
                type="file" ref={fileInputRef} hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="empty" exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud size={32} />
                    </div>
                    <p className="text-lg font-bold text-slate-700">Drop your document here</p>
                    <p className="text-slate-400 text-sm">PDF, DOCX, or Images up to 20MB</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="selected" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 w-full bg-white p-4 rounded-2xl shadow-sm border border-blue-100"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shrink-0">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-bold text-slate-800 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500 uppercase">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => setFile(null)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                      <X size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* STEP 2: METADATA */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Document Title</label>
                <input
                  placeholder="e.g. Invoice_2024_001"
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Storage Division</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-blue-100 outline-none shadow-sm"
                    value={division} onChange={(e) => { setDivision(e.target.value); setRackId(""); setBoxId(""); }}
                  >
                    <option value="">Select Division</option>
                    {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Target Rack</label>
                <div className="relative">
                  <Server size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    disabled={!division}
                    className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-2xl appearance-none disabled:bg-slate-50 disabled:text-slate-400 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm"
                    value={rackId} onChange={(e) => handleRackChange(e.target.value)}
                  >
                    <option value="">Select Rack</option>
                    {filteredRacks.map((r) => <option key={r.id} value={r.id}>{r.name_rack}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Final Box Location</label>
                <div className="relative">
                  <Archive size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    disabled={!rackId}
                    className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-2xl appearance-none disabled:bg-slate-50 disabled:text-slate-400 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm"
                    value={boxId} onChange={(e) => setBoxId(e.target.value)}
                  >
                    <option value="">Select Box</option>
                    {boxes.map((b) => <option key={b.id} value={b.id}>{b.name_box}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Notes</label>
              <textarea
                placeholder="Additional details about this document..."
                rows={3}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none shadow-sm transition-all"
                value={description} onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* SIDEBAR SUMMARY AREA */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 blur-[80px]" />

              <div className="relative space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="font-bold">Upload Summary</h2>
                    <p className="text-xs text-slate-400">Review before finalizing</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <SummaryItem label="Division" value={division || "Not Selected"} active={!!division} />
                  <ChevronRight size={14} className="text-slate-700 mx-auto" />
                  <SummaryItem label="Rack" value={racks.find(r => r.id === rackId)?.name_rack || "Not Selected"} active={!!rackId} />
                  <ChevronRight size={14} className="text-slate-700 mx-auto" />
                  <SummaryItem label="Box" value={boxes.find(b => b.id === boxId)?.name_box || "Not Selected"} active={!!boxId} />
                </div>

                <button
                  onClick={handleUpload}
                  disabled={loading || !boxId || !file}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3
                    ${loading || !boxId || !file
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-95"}`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>Push Archive</span>
                      <CheckCircle2 size={20} />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-500 uppercase tracking-[0.2em] font-bold">
                  Encryption v4.2 Active
                </p>
              </div>
            </div>

            {/* QUICK TIPS */}
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
              <h4 className="text-blue-800 font-bold text-sm mb-2">Pro Tip</h4>
              <p className="text-blue-600/80 text-xs leading-relaxed">
                Ensure the document is clearly scanned. The system automatically performs OCR once the box location is verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${active ? "bg-slate-800/50 border-blue-500/30" : "bg-transparent border-slate-800"}`}>
      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">{label}</p>
      <p className={`font-semibold truncate ${active ? "text-white" : "text-slate-600 italic text-sm"}`}>{value}</p>
    </div>
  );
}