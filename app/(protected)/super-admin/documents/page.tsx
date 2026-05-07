"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  HardDrive,
  User,
  Filter,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface DocumentItem {
  id: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  fileUrl?: string;
  box?: {
    name?: string;
    code?: string;
    name_box?: string;
  };
  user?: {
    name?: string;
    fullname?: string;
    fullName?: string;
  };
  createdAt: string;
}

const statusConfig = {
  approved: {
    class: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle2,
  },
  pending: {
    class: "bg-amber-50 text-amber-600",
    icon: Clock,
  },
  rejected: {
    class: "bg-red-50 text-red-600",
    icon: XCircle,
  },
};

function openFile(fileUrl: string): void {
  window.open(fileUrl, "_blank", "noopener,noreferrer");
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get("/documents");
      const data: DocumentItem[] = Array.isArray(response.data)
        ? response.data
        : response.data?.data ?? [];
      setDocuments(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch documents";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: string,
    action: "approve" | "reject"
  ): Promise<void> {
    try {
      setActionLoading(id);
      await api.patch(`/documents/${id}/${action}`);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                status: action === "approve" ? "approved" : "rejected",
              }
            : doc
        )
      );
      toast.success(
        `Document ${action === "approve" ? "approved" : "rejected"}`
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : `${action} failed`;
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  }

  const filteredDocuments = useMemo<DocumentItem[]>(() => {
    const search = searchTerm.toLowerCase();
    return documents.filter((doc) => {
      const title = doc.title.toLowerCase();
      const uploader = (
        doc.user?.fullname ?? doc.user?.fullName ?? doc.user?.name ?? ""
      ).toLowerCase();
      return title.includes(search) || uploader.includes(search);
    });
  }, [documents, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase italic text-slate-900">
            <HardDrive className="text-blue-600" size={32} />
            Master Repository
          </h1>
          <p className="mt-1 pl-1 text-sm italic font-medium text-slate-500">
            Auditing {documents.length} digital assets across all rack clusters.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative min-w-[300px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-sm font-bold transition-all bg-white border border-slate-200 rounded-[20px] shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <button className="p-3 transition-all bg-white border border-slate-200 rounded-[18px] text-slate-600 hover:bg-slate-50">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-slate-200 shadow-sm rounded-[2.5rem]">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-[10px] font-black tracking-[0.3em] uppercase animate-pulse text-slate-400">
                Accessing Encrypted Records...
              </p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <FileText size={50} className="mb-4 text-slate-200" />
              <h3 className="text-lg font-black text-slate-700">
                No Documents Found
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                There are currently no uploaded documents.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black tracking-widest uppercase text-slate-400">
                <tr>
                  <th className="px-8 py-6">Asset Title</th>
                  <th className="px-8 py-6">Placement</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Uploader</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="font-bold divide-y divide-slate-100 text-slate-700">
                <AnimatePresence>
                  {filteredDocuments.map((doc, index) => {
                    const status =
                      statusConfig[doc.status] ?? statusConfig.pending;
                    const StatusIcon = status.icon;
                    const isActioning = actionLoading === doc.id;
                    const hasFile = Boolean(doc.fileUrl);

                    return (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="transition-colors group hover:bg-slate-50/50"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 transition-colors rounded-lg bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="mb-1 leading-none text-slate-900">
                                {doc.title}
                              </p>
                              <p className="text-[10px] uppercase tracking-tighter text-slate-400">
                                {new Date(doc.createdAt).toLocaleDateString(
                                  "id-ID"
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-[10px] uppercase rounded-md bg-blue-50 text-blue-600">
                              {doc.box?.code ?? "UNBOXED"}
                            </span>
                            <span className="text-xs italic text-slate-400">
                              {doc.box?.name ?? doc.box?.name_box}
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <div
                            className={[
                              "inline-flex items-center gap-1.5 px-3 py-1",
                              "rounded-full text-[10px] uppercase tracking-wider font-black",
                              status.class,
                            ].join(" ")}
                          >
                            <StatusIcon size={12} />
                            {doc.status}
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-500">
                            <User size={14} className="text-slate-300" />
                            <span className="text-xs">
                              {doc.user?.fullname ??
                                doc.user?.fullName ??
                                doc.user?.name ??
                                "Unknown"}
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              disabled={
                                isActioning || doc.status === "approved"
                              }
                              onClick={() => updateStatus(doc.id, "approve")}
                              className="p-2.5 text-white transition-all shadow-lg bg-slate-900 rounded-xl hover:bg-slate-800 shadow-slate-200 disabled:opacity-50"
                            >
                              {isActioning ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Check size={18} />
                              )}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              disabled={
                                isActioning || doc.status === "rejected"
                              }
                              onClick={() => updateStatus(doc.id, "reject")}
                              className="p-2.5 text-red-500 transition-all bg-white border border-slate-200 rounded-xl hover:bg-red-50 disabled:opacity-50"
                            >
                              <X size={18} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              disabled={!hasFile}
                              onClick={() =>
                                doc.fileUrl && openFile(doc.fileUrl)
                              }
                              className={[
                                "p-2.5 transition-all rounded-xl shadow-lg",
                                hasFile
                                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                                  : "bg-slate-100 text-slate-300 cursor-not-allowed opacity-50",
                              ].join(" ")}
                            >
                              <Download size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}