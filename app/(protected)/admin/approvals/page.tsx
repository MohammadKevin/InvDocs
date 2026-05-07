"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { toast } from "sonner";

import { api } from "@/lib/api";

interface BoxItem {
  id: string;
  name?: string;
  name_box?: string;
  code_box?: string;
}

export default function UploadDocumentPage() {
  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [selectedBoxId, setSelectedBoxId] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [boxes, setBoxes] = useState<
    BoxItem[]
  >([]);

  const [fetchLoading, setFetchLoading] =
    useState(true);

  useEffect(() => {
    fetchBoxes();
  }, []);

  const fetchBoxes = async () => {
    try {
      setFetchLoading(true);

      const res = await api.get(
        "/boxes",
      );

      const data = Array.isArray(
        res.data,
      )
        ? res.data
        : res.data?.data || [];

      setBoxes(data);
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data
          ?.message ||
          "Failed fetch boxes",
      );
    } finally {
      setFetchLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      if (!title) {
        toast.error(
          "Title is required",
        );

        return;
      }

      if (!selectedBoxId) {
        toast.error(
          "Select storage box",
        );

        return;
      }

      if (!selectedFile) {
        toast.error(
          "Select file first",
        );

        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile,
      );

      formData.append(
        "title",
        title,
      );

      formData.append(
        "description",
        description,
      );

      formData.append(
        "boxId",
        selectedBoxId,
      );

      const response = await api.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        },
      );

      console.log(response.data);

      toast.success(
        "Document uploaded successfully",
      );

      setTitle("");

      setDescription("");

      setSelectedBoxId("");

      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data
          ?.message ||
          "Upload failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
            Upload Document
          </h1>

          <p className="text-slate-500 mt-2 font-medium">
            Upload archive files securely to your storage rack.
          </p>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wide text-slate-700">
              Document Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value,
                )
              }
              placeholder="Input document title"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wide text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              placeholder="Input document description"
              rows={5}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 font-semibold resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wide text-slate-700">
              Select Storage Box
            </label>

            {fetchLoading ? (
              <div className="flex items-center gap-3 py-4 text-slate-500 font-bold">
                <Loader2 className="animate-spin w-5 h-5" />
                Loading boxes...
              </div>
            ) : (
              <select
                value={selectedBoxId}
                onChange={(e) =>
                  setSelectedBoxId(
                    e.target.value,
                  )
                }
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 font-semibold bg-white"
              >
                <option value="">
                  Select box
                </option>

                {boxes.map((box) => (
                  <option
                    key={box.id}
                    value={box.id}
                  >
                    {box.name_box ||
                      box.name ||
                      box.code_box}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wide text-slate-700">
              Upload File
            </label>

            <label className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-300 rounded-[2rem] p-10 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
              <Upload className="w-12 h-12 text-slate-400" />

              <div className="text-center">
                <p className="font-black text-slate-700 text-lg">
                  Click to upload file
                </p>

                <p className="text-slate-500 text-sm mt-1 font-medium">
                  PDF, JPG, PNG up to 5MB
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) =>
                  setSelectedFile(
                    e.target
                      .files?.[0] || null,
                  )
                }
              />
            </label>

            {selectedFile && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />

                <div>
                  <p className="font-black text-emerald-700">
                    {selectedFile.name}
                  </p>

                  <p className="text-xs text-emerald-600 font-semibold">
                    {(
                      selectedFile.size /
                      1024 /
                      1024
                    ).toFixed(2)}
                    MB
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />

            <div>
              <h3 className="font-black text-amber-700">
                Upload Information
              </h3>

              <p className="text-sm text-amber-600 mt-1 font-medium leading-relaxed">
                Files are stored temporarily on Railway storage.
                Avoid redeploying the backend frequently because uploaded files may be removed automatically.
              </p>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-wide hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Upload Document
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}