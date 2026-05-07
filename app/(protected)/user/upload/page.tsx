"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import {
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { api } from "@/lib/api";

interface RackType {
  id: string;
  name?: string;
  code?: string;
  name_rack?: string;
}

interface BoxType {
  id: string;
  name?: string;
  code?: string;
  name_box?: string;
  rackId?: string;
}

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [loadingRacks, setLoadingRacks] = useState(true);
  const [loadingBoxes, setLoadingBoxes] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [rackId, setRackId] = useState("");
  const [boxId, setBoxId] = useState("");

  const [racks, setRacks] = useState<RackType[]>([]);
  const [boxes, setBoxes] = useState<BoxType[]>([]);

  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    try {
      setLoadingRacks(true);

      const response = await api.get("/racks");

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setRacks(data);
    } catch (error) {
      console.error("FETCH RACKS ERROR:", error);
    } finally {
      setLoadingRacks(false);
    }
  };

  const fetchBoxes = async (selectedRackId: string) => {
    try {
      setLoadingBoxes(true);

      const response = await api.get("/boxes");

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      const filteredBoxes = data.filter(
        (box: BoxType) => box.rackId === selectedRackId
      );

      setBoxes(filteredBoxes);
    } catch (error) {
      console.error("FETCH BOXES ERROR:", error);
    } finally {
      setLoadingBoxes(false);
    }
  };

  const handleRackChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedRackId = e.target.value;

    setRackId(selectedRackId);
    setBoxId("");
    setBoxes([]);

    if (selectedRackId) {
      await fetchBoxes(selectedRackId);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) return alert("Pilih file");
      if (!title) return alert("Title wajib diisi");
      if (!rackId) return alert("Pilih rack");
      if (!boxId) return alert("Pilih box");

      setIsUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("rackId", rackId);
      formData.append("boxId", boxId);

      await api.post("/documents/upload", formData);

      alert("Upload berhasil");

      setFile(null);
      setTitle("");
      setDescription("");
      setRackId("");
      setBoxId("");
      setBoxes([]);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("UPLOAD ERROR:", error);
      console.log("ERROR RESPONSE:", error?.response?.data);

      alert(error?.response?.data?.message || "Upload gagal");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
          Secure Ingestion
        </h2>

        <p className="text-slate-500 font-medium">
          Digitalize and archive your assets securely.
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center group hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 flex flex-col items-center">
          <div
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 mb-8 group-hover:rotate-12 transition-transform"
          >
            <UploadCloud size={32} />
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-2">
            Drag and drop files
          </h3>

          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            Support PDF, JPG, PNG up to 50MB
          </p>

          {file && (
            <p className="text-sm font-bold text-blue-600 break-all">
              {file.name}
            </p>
          )}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-6 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
          >
            Browse Documents
          </button>

          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-600" />
            Upload Properties
          </h4>

          <div className="space-y-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 rounded-2xl py-4 px-5 text-sm font-medium outline-none"
              placeholder="Document Title"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 rounded-2xl py-4 px-5 text-sm font-medium outline-none"
              placeholder="Description"
            />

            <select
              value={rackId}
              onChange={handleRackChange}
              className="w-full bg-slate-50 rounded-2xl py-4 px-5 text-sm font-medium outline-none"
            >
              <option value="">
                {loadingRacks ? "Loading racks..." : "Choose Rack"}
              </option>

              {racks.map((rack) => (
                <option key={rack.id} value={rack.id}>
                  {rack.name ||
                    rack.name_rack ||
                    rack.code ||
                    "Unnamed Rack"}
                </option>
              ))}
            </select>

            <select
              value={boxId}
              onChange={(e) => setBoxId(e.target.value)}
              disabled={!rackId}
              className="w-full bg-slate-50 rounded-2xl py-4 px-5 text-sm font-medium outline-none disabled:opacity-50"
            >
              <option value="">
                {loadingBoxes
                  ? "Loading boxes..."
                  : !rackId
                    ? "Choose rack first"
                    : "Choose Box"}
              </option>

              {boxes.map((box) => (
                <option key={box.id} value={box.id}>
                  {box.name ||
                    box.name_box ||
                    box.code ||
                    "Unnamed Box"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex gap-4 items-center mb-6">
              <CheckCircle2 size={24} className="text-emerald-400" />

              <h4 className="text-lg font-black">
                Instant Verification Active
              </h4>
            </div>

            <p className="text-emerald-200/60 text-xs">
              Files will be scanned and securely archived.
            </p>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-8 py-4 bg-emerald-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              "Commit Upload"
            )}
          </button>

          <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-emerald-500/20 blur-[60px] rounded-full" />
        </div>
      </div>
    </div>
  );
}