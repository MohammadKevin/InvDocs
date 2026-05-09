"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Mail, Lock, Loader2, LogIn, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const decodeJWT = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!form.email.includes("@")) return "Email tidak valid";
    if (form.password.length < 6) return "Password minimal 6 karakter";
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      const token = res.data.access_token;
      localStorage.setItem("token", token);

      const decoded = decodeJWT(token);
      if (!decoded?.role) throw new Error("Role tidak ditemukan");

      if (decoded.role === "super_admin") router.push("/super-admin/dashboard");
      else if (decoded.role === "admin_rack") router.push("/admin/dashboard");
      else router.push("/user/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-gray-950 overflow-hidden relative p-4 transition-colors duration-300">

      {/* Toggle pojok kanan atas */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Blob */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-20 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/50 dark:border-gray-700/50 shadow-[0_20px_50px_rgba(8,112,184,0.07)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2.5rem] p-8 md:p-12 transition-colors duration-300">

          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="inline-flex p-4 rounded-3xl bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-200 dark:shadow-blue-900 mb-4"
            >
              <LogIn className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-gray-100 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-gray-400 mt-2">Please enter your details</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 dark:bg-red-950/50 border-l-4 border-red-500 p-3 rounded-r-xl"
                >
                  <p className="text-red-600 dark:text-red-400 text-xs font-bold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="block w-full pl-12 pr-4 py-3.5 text-sm outline-none rounded-2xl border transition-all bg-slate-50/50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-3.5 text-sm outline-none rounded-2xl border transition-all bg-slate-50/50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Forgot Password?</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full font-bold py-4 rounded-2xl mt-4 flex items-center justify-center space-x-2 transition-all disabled:opacity-70 group bg-slate-900 hover:bg-slate-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 shadow-xl shadow-slate-200 dark:shadow-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
              >
                Sign Up Free
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
