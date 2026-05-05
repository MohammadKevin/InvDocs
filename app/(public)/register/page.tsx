"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Mail, Lock, User, Loader2, UserPlus, ArrowRight } from "lucide-react";
// Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validate = () => {
        if (form.name.length < 3) return "Nama minimal 3 karakter";
        if (!form.email.includes("@")) return "Email tidak valid";
        if (form.password.length < 6) return "Password minimal 6 karakter";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            await api.post("/auth/register-user", form);
            router.push("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] overflow-hidden relative">
            {/* ✨ Animasi Latar Belakang (Blob Bergerak) */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10 p-4"
            >
                <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden">
                    <div className="p-10">
                        {/* Header dengan Staggered Animation */}
                        <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-center mb-10"
                        >
                            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                                <UserPlus className="text-white w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Join Us.</h1>
                            <p className="text-slate-500 mt-2 font-medium">Create your account in seconds</p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Alert dengan AnimatePresence */}
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center space-x-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <p className="text-red-600 text-xs font-semibold">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Input Fields dengan Hover Effect */}
                            {[
                                { id: 'name', type: 'text', icon: User, placeholder: 'Full Name' },
                                { id: 'email', type: 'email', icon: Mail, placeholder: 'Email Address' },
                                { id: 'password', type: 'password', icon: Lock, placeholder: 'Password' }
                            ].map((input, idx) => (
                                <motion.div 
                                    key={input.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 + 0.2 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <input.icon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                                        value={(form as any)[input.id]}
                                        onChange={(e) => setForm({ ...form, [input.id]: e.target.value })}
                                    />
                                </motion.div>
                            ))}

                            {/* Submit Button Animasi */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70 transition-all mt-6"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 text-center"
                        >
                            <p className="text-sm text-slate-500">
                                Already have an account?{" "}
                                <span
                                    onClick={() => router.push("/login")}
                                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-700 transition-colors"
                                >
                                    Sign In
                                </span>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}