"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Download, 
  Search, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  XCircle,
  HardDrive,
  User,
  MoreVertical
} from "lucide-react";
import { api } from "@/lib/api";

interface Document {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
  box: {
    name: string;
    code: string;
  };
  user: {
    name: string;
  };
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        // Mengambil data dari endpoint https://invdocs-api-production.up.railway.app/api/documents
        const res = await api.get("/documents");
        setDocuments(res.data);
      } catch (err) {
        console.error("Gagal sinkronisasi dokumen:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDownload = async (id: string, title: string) => {
    try {
      // Mengarahkan ke endpoint download
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Gagal mengunduh file.");
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-3">
            <HardDrive className="text-blue-600" size={32} />
            Master Repository
          </h1>
          <p className="text-slate-500 text-sm font-medium italic mt-1 pl-1">
            Auditing {documents.length} digital assets across all rack clusters.
          </p>
        </div>

        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[20px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Accessing Encrypted Records...
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6">Asset Title</th>
                  <th className="px-8 py-6">Placement</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Uploader</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                <AnimatePresence>
                  {filteredDocs.map((doc, i) => (
                    <motion.tr 
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-slate-900 leading-none mb-1">{doc.title}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                              {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-[10px] uppercase">
                            {doc.box?.code || "UNBOXED"}
                          </span>
                          <span className="text-slate-400 text-xs italic">{doc.box?.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider ${
                          doc.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                          doc.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {doc.status === 'approved' && <CheckCircle2 size={12} />}
                          {doc.status === 'pending' && <Clock size={12} />}
                          {doc.status === 'rejected' && <XCircle size={12} />}
                          {doc.status}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <User size={14} className="text-slate-300" />
                          <span className="text-xs">{doc.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDownload(doc.id, doc.title)}
                            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                          >
                            <Download size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}