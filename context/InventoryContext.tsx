"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    addDoc,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Studio, Equipment, EquipmentUnit, EquipmentStatus, LabelStatus, MaintenanceHistory } from "@/data/types";

interface InventoryContextType {
    studios: Studio[];
    userHistory: string[];
    maintenanceHistory: MaintenanceHistory[];
    loading: boolean;
    updateUnitStatus: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        newStatus: EquipmentStatus,
        checkedBy?: string
    ) => Promise<void>;
    updateUnitLabelStatus: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        newLabelStatus: LabelStatus,
        checkedBy?: string
    ) => Promise<void>;
    toggleUnitLabelReplacement: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        checkedBy?: string
    ) => Promise<void>;
    updateUnitLabelRemark: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        remark: string,
        checkedBy?: string
    ) => Promise<void>;
    updateUnitRemark: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        remark: string,
        checkedBy?: string
    ) => Promise<void>;
    updateStudioAssignee: (studioId: string, assignee: string) => Promise<void>;
    addStudioAssignee: (studioId: string, assignee: string) => Promise<void>;
    removeStudioAssignee: (studioId: string, assignee: string) => Promise<void>;
    addToUserHistory: (name: string) => void;
    recordMaintenanceReturn: (
        studioId: string,
        equipmentId: string,
        unitId: string,
        previousStatus: EquipmentStatus,
        returnedBy: string,
        notes?: string
    ) => Promise<void>;
    deleteMaintenanceRecord: (recordId: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
    // Separate states for raw data from each collection
    const [rawStudios, setRawStudios] = useState<any[]>([]);
    const [equipmentMap, setEquipmentMap] = useState<Map<string, Equipment[]>>(new Map());
    const [unitsMap, setUnitsMap] = useState<Map<string, EquipmentUnit[]>>(new Map());
    const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceHistory[]>([]);
    const [userHistory, setUserHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Load user history from local storage
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
            const newHistory = [name, ...prev].slice(0, 10);
            localStorage.setItem('inventory_user_history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    // Subscribe to studios
    useEffect(() => {
        const studiosRef = collection(db, "studios");
        const unsubscribe = onSnapshot(studiosRef, (snapshot) => {
            const studiosData: any[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                studiosData.push({
                    id: data.id,
                    name: data.name,
                    icon: data.icon,
                    themeColor: data.themeColor,
                    description: data.description || '',
                    assignees: data.assignees || [],
                    assignee: data.assignees?.[0],
                });
            });
            setRawStudios(studiosData);
        });

        return () => unsubscribe();
    }, []);

    // Subscribe to equipment
    useEffect(() => {
        const equipmentRef = collection(db, "equipment");
        const unsubscribe = onSnapshot(equipmentRef, (snapshot) => {
            const map = new Map<string, Equipment[]>();

            snapshot.forEach((doc) => {
                const data = doc.data();
                const equipment: Equipment = {
                    id: data.id,
                    name: data.name,
                    category: data.category,
                    quantity: data.quantity,
                    unit: data.unit || '台',
                    units: [],
                };

                const studioId = data.studioId;
                if (!map.has(studioId)) {
                    map.set(studioId, []);
                }
                map.get(studioId)!.push(equipment);
            });

            setEquipmentMap(map);
        });

        return () => unsubscribe();
    }, []);

    // Subscribe to equipment units
    useEffect(() => {
        const unitsRef = collection(db, "equipment_units");
        const unsubscribe = onSnapshot(unitsRef, (snapshot) => {
            const map = new Map<string, EquipmentUnit[]>();

            snapshot.forEach((doc) => {
                const data = doc.data();
                const unit: EquipmentUnit = {
                    id: data.id,
                    unitIndex: data.unitIndex || 0,
                    unitLabel: data.unitLabel,
                    status: data.status || 'available',
                    labelStatus: data.labelStatus || 'normal',
                    remark: data.remark || '',
                    labelRemark: data.labelRemark || '',
                    checkedBy: data.checkedBy || undefined,
                    replacementPending: data.replacementPending || false,
                };

                const equipmentId = data.equipmentId;
                if (!map.has(equipmentId)) {
                    map.set(equipmentId, []);
                }
                map.get(equipmentId)!.push(unit);
            });

            setUnitsMap(map);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Subscribe to maintenance history
    useEffect(() => {
        const historyRef = collection(db, "maintenance_history");
        const unsubscribe = onSnapshot(historyRef, (snapshot) => {
            const historyData: any[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                historyData.push({
                    id: data.id,
                    unitId: data.unitId,
                    equipmentId: data.equipmentId,
                    equipmentName: data.equipmentName,
                    unitLabel: data.unitLabel,
                    studioId: data.studioId,
                    studioName: data.studioName,
                    previousStatus: data.previousStatus,
                    sentToMaintenanceAt: data.sentToMaintenanceAt?.toDate(),
                    sentBy: data.sentBy,
                    returnedAt: data.returnedAt?.toDate(),
                    returnedBy: data.returnedBy,
                    notes: data.notes || '',
                    createdAt: data.createdAt?.toDate(),
                });
            });
            setMaintenanceHistory(historyData);
        });

        return () => unsubscribe();
    }, []);

    // Combine data using useMemo - this prevents race conditions
    const studios = useMemo(() => {
        return rawStudios.map(studio => {
            const equipment = equipmentMap.get(studio.id) || [];

            const equipmentWithUnits = equipment.map(eq => ({
                ...eq,
                units: unitsMap.get(eq.id) || [],
            }));

            return {
                ...studio,
                equipment: equipmentWithUnits,
            };
        });
    }, [rawStudios, equipmentMap, unitsMap]);

    // Update functions
    const updateUnitStatus = async (
        studioId: string,
        equipmentId: string,
        unitId: string,
        newStatus: EquipmentStatus,
        checkedBy?: string
    ) => {
        const unitRef = doc(db, "equipment_units", unitId);
        await updateDoc(unitRef, {
            status: newStatus,
            checkedBy: checkedBy || null,
            updatedAt: new Date(),
        });
    };

    const updateUnitLabelStatus = async (
        studioId: string,
        equipmentId: string,
        unitId: string,
        newLabelStatus: LabelStatus,
        checkedBy?: string
    ) => {
        const unitRef = doc(db, "equipment_units", unitId);
        await updateDoc(unitRef, {
            labelStatus: newLabelStatus,
            checkedBy: checkedBy || null,
            updatedAt: new Date(),
        });
    };

    const toggleUnitLabelReplacement = async (
        studioId: string,
        equipmentId: string,
        unitId: string,
        checkedBy?: string
    ) => {
        const studio = studios.find((s: Studio) => s.id === studioId);
        const equipment = studio?.equipment.find((e: Equipment) => e.id === equipmentId);
        const unit = equipment?.units.find((u: EquipmentUnit) => u.id === unitId);

        if (unit) {
            const unitRef = doc(db, "equipment_units", unitId);
            await updateDoc(unitRef, {
                replacementPending: !unit.replacementPending,
                checkedBy: checkedBy || null,
                updatedAt: new Date(),
            });
        }
    };

    const updateUnitLabelRemark = async (
        studioId: string,
        equipmentId: string,
        unitId: string,
        remark: string,
        checkedBy?: string
    ) => {
        const unitRef = doc(db, "equipment_units", unitId);
        await updateDoc(unitRef, {
            labelRemark: remark,
            checkedBy: checkedBy || null,
            updatedAt: new Date(),
        });
    };

    const updateUnitRemark = async (
        studioId: string,
        equipmentId: string,
        unitId: string,
        remark: string,
        checkedBy?: string
    ) => {
        const unitRef = doc(db, "equipment_units", unitId);
        await updateDoc(unitRef, {
            remark: remark,
            checkedBy: checkedBy || null,
            updatedAt: new Date(),
        });
    };

    const updateStudioAssignee = async (studioId: string, assignee: string) => {
        await addStudioAssignee(studioId, assignee);
    };

    const addStudioAssignee = async (studioId: string, assignee: string) => {
        addToUserHistory(assignee);
        const studioRef = doc(db, "studios", studioId);
        await updateDoc(studioRef, {
            assignees: arrayUnion(assignee),
            updatedAt: new Date(),
        });
    };

    const removeStudioAssignee = async (studioId: string, assignee: string) => {
        const studioRef = doc(db, "studios", studioId);
        await updateDoc(studioRef, {
            assignees: arrayRemove(assignee),
            updatedAt: new Date(),
        });
    };

    const recordMaintenanceReturn = async (
        studioId: string,
        equipmentId: string,
        unitId: string,
        previousStatus: EquipmentStatus,
        returnedBy: string,
        notes?: string
    ) => {
        // Find unit details
        const studio = rawStudios.find((s: any) => s.id === studioId);
        const equipment = equipmentMap.get(studioId)?.find((e: Equipment) => e.id === equipmentId);
        const unit = unitsMap.get(equipmentId)?.find((u: EquipmentUnit) => u.id === unitId);

        if (!studio || !equipment || !unit) {
            console.error('Unable to find studio, equipment, or unit for maintenance record');
            return;
        }

        const historyRef = collection(db, "maintenance_history");
        await addDoc(historyRef, {
            id: `${unitId}_${Date.now()}`,
            unitId: unitId,
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            unitLabel: unit.unitLabel,
            studioId: studioId,
            studioName: studio.name,
            previousStatus: previousStatus,
            sentToMaintenanceAt: Timestamp.now(),
            sentBy: returnedBy,
            returnedAt: Timestamp.now(),
            returnedBy: returnedBy,
            notes: notes || '',
            createdAt: Timestamp.now(),
        });
    };

    const deleteMaintenanceRecord = async (recordId: string) => {
        try {
            // Find the document in maintenance_history collection
            const historyRef = collection(db, "maintenance_history");

            // We need to find the document by the recordId
            // Since recordId is stored as a field, we need to iterate through to find the Firebase doc ID
            const recordToDelete = maintenanceHistory.find(record => record.id === recordId);

            if (!recordToDelete) {
                console.error('Maintenance record not found');
                return;
            }

            // Query to find the document
            // For simplicity, we'll delete by searching for matching fields
            // A better approach would be to store the Firebase document ID in the record
            const snapshot = await (await import('firebase/firestore')).getDocs(historyRef);
            let docIdToDelete = null;

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.id === recordId) {
                    docIdToDelete = doc.id;
                }
            });

            if (docIdToDelete) {
                await deleteDoc(doc(db, "maintenance_history", docIdToDelete));
            }
        } catch (error) {
            console.error('Error deleting maintenance record:', error);
            throw error;
        }
    };

    return (
        <InventoryContext.Provider value={{
            studios,
            userHistory,
            loading,
            updateUnitStatus,
            updateUnitLabelStatus,
            toggleUnitLabelReplacement,
            updateUnitLabelRemark,
            updateUnitRemark,
            updateStudioAssignee,
            addStudioAssignee,
            removeStudioAssignee,
            addToUserHistory,
            maintenanceHistory,
            recordMaintenanceReturn,
            deleteMaintenanceRecord
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
