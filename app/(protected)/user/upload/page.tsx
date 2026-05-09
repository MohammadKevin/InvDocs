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
  Info,
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
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInit();
  }, []);

  async function fetchInit() {
    try {
      const res = await api.get("/rack/divisi");
      const data: Rack[] = Array.isArray(res.data) ? res.data : [];
      setRacks(data);
      const uniqueDiv = [...new Set(data.map((r) => r.divisi))];
      setDivisions(uniqueDiv);
    } catch (err) {
      setRacks([]);
      setDivisions([]);
    }
  }

  const filteredRacks = racks.filter((r) => r.divisi === division);

  async function handleRackChange(id: string) {
    setRackId(id);
    setBoxId("");
    try {
      const res = await api.get("/boxes");
      const data: Box[] = Array.isArray(res.data) ? res.data : [];
      setBoxes(data.filter((b) => b.rackId === id));
    } catch (err) {
      setBoxes([]);
    }
  }

  async function handleUpload() {
    if (!file || !title || !boxId) return alert("Harap lengkapi semua data wajib");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description || "");
      formData.append("boxId", boxId);

      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Upload Success 🎉");
      setFile(null);
      setTitle("");
      setDescription("");
      setDivision("");
      setRackId("");
      setBoxId("");
      setBoxes([]);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* EXCLUSIVE HEADER */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-widest">
          <ShieldCheck size={16} />
          <span>Secure Digital Gateway</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Upload Resources
        </h1>
        <p className="text-slate-500 font-medium">Unggah dokumen digital Anda ke enkripsi awan CyanDrive.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
        
        {/* MAIN UPLOAD FORM */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* DRAG & DROP AREA */}
          <motion.div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              setFile(e.dataTransfer.files?.[0] || null);
            }}
            onClick={() => fileInputRef.current?.click()}
            animate={{ 
              borderColor: isDragging ? "#06b6d4" : "#e2e8f0",
              backgroundColor: isDragging ? "#ecfeff" : "#ffffff" 
            }}
            className="border-2 border-dashed rounded-[3rem] p-12 text-center cursor-pointer group transition-all relative overflow-hidden shadow-xl shadow-slate-200/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {!file ? (
              <div className="space-y-4">
                <div className="p-5 bg-cyan-50 text-cyan-500 rounded-3xl w-fit mx-auto group-hover:scale-110 transition-transform">
                  <UploadCloud size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Pilih berkas atau tarik ke sini</h3>
                  <p className="text-sm text-slate-400 font-medium">PDF, JPG, PNG atau DOCX (Maks. 5MB)</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-cyan-50 p-6 rounded-[2rem] border border-cyan-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white text-cyan-600 rounded-2xl shadow-sm">
                    <FileText size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">{file.name}</p>
                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="p-2 hover:bg-white hover:text-rose-500 rounded-full transition-all text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </motion.div>

          {/* FORM FIELDS */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Title</label>
              <input
                placeholder="Ex: Laporan Keuangan Q1..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all outline-none font-bold text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Division</label>
              <select
                value={division}
                onChange={(e) => {
                  setDivision(e.target.value);
                  setRackId("");
                  setBoxId("");
                  setBoxes([]);
                }}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none font-bold text-slate-700"
              >
                <option value="">Select Division</option>
                {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rack Location</label>
              <select
                value={rackId}
                onChange={(e) => handleRackChange(e.target.value)}
                disabled={!division}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none font-bold text-slate-700 disabled:bg-slate-50"
              >
                <option value="">Select Rack</option>
                {filteredRacks.map((r) => <option key={r.id} value={r.id}>{r.name_rack}</option>)}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Box Target</label>
              <select
                value={boxId}
                onChange={(e) => setBoxId(e.target.value)}
                disabled={!rackId}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none font-bold text-slate-700 disabled:bg-slate-50"
              >
                <option value="">Select Box</option>
                {boxes.map((b) => <option key={b.id} value={b.id}>{b.name_box}</option>)}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Notes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none font-bold text-slate-700"
                placeholder="Tambahkan catatan singkat tentang dokumen ini..."
              />
            </div>
          </div>
        </div>

        {/* SUMMARY PANEL */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <Info size={20} className="text-cyan-400" />
              Summary
            </h2>

            <div className="space-y-4">
              <SummaryItem label="Target Division" value={division} />
              <SummaryItem label="Rack Position" value={racks.find(r => r.id === rackId)?.name_rack} />
              <SummaryItem label="Box Container" value={boxes.find(b => b.id === boxId)?.name_box} />
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full mt-8 p-4 rounded-2xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-3 transition-all ${
                loading || !file 
                ? 'bg-slate-800 text-slate-600' 
                : 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg shadow-cyan-500/30'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Start Upload"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string, value?: string }) {
  return (
    <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold text-sm text-slate-200 truncate">{value || "Not Selected"}</p>
    </div>
  );
}