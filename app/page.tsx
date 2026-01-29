"use client";

import Link from "next/link";
import { ChevronRight, Warehouse, CheckCircle2, User, History } from "lucide-react";
import { useInventory } from "@/context/InventoryContext";
import { EquipmentStatus } from "@/data/types";
import { cn } from "@/lib/utils";

export default function Home() {
  const { studios } = useInventory();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="px-6 py-6 pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Studio Inventory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          器材清點系統
        </p>
      </header>

      {/* List - Full Width */}
      <div className="flex-1 px-4 pb-8 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {studios.map((studio) => {
            // Calculate total items (categories) and total units (individual pieces)
            const totalItems = studio.equipment.length;
            const totalUnits = studio.equipment.reduce((acc, item) => acc + item.quantity, 0);

            // Calculate checked units (status is NOT UNCHECKED)
            let checkedUnits = 0;
            studio.equipment.forEach(item => {
              checkedUnits += item.units.filter(u => u.status !== EquipmentStatus.UNCHECKED).length;
            });

            const progressPercentage = totalUnits > 0 ? Math.round((checkedUnits / totalUnits) * 100) : 0;

            return (
              <Link
                key={studio.id}
                href={`/inventory/${studio.id}`}
                className="group relative flex flex-col p-5 bg-card border border-border rounded-xl shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-5">
                    {/* Large Icon Placeholder using the emoji from data or fallback */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary text-3xl shadow-inner">
                      {studio.icon || <Warehouse className="w-8 h-8 opacity-70" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground tracking-tight">
                          {studio.name}
                        </h2>
                        {studio.assignee && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-100 font-medium">
                            <User className="w-3 h-3" /> {studio.assignee}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {studio.description}
                      </p>
                      <p className="text-xs text-muted-foreground/60 font-mono">
                        {totalItems} 品項 / {totalUnits} 機台
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-6 h-6 text-muted-foreground/30 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Progress Bar Section */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      清點進度 ({checkedUnits}/{totalUnits})
                    </span>
                    <span className={cn("text-xs font-bold", progressPercentage === 100 ? "text-green-600" : "text-primary")}>
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", progressPercentage === 100 ? "bg-green-500" : "bg-primary/80")}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Dashboard Summary Section */}
        <div className="mt-8 pt-8 border-t border-border mb-8">
          <h2 className="text-lg font-bold mb-4 px-1">器材狀況一覽</h2>

          {(() => {
            let damagedCount = 0;
            let lostCount = 0;
            let outgoingCount = 0;
            let repairedCount = 0;
            let labelCount = 0;

            studios.forEach(s => {
              s.equipment.forEach(e => {
                e.units.forEach(u => {
                  if (u.status === '損壞') damagedCount++;
                  if (u.status === '遺失') lostCount++;
                  if (u.status === '外出拍攝') outgoingCount++;
                  if (u.status === '已維修') repairedCount++;
                  if (u.replacementPending) labelCount++;
                });
              });
            });

            const stats = [
              { label: '損壞', count: damagedCount, color: 'text-red-600 bg-red-50 border-red-200' },
              { label: '遺失', count: lostCount, color: 'text-stone-600 bg-stone-100 border-stone-200' },
              { label: '已維修', count: repairedCount, color: 'text-green-600 bg-green-50 border-green-200' },
              { label: '標籤更換', count: labelCount, color: 'text-orange-600 bg-orange-50 border-orange-200' },
            ];

            return (
              <div className="space-y-4">
                <Link href="/dashboard" className="block">
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat) => (
                      <div key={stat.label} className={`flex flex-col items-center justify-center p-4 rounded-xl border ${stat.color} transition-all active:scale-[0.98]`}>
                        <span className="text-2xl font-bold mb-1">{stat.count}</span>
                        <span className="text-xs font-medium opacity-80">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                    查看詳細報表 <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>

                <Link href="/maintenance-history" className="block">
                  <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl transition-all active:scale-[0.98] hover:bg-green-100">
                    <History className="w-5 h-5" />
                    <span className="text-sm font-bold">查看維修歷史記錄</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Footer / Status Bar (optional) */}
      <div className="px-6 py-4 bg-muted/30 border-t border-border text-center">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
          Studio Inventory Pro
        </p>
      </div>
    </div>
  );
}
