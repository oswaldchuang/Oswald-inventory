
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { EquipmentStatus, Studio } from '@/data/types';

export const exportDashboardToExcel = async (studios: Studio[]) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Studio Inventory Pro';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('器材總覽', {
        views: [{ showGridLines: false }]
    });

    // Determine all unique categories across all studios to potentially sort if needed, 
    // but usually we just want to list per studio.

    let currentRowIdx = 1;

    // Define columns primarily for width
    sheet.columns = [
        { header: '', key: 'indent', width: 2 }, // A indent
        { header: '', key: 'name', width: 30 },  // B Name
        { header: '', key: 'normal', width: 12 }, // C Normal
        { header: '', key: 'total', width: 12 },  // D Total
        { header: '', key: 'check', width: 15 },  // E Status
        { header: '', key: 'remark', width: 20 }, // F Remark
    ];

    studios.forEach((studio) => {
        // --- Studio Header ---
        const studioRow = sheet.getRow(currentRowIdx);
        studioRow.values = [null, `${studio.icon} ${studio.name}`, '', '', '', ''];

        // Merge cells for studio header
        sheet.mergeCells(`B${currentRowIdx}:F${currentRowIdx}`);

        // Style Studio Header
        studioRow.font = { size: 16, bold: true, color: { argb: 'FF000000' } }; // Black
        studioRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFEF' } // Light gray background
        };
        studioRow.height = 30;
        studioRow.alignment = { vertical: 'middle' };

        currentRowIdx++;

        // Group equipment by category
        const categories = Array.from(new Set(studio.equipment.map(e => e.category)));

        categories.forEach(category => {
            const items = studio.equipment.filter(e => e.category === category);

            // --- Category Header ---
            const catRow = sheet.getRow(currentRowIdx);
            catRow.values = [null, category, '正常', '總數', '狀態', ''];

            // Style Category Header
            catRow.font = { size: 12, bold: true, color: { argb: 'FF444444' } }; // Dark gray
            catRow.getCell(2).alignment = { horizontal: 'left' };

            // Align header columns
            ['C', 'D', 'E'].forEach(col => {
                const cell = catRow.getCell(col);
                cell.alignment = { horizontal: 'center' };
                cell.font = { bold: true, size: 10, color: { argb: 'FF666666' } };
            });

            // Add bottom border to category header
            catRow.border = {
                bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } }
            };

            currentRowIdx++;

            // --- Items ---
            items.forEach(item => {
                const normalCount = item.units.filter(u => u.status === EquipmentStatus.NORMAL).length;
                const isFullyNormal = normalCount === item.quantity;

                const itemRow = sheet.getRow(currentRowIdx);
                itemRow.values = [
                    null,
                    item.name,
                    normalCount,
                    item.quantity,
                    isFullyNormal ? 'OK' : '異常',
                    ''
                ];

                // Style Item Row
                itemRow.font = { size: 11 };
                itemRow.height = 24;
                itemRow.alignment = { vertical: 'middle' };

                // Quantity Colors
                const normalCell = itemRow.getCell('C');
                normalCell.alignment = { horizontal: 'center' };
                normalCell.font = {
                    bold: true,
                    color: { argb: isFullyNormal ? 'FF16A34A' : 'FFEA580C' } // Green-600 vs Orange-600
                };

                const totalCell = itemRow.getCell('D');
                totalCell.alignment = { horizontal: 'center' };
                totalCell.font = { color: { argb: 'FF888888' } };

                const statusCell = itemRow.getCell('E');
                statusCell.alignment = { horizontal: 'center' };
                statusCell.font = {
                    bold: true,
                    color: { argb: isFullyNormal ? 'FF16A34A' : 'FFDC2626' }
                };

                // Alternating row background for readability could be added here if needed

                currentRowIdx++;
            });

            // Spacer after category
            currentRowIdx++;
        });

        // Spacer after studio
        currentRowIdx++;
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Save file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `器材總覽_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);
};
