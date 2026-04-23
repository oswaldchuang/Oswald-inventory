import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { EquipmentStatus, LabelStatus, Studio } from '@/data/types';

// ──────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────
const statusLabel = (status: EquipmentStatus): string => {
    switch (status) {
        case EquipmentStatus.UNCHECKED: return '未清點';
        case EquipmentStatus.NORMAL: return '正常';
        case EquipmentStatus.DAMAGED: return '損壞';
        case EquipmentStatus.LOST: return '遺失';
        case EquipmentStatus.MAINTENANCE: return '外出';
        case EquipmentStatus.REPAIRED: return '已維修';
        default: return status;
    }
};

const statusTextColor = (status: EquipmentStatus): string => {
    switch (status) {
        case EquipmentStatus.NORMAL: return 'FF16A34A'; // green-600
        case EquipmentStatus.DAMAGED: return 'FFDC2626'; // red-600
        case EquipmentStatus.LOST: return 'FF78716C'; // stone-500
        case EquipmentStatus.MAINTENANCE: return 'FF2563EB'; // blue-600
        case EquipmentStatus.REPAIRED: return 'FF059669'; // emerald-600
        default: return 'FF888888';
    }
};

const statusBgColor = (status: EquipmentStatus): string => {
    switch (status) {
        case EquipmentStatus.NORMAL: return 'FFF0FDF4';
        case EquipmentStatus.DAMAGED: return 'FFFEF2F2';
        case EquipmentStatus.LOST: return 'FFFAFAF9';
        case EquipmentStatus.MAINTENANCE: return 'FFEFF6FF';
        case EquipmentStatus.REPAIRED: return 'FFECFDF5';
        default: return 'FFFFFFFF';
    }
};

const applyHeaderStyle = (row: ExcelJS.Row, bgArgb: string) => {
    row.eachCell((cell) => {
        cell.font = { bold: true, size: 10, color: { argb: 'FF374151' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            bottom: { style: 'medium', color: { argb: 'FFD1D5DB' } },
        };
    });
};

// ──────────────────────────────────────────────────────
// Main export function
// ──────────────────────────────────────────────────────
export const exportDashboardToExcel = async (studios: Studio[]) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Studio Inventory Pro';
    workbook.created = new Date();

    // ── Sheet 1: Full Detail ──────────────────────────
    const detail = workbook.addWorksheet('逐標籤明細', { views: [{ showGridLines: false }] });

    detail.columns = [
        { key: 'studio', width: 14 },  // A 棚別
        { key: 'category', width: 14 },  // B 分類
        { key: 'name', width: 26 },  // C 器材名稱
        { key: 'label', width: 18 },  // D 標籤編號
        { key: 'status', width: 10 },  // E 狀態
        { key: 'labelSt', width: 10 },  // F 貼標狀況
        { key: 'replace', width: 10 },  // G 待換標
        { key: 'checkedBy', width: 12 },  // H 清點人員
        { key: 'remark', width: 30 },  // I 狀態備註
        { key: 'labelRmk', width: 30 },  // J 置換備註
    ];

    // Header row
    const headerRow = detail.addRow([
        '棚別', '分類', '器材名稱', '標籤編號',
        '狀態', '貼標狀況', '待換標籤', '清點人員',
        '狀態備註', '置換備註',
    ]);
    applyHeaderStyle(headerRow, 'FFE5E7EB');
    detail.getRow(1).height = 24;

    studios.forEach((studio) => {
        // Studio divider row
        const studioRow = detail.addRow([`${studio.icon} ${studio.name}`]);
        detail.mergeCells(`A${studioRow.number}:J${studioRow.number}`);
        studioRow.height = 22;
        studioRow.getCell(1).font = { bold: true, size: 13, color: { argb: 'FF1E293B' } };
        studioRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        studioRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

        studio.equipment.forEach((eq) => {
            eq.units.forEach((unit) => {
                const issues: string[] = [];
                if (unit.status === EquipmentStatus.DAMAGED) issues.push('損壞');
                if (unit.status === EquipmentStatus.LOST) issues.push('遺失');
                if (unit.status === EquipmentStatus.MAINTENANCE) issues.push('外出');
                if (unit.replacementPending) issues.push('待換標');

                const dataRow = detail.addRow([
                    studio.name,
                    eq.category,
                    eq.name,
                    unit.unitLabel || unit.id,
                    statusLabel(unit.status),
                    unit.labelStatus === LabelStatus.LABELED ? '已貼'
                        : unit.labelStatus === LabelStatus.UNLABELED ? '未貼' : '-',
                    unit.replacementPending ? '是' : '',
                    unit.checkedBy || '',
                    unit.remark || '',
                    unit.labelRemark || '',
                ]);

                dataRow.height = 20;
                dataRow.alignment = { vertical: 'middle' };

                // Status cell colour
                const stCell = dataRow.getCell(5);
                stCell.alignment = { horizontal: 'center', vertical: 'middle' };
                stCell.font = { bold: true, size: 10, color: { argb: statusTextColor(unit.status) } };
                stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusBgColor(unit.status) } };

                // Label status
                const lsCell = dataRow.getCell(6);
                lsCell.alignment = { horizontal: 'center', vertical: 'middle' };
                lsCell.font = {
                    bold: unit.labelStatus !== LabelStatus.LABELED,
                    size: 10,
                    color: { argb: unit.labelStatus === LabelStatus.UNLABELED ? 'FFD97706' : 'FF6B7280' },
                };

                // Replace flag
                const replCell = dataRow.getCell(7);
                replCell.alignment = { horizontal: 'center', vertical: 'middle' };
                if (unit.replacementPending) {
                    replCell.font = { bold: true, color: { argb: 'FFD97706' } };
                }

                // Highlight entire row if any issue
                if (issues.length > 0) {
                    const issueBg = unit.status === EquipmentStatus.DAMAGED ? 'FFFFF5F5'
                        : unit.status === EquipmentStatus.LOST ? 'FFFFF9F0'
                            : unit.status === EquipmentStatus.MAINTENANCE ? 'FFF0F7FF'
                                : 'FFFFFBEB';
                    [1, 2, 3, 4, 8, 9, 10].forEach(col => {
                        dataRow.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: issueBg } };
                    });
                }

                // Light border between rows
                dataRow.eachCell(cell => {
                    cell.border = { bottom: { style: 'hair', color: { argb: 'FFE5E7EB' } } };
                });
            });
        });

        // Spacer
        detail.addRow([]);
    });

    // Freeze top row
    detail.views = [{ state: 'frozen', ySplit: 1, showGridLines: false }];

    // ── Sheet 2: Issues Summary ───────────────────────
    const issues = workbook.addWorksheet('異常摘要', { views: [{ showGridLines: false }] });

    issues.columns = [
        { key: 'studio', width: 14 },
        { key: 'category', width: 14 },
        { key: 'name', width: 26 },
        { key: 'label', width: 18 },
        { key: 'issue', width: 12 },
        { key: 'checkedBy', width: 12 },
        { key: 'remark', width: 35 },
        { key: 'labelRmk', width: 35 },
    ];

    const issueHeader = issues.addRow([
        '棚別', '分類', '器材名稱', '標籤編號',
        '問題類型', '清點人員', '狀態備註', '置換備註',
    ]);
    applyHeaderStyle(issueHeader, 'FFFEE2E2');
    issues.getRow(1).height = 24;

    let hasAnyIssue = false;

    studios.forEach((studio) => {
        const studioIssues: ExcelJS.Row[] = [];

        studio.equipment.forEach((eq) => {
            eq.units.forEach((unit) => {
                const isDamaged = unit.status === EquipmentStatus.DAMAGED;
                const isLost = unit.status === EquipmentStatus.LOST;
                const isOut = unit.status === EquipmentStatus.MAINTENANCE;
                const isReplace = unit.replacementPending;

                if (!isDamaged && !isLost && !isOut && !isReplace) return;

                const issueType = isDamaged ? '損壞'
                    : isLost ? '遺失'
                        : isOut ? '外出'
                            : '待換標籤';

                const issueColor = isDamaged ? 'FFFEF2F2'
                    : isLost ? 'FFFAFAF9'
                        : isOut ? 'FFEFF6FF'
                            : 'FFFFFBEB';

                const issueTextColor = isDamaged ? 'FFDC2626'
                    : isLost ? 'FF78716C'
                        : isOut ? 'FF2563EB'
                            : 'FFD97706';

                const row = issues.addRow([
                    studio.name,
                    eq.category,
                    eq.name,
                    unit.unitLabel || unit.id,
                    issueType,
                    unit.checkedBy || '',
                    unit.remark || '',
                    unit.labelRemark || '',
                ]);

                row.height = 22;
                row.eachCell(cell => {
                    cell.alignment = { vertical: 'middle', wrapText: true };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: issueColor } };
                    cell.border = { bottom: { style: 'hair', color: { argb: 'FFE5E7EB' } } };
                });

                const issueCell = row.getCell(5);
                issueCell.alignment = { horizontal: 'center', vertical: 'middle' };
                issueCell.font = { bold: true, color: { argb: issueTextColor } };

                studioIssues.push(row);
                hasAnyIssue = true;
            });
        });

        if (studioIssues.length > 0) {
            // Group label
            const labelRow = issues.insertRow(studioIssues[0].number, [`${studio.icon} ${studio.name}（${studioIssues.length} 筆異常）`]);
            issues.mergeCells(`A${labelRow.number}:H${labelRow.number}`);
            labelRow.height = 22;
            labelRow.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF1E293B' } };
            labelRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
            labelRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
            issues.addRow([]);
        }
    });

    if (!hasAnyIssue) {
        const emptyRow = issues.addRow(['目前沒有任何異常項目 🎉']);
        issues.mergeCells(`A${emptyRow.number}:H${emptyRow.number}`);
        emptyRow.getCell(1).alignment = { horizontal: 'center' };
        emptyRow.getCell(1).font = { size: 13, color: { argb: 'FF6B7280' } };
    }

    issues.views = [{ state: 'frozen', ySplit: 1, showGridLines: false }];

    // ── Export ────────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const today = new Date().toISOString().split('T')[0];
    saveAs(blob, `器材清點報告_${today}.xlsx`);
};
