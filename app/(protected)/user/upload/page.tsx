"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

import {
  UploadCloud,
  Loader2,
  ShieldCheck,
  FileText,
  X,
  Info,
} from "lucide-react";

import { api } from "@/lib/api";

interface Rack {
  id: string;
  kode_rack: string;
  divisi: string;
}

interface Box {
  id: string;
  kode_box: string;
  rackId: string;
}

export default function UploadPage() {
  const [file, setFile] =
    useState<File | null>(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [divisions, setDivisions] =
    useState<string[]>([]);

  const [racks, setRacks] = useState<
    Rack[]
  >([]);

  const [boxes, setBoxes] = useState<
    Box[]
  >([]);

  const [division, setDivision] =
    useState("");

  const [rackId, setRackId] =
    useState("");

  const [boxId, setBoxId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInit();
  }, []);

  async function fetchInit() {
    try {
      const res =
        await api.get("/rack/divisi");

      const data: Rack[] =
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

      setRacks(data);

      const uniqueDiv = [
        ...new Set(
          data.map((r) => r.divisi)
        ),
      ];

      setDivisions(uniqueDiv);
    } catch (err) {
      setRacks([]);
      setDivisions([]);
    }
  }

  const filteredRacks =
    racks.filter(
      (r) => r.divisi === division
    );

  async function handleRackChange(
    id: string
  ) {
    setRackId(id);

    setBoxId("");

    try {
      const res =
        await api.get("/boxes");

      const data: Box[] =
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

      setBoxes(
        data.filter(
          (b) => b.rackId === id
        )
      );
    } catch (err) {
      setBoxes([]);
    }
  }

  async function handleUpload() {
    if (!file || !title || !boxId) {
      return alert(
        "Harap lengkapi semua data wajib"
      );
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "title",
        title
      );

      formData.append(
        "description",
        description || ""
      );

      formData.append(
        "boxId",
        boxId
      );

      await api.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Upload Success 🎉");

      setFile(null);

      setTitle("");

      setDescription("");

      setDivision("");

      setRackId("");

      setBoxId("");

      setBoxes([]);
    } catch (err: any) {
      alert(
        err?.response?.data
          ?.message ||
          "Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* HEADER */}
        <header className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={16} />
              <span>
                Secure Digital Gateway
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight">
              Upload Resources
            </h1>

            <p className="font-medium text-slate-500 dark:text-slate-400">
              Upload dokumen digital
              dengan sistem modern
              cloud archive.
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* MAIN FORM */}
          <div className="lg:col-span-2 space-y-8">
            {/* DRAG AREA */}
            <motion.div
              onDragOver={(e) => {
                e.preventDefault();

                setIsDragging(
                  true
                );
              }}
              onDragLeave={() =>
                setIsDragging(false)
              }
              onDrop={(e) => {
                e.preventDefault();

                setIsDragging(
                  false
                );

                setFile(
                  e.dataTransfer
                    .files?.[0] ||
                    null
                );
              }}
              onClick={() =>
                fileInputRef.current?.click()
              }
              animate={{
                borderColor:
                  isDragging
                    ? "#06b6d4"
                    : "#334155",
              }}
              className="
                border-2 border-dashed
                rounded-[3rem]
                p-12
                text-center
                cursor-pointer
                transition-all
                overflow-hidden
                bg-white
                shadow-xl shadow-slate-200/50
                dark:bg-slate-900
                dark:border-slate-700
                dark:shadow-none
              "
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(e) =>
                  setFile(
                    e.target
                      .files?.[0] ||
                      null
                  )
                }
              />

              {!file ? (
                <div className="space-y-4">
                  <div className="p-5 bg-cyan-500/10 text-cyan-500 rounded-3xl w-fit mx-auto">
                    <UploadCloud
                      size={40}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      Pilih file atau
                      tarik ke sini
                    </h3>

                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      PDF, JPG, PNG,
                      DOCX (Max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="
                    flex items-center justify-between
                    p-6 rounded-[2rem]
                    border
                    bg-cyan-50 border-cyan-100
                    dark:bg-slate-800
                    dark:border-slate-700
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-700">
                      <FileText
                        size={24}
                        className="text-cyan-500"
                      />
                    </div>

                    <div className="text-left">
                      <p className="font-bold truncate max-w-[220px] md:max-w-md">
                        {file.name}
                      </p>

                      <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">
                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(
                      e
                    ) => {
                      e.stopPropagation();

                      setFile(
                        null
                      );
                    }}
                    className="
                      p-2 rounded-full
                      transition-all
                      text-slate-400
                      hover:text-rose-500
                    "
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </motion.div>

            {/* FORM */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Document Title"
                value={title}
                onChange={setTitle}
                placeholder="Ex: Financial Report Q1..."
                className="md:col-span-2"
              />

              {/* DIVISION */}
              <SelectField
                label="Division"
                value={division}
                onChange={(
                  value: string
                ) => {
                  setDivision(
                    value
                  );

                  setRackId("");

                  setBoxId("");

                  setBoxes([]);
                }}
                options={divisions.map(
                  (d) => ({
                    label: d,
                    value: d,
                  })
                )}
              />

              {/* RACK */}
              <SelectField
                label="Rack"
                value={rackId}
                onChange={
                  handleRackChange
                }
                disabled={!division}
                options={filteredRacks.map(
                  (r) => ({
                    label:
                      r.kode_rack,
                    value: r.id,
                  })
                )}
              />

              {/* BOX */}
              <SelectField
                label="Box"
                value={boxId}
                onChange={
                  setBoxId
                }
                disabled={!rackId}
                className="md:col-span-2"
                options={boxes.map(
                  (b) => ({
                    label:
                      b.kode_box,
                    value: b.id,
                  })
                )}
              />

              {/* DESCRIPTION */}
              <div className="space-y-2 md:col-span-2">
                <label
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-widest
                    ml-1
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  Additional Notes
                </label>

                <textarea
                  rows={4}
                  value={
                    description
                  }
                  onChange={(
                    e
                  ) =>
                    setDescription(
                      e.target
                        .value
                    )
                  }
                  placeholder="Tambahkan catatan..."
                  className="
                    w-full
                    p-4
                    rounded-2xl
                    outline-none
                    transition-all
                    font-bold
                    bg-white
                    border border-slate-200
                    text-slate-700
                    dark:bg-slate-900
                    dark:border-slate-700
                    dark:text-white
                  "
                />
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div
              className="
                rounded-[2.5rem]
                p-8
                relative
                overflow-hidden
                bg-white
                border border-slate-200
                dark:bg-slate-900
                dark:border-slate-800
              "
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />

              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Info
                  size={20}
                  className="text-cyan-400"
                />
                Summary
              </h2>

              <div className="space-y-4">
                <SummaryItem
                  label="Target Division"
                  value={
                    division
                  }
                />

                <SummaryItem
                  label="Rack Position"
                  value={
                    racks.find(
                      (
                        r
                      ) =>
                        r.id ===
                        rackId
                    )
                      ?.kode_rack
                  }
                />

                <SummaryItem
                  label="Box Container"
                  value={
                    boxes.find(
                      (
                        b
                      ) =>
                        b.id ===
                        boxId
                    )
                      ?.kode_box
                  }
                />
              </div>

              <button
                onClick={
                  handleUpload
                }
                disabled={
                  loading ||
                  !file
                }
                className={`
                  w-full mt-8 p-4 rounded-2xl
                  font-black uppercase tracking-widest text-xs
                  flex justify-center items-center gap-3 transition-all
                  ${
                    loading ||
                    !file
                      ? "bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                      : "bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg shadow-cyan-500/30"
                  }
                `}
              >
                {loading ? (
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                ) : (
                  "Start Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* INPUT FIELD */
function InputField({
  label,
  value,
  onChange,
  placeholder,
  className,
}: any) {
  return (
    <div
      className={`space-y-2 ${
        className || ""
      }`}
    >
      <label
        className="
          text-[10px]
          font-black
          uppercase
          tracking-widest
          ml-1
          text-slate-400
          dark:text-slate-500
        "
      >
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="
          w-full
          p-4
          rounded-2xl
          outline-none
          transition-all
          font-bold
          bg-white
          border border-slate-200
          text-slate-700
          dark:bg-slate-900
          dark:border-slate-700
          dark:text-white
        "
      />
    </div>
  );
}

/* SELECT FIELD */
function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
  className,
}: any) {
  return (
    <div
      className={`space-y-2 ${
        className || ""
      }`}
    >
      <label
        className="
          text-[10px]
          font-black
          uppercase
          tracking-widest
          ml-1
          text-slate-400
          dark:text-slate-500
        "
      >
        {label}
      </label>

      <select
        value={value}
        disabled={
          disabled
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="
          w-full
          p-4
          rounded-2xl
          outline-none
          transition-all
          font-bold
          bg-white
          border border-slate-200
          text-slate-700
          dark:bg-slate-900
          dark:border-slate-700
          dark:text-white
          disabled:opacity-50
        "
      >
        <option value="">
          Select {label}
        </option>

        {options.map(
          (opt: any) => (
            <option
              key={
                opt.value
              }
              value={
                opt.value
              }
            >
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

/* SUMMARY ITEM */
function SummaryItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div
      className="
        p-4
        rounded-2xl
        border
        bg-slate-100
        border-slate-200
        dark:bg-slate-800
        dark:border-slate-700
      "
    >
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
        {label}
      </p>

      <p className="font-bold text-sm text-slate-700 dark:text-slate-200 truncate">
        {value ||
          "Not Selected"}
      </p>
    </div>
  );
}