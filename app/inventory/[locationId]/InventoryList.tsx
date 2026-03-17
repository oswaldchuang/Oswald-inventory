"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Equipment, EquipmentStatus, LabelStatus } from "@/data/types";
import { ChevronDown, Circle, CheckCircle2, AlertCircle, Sparkles, Tag, ArrowRight, User, ArrowLeft, Plus, History, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInventory } from "@/context/InventoryContext";

interface InventoryListProps {
    studioId: string;
}

export default function InventoryList({ studioId }: InventoryListProps) {
    const {
        studios,
        userHistory,
        updateUnitStatus,
        updateUnitLabelStatus,
        toggleUnitLabelReplacement,
        updateUnitLabelRemark,
        updateUnitRemark,
        addStudioAssignee,
        removeStudioAssignee,
        recordMaintenanceReturn,
        addEquipment,
        addUnitsToEquipment,
        deleteEquipment,
        deleteUnit,
    } = useInventory();

    const studio = studios.find(s => s.id === studioId);

    // Derived state for multiple assignees
    const assignees = studio?.assignees || (studio?.assignee ? [studio.assignee] : []);

    // Local state for the current active user (who is clicking buttons)
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    // Auto-select the first assignee if none selected, or if the current user was removed
    useEffect(() => {
        if (assignees.length > 0 && (!currentUser || !assignees.includes(currentUser))) {
            setCurrentUser(assignees[assignees.length - 1]); // Select the most recent one by default
        }
    }, [assignees, currentUser]);

    if (!studio) return null;

    const equipment = studio.equipment;
    const categories = Array.from(new Set(equipment.map((e) => e.category)));

    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
    const [nameInput, setNameInput] = useState("");
    const [showNameModal, setShowNameModal] = useState(false);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const isComposingRef = useRef(false);
    const [maintenanceNotes, setMaintenanceNotes] = useState("");
    const [pendingMaintenanceUnit, setPendingMaintenanceUnit] = useState<{
        equipmentId: string;
        unitId: string;
        previousStatus: EquipmentStatus;
    } | null>(null);

    // Add Equipment Modal state
    const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
    // 'new' = build a brand new item, 'existing' = add units to an existing item
    const [addEquipmentMode, setAddEquipmentMode] = useState<'new' | 'existing'>('new');
    const [selectedExistingId, setSelectedExistingId] = useState('');
    const [addEquipmentForm, setAddEquipmentForm] = useState({
        name: '',
        category: '',
        quantity: 1,
        unit: '台',
    });
    const [isAddingEquipment, setIsAddingEquipment] = useState(false);
    const [addEquipmentSuccess, setAddEquipmentSuccess] = useState(false);
    const isAddingNameRef = useRef(false);
    const isAddingUnitRef = useRef(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeletingEquipment, setIsDeletingEquipment] = useState(false);

    const toggleNameModal = () => setShowNameModal(!showNameModal);

    const openAddEquipmentModal = (preselectedCategory: string) => {
        setAddEquipmentForm({ name: '', category: preselectedCategory, quantity: 1, unit: '台' });
        setAddEquipmentMode('new');
        setSelectedExistingId('');
        setAddEquipmentSuccess(false);
        setShowAddEquipmentModal(true);
    };

    const handleAddEquipment = async () => {
        if (isAddingEquipment) return;
        setIsAddingEquipment(true);
        try {
            if (addEquipmentMode === 'existing' && selectedExistingId) {
                const existingItem = equipment.find(e => e.id === selectedExistingId);
                if (existingItem) {
                    await addUnitsToEquipment(
                        existingItem.id,
                        existingItem.name,
                        existingItem.quantity,
                        addEquipmentForm.quantity
                    );
                }
            } else {
                if (!addEquipmentForm.name.trim()) { setIsAddingEquipment(false); return; }
                await addEquipment(
                    studioId,
                    addEquipmentForm.name.trim(),
                    addEquipmentForm.category,
                    addEquipmentForm.quantity,
                    addEquipmentForm.unit || '台'
                );
            }
            setAddEquipmentSuccess(true);
            setTimeout(() => {
                setShowAddEquipmentModal(false);
                setAddEquipmentSuccess(false);
            }, 1000);
        } finally {
            setIsAddingEquipment(false);
        }
    };

    const handleDeleteUnit = async (equipmentId: string, unitId: string, isLastUnit: boolean) => {
        setIsDeletingEquipment(true);
        try {
            await deleteUnit(unitId, equipmentId, isLastUnit);
            if (isLastUnit) {
                setExpandedItemId(null);
            } else {
                // Go back to previous unit if possible
                setSelectedUnitIndex(prev => Math.max(0, prev - 1));
            }
            setConfirmDeleteId(null);
        } finally {
            setIsDeletingEquipment(false);
        }
    };

    const toggleExpand = (id: string) => {
        if (expandedItemId === id) {
            setExpandedItemId(null);
        } else {
            setExpandedItemId(id);
            setSelectedUnitIndex(0);
        }
    };

    // Helper to check if we can perform actions
    const canEdit = !!currentUser;

    const handleStatusChange = (status: EquipmentStatus, equipmentId: string, unitId: string, currentStatus: EquipmentStatus) => {
        if (!currentUser) return;

        // If changing to REPAIRED, show maintenance notes modal
        if (status === EquipmentStatus.REPAIRED) {
            setPendingMaintenanceUnit({
                equipmentId,
                unitId,
                previousStatus: currentStatus
            });
            setMaintenanceNotes("");
            setShowMaintenanceModal(true);
        } else {
            updateUnitStatus(studioId, equipmentId, unitId, status, currentUser);
        }
    };

    const handleConfirmMaintenance = async () => {
        if (!currentUser || !pendingMaintenanceUnit) return;

        // Record maintenance history
        await recordMaintenanceReturn(
            studioId,
            pendingMaintenanceUnit.equipmentId,
            pendingMaintenanceUnit.unitId,
            pendingMaintenanceUnit.previousStatus,
            currentUser,
            maintenanceNotes
        );

        // Update status to REPAIRED
        await updateUnitStatus(
            studioId,
            pendingMaintenanceUnit.equipmentId,
            pendingMaintenanceUnit.unitId,
            EquipmentStatus.REPAIRED,
            currentUser
        );

        // Close modal
        setShowMaintenanceModal(false);
        setPendingMaintenanceUnit(null);
        setMaintenanceNotes("");
    };

    const handleLabelStatusChange = (status: LabelStatus, equipmentId: string, unitId: string) => {
        if (!currentUser) return;
        updateUnitLabelStatus(studioId, equipmentId, unitId, status, currentUser);
    };

    const handleToggleReplacement = (equipmentId: string, unitId: string) => {
        if (!currentUser) return;
        toggleUnitLabelReplacement(studioId, equipmentId, unitId, currentUser);
    };

    const handleLabelRemarkChange = (equipmentId: string, unitId: string, value: string) => {
        if (!currentUser) return;
        updateUnitLabelRemark(studioId, equipmentId, unitId, value, currentUser);
    };

    const handleRemarkChange = (equipmentId: string, unitId: string, value: string) => {
        if (!currentUser) return;
        updateUnitRemark(studioId, equipmentId, unitId, value, currentUser);
    };

    const handleSignIn = (name: string) => {
        const trimmed = name.trim();
        if (trimmed) {
            addStudioAssignee(studioId, trimmed);
            setCurrentUser(trimmed);
            setNameInput("");
            setShowNameModal(false);
        }
    };

    const currentStatusOptions = [
        { value: EquipmentStatus.UNCHECKED, label: "未清點", color: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 data-[state=active]:bg-slate-500 data-[state=active]:text-white data-[state=active]:border-slate-500" },
        { value: EquipmentStatus.NORMAL, label: "正常", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600" },
        { value: EquipmentStatus.DAMAGED, label: "損壞", color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-red-600" },
        { value: EquipmentStatus.LOST, label: "遺失", color: "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 data-[state=active]:bg-stone-600 data-[state=active]:text-white data-[state=active]:border-stone-600" },
        { value: EquipmentStatus.MAINTENANCE, label: "外出", color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:border-purple-600" },
        { value: EquipmentStatus.REPAIRED, label: "已維修", color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600" },
    ];

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
                            <span className="text-2xl">{studio.icon}</span>
                            {studio.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            {assignees.length > 0 ? (
                                assignees.map((assignee) => (
                                    <div
                                        key={assignee}
                                        className={cn(
                                            "flex items-center gap-1 text-xs px-2 py-1 rounded-full cursor-pointer transition-all border",
                                            currentUser === assignee
                                                ? "bg-blue-100 text-blue-700 border-blue-200 font-bold"
                                                : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"
                                        )}
                                        onClick={() => setCurrentUser(assignee)}
                                    >
                                        <User className="w-3 h-3" />
                                        {assignee}
                                        {/* Optional remove button could go here */}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground">還未有人簽到</p>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={toggleNameModal}
                    className={cn(
                        "p-2 rounded-full transition-all border flex items-center gap-2 px-3",
                        assignees.length > 0
                            ? "bg-secondary text-foreground border-border hover:bg-secondary/80"
                            : "bg-primary text-primary-foreground border-transparent hover:opacity-90 animate-pulse"
                    )}
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-bold">簽到</span>
                </button>
            </header>

            {/* Modal */}
            {showNameModal && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border p-6 space-y-6 animate-in fade-in zoom-in duration-300 relative">
                        <button
                            onClick={() => setShowNameModal(false)}
                            className="absolute top-4 right-4 p-1 text-muted-foreground hover:bg-secondary rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                <User className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold">新增檢查人員</h2>
                            <p className="text-sm text-muted-foreground">請輸入您的姓名以加入清點行列。</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="您的姓名"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSignIn(nameInput);
                                }}
                            />

                            {/* User History */}
                            {userHistory.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-muted-foreground flex items-center gap-1 justify-center">
                                        <History className="w-3 h-3" /> 最近使用
                                    </h3>
                                    <div className="flex flex-wrap gap-2 justify-center max-h-[100px] overflow-y-auto p-1">
                                        {userHistory.map(name => (
                                            <button
                                                key={name}
                                                onClick={() => handleSignIn(name)}
                                                className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-xs rounded-lg transition-colors border border-transparent hover:border-border"
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => handleSignIn(nameInput)}
                                disabled={!nameInput.trim()}
                                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                確認加入 <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Maintenance Notes Modal */}
            {showMaintenanceModal && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border p-6 space-y-6 animate-in fade-in zoom-in duration-300 relative">
                        <button
                            onClick={() => {
                                setShowMaintenanceModal(false);
                                setPendingMaintenanceUnit(null);
                                setMaintenanceNotes("");
                            }}
                            className="absolute top-4 right-4 p-1 text-muted-foreground hover:bg-secondary rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold">維修完成歸還</h2>
                            <p className="text-sm text-muted-foreground">請輸入維修相關備註（選填）</p>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                placeholder="例如：更換鏡頭、清潔感光元件、校正白平衡等..."
                                value={maintenanceNotes}
                                onCompositionStart={() => {
                                    isComposingRef.current = true;
                                }}
                                onCompositionEnd={(e) => {
                                    isComposingRef.current = false;
                                    setMaintenanceNotes(e.currentTarget.value);
                                }}
                                onChange={e => {
                                    if (!isComposingRef.current) {
                                        setMaintenanceNotes(e.target.value);
                                    }
                                }}
                                className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                                autoFocus
                            />

                            <button
                                onClick={handleConfirmMaintenance}
                                className="w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                確認歸還 <CheckCircle2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Equipment Modal */}
            {showAddEquipmentModal && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border p-6 space-y-5 animate-in fade-in zoom-in duration-300 relative">
                        <button
                            onClick={() => setShowAddEquipmentModal(false)}
                            className="absolute top-4 right-4 p-1 text-muted-foreground hover:bg-secondary rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                <Plus className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold">新增器材</h2>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex bg-secondary p-1 rounded-xl">
                            <button
                                onClick={() => setAddEquipmentMode('new')}
                                className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", addEquipmentMode === 'new' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground")}
                            >
                                建立新器材
                            </button>
                            <button
                                onClick={() => { setAddEquipmentMode('existing'); if (!selectedExistingId && equipment.length > 0) setSelectedExistingId(equipment[0].id); }}
                                className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", addEquipmentMode === 'existing' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground")}
                            >
                                加入現有項目
                            </button>
                        </div>

                        <div className="space-y-4">
                            {addEquipmentMode === 'new' ? (
                                <>
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted-foreground">器材名稱 <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="例如：Sony A7S3"
                                            value={addEquipmentForm.name}
                                            onCompositionStart={() => { isAddingNameRef.current = true; }}
                                            onCompositionEnd={() => { isAddingNameRef.current = false; }}
                                            onChange={(e) => setAddEquipmentForm(prev => ({ ...prev, name: e.target.value }))}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !isAddingNameRef.current) handleAddEquipment(); }}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            autoFocus
                                        />
                                    </div>
                                    {/* Category */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted-foreground">分類</label>
                                        <select
                                            value={addEquipmentForm.category}
                                            onChange={(e) => setAddEquipmentForm(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                                        >
                                            {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                                            <option value="其他">其他</option>
                                        </select>
                                    </div>
                                    {/* Quantity + Unit */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted-foreground">數量</label>
                                            <input type="number" min={1} max={50} value={addEquipmentForm.quantity}
                                                onChange={(e) => setAddEquipmentForm(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted-foreground">單位</label>
                                            <input type="text" placeholder="台" value={addEquipmentForm.unit}
                                                onCompositionStart={() => { isAddingUnitRef.current = true; }}
                                                onCompositionEnd={() => { isAddingUnitRef.current = false; }}
                                                onChange={(e) => setAddEquipmentForm(prev => ({ ...prev, unit: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Existing item picker */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted-foreground">選擇器材項目</label>
                                        <select
                                            value={selectedExistingId}
                                            onChange={(e) => setSelectedExistingId(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                                        >
                                            {equipment.map(eq => (
                                                <option key={eq.id} value={eq.id}>{eq.name}（目前 {eq.quantity} {eq.unit}）</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Additional quantity */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted-foreground">新增數量</label>
                                        <input type="number" min={1} max={50} value={addEquipmentForm.quantity}
                                            onChange={(e) => setAddEquipmentForm(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                        {selectedExistingId && (() => {
                                            const eq = equipment.find(e => e.id === selectedExistingId);
                                            return eq ? <p className="text-xs text-muted-foreground text-center">新增後共 {eq.quantity + addEquipmentForm.quantity} {eq.unit}</p> : null;
                                        })()}
                                    </div>
                                </>
                            )}

                            <button
                                onClick={handleAddEquipment}
                                disabled={(
                                    addEquipmentMode === 'new' ? !addEquipmentForm.name.trim() : !selectedExistingId
                                ) || isAddingEquipment}
                                className={cn(
                                    "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                                    addEquipmentSuccess
                                        ? "bg-green-500 text-white"
                                        : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                                )}
                            >
                                {addEquipmentSuccess ? (
                                    <><CheckCircle2 className="w-4 h-4" /> {addEquipmentMode === 'existing' ? '新增台數成功！' : '新增成功！'}</>
                                ) : isAddingEquipment ? '處理中...' : (
                                    <><Plus className="w-4 h-4" /> {addEquipmentMode === 'existing' ? '確認加入台數' : '確認新增'}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className={cn(
                "flex-1 overflow-y-auto px-4 py-6 transition-all duration-300",
                !currentUser && "opacity-50 pointer-events-none grayscale-[0.5]"
            )}>
                <div className="space-y-8 pb-40">
                    {categories.map((category) => {
                        const items = equipment.filter((e) => e.category === category);

                        return (
                            <div key={category} className="space-y-3">
                                <h2 className="text-sm font-semibold text-muted-foreground px-1 sticky top-0 bg-background/95 backdrop-blur py-2 z-10 border-b border-border/50 flex items-center justify-between">
                                    <span>{category}</span>
                                    <button
                                        onClick={() => openAddEquipmentModal(category)}
                                        className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                        title={`在「${category}」新增器材`}
                                    >
                                        <Plus className="w-3 h-3" />
                                        新增
                                    </button>
                                </h2>

                                <div className="flex flex-col gap-3">
                                    {items.map((item) => {
                                        const isExpanded = expandedItemId === item.id;
                                        const activeUnit = item.units[selectedUnitIndex];
                                        const checkedCount = item.units.filter(u => u.status !== EquipmentStatus.UNCHECKED).length;

                                        return (
                                            <div
                                                key={item.id}
                                                className="group flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-300"
                                            >
                                                {/* Card Header (Clickable) */}
                                                <button
                                                    onClick={() => toggleExpand(item.id)}
                                                    className="flex items-stretch min-h-[5rem] text-left p-0 w-full"
                                                >
                                                    <div className="flex-1 p-5 flex flex-col justify-center">
                                                        <h3 className="text-lg font-bold text-foreground mb-1">
                                                            {item.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-muted-foreground">{item.category}</span>
                                                            <span className="text-border mx-1">•</span>
                                                            <span className={cn("font-medium", checkedCount === item.quantity ? "text-green-600" : "text-blue-600")}>
                                                                已清點 {checkedCount} / {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="pr-5 flex items-center justify-center text-muted-foreground/30">
                                                        {/* Visual dots indicator for units */}
                                                        <div className="mr-4 flex gap-1">
                                                            {!isExpanded && (
                                                                <div className="flex gap-1">
                                                                    {item.quantity <= 5 && item.units.map((u, i) => (
                                                                        <div key={i} className={cn("w-2 h-2 rounded-full", u.status !== EquipmentStatus.UNCHECKED ? "bg-blue-400" : "bg-secondary")} />
                                                                    ))}
                                                                    {item.quantity > 5 && (
                                                                        <Circle className="w-2 h-2 text-border" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <ChevronDown
                                                            className={cn(
                                                                "w-6 h-6 transition-transform duration-300",
                                                                isExpanded && "rotate-180"
                                                            )}
                                                        />
                                                    </div>
                                                </button>

                                                {/* Expanded Content */}
                                                <AnimatePresence>
                                                    {isExpanded && activeUnit && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="border-t border-border bg-background"
                                                        >
                                                            <div className="p-5 space-y-6">

                                                                {/* 1. Unit Tabs Scrollable */}
                                                                <div className="flex overflow-x-auto gap-2 pb-2 -mx-2 px-2 no-scrollbar">
                                                                    {item.units.map((unit, index) => {
                                                                        const isChecked = unit.status !== EquipmentStatus.UNCHECKED;
                                                                        return (
                                                                            <button
                                                                                key={unit.id}
                                                                                onClick={() => setSelectedUnitIndex(index)}
                                                                                className={cn(
                                                                                    "flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all border relative overflow-hidden",
                                                                                    index === selectedUnitIndex
                                                                                        ? "bg-white border-blue-200 text-blue-600 shadow-sm ring-1 ring-blue-200"
                                                                                        : "bg-secondary/50 border-transparent text-muted-foreground hover:bg-secondary",
                                                                                    isChecked && index !== selectedUnitIndex && "bg-blue-50/50 text-blue-600/70 border-blue-100"
                                                                                )}
                                                                            >
                                                                                {/* Small dot for unchecked/checked state */}
                                                                                <span className={cn("absolute top-1 right-1 w-1.5 h-1.5 rounded-full", isChecked ? "bg-green-400" : "bg-slate-300")} />
                                                                                {unit.unitLabel || unit.id.split('-').pop()}
                                                                            </button>
                                                                        )
                                                                    })}
                                                                </div>

                                                                {/* 2. Current Unit Header */}
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <h4 className="text-xs text-muted-foreground font-medium">當前機台</h4>
                                                                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold",
                                                                            activeUnit.status === EquipmentStatus.UNCHECKED ? "bg-slate-100 text-slate-500" : "bg-green-100 text-green-700"
                                                                        )}>
                                                                            {activeUnit.status === EquipmentStatus.UNCHECKED ? '未清點' : activeUnit.status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-lg font-bold text-foreground font-mono tracking-tight">
                                                                        {activeUnit.unitLabel || activeUnit.id}
                                                                    </p>
                                                                    {activeUnit.checkedBy && (
                                                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                                            <User className="w-3 h-3" />
                                                                            {activeUnit.checkedBy} 檢查
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* 3. Status Grid */}
                                                                <div>
                                                                    <h4 className="text-xs text-muted-foreground font-medium mb-2">清點狀況</h4>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        {currentStatusOptions.map((option) => {
                                                                            const isActive = activeUnit.status === option.value;
                                                                            return (
                                                                                <button
                                                                                    key={option.value}
                                                                                    onClick={() => handleStatusChange(option.value, item.id, activeUnit.id, activeUnit.status)}
                                                                                    data-state={isActive ? 'active' : 'inactive'}
                                                                                    className={cn(
                                                                                        "relative py-3 rounded-xl text-sm font-bold border transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-1",
                                                                                        option.color
                                                                                    )}
                                                                                >
                                                                                    {option.label}
                                                                                    {isActive && activeUnit.checkedBy && (
                                                                                        <span className="absolute bottom-1 right-2 text-[10px] opacity-80 font-normal">
                                                                                            {activeUnit.checkedBy}
                                                                                        </span>
                                                                                    )}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                {/* 4. Label Replacement Section */}
                                                                <div className="space-y-3">
                                                                    <button
                                                                        onClick={() => handleToggleReplacement(item.id, activeUnit.id)}
                                                                        className={cn(
                                                                            "w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-colors active:scale-[0.98]",
                                                                            activeUnit.replacementPending
                                                                                ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-200"
                                                                                : "bg-white border-border text-foreground hover:bg-secondary/50"
                                                                        )}
                                                                    >
                                                                        <Tag className={cn("w-4 h-4", activeUnit.replacementPending ? "text-white fill-white" : "text-orange-400 fill-orange-400")} />
                                                                        {activeUnit.replacementPending ? "已標記需換標籤" : "標籤更換"}
                                                                    </button>

                                                                    {/* Label Remark Input - Only visible when replacement pending */}
                                                                    {activeUnit.replacementPending && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
                                                                                <label className="text-xs font-bold text-orange-700 block">
                                                                                    標籤置換與去向備註：
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="例如：更換為 1A-A7S3-01 / 送去維修"
                                                                                    value={activeUnit.labelRemark || ''}
                                                                                    onChange={(e) => handleLabelRemarkChange(item.id, activeUnit.id, e.target.value)}
                                                                                    className="w-full px-3 py-2 rounded-lg border border-orange-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                                                                />
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </div>

                                                                {/* 5. Label Status & Next Unit */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="text-xs text-muted-foreground font-medium mb-2">標籤狀態</h4>
                                                                        <div className="flex bg-secondary p-1 rounded-lg">
                                                                            <button
                                                                                onClick={() => handleLabelStatusChange(LabelStatus.LABELED, item.id, activeUnit.id)}
                                                                                className={cn("flex-1 py-2 text-sm font-medium rounded-md transition-all", activeUnit.labelStatus === LabelStatus.LABELED ? "bg-white shadow-sm text-blue-600" : "text-muted-foreground")}
                                                                            >
                                                                                已貼
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleLabelStatusChange(LabelStatus.UNLABELED, item.id, activeUnit.id)}
                                                                                className={cn("flex-1 py-2 text-sm font-medium rounded-md transition-all", activeUnit.labelStatus === LabelStatus.UNLABELED ? "bg-white shadow-sm text-red-600" : "text-muted-foreground")}
                                                                            >
                                                                                未貼
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <h4 className="text-xs text-muted-foreground font-medium mb-2">快速切換</h4>
                                                                        <button
                                                                            onClick={() => {
                                                                                if (selectedUnitIndex < item.units.length - 1) {
                                                                                    setSelectedUnitIndex(prev => prev + 1);
                                                                                }
                                                                            }}
                                                                            disabled={selectedUnitIndex >= item.units.length - 1}
                                                                            className="w-full h-[42px] flex items-center justify-center gap-2 bg-secondary/80 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-foreground transition-colors"
                                                                        >
                                                                            下一台 <ArrowRight className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* 6. Remarks */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="text-xs text-muted-foreground font-medium">狀態備註</h4>
                                                                        <button className="flex items-center gap-1 text-[10px] font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors">
                                                                            <Sparkles className="w-3 h-3" /> AI 建議
                                                                        </button>
                                                                    </div>
                                                                    <textarea
                                                                        value={activeUnit.remark || ''}
                                                                        onChange={(e) => handleRemarkChange(item.id, activeUnit.id, e.target.value)}
                                                                        placeholder="輸入此機台的特殊狀況..."
                                                                        className="w-full min-h-[80px] p-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                                                    />
                                                                </div>

                                                                {/* 7. Delete Unit / Equipment */}
                                                                {confirmDeleteId === item.id ? (
                                                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                                                                        {item.units.length === 1 ? (
                                                                            <>
                                                                                <p className="text-sm font-bold text-red-700 text-center">確定要刪除「{item.name}」嗎？</p>
                                                                                <p className="text-xs text-red-500 text-center">這是最後一個標籤，整個器材項目將被移除。</p>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <p className="text-sm font-bold text-red-700 text-center">確定要刪除標籤「{activeUnit.unitLabel}」嗎？</p>
                                                                                <p className="text-xs text-red-500 text-center">其餘 {item.units.length - 1} 個標籤不受影響。</p>
                                                                            </>
                                                                        )}
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={() => setConfirmDeleteId(null)}
                                                                                className="flex-1 py-2 rounded-lg border border-border text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors"
                                                                            >
                                                                                取消
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteUnit(item.id, activeUnit.id, item.units.length === 1)}
                                                                                disabled={isDeletingEquipment}
                                                                                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                                {isDeletingEquipment ? '刪除中...' : '確認刪除'}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setConfirmDeleteId(item.id)}
                                                                        className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        {item.units.length === 1 ? '刪除此器材' : `刪除此標籤（${activeUnit.unitLabel}）`}
                                                                    </button>
                                                                )}

                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
