"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, HelpCircle, ArrowUpRight, Tag, Layers, ClipboardList, User, FileDown } from "lucide-react";
import { useInventory } from "@/context/InventoryContext";
import { EquipmentStatus, LabelStatus } from "@/data/types";
import { cn } from "@/lib/utils";
import { exportDashboardToExcel } from "@/lib/exportToExcel";

type FilterType = 'ALL' | 'DAMAGED' | 'LOST' | 'OUTGOING' | 'LABEL' | 'UNLABELED' | 'HAS_LABEL' | 'SUMMARY';

export default function DashboardPage() {
    const { studios } = useInventory();
    const [filter, setFilter] = useState<FilterType>('ALL');

    // Calculate statuses across all studios
    let damagedCount = 0;
    let lostCount = 0;
    let outgoingCount = 0;
    let replacementCount = 0;

    // New label stats
    let labeledCount = 0;
    let unlabeledCount = 0;

    studios.forEach(s => {
        s.equipment.forEach(e => {
            e.units.forEach(u => {
                if (u.status === EquipmentStatus.DAMAGED) damagedCount++;
                if (u.status === EquipmentStatus.LOST) lostCount++;
                if (u.status === EquipmentStatus.MAINTENANCE) outgoingCount++;
                if (u.replacementPending) replacementCount++;

                // Label stats
                if (u.labelStatus === LabelStatus.LABELED) labeledCount++;
                if (u.labelStatus === LabelStatus.UNLABELED) unlabeledCount++;
            });
        });
    });

    const stats = [
        { label: '損壞', count: damagedCount, color: 'text-red-600 bg-red-50 border-red-200', icon: <AlertCircle className="w-5 h-5" />, filterType: 'DAMAGED' as FilterType },
        { label: '遺失', count: lostCount, color: 'text-stone-600 bg-stone-100 border-stone-200', icon: <HelpCircle className="w-5 h-5" />, filterType: 'LOST' as FilterType },
        { label: '外出', count: outgoingCount, color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <ArrowUpRight className="w-5 h-5" />, filterType: 'OUTGOING' as FilterType },
        { label: '標籤更換', count: replacementCount, color: 'text-orange-600 bg-orange-50 border-orange-200', icon: <Tag className="w-5 h-5" />, filterType: 'LABEL' as FilterType },
        // New cards
        { label: '已貼標', count: labeledCount, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <Tag className="w-5 h-5" />, filterType: 'HAS_LABEL' as FilterType },
        { label: '未貼標', count: unlabeledCount, color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Tag className="w-5 h-5" />, filterType: 'UNLABELED' as FilterType },
    ];

    // Helper to get status color/icon
    const getStatusConfig = (status: EquipmentStatus, isReplacement: boolean) => {
        if (isReplacement) return { color: "text-orange-600 bg-orange-50 border-orange-200", icon: <Tag className="w-4 h-4" />, label: "標籤更換" };
        switch (status) {
            case EquipmentStatus.DAMAGED: return { color: "text-red-600 bg-red-50 border-red-200", icon: <AlertCircle className="w-4 h-4" />, label: "損壞" };
            case EquipmentStatus.LOST: return { color: "text-stone-600 bg-stone-100 border-stone-200", icon: <HelpCircle className="w-4 h-4" />, label: "遺失" };
            case EquipmentStatus.MAINTENANCE: return { color: "text-blue-600 bg-blue-50 border-blue-200", icon: <ArrowUpRight className="w-4 h-4" />, label: "外出" };
            default: return { color: "text-gray-500", icon: <div />, label: status };
        }
    };

    const filterOptions: { value: FilterType, label: string, icon: React.ReactNode }[] = [
        { value: 'ALL', label: "全部", icon: <Layers className="w-3 h-3" /> },
        { value: 'DAMAGED', label: "損壞", icon: <AlertCircle className="w-3 h-3" /> },
        { value: 'LOST', label: "遺失", icon: <HelpCircle className="w-3 h-3" /> },
        { value: 'OUTGOING', label: "外出", icon: <ArrowUpRight className="w-3 h-3" /> },
        { value: 'LABEL', label: "標籤更換", icon: <Tag className="w-3 h-3" /> },
        { value: 'HAS_LABEL', label: "已貼標", icon: <Tag className="w-3 h-3" /> },
        { value: 'UNLABELED', label: "未貼標", icon: <Tag className="w-3 h-3" /> },
        { value: 'SUMMARY', label: "總數統計", icon: <ClipboardList className="w-3 h-3" /> },
    ];

    const hasAnyIssues = studios.some(s => s.equipment.some(e => e.units.some(u =>
        u.status === EquipmentStatus.DAMAGED ||
        u.status === EquipmentStatus.LOST ||
        u.status === EquipmentStatus.MAINTENANCE ||
        u.replacementPending ||
        u.labelStatus === LabelStatus.UNLABELED ||
        u.labelStatus === LabelStatus.LABELED
    )));

    return (
        <div className="flex flex-col h-screen bg-background text-foreground font-sans">
            {/* Header */}
            <header className="flex flex-col bg-background/80 backdrop-blur-sm sticky top-0 z-10 border-b border-border">
                <div className="flex items-center gap-4 px-4 py-4">
                    <Link
                        href="/"
                        className="p-2 -ml-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">
                            器材狀況總覽
                        </h1>
                        <p className="text-xs text-muted-foreground">異常與待處理項目</p>
                    </div>

                    <button
                        onClick={() => exportDashboardToExcel(studios)}
                        className="ml-auto flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <FileDown className="w-4 h-4" />
                        <span className="hidden sm:inline">匯出 Excel</span>
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
                    {filterOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
                                filter === opt.value
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-background text-muted-foreground border-border hover:bg-secondary"
                            )}
                        >
                            {opt.icon}
                            {opt.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {stats.map((stat) => (
                            <button
                                key={stat.label}
                                onClick={() => stat.filterType && setFilter(stat.filterType)}
                                disabled={!stat.filterType}
                                className={cn(
                                    `flex flex-col items-center justify-center p-4 rounded-xl border ${stat.color} transition-all`,
                                    stat.filterType ? "hover:scale-[0.98] cursor-pointer" : "cursor-default"
                                )}
                            >
                                <div className="mb-2 opacity-80">{stat.icon}</div>
                                <span className="text-2xl font-bold mb-1">{stat.count}</span>
                                <span className="text-xs font-medium opacity-80">{stat.label}</span>
                            </button>
                        ))}
                    </div>

                    {filter === 'SUMMARY' ? (
                        // --- Summary View ---
                        <div className="space-y-10">
                            {studios.map((studio) => {
                                // Group by category
                                const categories = Array.from(new Set(studio.equipment.map(e => e.category)));

                                return (
                                    <div key={studio.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                                        {/* Studio Header */}
                                        <div className="bg-secondary/30 px-6 py-4 border-b border-border flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{studio.icon}</span>
                                                    <div>
                                                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                                            {studio.name} <span className="text-base font-normal text-muted-foreground">總數統計</span>
                                                        </h2>
                                                    </div>
                                                </div>
                                                {studio.assignee && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                                                        <User className="w-3 h-3" />
                                                        {studio.assignee}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Progress Bar */}
                                            {(() => {
                                                const totalUnits = studio.equipment.reduce((acc, item) => acc + item.quantity, 0);
                                                const checkedUnits = studio.equipment.reduce((acc, item) => acc + item.units.filter(u => u.status !== EquipmentStatus.UNCHECKED).length, 0);
                                                const progress = totalUnits > 0 ? (checkedUnits / totalUnits) * 100 : 0;

                                                return (
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                                                            <span>清點進度</span>
                                                            <span>{checkedUnits} / {totalUnits} ({Math.round(progress)}%)</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        <div className="divide-y divide-border">
                                            {categories.map(category => {
                                                const items = studio.equipment.filter(e => e.category === category);

                                                return (
                                                    <div key={category} className="px-6 py-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h3 className="text-sm font-bold text-muted-foreground">{category}</h3>
                                                            <span className="text-xs text-muted-foreground font-mono">{items.length} 品項</span>
                                                        </div>

                                                        {/* Table Header */}
                                                        <div className="flex items-center text-xs text-muted-foreground/60 mb-2 px-2">
                                                            <div className="flex-1">品項名稱</div>
                                                            <div className="w-16 text-center">狀態摘要</div>
                                                            <div className="w-20 text-right">數量 (常/總)</div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            {items.map(item => {
                                                                const normalCount = item.units.filter(u => u.status === EquipmentStatus.NORMAL).length;
                                                                // Consider Outgoing as "Normal" for inventory tracking purposes? Usually "Normal" means available/good. 
                                                                // User request: "看見所有器材的狀況" and screenshot shows "常/總". "常" likely means Normal.

                                                                const isFullyNormal = normalCount === item.quantity;

                                                                return (
                                                                    <div key={item.id} className="flex items-center text-sm py-2 px-2 hover:bg-secondary/30 rounded-lg transition-colors">
                                                                        <div className="flex-1 font-bold text-foreground">
                                                                            {item.name}
                                                                        </div>
                                                                        <div className="w-16 flex justify-center">
                                                                            <div className={cn(
                                                                                "w-2.5 h-2.5 rounded-full",
                                                                                isFullyNormal ? "bg-green-500" : "bg-orange-400"
                                                                            )} />
                                                                        </div>
                                                                        <div className="w-20 text-right font-mono">
                                                                            <span className={cn("font-bold", isFullyNormal ? "text-green-600" : "text-orange-600")}>
                                                                                {normalCount}
                                                                            </span>
                                                                            <span className="text-muted-foreground/50 mx-1">/</span>
                                                                            <span className="text-muted-foreground">{item.quantity}</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        // --- Issue View (Original Logic) ---
                        <>
                            {studios.map(studio => {
                                const issues: { item: any; unit: any }[] = [];
                                studio.equipment.forEach(e => {
                                    e.units.forEach(u => {
                                        let match = false;

                                        const isDamaged = u.status === EquipmentStatus.DAMAGED;
                                        const isLost = u.status === EquipmentStatus.LOST;
                                        const isOutgoing = u.status === EquipmentStatus.MAINTENANCE;
                                        const isLabel = u.replacementPending;
                                        const isUnlabeled = u.labelStatus === LabelStatus.UNLABELED;
                                        const isLabeled = u.labelStatus === LabelStatus.LABELED;

                                        // Base check: The logic here is tricky. "HasAnyIssues" controls the empty state. 
                                        // The loop logic below filters items to display.
                                        // If we are filtering by 'HAS_LABEL', we want to show labeled items even if they are normal.
                                        // If we are in 'ALL' mode, typically we show 'issues' only. 
                                        // If we are in specific filter mode (like DAMAGED), we show damaged.

                                        // Revised Logic:
                                        // 1. If filtering for a specific type, check if it matches that type.
                                        // 2. If filter is ALL, check if it matches any "Issue" type (excluding Labeled/Normal).

                                        let shouldShow = false;

                                        if (filter === 'ALL') {
                                            if (isDamaged || isLost || isOutgoing || isLabel || isUnlabeled) shouldShow = true;
                                        } else if (filter === 'DAMAGED' && isDamaged) shouldShow = true;
                                        else if (filter === 'LOST' && isLost) shouldShow = true;
                                        else if (filter === 'OUTGOING' && isOutgoing) shouldShow = true;
                                        else if (filter === 'LABEL' && isLabel) shouldShow = true;
                                        else if (filter === 'UNLABELED' && isUnlabeled) shouldShow = true;
                                        else if (filter === 'HAS_LABEL' && isLabeled) shouldShow = true;

                                        if (!shouldShow) return;

                                        issues.push({ item: e, unit: u });
                                    });
                                });

                                if (issues.length === 0) return null;

                                return (
                                    <div key={studio.id} className="space-y-3">
                                        <div className="flex items-center gap-2 px-1">
                                            <span className="text-xl">{studio.icon}</span>
                                            <h2 className="text-base font-bold text-foreground">{studio.name}</h2>
                                            {studio.assignee && (
                                                <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium border border-blue-100">
                                                    <User className="w-3 h-3" /> {studio.assignee}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
                                                {issues.length}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            {issues.map((issue) => {
                                                const showStatus = issue.unit.status !== EquipmentStatus.NORMAL && issue.unit.status !== EquipmentStatus.UNCHECKED;
                                                const showReplacement = issue.unit.replacementPending;

                                                return (
                                                    <div key={`${issue.item.id}-${issue.unit.id}`} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col gap-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-foreground">{issue.item.name}</h3>
                                                                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                                                    {issue.unit.unitLabel || issue.unit.id}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <Link href={`/inventory/${studio.id}`} className="text-xs text-blue-500 hover:underline block mb-1">
                                                                    前往查看
                                                                </Link>
                                                                {issue.unit.checkedBy && (
                                                                    <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-full">
                                                                        <User className="w-3 h-3" />
                                                                        {issue.unit.checkedBy}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {showStatus && (
                                                                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border", getStatusConfig(issue.unit.status, false).color)}>
                                                                    {getStatusConfig(issue.unit.status, false).icon}
                                                                    {getStatusConfig(issue.unit.status, false).label}
                                                                </div>
                                                            )}
                                                            {showReplacement && (
                                                                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border", getStatusConfig(EquipmentStatus.NORMAL, true).color)}>
                                                                    {getStatusConfig(EquipmentStatus.NORMAL, true).icon}
                                                                    {getStatusConfig(EquipmentStatus.NORMAL, true).label}
                                                                </div>
                                                            )}
                                                            {issue.unit.labelStatus === LabelStatus.UNLABELED && filter === 'UNLABELED' && (
                                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-200 bg-amber-50 text-amber-700">
                                                                    <Tag className="w-4 h-4" />
                                                                    未貼標
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Label Replacement Remark */}
                                                        {showReplacement && issue.unit.labelRemark && (
                                                            <div className="text-xs bg-orange-50 border border-orange-100 p-2 rounded text-orange-800">
                                                                <span className="font-bold">置換備註:</span> {issue.unit.labelRemark}
                                                            </div>
                                                        )}

                                                        {issue.unit.remark && (
                                                            <div className="text-xs bg-secondary/50 p-2 rounded text-muted-foreground">
                                                                備註: {issue.unit.remark}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Empty State Logic */}
                            {!hasAnyIssues && (
                                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                                    <p>目前沒有任何異常項目</p>
                                </div>
                            )}

                            {/* Empty State Filtered */}
                            {hasAnyIssues && studios.every(s => {
                                // Dry run filter to check if empty
                                let count = 0;
                                s.equipment.forEach(e => e.units.forEach(u => {
                                    const isDamaged = u.status === EquipmentStatus.DAMAGED;
                                    const isLost = u.status === EquipmentStatus.LOST;
                                    const isOutgoing = u.status === EquipmentStatus.MAINTENANCE;
                                    const isLabel = u.replacementPending;
                                    if ((!isDamaged && !isLost && !isOutgoing && !isLabel)) return;

                                    if (filter === 'ALL') count++;
                                    else if (filter === 'DAMAGED' && isDamaged) count++;
                                    else if (filter === 'LOST' && isLost) count++;
                                    else if (filter === 'OUTGOING' && isOutgoing) count++;
                                    else if (filter === 'LABEL' && isLabel) count++;
                                }));
                                return count === 0;
                            }) && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground/50">
                                        <Layers className="w-12 h-12 mb-2 opacity-20" />
                                        <p>此分類下沒有項目</p>
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
