"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Users, UserCheck, UserX, TrendingUp, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
    isPhoneVerified: boolean;
    status: "pending" | "verified" | "approved" | "rejected";
}

interface GetLeadsResponse {
    total: number;
    leads: Lead[];
}

interface Stats {
    total: number;
    verified: number;
    unverified: number;
    converted: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
    const router = useRouter();

    const handleLogout = () => {
        router.push("/admin/login");
    };

    return (
        <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 fixed h-screen p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Trade Circle</h2>

            <nav className="space-y-2 flex-1">
                <div className="bg-white/10 px-4 py-2 rounded-lg font-medium">
                    Dashboard
                </div>

                <Link
                    href="/admin/leads"
                    className="block px-4 py-2 rounded-lg hover:bg-white/10 transition"
                >
                    Leads
                </Link>
            </nav>

            {/* Logout at bottom */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition group mt-auto cursor-pointer"
            >
                <LogOut
                    size={18}
                    className="group-hover:translate-x-0.5 transition-transform"
                />
                <span className="text-sm font-medium">Logout</span>
            </button>
        </aside>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    loading: boolean;
}

function StatCard({ title, value, icon, loading }: StatCardProps) {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-white/20 transition">
            <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-lg">{title}</p>
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                    {icon}
                </div>
            </div>

            {loading ? (
                <div className="h-9 w-16 bg-white/10 rounded-lg animate-pulse mt-2" />
            ) : (
                <h3 className="text-3xl font-bold mt-2">{value}</h3>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        total: 0,
        verified: 0,
        unverified: 0,
        converted: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError]     = useState<string>("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchStats = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`${API_BASE}/api/leads/get`, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message ?? "Failed to fetch leads.");
                }

                const data: GetLeadsResponse = await res.json();

                const verified   = data.leads.filter((l) => l.isPhoneVerified).length;
                const unverified = data.leads.filter((l) => !l.isPhoneVerified).length;
                const converted  = data.leads.filter((l) => l.status === "approved").length;

                setStats({
                    total: data.total,
                    verified,
                    unverified,
                    converted,
                });
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError(
                    err instanceof Error ? err.message : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        return () => controller.abort();
    }, []);

    const cards: { title: string; value: number; icon: React.ReactNode }[] = [
        {
            title: "Total Leads",
            value: stats.total,
            icon: <Users size={18} />,
        },
        {
            title: "Verified Leads",
            value: stats.verified,
            icon: <UserCheck size={18} />,
        },
        {
            title: "Unverified Leads",
            value: stats.unverified,
            icon: <UserX size={18} />,
        },
        {
            title: "Converted Leads",
            value: stats.converted,
            icon: <TrendingUp size={18} />,
        },
    ];

    return (
        <div className="min-h-screen bg-brand-dark text-white flex">
            <Sidebar />

            <div className="flex-1 ml-64 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

                    {/* Refresh button */}
                    {!loading && (
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                        >
                            <Loader2 size={14} />
                            Refresh
                        </button>
                    )}
                </div>

                {/* Error banner */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-6 py-4 text-sm mb-6">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-4 gap-6">
                    {cards.map((card) => (
                        <StatCard
                            key={card.title}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            loading={loading}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}