"use client";

import { useEffect, useState } from "react";

import {
    BarChart3,
    FileText,
    Archive,
    Server,
    CheckCircle2,
    Clock3,
    XCircle,
    Download,
    Loader2,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import { api } from "@/lib/api";

interface DashboardSummary {
    totalDocuments: number;
    totalRacks: number;
    totalBoxes: number;
    approvedDocuments: number;
    pendingDocuments: number;
    rejectedDocuments: number;
}

interface MonthlyReport {
    month: string;
    total: number;
}

interface StatusReport {
    status: string;
    total: number;
}

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);

    const [summary, setSummary] =
        useState<DashboardSummary | null>(null);

    const [monthly, setMonthly] = useState<MonthlyReport[]>([]);

    const [status, setStatus] = useState<StatusReport[]>([]);

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        fetchReports();
    }, []);

    async function fetchReports() {
        try {
            setLoading(true);

            const [
                summaryRes,
                monthlyRes,
                statusRes,
            ] = await Promise.all([
                api.get("/reports/dashboard"),
                api.get(`/reports/monthly?year=${currentYear}`),
                api.get("/reports/status"),
            ]);

            setSummary(summaryRes.data);
            setMonthly(monthlyRes.data);
            setStatus(statusRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function exportYearlyReport() {
        try {
            const response = await api.get(
                `/reports/export?type=yearly&year=${currentYear}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                `report-${currentYear}.xlsx`
            );

            document.body.appendChild(link);

            link.click();

            link.remove();
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Loader2
                    className="animate-spin text-cyan-400"
                    size={40}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                    <div className="flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em] mb-3">
                        <BarChart3 size={14} />
                        Analytics Report
                    </div>

                    <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
                        Reports Dashboard
                    </h1>

                    <p className="text-slate-400 mt-2 font-medium">
                        Statistik laporan dokumen dan aktivitas rack
                    </p>
                </div>

                <button
                    onClick={exportYearlyReport}
                    className="h-14 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-black text-sm flex items-center gap-3 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                    <Download size={18} />
                    Export Excel
                </button>
            </div>

            {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-5">
                    <Card
                        title="Documents"
                        value={summary.totalDocuments}
                        icon={<FileText size={22} />}
                    />

                    <Card
                        title="Racks"
                        value={summary.totalRacks}
                        icon={<Server size={22} />}
                    />

                    <Card
                        title="Boxes"
                        value={summary.totalBoxes}
                        icon={<Archive size={22} />}
                    />

                    <Card
                        title="Approved"
                        value={summary.approvedDocuments}
                        icon={<CheckCircle2 size={22} />}
                    />

                    <Card
                        title="Pending"
                        value={summary.pendingDocuments}
                        icon={<Clock3 size={22} />}
                    />

                    <Card
                        title="Rejected"
                        value={summary.rejectedDocuments}
                        icon={<XCircle size={22} />}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                <div className="bg-[#081028] border border-cyan-500/10 rounded-[2rem] p-7 shadow-xl shadow-black/20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                            <BarChart3 size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-white uppercase italic">
                                Monthly Documents
                            </h2>

                            <p className="text-slate-400 text-sm">
                                Statistik upload dokumen bulanan
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthly}>
                                <XAxis
                                    dataKey="month"
                                    stroke="#94a3b8"
                                />

                                <YAxis stroke="#94a3b8" />

                                <Tooltip />

                                <Bar
                                    dataKey="total"
                                    radius={[12, 12, 0, 0]}
                                    fill="#06b6d4"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#081028] border border-cyan-500/10 rounded-[2rem] p-7 shadow-xl shadow-black/20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                            <CheckCircle2 size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-white uppercase italic">
                                Document Status
                            </h2>

                            <p className="text-slate-400 text-sm">
                                Distribusi status dokumen
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={status}
                                    dataKey="total"
                                    nameKey="status"
                                    outerRadius={120}
                                    label
                                >
                                    <Cell fill="#06b6d4" />
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#ef4444" />
                                </Pie>

                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="bg-[#081028] border border-cyan-500/10 rounded-[2rem] p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-5">
                <div className="text-slate-400 font-bold text-sm">
                    {title}
                </div>

                <div className="text-cyan-400">
                    {icon}
                </div>
            </div>

            <h2 className="text-4xl font-black text-white">
                {value}
            </h2>
        </div>
    );
}