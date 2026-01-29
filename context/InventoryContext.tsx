"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Studio, EquipmentStatus, LabelStatus } from "@/data/types";
import { INITIAL_STUDIOS } from "@/data/constants";

interface InventoryContextType {
    studios: Studio[];
    userHistory: string[];
    updateUnitStatus: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        newStatus: EquipmentStatus,
        checkedBy?: string
    ) => void;
    updateUnitLabelStatus: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        newLabelStatus: LabelStatus,
        checkedBy?: string
    ) => void;
    toggleUnitLabelReplacement: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        checkedBy?: string
    ) => void;
    updateUnitLabelRemark: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        remark: string,
        checkedBy?: string
    ) => void;
    updateUnitRemark: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        remark: string,
        checkedBy?: string
    ) => void;
    updateStudioAssignee: (studioId: string, assignee: string) => void; // Deprecated
    addStudioAssignee: (studioId: string, assignee: string) => void;
    removeStudioAssignee: (studioId: string, assignee: string) => void;
    addToUserHistory: (name: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
    const [studios, setStudios] = useState<Studio[]>(INITIAL_STUDIOS);
    const [userHistory, setUserHistory] = useState<string[]>([]);

    // Load user history from local storage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('inventory_user_history');
        if (savedHistory) {
            try {
                setUserHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse user history", e);
            }
        }
    }, []);

    const addToUserHistory = (name: string) => {
        setUserHistory(prev => {
            if (prev.includes(name)) return prev;
            const newHistory = [name, ...prev].slice(0, 10); // Keep last 10
            localStorage.setItem('inventory_user_history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    // Helper to update state deeply
    const updateUnit = (
        studioId: string,
        equipmentId: string,
        unitId: string,
        updater: (unit: any) => any
    ) => {
        setStudios((prev) =>
            prev.map((s) => {
                if (s.id !== studioId) return s;
                return {
                    ...s,
                    equipment: s.equipment.map((e) => {
                        if (e.id !== equipmentId) return e;
                        return {
                            ...e,
                            units: e.units.map((u) => {
                                if (u.id !== unitId) return u;
                                return { ...u, ...updater(u) };
                            }),
                        };
                    }),
                };
            })
        );
    };

    const updateUnitStatus = (studioId: string, equipmentId: string, unitId: string, newStatus: EquipmentStatus, checkedBy?: string) => {
        updateUnit(studioId, equipmentId, unitId, () => ({ status: newStatus, checkedBy }));
    };

    const updateUnitLabelStatus = (studioId: string, equipmentId: string, unitId: string, newLabelStatus: LabelStatus, checkedBy?: string) => {
        updateUnit(studioId, equipmentId, unitId, () => ({ labelStatus: newLabelStatus, checkedBy }));
    };

    const toggleUnitLabelReplacement = (studioId: string, equipmentId: string, unitId: string, checkedBy?: string) => {
        updateUnit(studioId, equipmentId, unitId, (u) => ({ replacementPending: !u.replacementPending, checkedBy }));
    };

    const updateUnitLabelRemark = (studioId: string, equipmentId: string, unitId: string, remark: string, checkedBy?: string) => {
        updateUnit(studioId, equipmentId, unitId, () => ({ labelRemark: remark, checkedBy }));
    };

    const updateUnitRemark = (studioId: string, equipmentId: string, unitId: string, remark: string, checkedBy?: string) => {
        updateUnit(studioId, equipmentId, unitId, () => ({ remark, checkedBy }));
    };

    const updateStudioAssignee = (studioId: string, assignee: string) => {
        setStudios(prev => prev.map(s => s.id === studioId ? { ...s, assignee } : s));
    };

    const addStudioAssignee = (studioId: string, assignee: string) => {
        addToUserHistory(assignee);
        setStudios(prev => prev.map(s => {
            if (s.id !== studioId) return s;
            const currentAssignees = s.assignees || [];
            if (currentAssignees.includes(assignee)) return s;
            return {
                ...s,
                assignees: [...currentAssignees, assignee],
                assignee: assignee // Update legacy field for compatibility
            };
        }));
    };

    const removeStudioAssignee = (studioId: string, assignee: string) => {
        setStudios(prev => prev.map(s => {
            if (s.id !== studioId) return s;
            const newAssignees = (s.assignees || []).filter(a => a !== assignee);
            return {
                ...s,
                assignees: newAssignees,
                assignee: newAssignees.length > 0 ? newAssignees[0] : undefined // Revert to another assignee or undefined
            };
        }));
    };

    return (
        <InventoryContext.Provider value={{
            studios,
            userHistory,
            updateUnitStatus,
            updateUnitLabelStatus,
            toggleUnitLabelReplacement,
            updateUnitLabelRemark,
            updateUnitRemark,
            updateStudioAssignee,
            addStudioAssignee,
            removeStudioAssignee,
            addToUserHistory
        }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error("useInventory must be used within an InventoryProvider");
    }
    return context;
}
