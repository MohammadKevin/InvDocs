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

  // ======================
  // INIT DATA
  // ======================
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
      console.error("INIT ERROR", err);
      setRacks([]);
      setDivisions([]);
    }
  }

  // ======================
  // FILTER RACK
  // ======================
  const filteredRacks = racks.filter((r) => r.divisi === division);

  // ======================
  // CHANGE RACK -> LOAD BOX
  // ======================
  async function handleRackChange(id: string) {
    setRackId(id);
    setBoxId("");

    try {
      const res = await api.get("/boxes");

      const data: Box[] = Array.isArray(res.data) ? res.data : [];

      setBoxes(data.filter((b) => b.rackId === id));
    } catch (err) {
      console.error("BOX ERROR", err);
      setBoxes([]);
    }
  }

  // ======================
  // UPLOAD FIXED (ANTI 400)
  // ======================
  async function handleUpload() {
    if (!file) return alert("File wajib diisi");
    if (!title) return alert("Title wajib diisi");
    if (!boxId) return alert("Box wajib dipilih");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file); // HARUS SAMA DI BACKEND
      formData.append("title", title);
      formData.append("description", description || "");
      formData.append("boxId", boxId);

      await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Upload Success 🎉");

      // RESET
      setFile(null);
      setTitle("");
      setDescription("");
      setDivision("");
      setRackId("");
      setBoxId("");
      setBoxes([]);
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold">Archive Manager</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT FORM */}
          <div className="lg:col-span-2 space-y-6">

            {/* FILE */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-dashed border-2 p-8 text-center rounded-2xl bg-white cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              {!file ? (
                <div>
                  <UploadCloud className="mx-auto" />
                  <p>Upload file</p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <FileText />
                  <span>{file.name}</span>
                  <button onClick={() => setFile(null)}>
                    <X />
                  </button>
                </div>
              )}
            </div>

            {/* TITLE */}
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />

            {/* DIVISION */}
            <select
              value={division}
              onChange={(e) => {
                setDivision(e.target.value);
                setRackId("");
                setBoxId("");
                setBoxes([]);
              }}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select Division</option>
              {divisions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* RACK */}
            <select
              value={rackId}
              onChange={(e) => handleRackChange(e.target.value)}
              className="w-full p-3 border rounded-xl"
              disabled={!division}
            >
              <option value="">Select Rack</option>
              {filteredRacks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name_rack}
                </option>
              ))}
            </select>

            {/* BOX */}
            <select
              value={boxId}
              onChange={(e) => setBoxId(e.target.value)}
              className="w-full p-3 border rounded-xl"
              disabled={!rackId}
            >
              <option value="">Select Box</option>
              {boxes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name_box}
                </option>
              ))}
            </select>

            {/* DESCRIPTION */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-xl"
              placeholder="Description"
            />

          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white p-6 rounded-2xl border space-y-4">

            <h2 className="font-bold">Summary</h2>

            <Summary label="Division" value={division} />
            <Summary label="Rack" value={racks.find(r => r.id === rackId)?.name_rack || "-"} />
            <Summary label="Box" value={boxes.find(b => b.id === boxId)?.name_box || "-"} />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-black text-white p-3 rounded-xl flex justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Upload"
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

// ======================
function Summary({ label, value }: any) {
  return (
    <div className="p-3 border rounded-xl">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}