"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useInventory } from "@/context/InventoryContext";
import { ArrowLeft, Search, Filter, History as HistoryIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

export default function MaintenanceHistoryPage() {
    const { maintenanceHistory, studios } = useInventory();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudio, setSelectedStudio] = useState<string>("all");

    // Filter and sort history
    const filteredHistory = useMemo(() => {
        let filtered = [...maintenanceHistory];

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (h) =>
                    h.equipmentName.toLowerCase().includes(query) ||
                    h.unitLabel.toLowerCase().includes(query) ||
                    h.studioName.toLowerCase().includes(query)
            );
        }

        // Filter by studio
        if (selectedStudio !== "all") {
            filtered = filtered.filter((h) => h.studioId === selectedStudio);
        }

        // Sort by most recent first
        filtered.sort((a, b) => {
            const dateA = a.createdAt?.getTime() || 0;
            const dateB = b.createdAt?.getTime() || 0;
            return dateB - dateA;
        });

        return filtered;
    }, [maintenanceHistory, searchQuery, selectedStudio]);

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 -ml-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <HistoryIcon className="w-5 h-5 text-green-600" />
                            維修歷史記錄
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            共 {filteredHistory.length} 筆記錄
                        </p>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="px-4 py-4 border-b border-border bg-background space-y-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="搜尋器材名稱、標籤或攝影棚..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Studio Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <button
                        onClick={() => setSelectedStudio("all")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                            selectedStudio === "all"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                    >
                        全部攝影棚
                    </button>
                    {studios.map((studio) => (
                        <button
                            key={studio.id}
                            onClick={() => setSelectedStudio(studio.id)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1",
                                selectedStudio === studio.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                            )}
                        >
                            <span>{studio.icon}</span>
                            {studio.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* History List */}
            <main className="flex-1 overflow-y-auto px-4 py-4">
                {filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                            <HistoryIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">暫無維修記錄</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            {searchQuery || selectedStudio !== "all"
                                ? "沒有符合篩選條件的維修記錄"
                                : "當器材標記為「已維修」時，會自動創建維修記錄"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 pb-4">
                        {filteredHistory.map((record) => (
                            <div
                                key={record.id}
                                className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm"
                            >
                                {/* Header: Equipment Name + Label */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-foreground truncate">
                                            {record.equipmentName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-mono">
                                            {record.unitLabel}
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg flex-shrink-0">
                                        已維修
                                    </span>
                                </div>

                                {/* Studio */}
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">攝影棚：</span>
                                    <span className="font-medium text-foreground">
                                        {studios.find((s) => s.id === record.studioId)?.icon}{" "}
                                        {record.studioName}
                                    </span>
                                </div>

                                {/* Previous Status */}
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">送修前狀態：</span>
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                                        {record.previousStatus}
                                    </span>
                                </div>

                                {/* Timeline */}
                                <div className="bg-secondary/50 rounded-lg p-3 space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">歸還時間：</span>
                                        <span className="font-medium text-foreground">
                                            {record.returnedAt
                                                ? format(record.returnedAt, "yyyy/MM/dd HH:mm", {
                                                    locale: zhTW,
                                                })
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">經手人：</span>
                                        <span className="font-medium text-foreground">
                                            {record.returnedBy}
                                        </span>
                                    </div>
                                </div>

                                {/* Notes */}
                                {record.notes && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                        <h4 className="text-xs font-bold text-blue-900 mb-1">
                                            維修備註：
                                        </h4>
                                        <p className="text-sm text-blue-800">{record.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
