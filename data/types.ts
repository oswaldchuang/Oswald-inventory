export enum EquipmentStatus {
    UNCHECKED = '未清點',
    NORMAL = '正常',
    DAMAGED = '損壞',
    LOST = '遺失',
    MAINTENANCE = '外出拍攝',
    REPAIRED = '已維修'
}

export enum LabelStatus {
    LABELED = '有標籤',
    UNLABELED = '無標籤',
    LABEL_DAMAGED = '標籤損毀'
}

export type EquipmentCategory =
    | '相機組'
    | '腳架組'
    | '圖傳Monitor'
    | '燈光組'
    | '收音組'
    | '線材電池組'
    | '記憶卡';

export interface EquipmentUnit {
    id: string;
    unitIndex: number;
    unitLabel: string;
    status: EquipmentStatus;
    labelStatus: LabelStatus;
    replacementPending?: boolean;
    labelRemark?: string; // Remark for label replacement
    remark: string; // General status remark
    checkedBy?: string; // Name of the user who last checked this unit
}

export interface Equipment {
    id: string;
    name: string;
    category: EquipmentCategory;
    quantity: number;
    unit: string;
    units: EquipmentUnit[];
}

export interface Studio {
    id: string;
    name: string;
    description: string;
    icon: string;
    themeColor: string;
    assignee?: string; // Deprecated: Single person responsible
    assignees?: string[]; // List of people checking
    equipment: Equipment[];
}

export interface MaintenanceHistory {
    id: string;
    unitId: string;
    equipmentId: string;
    equipmentName: string;
    unitLabel: string;
    studioId: string;
    studioName: string;
    // Previous status before sent to maintenance
    previousStatus: EquipmentStatus;
    // Maintenance record
    sentToMaintenanceAt: Date;
    sentBy: string;
    returnedAt: Date;
    returnedBy: string;
    notes?: string;
    createdAt: Date;
}
