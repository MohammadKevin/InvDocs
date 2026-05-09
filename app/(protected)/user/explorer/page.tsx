"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Grid,
  List,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { api } from "@/lib/api";

interface DocumentType {
  fileUrl: any;
  id: string;
  title: string;
  status: string;
  createdAt: string;
  fileSize: number;
}

// ─── Helper Preview ───────────────────────────────────────────
const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];

function getFileExt(url: string): string {
  return url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}

function isImage(url: string): boolean {
  return IMAGE_EXTS.includes(getFileExt(url));
}

function getPreviewUrl(fileUrl: string): string {
  if (isImage(fileUrl)) return fileUrl;
  return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
}
// ──────────────────────────────────────────────────────────────

export default function ExplorerPage() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<DocumentType | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/documents");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setDocuments(data);
    } catch (error) {
      console.error("Fetch documents error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Archive Explorer
        </h2>

        <div className="flex gap-3">
          <div className="flex bg-white border border-slate-100 p-1 rounded-2xl shadow-sm">
            <button className="p-2 bg-slate-50 text-blue-600 rounded-xl">
              <List size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm shadow-slate-100/50">
        <div className="p-6 border-b border-slate-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Filter by name, date, or status..."
              className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                <tr>
                  <th className="px-8 py-4 text-left">Document Info</th>
                  <th className="px-6 py-4 text-left">Upload Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {documents.map((doc) => (
                  <motion.tr
                    whileHover={{ backgroundColor: "#F8FAFC" }}
                    key={doc.id}
                    className="group transition-colors cursor-pointer"
                    onClick={() => setPreviewDoc(doc)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold border border-blue-100 group-hover:scale-110 transition-transform">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{doc.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          doc.status === "approved"
                            ? "bg-emerald-50 text-emerald-600"
                            : doc.status === "pending"
                            ? "bg-amber-50 text-amber-500"
                            : "bg-rose-50 text-rose-500"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-blue-600" />
                  <h2 className="font-bold truncate max-w-sm">{previewDoc.title}</h2>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Preview area */}
              <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-auto">
                {isImage(previewDoc.fileUrl) ? (
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    className="max-w-full max-h-full object-contain p-4"
                  />
                ) : (
                  <iframe
                    src={getPreviewUrl(previewDoc.fileUrl)}
                    className="w-full h-full border-none"
                    title="Document Preview"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}