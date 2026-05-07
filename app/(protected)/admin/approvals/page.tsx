"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  Check,
  X,
  Download,
  Search,
  Filter,
  FileText,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { api } from "@/lib/api";

interface DocumentItem {
  id: string;

  title?: string;

  file_name?: string;

  fileUrl?: string;

  file_url?: string;

  user?: {
    fullname?: string;
    fullName?: string;
  };

  box?: {
    name_box?: string;
    name?: string;
  };

  createdAt?: string;

  status?: string;
}

const FILE_BASE_URL =
  "https://invdocs-api-production.up.railway.app";

export default function ApprovalsPage() {
  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/documents",
      );

      const data = Array.isArray(
        res.data,
      )
        ? res.data
        : res.data?.data || [];

      setDocuments(data);
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data
          ?.message ||
          "Failed fetch documents",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (
    id: string,
  ) => {
    try {
      setActionLoading(id);

      await api.patch(
        `/documents/${id}/approve`,
      );

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                status: "approved",
              }
            : doc,
        ),
      );

      toast.success(
        "Document approved",
      );
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data
          ?.message ||
          "Approve failed",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (
    id: string,
  ) => {
    try {
      setActionLoading(id);

      await api.patch(
        `/documents/${id}/reject`,
      );

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                status: "rejected",
              }
            : doc,
        ),
      );

      toast.success(
        "Document rejected",
      );
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data
          ?.message ||
          "Reject failed",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDocuments =
    documents.filter((doc) => {
      const title = (
        doc.title ||
        doc.file_name ||
        ""
      ).toLowerCase();

      const user = (
        doc.user?.fullname ||
        doc.user?.fullName ||
        ""
      ).toLowerCase();

      const search =
        searchTerm.toLowerCase();

      return (
        title.includes(search) ||
        user.includes(search)
      );
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Document Approvals
          </h1>

          <p className="text-slate-500 font-medium">
            Review and verify incoming
            documents for your rack.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value,
                )
              }
              placeholder="Search documents..."
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[20px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none w-64 transition-all"
            />
          </div>

          <button className="p-3 bg-white border border-slate-200 rounded-[18px] text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : filteredDocuments.length ===
          0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText
              size={50}
              className="text-slate-200 mb-4"
            />

            <h3 className="text-lg font-black text-slate-700">
              No Documents Found
            </h3>

            <p className="text-slate-400 text-sm mt-1">
              There are currently no
              uploaded documents.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto text-sm font-bold">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 font-black">
                <tr>
                  <th className="px-8 py-6">
                    Document Title
                  </th>

                  <th className="px-8 py-6">
                    Uploader
                  </th>

                  <th className="px-8 py-6">
                    Storage
                  </th>

                  <th className="px-8 py-6">
                    Status
                  </th>

                  <th className="px-8 py-6 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 italic">
                {filteredDocuments.map(
                  (doc) => {
                    const rawFile =
                      doc.fileUrl ||
                      doc.file_url ||
                      "";

                    const normalizedFile =
                      rawFile.startsWith(
                        "/uploads",
                      )
                        ? rawFile
                        : `/uploads/documents/${rawFile}`;

                    const downloadUrl =
                      rawFile
                        ? `${FILE_BASE_URL}${normalizedFile}`
                        : "#";

                    return (
                      <motion.tr
                        key={doc.id}
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <FileText
                              size={18}
                              className="text-slate-300"
                            />

                            <span className="text-slate-800 not-italic">
                              {doc.title ||
                                doc.file_name ||
                                "Untitled"}
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-5 text-slate-500 font-medium">
                          {doc.user
                            ?.fullname ||
                            doc.user
                              ?.fullName ||
                            "Unknown User"}
                        </td>

                        <td className="px-8 py-5">
                          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] uppercase font-black">
                            {doc.box
                              ?.name_box ||
                              doc.box
                                ?.name ||
                              "No Box"}
                          </span>
                        </td>

                        <td className="px-8 py-5">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider ${
                              doc.status ===
                              "approved"
                                ? "bg-emerald-50 text-emerald-600"
                                : doc.status ===
                                  "pending"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {doc.status ||
                              "pending"}
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <div className="flex justify-center gap-2">
                            <button
                              disabled={
                                actionLoading ===
                                  doc.id ||
                                doc.status ===
                                  "approved"
                              }
                              onClick={() =>
                                handleApprove(
                                  doc.id,
                                )
                              }
                              className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                              {actionLoading ===
                              doc.id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Check
                                  size={16}
                                />
                              )}
                            </button>

                            <button
                              disabled={
                                actionLoading ===
                                  doc.id ||
                                doc.status ===
                                  "rejected"
                              }
                              onClick={() =>
                                handleReject(
                                  doc.id,
                                )
                              }
                              className="p-2.5 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                            >
                              <X size={16} />
                            </button>

                            <a
                              href={
                                downloadUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-2.5 rounded-xl transition-all active:scale-95 ${
                                downloadUrl ===
                                "#"
                                  ? "bg-slate-100 text-slate-300 pointer-events-none"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              <Download
                                size={16}
                              />
                            </a>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}