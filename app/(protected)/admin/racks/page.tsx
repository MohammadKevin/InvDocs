"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  ShieldCheck,
  Settings,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { api } from "@/lib/api";

interface Rack {
  id: string;
  name_rack: string;
  createdAt?: string;
}

const RACK_ID =
  "0012856e-af9f-487e-b3d1-7b14607de404";

export default function RackProfilePage() {
  const [rack, setRack] = useState<Rack | null>(null);

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [nameRack, setNameRack] = useState("");

  // =======================
  // FETCH RACK
  // =======================
  useEffect(() => {
    const fetchRack = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/rack/${RACK_ID}`
        );

        console.log("RACK DATA:", res.data);

        setRack(res.data);

        setNameRack(res.data?.name_rack || "");
      } catch (err: any) {
        console.error(
          "Failed fetch rack:",
          err
        );

        toast.error(
          err?.response?.data?.message ||
            "Failed fetch rack"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRack();
  }, []);

  // =======================
  // UPDATE RACK
  // =======================
  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!rack?.id) {
      toast.error("Rack ID not found");
      return;
    }

    if (!nameRack.trim()) {
      toast.error("Rack name wajib diisi");
      return;
    }

    try {
      setUpdating(true);

      const response = await api.patch(
        `/rack/${rack.id}`,
        {
          name_rack: nameRack.trim(),
        }
      );

      console.log(
        "UPDATE RESPONSE:",
        response.data
      );

      setRack((prev) =>
        prev
          ? {
              ...prev,
              name_rack: nameRack,
            }
          : null
      );

      toast.success(
        "Rack updated successfully"
      );
    } catch (err: any) {
      console.error(
        "Update rack failed:",
        err
      );

      console.log(
        "BACKEND ERROR:",
        err?.response?.data
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed update rack"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =======================
  // LOADING
  // =======================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
          Rack Configuration
        </h1>

        <p className="text-slate-500 font-medium pl-1">
          Personalize your assigned storage
          identity.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT CARD */}
        <div className="md:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner shadow-blue-100">
            <ShieldCheck size={40} />
          </div>

          <h2 className="text-2xl font-black text-slate-900 leading-none mb-2 tracking-tighter">
            {rack?.name_rack ||
              "Unnamed Rack"}
          </h2>

          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
            Status: Active
          </span>

          <div className="mt-8 space-y-4 w-full">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
              <span>Created</span>

              <span className="text-slate-900 italic font-bold tracking-tight text-xs">
                {rack?.createdAt
                  ? new Date(
                      rack.createdAt
                    ).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <Settings
              className="text-blue-600"
              size={18}
            />

            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">
              Update Rack Details
            </h3>
          </div>

          <form
            onSubmit={handleUpdate}
            className="space-y-6 font-bold"
          >
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-400 tracking-[0.2em] ml-2">
                New Rack Alias
              </label>

              <input
                type="text"
                value={nameRack}
                onChange={(e) =>
                  setNameRack(e.target.value)
                }
                placeholder="e.g. Master Logistics Alpha"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all italic shadow-inner"
              />
            </div>

            <motion.button
              type="submit"
              disabled={updating}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-slate-900 text-white rounded-[22px] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {updating ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Configuration"
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}