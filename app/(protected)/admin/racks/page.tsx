"use client";

import { useEffect, useState } from "react";

import {
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface User {
  fullName?: string;
  email?: string;
  rack?: {
    name_rack?: string;
    createdAt?: string;
  };
}

export default function RackProfilePage() {
  const [loading, setLoading] =
    useState(true);

  const [rackName, setRackName] =
    useState("Unnamed Rack");

  const [createdAt, setCreatedAt] =
    useState("");

  useEffect(() => {
    try {
      const userData =
        localStorage.getItem("user");

      console.log(
        "LOCAL USER:",
        userData
      );

      if (userData) {
        const parsedUser: User =
          JSON.parse(userData);

        setRackName(
          parsedUser?.rack
            ?.name_rack ||
            "Rack Admin"
        );

        setCreatedAt(
          parsedUser?.rack
            ?.createdAt || ""
        );
      }
    } catch (error) {
      console.error(
        "LOCAL STORAGE ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
          Rack Information
        </h1>

        <p className="text-slate-500 font-medium pl-1">
          Your assigned storage
          identity.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner shadow-blue-100">
            <ShieldCheck size={48} />
          </div>

          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {rackName}
          </h2>

          <span className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Active Rack
          </span>

          <div className="mt-10 w-full border-t border-slate-100 pt-6 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Created
            </span>

            <span className="text-sm font-bold text-slate-800">
              {createdAt
                ? new Date(
                    createdAt
                  ).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}