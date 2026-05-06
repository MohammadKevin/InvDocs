"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  User,
  Mail,
  ShieldCheck,
  Camera,
  Loader2,
} from "lucide-react";

interface UserType {
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] =
    useState<UserType | null>(null);

  useEffect(() => {
    try {
      const userData =
        localStorage.getItem("user");

      console.log(
        "RAW USER DATA:",
        userData
      );

      // 🔥 cek dulu
      if (
        userData &&
        userData !== "undefined"
      ) {
        const parsedUser =
          JSON.parse(userData);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "USER PARSE ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="max-w-5xl mx-auto"
    >
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 md:p-14">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          {/* Avatar */}
          <div className="relative">
            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.fullName ||
                  user?.name ||
                  "User"
                  }&background=2563eb&color=fff&size=256`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <button className="absolute bottom-0 right-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xl text-slate-900 hover:text-blue-600 transition-colors">
              <Camera size={18} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                {user?.fullName ||
                  user?.name ||
                  "Unknown User"}
              </h1>

              <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center gap-2">
                <ShieldCheck
                  size={14}
                  className="text-emerald-400"
                />

                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-400">
                  Verified
                </span>
              </div>
            </div>

            <p className="text-blue-100/60 text-sm font-medium max-w-xl">
              Secure digital archive identity
              registered inside InvDocs Cloud
              Infrastructure.
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
              {/* Email */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Mail
                    size={18}
                    className="text-blue-400"
                  />

                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-200/50">
                    Email Address
                  </span>
                </div>

                <p className="text-white font-bold text-sm break-all">
                  {user?.email ||
                    "No email"}
                </p>
              </div>

              {/* Role */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <User
                    size={18}
                    className="text-blue-400"
                  />

                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-200/50">
                    System Role
                  </span>
                </div>

                <p className="text-white font-bold text-sm uppercase">
                  {user?.role ||
                    "User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}