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
  fileUrl: string;
  id: string;
  title: string;
  status: string;
  createdAt: string;
  fileSize: number;
}

const IMAGE_EXTS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
];

function getFileExt(url: string): string {
  return url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}

function isImage(url: string): boolean {
  return IMAGE_EXTS.includes(getFileExt(url));
}

function getPreviewUrl(fileUrl: string): string {
  if (isImage(fileUrl)) return fileUrl;

  return `https://docs.google.com/viewer?url=${encodeURIComponent(
    fileUrl
  )}&embedded=true`;
}

export default function ExplorerPage() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<DocumentType | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      setLoading(true);

      const res = await api.get("/documents");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setDocuments(data);
    } catch (error) {
      console.error("Fetch documents error:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <div className="space-y-8 p-4 lg:p-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          <div>
            <p className="text-cyan-500 text-xs font-black uppercase tracking-[0.25em]">
              Digital Archive
            </p>

            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              Archive Explorer
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Explore and preview your digital archive documents.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">

            {/* SEARCH */}
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search document..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[260px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none text-slate-800 dark:text-white focus:ring-4 focus:ring-cyan-500/10"
              />
            </div>

            {/* VIEW */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl">
              <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-500">
                <List size={18} />
              </button>

              <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all">
                <Grid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">

          {/* TOPBAR */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">

            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              {filteredDocuments.length} Documents
            </p>

            <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-cyan-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
              <Filter size={16} />
              Filter
            </button>
          </div>

          {/* CONTENT */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 gap-4">
                <Loader2
                  className="animate-spin text-cyan-500"
                  size={42}
                />

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Loading Archive...
                </p>
              </div>
            ) : (
              <table className="w-full">

                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">

                    <th className="px-8 py-5 text-left">
                      Document
                    </th>

                    <th className="px-6 py-5 text-left">
                      Date
                    </th>

                    <th className="px-6 py-5 text-left">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {filteredDocuments.map((doc) => (
                    <motion.tr
                      key={doc.id}
                      className="cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900/70"
                      onClick={() => setPreviewDoc(doc)}
                    >

                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center text-cyan-500">
                            <FileText size={18} />
                          </div>

                          <div>
                            <p className="font-bold text-slate-800 dark:text-white text-sm">
                              {doc.title}
                            </p>

                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
                              {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black ${
                            doc.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : doc.status === "pending"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-rose-500/10 text-rose-500"
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

        {/* MODAL */}
        <AnimatePresence>
          {previewDoc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewDoc(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-col"
              >

                {/* MODAL HEADER */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                      <FileText size={18} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        {previewDoc.title}
                      </h2>

                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                        {getFileExt(previewDoc.fileUrl)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* PREVIEW */}
                <div className="flex-1 bg-slate-100 dark:bg-slate-900 overflow-auto flex items-center justify-center">

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
    </div>
  );
}