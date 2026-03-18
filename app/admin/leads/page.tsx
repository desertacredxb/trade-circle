"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface Lead {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    countryCode: string;
    language: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    status: "pending" | "verified" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
    otpLastSent?: string;
    accountStatus: "In Process" | "Demo Shared" | "ID Created";
}

interface GetLeadsResponse {
    total: number;
    leads: Lead[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const STATUS_STYLES: Record<Lead["status"], string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    verified: "bg-blue-500/10   text-blue-400   border border-blue-500/20",
    approved: "bg-green-500/10  text-green-400  border border-green-500/20",
    rejected: "bg-red-500/10    text-red-400    border border-red-500/20",
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function SkeletonRow() {
    return (
        <tr className="border-b border-white/5 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
                <td key={i} className="py-4 pr-4">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );
}

function StatusBadge({ status }: { status: Lead["status"] }) {
    return (
        <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${STATUS_STYLES[status] ?? "text-gray-400"}`}>
            {status}
        </span>
    );
}

export default function LeadsPage() {
    const router = useRouter();

    const [leads, setLeads] = useState<Lead[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<Lead["status"] | "all">("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"delete" | "status" | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [newAccountStatus, setNewAccountStatus] = useState<string>("");

    const handleLogout = () => {
        router.push("/admin/login");
    };

    useEffect(() => {
        const controller = new AbortController();

        const fetchLeads = async () => {
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
                setLeads(data.leads);
                setTotal(data.total);
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
        return () => controller.abort();
    }, []);

    // console.log(leads);
    
    const filtered = leads.filter((lead) => {

        const matchesSearch =
            lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
            lead.email.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone.includes(search);

        const matchesStatus =
            statusFilter === "all" || lead.status === statusFilter;

        const createdDate = new Date(lead.createdAt);

        const matchesStartDate =
            !startDate || createdDate >= new Date(startDate);

        const matchesEndDate =
            !endDate || createdDate <= new Date(endDate + "T23:59:59");

        return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    const updateAccountStatus = async () => {
        if (!selectedLead) return;

        try {
            const res = await fetch(
                `${API_BASE}/api/leads/update-status/${selectedLead._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accountStatus: newAccountStatus }),
                }
            );

            if (!res.ok) throw new Error("Failed to update status");

            setLeads((prev) =>
                prev.map((lead) =>
                    lead._id === selectedLead._id
                        ? { ...lead, accountStatus: newAccountStatus as any }
                        : lead
                )
            );

            setModalOpen(false);
        } catch (err) {
            alert("Failed to update account status");
        }
    };

    const deleteLead = async () => {
        if (!selectedLead) return;

        try {
            const res = await fetch(
                `${API_BASE}/api/leads/delete/${selectedLead._id}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Failed to delete lead");

            setLeads((prev) =>
                prev.filter((lead) => lead._id !== selectedLead._id)
            );

            setModalOpen(false);
        } catch {
            alert("Failed to delete lead");
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark text-white flex w-[80vw] mx-auto">

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 fixed h-screen p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-6">Trade Circle</h2>

                <nav className="space-y-2 flex-1">
                    <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 rounded-lg hover:bg-white/10 transition"
                    >
                        Dashboard
                    </Link>

                    <div className="bg-white/10 px-4 py-2 rounded-lg font-medium">
                        Leads
                    </div>
                </nav>

                {/* Logout pinned to bottom */}
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

            {/* ── Main ────────────────────────────────────────────────────── */}
            <div className="flex-1 ml-64 p-8 overflow-x-auto">

                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-semibold">Lead List</h1>
                        {!loading && !error && (
                            <p className="text-gray-400 text-sm mt-1">
                                {filtered.length} of {total} lead{total !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                        />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                        />

                        <input
                            type="text"
                            placeholder="Search name, email, phone…"
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSearch(e.target.value)
                            }
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-white/30 transition w-64"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setStatusFilter(e.target.value as Lead["status"] | "all")
                            }
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition"
                        >
                            <option value="all" className="bg-gray-900">All Status</option>
                            <option value="pending" className="bg-gray-900">Pending</option>
                            <option value="verified" className="bg-gray-900">Verified</option>
                        </select>

                        <button
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("all");
                                setStartDate("");
                                setEndDate("");
                            }}
                            className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/10 transition"
                        >
                            Reset
                        </button>

                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-6 py-4 text-sm mb-6">
                        {error}
                    </div>
                )}

                <div className="rounded-xl border border-white/10 overflow-hidden">

                    {/* Scroll wrapper */}
                    <div className="w-full overflow-x-auto">

                        <table className="w-full min-w-[900px] border-collapse text-sm">

                            <thead className="sticky top-0 bg-white/5">
                                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider whitespace-nowrap">
                                    <th className="text-left px-4 py-3">Name</th>
                                    <th className="text-left px-4 py-3">Email</th>
                                    <th className="text-left px-4 py-3">Phone</th>
                                    <th className="text-left px-4 py-3">Account Status</th>
                                    <th className="text-left px-4 py-3">Language</th>
                                    <th className="text-left px-4 py-3">Status</th>
                                    <th className="text-left px-4 py-3">Created</th>
                                    <th className="text-left px-4 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading &&
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                }

                                {!loading && !error && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center text-gray-500">
                                            {search || statusFilter !== "all"
                                                ? "No leads match your filters."
                                                : "No leads found."}
                                        </td>
                                    </tr>
                                )}

                                {!loading &&
                                    filtered.map((lead) => (
                                        <tr
                                            key={lead._id}
                                            className="border-b border-white/5 hover:bg-white/5 transition whitespace-nowrap"
                                        >
                                            <td className="px-4 py-4 font-medium">
                                                {lead.fullName}
                                            </td>

                                            <td className="px-4 py-4 text-gray-400">
                                                {lead.email}
                                            </td>

                                            <td className="px-4 py-4 text-gray-400">
                                                {lead.countryCode} {lead.phone}
                                            </td>

                                            <td className="px-4 py-4">
                                                <select
                                                    value={lead.accountStatus}
                                                    onChange={(e) => {
                                                        setSelectedLead(lead);
                                                        setNewAccountStatus(e.target.value);
                                                        setModalType("status");
                                                        setModalOpen(true);
                                                    }}
                                                    className="bg-black/40 border border-white/10 text-white rounded-md px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/20"
                                                >
                                                    <option value="In Process" className="bg-[#111] text-white">
                                                        In Process
                                                    </option>
                                                    <option value="Demo Shared" className="bg-[#111] text-white">
                                                        Demo Shared
                                                    </option>
                                                    <option value="ID Created" className="bg-[#111] text-white">
                                                        ID Created
                                                    </option>
                                                </select>
                                            </td>

                                            <td className="px-4 py-4 text-gray-400">
                                                {lead.language}
                                            </td>

                                            <td className="px-4 py-4">
                                                <StatusBadge status={lead.status} />
                                            </td>

                                            <td className="px-4 py-4 text-gray-400">
                                                {formatDate(lead.createdAt)}
                                            </td>

                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLead(lead);
                                                        setModalType("delete");
                                                        setModalOpen(true);
                                                    }}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-96">
                        {modalType === "delete" && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                    Delete Lead
                                </h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    Are you sure you want to delete this lead?
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 border border-white/10 rounded-lg"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={deleteLead}
                                        className="px-4 py-2 bg-red-600 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}

                        {modalType === "status" && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                    Change Account Status
                                </h3>

                                <p className="text-gray-400 text-sm mb-6">
                                    Confirm updating account status to{" "}
                                    <span className="text-white">{newAccountStatus}</span> ?
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 border border-white/10 rounded-lg"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={updateAccountStatus}
                                        className="px-4 py-2 bg-green-600 rounded-lg"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}