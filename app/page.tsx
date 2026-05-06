"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ShieldCheck,
  Users,
  ArrowRight,
  Menu,
  X,
  Truck,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Animation Variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityHeader = useTransform(scrollY, [0, 100], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      {/* 🚀 Header / Navigation */}
      <nav
        className={`fixed w-full z-[100] transition-all duration-500 ${
          isScrolled
            ? "bg-white/70 backdrop-blur-xl py-4 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.1)] border-b border-slate-100"
            : "bg-transparent py-8"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 relative bg-white p-1.5 rounded-xl shadow-sm border border-slate-100 group-hover:rotate-6 transition-transform">
              <Image
                src="/logo-removebg-pt.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
                PT <span className="text-[#F2C547]">GUDANG</span> BARU BERKAH
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em]">
                LOGISTICS
              </span>
            </div>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {["Home", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-all relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l pl-10 border-slate-200">
              <Link
                href="/login"
                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Log In
              </Link>
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-900 text-white px-7 py-3 rounded-2xl text-sm font-bold shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] hover:bg-slate-800 transition-all"
                >
                  Create Account
                </motion.div>
              </Link>
            </div>
          </div>

          <button
            className="lg:hidden p-2 bg-slate-50 rounded-xl"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} className="text-slate-900" />
          </button>
        </div>
      </nav>

      {/* 📱 Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-[80%] bg-white p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-16">
                <span className="font-black text-xl tracking-tighter uppercase">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-6">
  {[
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ].map((item) => (
    <a
      key={item.name}
      href={item.href}
      className="block text-4xl font-black text-slate-900 hover:text-amber-500 transition-colors"
    >
      {item.name}
    </a>
  ))}
</div>
              <div className="absolute bottom-10 left-8 right-8 space-y-4">
                <Link
                  href="/login"
                  className="block w-full text-center py-4 rounded-2xl font-bold bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center py-4 rounded-2xl font-bold bg-slate-900 text-white"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏗️ Hero Section */}
      <section
        id="home"
        className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden"
      >
        {/* Animated Background Gradients */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-0 left-0 w-full h-full -z-10"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[100px]" />
        </motion.div>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="relative z-10"
            >

              <motion.h1
                variants={fadeIn}
                className="text-6xl md:text-[84px] font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter"
              >
                Penyimpanan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-amber-600">
                  Dokumen Digital
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg mb-12 font-medium"
              >
                Kelola dokumen digital dengan aman, cepat, dan terstruktur dalam
                satu sistem terpusat.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-wrap gap-5">
                <motion.button
                  whileHover={{
                    y: -4,
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-slate-900 text-white rounded-[20px] font-bold flex items-center gap-3 group transition-all"
                >
                  Start Integration
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </motion.button>
                <motion.button
                  whileHover={{ background: "#f8fafc" }}
                  className="px-10 py-5 border-2 border-slate-200 text-slate-900 rounded-[20px] font-bold transition-all hover:border-slate-300"
                >
                  Explore Features
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Container Gambar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-[500px]"
            >
              {/* Frame utama (dari versi pertama) */}
              <div className="relative h-full w-full bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100">
                {/* Inner image container */}
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden">
                  <Image
                    src="/perusahaan.jpeg"
                    alt="Fasilitas PT Gudang Baru"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[2s] hover:scale-110"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                  {/* Label lokasi */}
                  <div className="absolute top-6 right-6">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30">
                      📍 Head Office, Malang
                    </span>
                  </div>

                  {/* Teks dalam gambar */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      Fasilitas Modern
                    </h3>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      Sistem manajemen gudang terintegrasi dengan standar
                      keamanan internasional.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🏢 About Section (Bento Inspired) */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Bagian Kiri: Visual/Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.google.com/maps?q=PT+Gudang+Baru+Berkah+Kepanjen+Malang&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="rounded-2xl"
                ></iframe>
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-[#F2C547] p-8 rounded-xl hidden md:block shadow-xl"
              >
                <p className="text-slate-900 font-bold text-4xl">#1</p>
                <p className="text-slate-800 text-sm font-medium">
                  Solusi Logistik &<br /> Pergudangan
                </p>
              </motion.div>
            </motion.div>

            {/* Bagian Kanan: Konten Teks */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h4 className="text-[#F2C547] font-bold tracking-widest uppercase text-sm mb-4">
                Tentang Kami
              </h4>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Membangun Masa Depan{" "}
                <span className="text-slate-500">Logistik Indonesia</span>
              </h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                <span className="font-bold text-slate-900">
                  PT. Gudang Baru Berkah
                </span>{" "}
                menghadirkan platform digital untuk menyimpan dan mengelola data
                secara aman, terstruktur, dan mudah diakses. Berlokasi di
                Kepanjen, Malang, sistem ini dirancang untuk mendukung kebutuhan
                administrasi dan operasional perusahaan secara efisien. Melalui
                platform ini, pengguna dapat mengunggah, menyimpan, serta
                mengorganisir berbagai dokumen penting dengan lebih praktis,
                sehingga proses pengelolaan dan pencarian data menjadi lebih
                cepat, akurat, dan terpercaya.
              </p>

              {/* Statistik */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="text-4xl font-black text-slate-900 mb-1 leading-none">
                    500+
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Active Partners
                  </div>
                </div>

                <div>
                  <div className="text-4xl font-black text-slate-900 mb-1 leading-none">
                    100%
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Uptime Cloud
                  </div>
                </div>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ x: 10 }}
                className="flex items-center gap-3 text-slate-900 font-bold group"
              >
                Pelajari Visi Misi Kami
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#F2C547] transition-colors">
                  <Truck size={18} />
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🏁 Footer */}
      <footer
        id="contact"
        className="bg-[#0A0C10] pt-32 pb-16 text-white overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-16 mb-24">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative bg-white rounded-xl p-2">
                  <Image
                    src="/logo-removebg-pt.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-black tracking-tighter">
                  PT GUDANG BARU BERKAH
                </span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                Platform digital untuk mendukung efisiensi, keamanan, dan
                integrasi dalam pengelolaan data dan dokumen industri.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/company/pt-gbb/?originalSubdomain=id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-[#0A66C2] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-5 h-5"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6 1.1 6 0 4.88 0 3.5 0 2.12 1.1 1 2.48 1 3.86 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.1c.7-1.3 2.4-2.6 4.9-2.6 5.2 0 6.2 3.4 6.2 7.8V24h-5v-7.5c0-1.8 0-4.1-2.5-4.1s-2.9 1.9-2.9 4V24h-5V8z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/gajahbaruofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-5 h-5"
                  >
                    <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5C18.22 4 20 5.78 20 7.75v8.5c0 1.97-1.78 3.75-3.75 3.75h-8.5C5.78 20 4 18.22 4 16.25v-8.5C4 5.78 5.78 4 7.75 4zm9.25 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="lg:ml-auto">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8">
                Navigation
              </h4>
              <ul className="space-y-4 font-bold text-slate-400">
                {[
                  "Company Profile",
                  "Product Stack",
                  "Security Protocol",
                  "Contact Lab",
                ].map((link) => (
                  <li
                    key={link}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                    {link}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:ml-auto">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8">
                Compliance
              </h4>
              <ul className="space-y-4 font-bold text-slate-400">
                {[
                  "Privacy Policy",
                  "SLA Agreement",
                  "Security Audit",
                  "ISO Certification",
                ].map((link) => (
                  <li
                    key={link}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:ml-auto">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8">
                Base Ops
              </h4>
              <p className="text-slate-400 font-bold leading-relaxed italic">
                Jl. Probolinggo No.162, <br />
                Penarukan, Kepanjen,
                <br />
                Malang, Jawa Timur
              </p>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-[11px] font-bold tracking-widest uppercase">
              &copy; 2026 PT GUDANG BARU BERKAH.
            </p>
            <div className="flex items-center gap-2 text-slate-600 text-[11px] font-bold">
              ENCRYPTED CONNECTION{" "}
              <ShieldCheck size={14} className="text-emerald-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
