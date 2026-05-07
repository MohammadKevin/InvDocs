"use client";

import { useEffect, useMemo, useState } from "react";

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

  fileUrl?: string;

  status?: string;

  user?: {
    fullname?: string;

    fullName?: string;
  };

  box?: {
    name_box?: string;

    name?: string;
  };
}

const statusStyles: Record<
  string,
  string
> = {
  approved:
    "bg-emerald-50 text-emerald-600",

  pending:
    "bg-amber-50 text-amber-600",

  rejected:
    "bg-red-50 text-red-600",
};

function getStatusClass(
  status?: string,
) {
  return `
    inline-flex items-center gap-1.5
    px-3 py-1 rounded-full
    text-[10px] uppercase
    font-black tracking-wider
    ${
      statusStyles[
        status || "rejected"
      ]
    }
  `;
}

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

  async function fetchDocuments() {
    try {
      setLoading(true);

      const response =
        await api.get(
          "/documents",
        );

      const data =
        Array.isArray(
          response.data,
        )
          ? response.data
          : response.data?.data ||
            [];

      setDocuments(data);
    } catch (error: any) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to fetch documents",
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: string,
    action:
      | "approve"
      | "reject",
  ) {
    try {
      setActionLoading(id);

      await api.patch(
        `/documents/${id}/${action}`,
      );

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                status:
                  action ===
                  "approve"
                    ? "approved"
                    : "rejected",
              }
            : doc,
        ),
      );

      toast.success(
        `Document ${
          action === "approve"
            ? "approved"
            : "rejected"
        }`,
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data
          ?.message ||
          `${action} failed`,
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDownload(
    id: string,
    title?: string,
  ) {
    try {
      const token =
        localStorage.getItem(
          "token",
        );

      const response =
        await api.get(
          `/documents/${id}/download`,
          {
            responseType:
              "blob",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

      const blob =
        new Blob([
          response.data,
        ]);

      const url =
        window.URL.createObjectURL(
          blob,
        );

      const link =
        document.createElement(
          "a",
        );

      link.href = url;

      link.download =
        title || "document";

      document.body.appendChild(
        link,
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url,
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Download failed",
      );
    }
  }

  const filteredDocuments =
    useMemo(() => {
      return documents.filter(
        (doc) => {
          const search =
            searchTerm.toLowerCase();

          const title = (
            doc.title || ""
          ).toLowerCase();

          const uploader =
            (
              doc.user
                ?.fullname ||
              doc.user
                ?.fullName ||
              ""
            ).toLowerCase();

          return (
            title.includes(
              search,
            ) ||
            uploader.includes(
              search,
            )
          );
        },
      );
    }, [
      documents,
      searchTerm,
    ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900">
            Document Approvals
          </h1>

          <p className="text-slate-500 font-medium">
            Review and verify
            incoming documents
            for your rack.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
              className="w-64 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[20px] text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <button className="p-3 bg-white border border-slate-200 rounded-[18px] text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : filteredDocuments.length ===
          0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText
              className="mb-4 text-slate-200"
              size={50}
            />

            <h3 className="text-lg font-black text-slate-700">
              No Documents Found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              There are currently
              no uploaded
              documents.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto text-sm font-bold">
            <table className="w-full text-left">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400 font-black">
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
                    const isLoading =
                      actionLoading ===
                      doc.id;

                    const hasFile =
                      !!doc.fileUrl;

                    return (
                      <motion.tr
                        key={doc.id}
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="transition-colors hover:bg-slate-50/50"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <FileText
                              size={18}
                              className="text-slate-300"
                            />

                            <span className="not-italic text-slate-800">
                              {doc.title ||
                                "Untitled"}
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-5 font-medium text-slate-500">
                          {doc.user
                            ?.fullname ||
                            doc.user
                              ?.fullName ||
                            "Unknown User"}
                        </td>

                        <td className="px-8 py-5">
                          <span className="px-2 py-1 text-[10px] uppercase rounded-md font-black bg-blue-50 text-blue-600">
                            {doc.box
                              ?.name_box ||
                              doc.box
                                ?.name ||
                              "No Box"}
                          </span>
                        </td>

                        <td className="px-8 py-5">
                          <div
                            className={getStatusClass(
                              doc.status,
                            )}
                          >
                            {doc.status ||
                              "pending"}
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <div className="flex justify-center gap-2">
                            <button
                              disabled={
                                isLoading ||
                                doc.status ===
                                  "approved"
                              }
                              onClick={() =>
                                updateStatus(
                                  doc.id,
                                  "approve",
                                )
                              }
                              className="p-2.5 bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                            >
                              {isLoading ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Check size={16} />
                              )}
                            </button>

                            <button
                              disabled={
                                isLoading ||
                                doc.status ===
                                  "rejected"
                              }
                              onClick={() =>
                                updateStatus(
                                  doc.id,
                                  "reject",
                                )
                              }
                              className="p-2.5 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                            >
                              <X size={16} />
                            </button>

                            <button
                              disabled={
                                !hasFile
                              }
                              onClick={() =>
                                handleDownload(
                                  doc.id,
                                  doc.title,
                                )
                              }
                              className={`p-2.5 rounded-xl transition-all active:scale-95 ${
                                hasFile
                                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  : "bg-slate-100 text-slate-300 opacity-50 cursor-not-allowed"
                              }`}
                            >
                              <Download
                                size={16}
                              />
                            </button>
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