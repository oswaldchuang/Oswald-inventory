import { Studio, EquipmentStatus, LabelStatus, Equipment, EquipmentUnit } from './types';

export const PERSONNEL_LIST = [
    'Oswald', 'Irene', 'Soda', 'Hana', 'Catherine',
    'Yachi', 'Toy', 'Glen', 'Sophie', 'Unity'
];

// --- 相機組標籤 (各棚) ---
const A7S3_LABELS: Record<number, string[]> = {
    1: ['1A-A7S3-01', '1A-A7S3-02'],
    2: ['2A-A7S3-03', '2A-A7S3-04'],
    3: ['3A-A7S3-05', '3A-A7S3-06'],
    4: ['4A-A7S3-07', '4A-A7S3-08'],
    5: ['5A-A7S3-11'],
    6: ['6A-A7S3-09', '6A-A7S3-10'],
};

// --- 公共區專用標籤 ---
const PUBLIC_CAM_LABELS = {
    A7S3: ['0A-A7S3-12', '0A-A7S3-13', '0A-A7S3-14'],
    FX3: ['0A-FX3-01', '0A-FX3-02'],
    A6400: ['0A- 6400-01', '0A- 6400-02'],
    TAMRON_35150: ['0A-35150-01', '0A-35150-02', '0A-35150-03', '0A-35150-04', '0A-35150-05'],
    RING_35150: ['0A-35150--01', '0A-35150-02', '0A-35150-03', '0A-35150-04', '0A-35150-05'],
    SONY_18105: ['0A-18105-1', '0A-18105-2'],
    MICRO_90: ['0A-MICRO-1'],
    HANDLE: ['0A-HANDLE-12', '0A-HANDLE-13', '0A-HANDLE-14', '0A-HANDLE-15', '0A-HANDLE-16'],
    ARM: ['5A-ARM-11', '5A-ARM-12', '0A-ARM-13', '0A-ARM-14', '0A-ARM-15'],
    BASE: ['0A-BASE-12', '0A-BASE-13', '0A-BASE-14', '0A-BASE-15', '0A-BASE-16'],
    PLATE: ['0A-PLATE-12', '0A-PLATE-13', '0A-PLATE-14', '0A-PLATE-15', '0A-PLATE-16']
};

const PUBLIC_TRIPOD_LABELS = {
    TERIS: ['0D-TERIS-12', '0D-TERIS-13', '0D-TERIS-14', '0D-TERIS-15', '0D-TERIS-16'],
    LOW_ANGLE: ['0D-LOW-01'],
    FOTOPRO: ['0D- FTP-01', '0D- FTP-02'],
    MONOPOD: ['0D-MAN-01', '0D-MAN-02'],
    RS4PRO: ['0D- DJIRS4-01'],
    K_TRIPOD: ['0D-TRIPOD-16', '0D-TRIPOD-17', '0D-TRIPOD-18', '0D-TRIPOD-19'],
    CSTAND_B: ['0D-C-Stand-B-03', '0D-C-Stand-B-04', '0D-C-Stand-B-05'],
    KCP200: ['0D-KCP-200-18', '0D-KCP-200-19', '0D-KCP-200-20'],
    CURTAIN_ROD: ['0D-APT-01', '0D-APT-02'],
    KCP414: ['0D- KCP-414-01', '0D- KCP-414-02', '0D- KCP-414-03', '0D- KCP-414-04']
};

// --- 記憶卡標籤 ---
const SD_128_LABELS = Array.from({ length: 40 }, (_, i) => `128-${(i + 1).toString().padStart(2, '0')}`);
const SD_256_LABELS = Array.from({ length: 10 }, (_, i) => `256-${(i + 1).toString().padStart(2, '0')}`);

// --- 公共區提詞機與線材標籤 ---
const PUBLIC_T3_LABELS = ['0B-T3-01', '0B-T3-02', '0B-T3-03'];
const PUBLIC_T22_LABELS = ['0B-T22-07'];
const PUBLIC_EC_LABELS = ['0B-EC-07', '0B-EC-08', '0B-EC-09', '0B-EC-10'];
const PUBLIC_HDMI_SHORT_LABELS = ['0B-HDMI-QS-02', '0B-HDMI-GL-13'];
const PUBLIC_HDMI_GSL_LABELS = ['0B-HDMI-GSL-01', '0B-HDMI-GSL-02', '0B-HDMI-GSL-03', '0B-HDMI-GSL-04'];
const PUBLIC_HDMI_2L_LABELS = ['0B-HDMI-2L-01', '0B-HDMI-2L-02'];
const PUBLIC_HDMI_BL_LABELS = ['0B-HDMI-BL-01', '0B-HDMI-BL-02', '0B-HDMI-BL-03', '0B-HDMI-BL-04', '0B-HDMI-BL-05'];
const PUBLIC_CHECKER_LABELS = ['0B-spydercheckr-01'];

// --- 公共區收音組標籤 ---
const PUBLIC_AUDIO_LABELS = {
    WIRELESS_GO: ['0C-WirelessGO-01'],
    VIDEOMIC_GO: ['0C-MicGO-01'],
    BOYA_MICRO: ['0C-Micro-02'],
    CASTER_PRO: ['0C-CasterPro-01'],
    PODMIC: ['0C-PODMIC-01', '0C-PODMIC-02', '0C-PODMIC-03', '0C-PODMIC-04']
};

// --- 公共區圖傳Monitor標籤 ---
const PUBLIC_MONITOR_LABELS = {
    SMALLHD: ['0C-BIGMO-07'],
    HOLLYLAND: ['0C-HOLLYLAND-01'],
    DESVIEW: ['0C-DESVIEW-01']
};

// --- 公共區燈光組標籤 ---
const PUBLIC_LIGHT_LABELS = {
    LS600D: ['0E-600d-01'],
    APUTURE_300C: ['0E-300c-01', '0E-300c-02'],
    SPOTLIGHT: ['0E-spotlight36°-07'],
    NANLITE_300: ['0E-N300-01'],
    APUTURE_120DII: ['0E-120dll-01'],
    MINI_20: ['0E- 20mini-01', '0E- 20mini-02', '0E- 20mini-03'],
    C80: ['0E-80C-01'],
    CF4_FRESNEL: ['CF4 Fresnel'],
    NEST_15C: ['0E-Nest-01', '0E-Nest-02'],
    BIG_DOME: ['0E- BLlightdome-07'],
    SMALL_DOME: ['0E- SLlightdome-08'],
    LANTERN: ['0E- lantern90-01', '0E- lantern90-02', '0E- lantern90-03'],
    FLAG_FRAME: ['0D- FLAG-FRAME-01', '0D- FLAG-FRAME-02', '0D- FLAG-FRAME-03'],
    REFLECTOR: ['0E-reflector-07'],
    GODOX_TT685: ['0E-TT685Sll-01'],
    ALMC: ['0E- ALME-01', '0E- ALME-02', '0E- ALME-03', '0E- ALME-04'],
    B7C: ['0E-B7C-01', '0E-B7C-02', '0E-B7C-03', '0E-B7C-04']
};

const TAMRON_2875_LABELS: Record<number, string[]> = {
    1: ['1A-28 75 -01'],
    2: ['2A-28 75 -02'],
    3: ['3A-28 75 -03'],
    4: ['4A-28 75 -04'],
    5: ['5A-28-75-06'],
    6: ['6A-28 75 -05'],
};

const TAMRON_70180_LABELS: Record<number, string[]> = {
    1: ['1A-70180-01'],
    2: ['2A-28 75 -02'],
    3: ['3A-70180-03'],
    4: ['4A-70180-04'],
    6: ['6A-70180-05'],
};

const HANDLE_LABELS: Record<number, string[]> = {
    1: ['1A-HANDLE-01', '1A-HANDLE-02'],
    2: ['2A-HANDLE-03', '2A-HANDLE-04'],
    3: ['3A-HANDLE-05', '3A-HANDLE-06'],
    4: ['4A-HANDLE-07', '4A-HANDLE-08'],
    5: ['0A-HANDLE-11'],
    6: ['6A-HANDLE-09', '6A-HANDLE-10'],
};

const ARM_LABELS: Record<number, string[]> = {
    1: ['1A-ARM-01', '1A-ARM-02'],
    2: ['2A-ARM-03', '2A-ARM-04'],
    3: ['3A-ARM-05', '3A-ARM-06'],
    4: ['4A-ARM-07', '4A-ARM-08'],
    5: ['5A-ARM-11'],
    6: ['6A-ARM-09', '6A-ARM-10'],
};

const BASE_LABELS: Record<number, string[]> = {
    1: ['1A-BASE-01', '1A-BASE-02'],
    2: ['2A-BASE-03', '2A-BASE-04'],
    3: ['3A-BASE-05', '3A-BASE-06'],
    4: ['4A-BASE-07', '4A-BASE-08'],
    5: ['5A-BASE-11'],
    6: ['6A-BASE-09', '6A-BASE-10'],
};

const PLATE_LABELS: Record<number, string[]> = {
    1: ['1A-PLATE-01', '1A-PLATE-02'],
    2: ['2A-PLATE-03', '2A-PLATE-04'],
    3: ['3A-PLATE-05', '3A-PLATE-06'],
    4: ['4A-PLATE-07', '4A-PLATE-08'],
    5: ['5A-PLATE-11'],
    6: ['6A-PLATE-09', '6A-PLATE-10'],
};

// --- 腳架組標籤 ---
const TERIS_LABELS: Record<number, string[]> = {
    1: ['1D-TERIS-01', '1D-TERIS-02'],
    2: ['2D-TERIS-03', '2D-TERIS-04'],
    3: ['3D-TERIS-05', '3D-TERIS-06'],
    4: ['4D-TERIS-07', '4D-TERIS-08'],
    5: ['5D-TERIS-11'],
    6: ['6D-TERIS-09', '6D-TERIS-10'],
};

const K_TRIPOD_LABELS: Record<number, string[]> = {
    1: ['1D-TRIPOD-01', '1D-TRIPOD-02', '1D-TRIPOD-03'],
    2: ['2D-TRIPOD-04', '2D-TRIPOD-05', '2D-TRIPOD-06'],
    3: ['3D-TRIPOD-07', '3D-TRIPOD-08', '3D-TRIPOD-09'],
    4: ['4D-TRIPOD-10', '4D-TRIPOD-11', '4D-TRIPOD-12'],
    6: ['6D-TRIPOD-13', '6D-TRIPOD-14', '6D-TRIPOD-15'],
};

const CSTAND_LABELS: Record<number, string[]> = {
    1: ['1D-C-Stand-01', '1D-C-Stand-02'],
    2: ['2D-C-Stand-03', '2D-C-Stand-04'],
    3: ['3D-C-Stand-05', '3D-C-Stand-06'],
    4: ['4D-C-Stand-07', '4D-C-Stand-08'],
    5: ['5D-C-Stand-B-01', '5D-C-Stand-B-02'],
    6: ['6D-C-Stand-09', '6D-C-Stand-10'],
};

const KCP241_LABELS: Record<number, string[]> = {
    1: ['1D-KCP-241-01', '1D-KCP-241-07'],
    2: ['2D-KCP-241-02', '2D-KCP-241-08'],
    3: ['3D-KCP-241-03', '3D-KCP-241-09'],
    4: ['4D-KCP-241-10', '4D-KCP-241-11'],
    5: ['5D-KCP-241-06'],
    6: ['6D-KCP-241-05', '6D-KCP-241-11'],
};

const KCP200_LABELS: Record<number, string[]> = {
    1: ['1D-KCP-200-01', '1D-KCP-200-02', '1D-KCP-200-03'],
    2: ['2D-KCP-200-04', '2D-KCP-200-05', '2D-KCP-200-06'],
    3: ['3D-KCP-200-07', '3D-KCP-200-08', '3D-KCP-200-09'],
    4: ['4D-KCP-200-10', '4D-KCP-200-11', '4D-KCP-200-12'],
    6: ['6D-KCP-200-13', '6D-KCP-200-14', '6D-KCP-200-15'],
};

const KCP640M_LABELS: Record<number, string[]> = {
    1: ['1D- KCP-640M-01'],
    2: ['2D- KCP-640M-02'],
    3: ['3D- KCP-640M-03'],
    4: ['4D- KCP-640M-04'],
    5: ['5D- KCP-640M-06'],
    6: ['6D- KCP-640M-05'],
};

// --- 圖傳 Monitor 標籤 ---
const VAXIS_A5_LABELS: Record<number, string[]> = {
    1: ['1C-SMALLMO-01', '1C-SMALLMO-02'],
    2: ['2C-SMALLMO-03', '2C-SMALLMO-04'],
    3: ['3C-SMALLMO-05', '3C-SMALLMO-06'],
    4: ['4C-SMALLMO-07', '4C-SMALLMO-08'],
    5: ['5C-SMALLMO-09', '5C-SMALLMO-10'],
    6: ['6C-SMALLMO-09', '6C-SMALLMO-10'],
};

const SMALLHD_INDIE_LABELS: Record<number, string[]> = {
    1: ['1C-BIGMO-01'],
    2: ['2C-BIGMO-02'],
    3: ['3C-BIGMO-02'],
    4: ['4C-BIGMO-04'],
    5: ['5C-BIGMO-06'],
    6: ['6C-BIGMO-05'],
};

// --- 燈光組標籤 ---
const APUTURE_300DII_LABELS: Record<number, string[]> = {
    1: ['1E-300dII-01'],
    2: ['2E-300dII-02'],
    3: ['3E-300dII-03'],
    4: ['4E-300dII-04'],
    6: ['5E-300dII-05'],
};

const AMARAN_200X_LABELS: Record<number, string[]> = {
    1: ['1E-200x-01', '1E-200x-02'],
    2: ['2E-200x-03', '2E-200x-04'],
    3: ['3E-200x-05', '3E-200x-06'],
    4: ['4E-200x-07', '4E-200x-08'],
    5: ['5E-200x-11', '5E-200x-12'],
    6: ['6E-200x-09', '6E-200x-10'],
};

const SPOTLIGHT_LABELS: Record<number, string[]> = {
    1: ['1E-spotlight36°-01'],
    2: ['2E-spotlight36°-02'],
    3: ['3E-spotlight36°-03'],
    4: ['4E-spotlight36°-04'],
    6: ['6E-spotlight36°-05'],
};

const BIG_LIGHTDOME_LABELS: Record<number, string[]> = {
    1: ['1E- BLightdome-01'],
    2: ['2E- BLightdome-02'],
    3: ['3E- BLightdome-03'],
    4: ['4E- BLightdome-04'],
    5: ['5E- BLlightdome-06'],
    6: ['6E- BLlightdome-05'],
};

const SMALL_LIGHTDOME_LABELS: Record<number, string[]> = {
    1: ['1E- SLightdome-01'],
    2: ['2E- SLightdome-02'],
    3: ['3E- SLightdome-03'],
    4: ['4E- SLightdome-04'],
    5: ['5E- SLlightdome-06', '5E- SLlightdome-07'],
    6: ['6E- SLlightdome-05'],
};

const REFLECTOR_LABELS: Record<number, string[]> = {
    1: ['1E-reflector-01'],
    2: ['2E-reflector-02'],
    3: ['3E- reflector-03'],
    4: ['4E-reflector-04'],
    5: ['5E-reflector-06'],
    6: ['6E-reflector-05'],
};

const AMARAN_PT2C_LABELS: Record<number, string[]> = {
    1: ['1E-PT2C-01', '1E-PT2C-02'],
    2: ['2E-PT2C-03', '2E-PT2C-04'],
};

const PAVOTUBE_15C_LABELS: Record<number, string[]> = {
    3: ['3E- pavotube-15C-01', '3E- pavotube-15C-02'],
    4: ['4E- pavotube-15C-03', '4E- pavotube-15C-04'],
    6: ['6E- pavotube-15C-05', '6E- pavotube-15C-06'],
};

// --- 收音組標籤 ---
const G4_LABELS: Record<number, string[]> = {
    1: ['1F-G4-01'],
    2: ['2F-G4-02'],
    3: ['3F-G4-03'],
    4: ['4F-G4-04'],
    6: ['6F-G4-05'],
};

const SONY_7506_LABELS: Record<number, string[]> = {
    1: ['1F-7506-01'],
    2: ['2F-7506-02'],
    3: ['3F-7506-03'],
    4: ['4F-7506-04'],
    6: ['6F-7506-05'],
};

const DT_770_PRO_LABELS_S5 = ['5C-DT770-01', '5C-DT770-02', '5C-DT770-03', '5C-DT770-04'];
const APUTURE_300C_LABELS_S5 = ['5E-300c-03', '5E-300c-04'];
const ALMC_LABELS_S5 = ['5E- ALME-05', '5E- ALME-06', '5E- ALME-07', '5E- ALME-08'];

// --- 線材電池組標籤 (各棚) ---
const DESVIEW_T22_LABELS: Record<number, string[]> = {
    1: ['1B-T22-01'],
    2: ['2B-T22-02'],
    3: ['3B-T22-03'],
    4: ['4B-T22-04'],
    5: ['5B-T22-06'],
    6: ['6B-T22-05'],
};

const APPLEBOX_LABELS: Record<number, string[]> = {
    1: ['1B-Box-01'],
    2: ['2B-Box-02'],
    3: ['3B-Box-03'],
    4: ['4B-Box-04'],
    6: ['6B-Box-05'],
};

const POWER_LINE_LABELS: Record<number, string[]> = {
    1: ['1B-PL-01', '1B-PL-02'],
    2: ['2B-PL-03', '2B-PL-04'],
    3: ['3B-PL-05', '3B-PL-06'],
    4: ['4B-PL-07', '4B-PL-08'],
    5: ['5BPL-11', '5B-PL-12'],
    6: ['6B-PL-09', '6B-PL-10'],
};

const EXTENSION_CORD_LABELS: Record<number, string[]> = {
    1: ['1B-EC-01'],
    2: ['2B-EC-02'],
    3: ['3B-EC-03'],
    4: ['4B-EC-04'],
    5: ['5B-EC-06'],
    6: ['6B-EC-05'],
};

const HDMI_BLACK_SHORT_LABELS: Record<number, string[]> = {
    1: ['1B-HDMI-BS-01'],
    2: ['2B-HDMI-BS-02'],
    3: ['3B-HDMI-BS-03'],
    4: ['4B-HDMI-BS-04'],
    5: ['5B-HDMI-BS-05'],
    6: ['6B-HDMI-QS-01'],
};

const HDMI_GRAY_LONG_LABELS: Record<number, string[]> = {
    1: ['1B-HDMI-GL-01', '1B-HDMI-GL-02'],
    2: ['2B-HDMI-GL-03', '2B-HDMI-GL-04'],
    3: ['3B-HDMI-GL-05', '3B-HDMI-GL-06'],
    4: ['4B-HDMI-GL-07', '4B-HDMI-GL-08'],
    5: ['5B-HDMI-GL-11', '5B-HDMI-GL-12'],
    6: ['6B-HDMI-GL-09', '6B-HDMI-GL-10'],
};

// --- 公共區標籤 (電池) ---
const FZ100_PUBLIC_LABELS = Array.from({ length: 18 }, (_, i) => `0B-FZ100-${(i + 1).toString().padStart(2, '0')}`);
const A6400_PUBLIC_LABELS = Array.from({ length: 4 }, (_, i) => `0B-a6400-${(i + 1).toString().padStart(2, '0')}`);
const NPF970_PUBLIC_LABELS = Array.from({ length: 12 }, (_, i) => `0B-NPF970-${(i + 1).toString().padStart(2, '0')}`);
const VMOUNT99_PUBLIC_LABELS = Array.from({ length: 4 }, (_, i) => `0B-Vmount99-${(i + 1).toString().padStart(2, '0')}`);
const VMOUNT135_PUBLIC_LABELS = Array.from({ length: 4 }, (_, i) => `0B-Vmount135-${(i + 1).toString().padStart(2, '0')}`);
const VMOUNT140_PUBLIC_LABELS = Array.from({ length: 14 }, (_, i) => `0B-Vmount140-${(i + 1).toString().padStart(2, '0')}`);
const BCTRW_PUBLIC_LABELS = Array.from({ length: 2 }, (_, i) => `0B-BCTRW-${(i + 1).toString().padStart(2, '0')}`);
const BCQZ1_PUBLIC_LABELS = Array.from({ length: 15 }, (_, i) => `0B-BCQZ1-${(i + 1).toString().padStart(2, '0')}`);
const BP2CH_PUBLIC_LABELS = Array.from({ length: 5 }, (_, i) => `0B-BP2CH-${(i + 1).toString().padStart(2, '0')}`);
const BQCC17_PUBLIC_LABELS = Array.from({ length: 7 }, (_, i) => `0B-BQCC17-${(i + 1).toString().padStart(2, '0')}`);
const F970LCD_PUBLIC_LABELS = Array.from({ length: 5 }, (_, i) => `0B-F970LCD-${(i + 1).toString().padStart(2, '0')}`);

const createUnits = (baseId: string, quantity: number, specificLabels?: string[]): EquipmentUnit[] => {
    return Array.from({ length: quantity }, (_, i) => {
        const label = (specificLabels && specificLabels[i]) ? specificLabels[i] : "";
        return {
            id: `${baseId}-u-${i + 1}`,
            unitIndex: i + 1,
            unitLabel: label,
            status: EquipmentStatus.UNCHECKED,
            labelStatus: label ? LabelStatus.LABELED : LabelStatus.UNLABELED,
            remark: '',
        };
    });
};

export const generateEquipmentList = (studioId: string, studioNum: number): Equipment[] => {
    // --- 公共區 (studioNum === 0) ---
    if (studioNum === 0) {
        const publicEquipment: Equipment[] = [
            // 公共區相機組
            { id: `${studioId}-cam-a7s3`, name: 'A7S3', category: '相機組', quantity: 3, unit: '台', units: createUnits(`${studioId}-cam-a7s3`, 3, PUBLIC_CAM_LABELS.A7S3) },
            { id: `${studioId}-cam-fx3`, name: 'FX3', category: '相機組', quantity: 2, unit: '台', units: createUnits(`${studioId}-cam-fx3`, 2, PUBLIC_CAM_LABELS.FX3) },
            { id: `${studioId}-cam-a6400`, name: 'A6400', category: '相機組', quantity: 2, unit: '台', units: createUnits(`${studioId}-cam-a6400`, 2, PUBLIC_CAM_LABELS.A6400) },
            { id: `${studioId}-cam-35150`, name: 'Tamron 35-150', category: '相機組', quantity: 5, unit: '顆', units: createUnits(`${studioId}-cam-35150`, 5, PUBLIC_CAM_LABELS.TAMRON_35150) },
            { id: `${studioId}-cam-35150-ring`, name: '35-150鏡頭環', category: '相機組', quantity: 5, unit: '個', units: createUnits(`${studioId}-cam-35150-ring`, 5, PUBLIC_CAM_LABELS.RING_35150) },
            { id: `${studioId}-cam-18105`, name: 'Sony 18105', category: '相機組', quantity: 2, unit: '顆', units: createUnits(`${studioId}-cam-18105`, 2, PUBLIC_CAM_LABELS.SONY_18105) },
            { id: `${studioId}-cam-micro`, name: 'SONY SEL90M28G', category: '相機組', quantity: 1, unit: '顆', units: createUnits(`${studioId}-cam-micro`, 1, PUBLIC_CAM_LABELS.MICRO_90) },
            { id: `${studioId}-cam-handle`, name: '相機提把', category: '相機組', quantity: 5, unit: '個', units: createUnits(`${studioId}-cam-handle`, 5, PUBLIC_CAM_LABELS.HANDLE) },
            { id: `${studioId}-cam-arm`, name: '怪手', category: '相機組', quantity: 5, unit: '個', units: createUnits(`${studioId}-cam-arm`, 5, PUBLIC_CAM_LABELS.ARM) },
            { id: `${studioId}-cam-base`, name: '底座（含雙導管）', category: '相機組', quantity: 5, unit: '座', units: createUnits(`${studioId}-cam-base`, 5, PUBLIC_CAM_LABELS.BASE) },
            { id: `${studioId}-cam-plate`, name: 'V掛背板', category: '相機組', quantity: 5, unit: '個', units: createUnits(`${studioId}-cam-plate`, 5, PUBLIC_CAM_LABELS.PLATE) },

            // 公共區腳架組
            { id: `${studioId}-tri-teris`, name: 'TERIS 圖瑞斯', category: '腳架組', quantity: 5, unit: '個', units: createUnits(`${studioId}-tri-teris`, 5, PUBLIC_TRIPOD_LABELS.TERIS) },
            { id: `${studioId}-tri-low`, name: '圖瑞斯鋁合金低角度三腳架', category: '腳架組', quantity: 1, unit: '個', units: createUnits(`${studioId}-tri-low`, 1, PUBLIC_TRIPOD_LABELS.LOW_ANGLE) },
            { id: `${studioId}-tri-fotopro`, name: 'Fotopro T-74C', category: '腳架組', quantity: 2, unit: '支', units: createUnits(`${studioId}-tri-fotopro`, 2, PUBLIC_TRIPOD_LABELS.FOTOPRO) },
            { id: `${studioId}-tri-monopod`, name: 'Manfrotto單腳架', category: '腳架組', quantity: 2, unit: '支', units: createUnits(`${studioId}-tri-monopod`, 2, PUBLIC_TRIPOD_LABELS.MONOPOD) },
            { id: `${studioId}-tri-rs4`, name: 'DJI RS4 PRO', category: '腳架組', quantity: 1, unit: '個', units: createUnits(`${studioId}-tri-rs4`, 1, PUBLIC_TRIPOD_LABELS.RS4PRO) },
            { id: `${studioId}-tri-k`, name: 'K腳', category: '腳架組', quantity: 4, unit: '個', units: createUnits(`${studioId}-tri-k`, 4, PUBLIC_TRIPOD_LABELS.K_TRIPOD) },
            { id: `${studioId}-tri-cstand`, name: 'C-Stand', category: '腳架組', quantity: 3, unit: '個', units: createUnits(`${studioId}-tri-cstand`, 3, PUBLIC_TRIPOD_LABELS.CSTAND_B) },
            { id: `${studioId}-tri-kcp200`, name: '芭樂頭', category: '腳架組', quantity: 3, unit: '個', units: createUnits(`${studioId}-tri-kcp200`, 3, PUBLIC_TRIPOD_LABELS.KCP200) },
            { id: `${studioId}-tri-curtain`, name: 'KUPO窗簾桿', category: '腳架組', quantity: 2, unit: '個', units: createUnits(`${studioId}-tri-curtain`, 2, PUBLIC_TRIPOD_LABELS.CURTAIN_ROD) },
            { id: `${studioId}-tri-kcp414`, name: 'KUPO KCP-414', category: '腳架組', quantity: 4, unit: '個', units: createUnits(`${studioId}-tri-kcp414`, 4, PUBLIC_TRIPOD_LABELS.KCP414) },

            // 公共區收音組
            { id: `${studioId}-aud-wgo`, name: 'RODE Wireless GO', category: '收音組', quantity: 1, unit: '個', units: createUnits(`${studioId}-aud-wgo`, 1, PUBLIC_AUDIO_LABELS.WIRELESS_GO) },
            { id: `${studioId}-aud-vmgo`, name: 'Rode VideoMic GO II', category: '收音組', quantity: 1, unit: '個', units: createUnits(`${studioId}-aud-vmgo`, 1, PUBLIC_AUDIO_LABELS.VIDEOMIC_GO) },
            { id: `${studioId}-aud-boya`, name: 'BOYA VideoMicro', category: '收音組', quantity: 1, unit: '個', units: createUnits(`${studioId}-aud-boya`, 1, PUBLIC_AUDIO_LABELS.BOYA_MICRO) },
            { id: `${studioId}-aud-caster`, name: 'Rode caster Pro', category: '收音組', quantity: 1, unit: '個', units: createUnits(`${studioId}-aud-caster`, 1, PUBLIC_AUDIO_LABELS.CASTER_PRO) },
            { id: `${studioId}-aud-podmic`, name: 'Rode PodMic', category: '收音組', quantity: 4, unit: '支', units: createUnits(`${studioId}-aud-podmic`, 4, PUBLIC_AUDIO_LABELS.PODMIC) },

            // 公共區圖傳Monitor
            { id: `${studioId}-mon-smallhd`, name: 'SmallHD INDIE', category: '圖傳Monitor', quantity: 1, unit: '台', units: createUnits(`${studioId}-mon-smallhd`, 1, PUBLIC_MONITOR_LABELS.SMALLHD) },
            { id: `${studioId}-mon-hollyland`, name: 'Hollyland Pyro H 4K HDMI 無線圖傳', category: '圖傳Monitor', quantity: 1, unit: '個', units: createUnits(`${studioId}-mon-hollyland`, 1, PUBLIC_MONITOR_LABELS.HOLLYLAND) },
            { id: `${studioId}-mon-desview`, name: 'Desview D21-HB', category: '圖傳Monitor', quantity: 1, unit: '個', units: createUnits(`${studioId}-mon-desview`, 1, PUBLIC_MONITOR_LABELS.DESVIEW) },

            // 公共區燈光組
            { id: `${studioId}-lite-600d`, name: 'LS600D', category: '燈光組', quantity: 1, unit: '台', units: createUnits(`${studioId}-lite-600d`, 1, PUBLIC_LIGHT_LABELS.LS600D) },
            { id: `${studioId}-lite-300c`, name: 'APUTURE 300c', category: '燈光組', quantity: 2, unit: '台', units: createUnits(`${studioId}-lite-300c`, 2, PUBLIC_LIGHT_LABELS.APUTURE_300C) },
            { id: `${studioId}-lite-spot`, name: 'Spolight', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-spot`, 1, PUBLIC_LIGHT_LABELS.SPOTLIGHT) },
            { id: `${studioId}-lite-n300`, name: '南光300', category: '燈光組', quantity: 1, unit: '台', units: createUnits(`${studioId}-lite-n300`, 1, PUBLIC_LIGHT_LABELS.NANLITE_300) },
            { id: `${studioId}-lite-120d`, name: 'APUTURE 120dll', category: '燈光組', quantity: 1, unit: '台', units: createUnits(`${studioId}-lite-120d`, 1, PUBLIC_LIGHT_LABELS.APUTURE_120DII) },
            { id: `${studioId}-lite-20mini`, name: '20mini', category: '燈光組', quantity: 3, unit: '台', units: createUnits(`${studioId}-lite-20mini`, 3, PUBLIC_LIGHT_LABELS.MINI_20) },
            { id: `${studioId}-lite-80c`, name: '80C', category: '燈光組', quantity: 1, unit: '台', units: createUnits(`${studioId}-lite-80c`, 1, PUBLIC_LIGHT_LABELS.C80) },
            { id: `${studioId}-lite-cf4`, name: 'CF4 Fresnel', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-cf4`, 1, PUBLIC_LIGHT_LABELS.CF4_FRESNEL) },
            { id: `${studioId}-lite-nest`, name: 'PavoTube II 15C 葉片網格', category: '燈光組', quantity: 2, unit: '個', units: createUnits(`${studioId}-lite-nest`, 2, PUBLIC_LIGHT_LABELS.NEST_15C) },
            { id: `${studioId}-lite-bigdome`, name: '大Lightdoom', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-bigdome`, 1, PUBLIC_LIGHT_LABELS.BIG_DOME) },
            { id: `${studioId}-lite-smalldome`, name: '小Lightdoom', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-smalldome`, 1, PUBLIC_LIGHT_LABELS.SMALL_DOME) },
            { id: `${studioId}-lite-lantern`, name: '燈籠', category: '燈光組', quantity: 3, unit: '個', units: createUnits(`${studioId}-lite-lantern`, 3, PUBLIC_LIGHT_LABELS.LANTERN) },
            { id: `${studioId}-lite-flag`, name: '旗板框', category: '燈光組', quantity: 3, unit: '個', units: createUnits(`${studioId}-lite-flag`, 3, PUBLIC_LIGHT_LABELS.FLAG_FRAME) },
            { id: `${studioId}-lite-ref`, name: '反光板', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-ref`, 1, PUBLIC_LIGHT_LABELS.REFLECTOR) },
            { id: `${studioId}-lite-tt685`, name: 'GODOX閃燈TT685Sll', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-tt685`, 1, PUBLIC_LIGHT_LABELS.GODOX_TT685) },
            { id: `${studioId}-lite-almc`, name: 'ALMC RGB led', category: '燈光組', quantity: 4, unit: '個', units: createUnits(`${studioId}-lite-almc`, 4, PUBLIC_LIGHT_LABELS.ALMC) },
            { id: `${studioId}-lite-b7c`, name: 'B7C', category: '燈光組', quantity: 4, unit: '顆', units: createUnits(`${studioId}-lite-b7c`, 4, PUBLIC_LIGHT_LABELS.B7C) },

            // 公共區記憶卡
            { id: `${studioId}-sd-128`, name: '128GB 記憶卡', category: '記憶卡', quantity: 40, unit: '張', units: createUnits(`${studioId}-sd-128`, 40, SD_128_LABELS) },
            { id: `${studioId}-sd-256`, name: '256GB 記憶卡', category: '記憶卡', quantity: 10, unit: '張', units: createUnits(`${studioId}-sd-256`, 10, SD_256_LABELS) },
        ];

        const publicBatteryItems = [
            { name: 'A7S3原電:FZ-100', unit: '顆', quantity: 18, labels: FZ100_PUBLIC_LABELS },
            { name: 'a6400電池', unit: '顆', quantity: 4, labels: A6400_PUBLIC_LABELS },
            { name: 'NP-F970', unit: '顆', quantity: 12, labels: NPF970_PUBLIC_LABELS },
            { name: '3號電池', unit: '組', quantity: 1 },
            { name: 'V掛(99)', unit: '顆', quantity: 4, labels: VMOUNT99_PUBLIC_LABELS },
            { name: 'V掛(135)', unit: '顆', quantity: 4, labels: VMOUNT135_PUBLIC_LABELS },
            { name: 'V掛(140)', unit: '顆', quantity: 14, labels: VMOUNT140_PUBLIC_LABELS },
            { name: 'a6400充電器', unit: '台', quantity: 2, labels: BCTRW_PUBLIC_LABELS },
            { name: 'FZ-100充電器', unit: '台', quantity: 15, labels: BCQZ1_PUBLIC_LABELS },
            { name: 'V掛充電', unit: '組', quantity: 5, labels: BP2CH_PUBLIC_LABELS },
            { name: '麥克風電池充電器', unit: '台', quantity: 7, labels: BQCC17_PUBLIC_LABELS },
            { name: 'NP-F970 LCD 智能雙座充電', unit: '台', quantity: 5, labels: F970LCD_PUBLIC_LABELS },
            // 提詞機與其他
            { name: '小提詞機Desview T3', unit: '個', quantity: 3, labels: PUBLIC_T3_LABELS },
            { name: '大提詞機Desview T22', unit: '個', quantity: 1, labels: PUBLIC_T22_LABELS },
            { name: '數位影像校正色卡', unit: '個', quantity: 1, labels: PUBLIC_CHECKER_LABELS },
            // 新增線材項目
            { name: '延長線', unit: '條', quantity: 4, labels: PUBLIC_EC_LABELS },
            { name: 'HDMI（短）', unit: '條', quantity: 2, labels: PUBLIC_HDMI_SHORT_LABELS },
            { name: 'HDMI線（灰長）', unit: '條', quantity: 4, labels: PUBLIC_HDMI_GSL_LABELS },
            { name: 'HDMI兩段式延長線', unit: '條', quantity: 2, labels: PUBLIC_HDMI_2L_LABELS },
            { name: 'HDMI(黑長 4K)', unit: '條', quantity: 5, labels: PUBLIC_HDMI_BL_LABELS },
        ];

        const batteryEquipment = publicBatteryItems.map((item, idx) => ({
            id: `p12-battery-${idx + 1}`,
            name: item.name,
            category: '線材電池組' as any,
            quantity: item.quantity,
            unit: item.unit,
            units: createUnits(`p12-battery-${idx + 1}`, item.quantity, (item as any).labels)
        }));

        return [...publicEquipment, ...batteryEquipment];
    }

    // --- 1, 2, 3, 4, 5, 6 號棚 (studioNum !== 0) ---
    const camQty = studioNum === 5 ? 1 : 2;
    const baseEquipment: Equipment[] = [
        // 相機組
        { id: `${studioId}-cam-1`, name: 'A7s3', category: '相機組', quantity: camQty, unit: '台', units: createUnits(`${studioId}-cam-1`, camQty, A7S3_LABELS[studioNum]) },
        { id: `${studioId}-cam-2`, name: 'Tamron 28-75', category: '相機組', quantity: 1, unit: '顆', units: createUnits(`${studioId}-cam-2`, 1, TAMRON_2875_LABELS[studioNum]) },
        { id: `${studioId}-cam-4`, name: '相機提把', category: '相機組', quantity: camQty, unit: '個', units: createUnits(`${studioId}-cam-4`, camQty, HANDLE_LABELS[studioNum]) },
        { id: `${studioId}-cam-5`, name: '怪手', category: '相機組', quantity: camQty, unit: '個', units: createUnits(`${studioId}-cam-5`, camQty, ARM_LABELS[studioNum]) },
        { id: `${studioId}-cam-6`, name: '底座（含雙導管）', category: '相機組', quantity: camQty, unit: '個', units: createUnits(`${studioId}-cam-6`, camQty, BASE_LABELS[studioNum]) },
        { id: `${studioId}-cam-7`, name: 'V掛背板', category: '相機組', quantity: camQty, unit: '個', units: createUnits(`${studioId}-cam-7`, camQty, PLATE_LABELS[studioNum]) },
    ];

    // 僅非 5 號棚有 Tamron 70-180
    if (studioNum !== 5) {
        baseEquipment.splice(2, 0, { id: `${studioId}-cam-3`, name: 'Tamron 70-180', category: '相機組', quantity: 1, unit: '顆', units: createUnits(`${studioId}-cam-3`, 1, TAMRON_70180_LABELS[studioNum]) });
    }

    // 其他分類 (腳架、Monitor、燈光等) 為通用配置
    const terisQty = studioNum === 5 ? 1 : 2;
    const cstandQty = studioNum === 5 ? 2 : 2;
    const kcp241Qty = studioNum === 5 ? 1 : 2;

    let otherEquipment: Equipment[] = [
        // 腳架組
        { id: `${studioId}-tri-1`, name: 'TERIS 圖瑞斯', category: '腳架組', quantity: terisQty, unit: '支', units: createUnits(`${studioId}-tri-1`, terisQty, TERIS_LABELS[studioNum]) },
        { id: `${studioId}-tri-2`, name: 'K腳', category: '腳架組', quantity: 3, unit: '支', units: createUnits(`${studioId}-tri-2`, 3, K_TRIPOD_LABELS[studioNum]) },
        { id: `${studioId}-tri-3`, name: 'C-Stand', category: '腳架組', quantity: cstandQty, unit: '支', units: createUnits(`${studioId}-tri-3`, cstandQty, CSTAND_LABELS[studioNum]) },
        { id: `${studioId}-tri-4`, name: '七號桿', category: '腳架組', quantity: kcp241Qty, unit: '支', units: createUnits(`${studioId}-tri-4`, kcp241Qty, KCP241_LABELS[studioNum]) },
        { id: `${studioId}-tri-5`, name: '芭樂頭', category: '腳架組', quantity: 3, unit: '顆', units: createUnits(`${studioId}-tri-5`, 3, KCP200_LABELS[studioNum]) },
        { id: `${studioId}-tri-6`, name: 'KUPO延伸桿', category: '腳架組', quantity: 1, unit: '支', units: createUnits(`${studioId}-tri-6`, 1, KCP640M_LABELS[studioNum]) },

        // 圖傳 Monitor
        { id: `${studioId}-mon-vaxis`, name: 'VAXIS ATOM A5', category: '圖傳Monitor', quantity: 2, unit: '台', units: createUnits(`${studioId}-mon-vaxis`, 2, VAXIS_A5_LABELS[studioNum]) },
        { id: `${studioId}-mon-smallhd`, name: 'SmallHD INDIE', category: '圖傳Monitor', quantity: 1, unit: '台', units: createUnits(`${studioId}-mon-smallhd`, 1, SMALLHD_INDIE_LABELS[studioNum]) },

        // 燈光組
        { id: `${studioId}-lite-300dii`, name: 'APUTURE 300dII', category: '燈光組', quantity: 1, unit: '台', units: createUnits(`${studioId}-lite-300dii`, 1, APUTURE_300DII_LABELS[studioNum]) },
        { id: `${studioId}-lite-200x`, name: 'AMARAN 200x', category: '燈光組', quantity: 2, unit: '台', units: createUnits(`${studioId}-lite-200x`, 2, AMARAN_200X_LABELS[studioNum]) },
        { id: `${studioId}-lite-spot`, name: 'Spotlight', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-spot`, 1, SPOTLIGHT_LABELS[studioNum]) },
        { id: `${studioId}-lite-bigdome`, name: '大Lightdoom', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-bigdome`, 1, BIG_LIGHTDOME_LABELS[studioNum]) },
        { id: `${studioId}-lite-smalldome`, name: '小Lightdoom', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-smalldome`, 1, SMALL_LIGHTDOME_LABELS[studioNum]) },
        { id: `${studioId}-lite-ref`, name: '反光板', category: '燈光組', quantity: 1, unit: '個', units: createUnits(`${studioId}-lite-ref`, 1, REFLECTOR_LABELS[studioNum]) },

        // 收音組
        { id: `${studioId}-aud-1`, name: 'Sennheiser wireless G4', category: '收音組', quantity: 1, unit: '組', units: createUnits(`${studioId}-aud-1`, 1, G4_LABELS[studioNum]) },
        { id: `${studioId}-aud-2`, name: 'Sony 7506', category: '收音組', quantity: 1, unit: '支', units: createUnits(`${studioId}-aud-2`, 1, SONY_7506_LABELS[studioNum]) },

        // 線材電池組
        { id: `${studioId}-cab-t22`, name: '大提詞機 Desview T22', category: '線材電池組', quantity: 1, unit: '個', units: createUnits(`${studioId}-cab-t22`, 1, DESVIEW_T22_LABELS[studioNum]) },
        { id: `${studioId}-cab-applebox`, name: '蘋果箱', category: '線材電池組', quantity: 1, unit: '個', units: createUnits(`${studioId}-cab-applebox`, 1, APPLEBOX_LABELS[studioNum]) },
        { id: `${studioId}-cab-pl`, name: '動力線', category: '線材電池組', quantity: 2, unit: '條', units: createUnits(`${studioId}-cab-pl`, 2, POWER_LINE_LABELS[studioNum]) },
        { id: `${studioId}-cab-ec`, name: '延長線', category: '線材電池組', quantity: 1, unit: '條', units: createUnits(`${studioId}-cab-ec`, 1, EXTENSION_CORD_LABELS[studioNum]) },
        { id: `${studioId}-cab-hdmi-bs`, name: 'HDMI(黑短)', category: '線材電池組', quantity: 1, unit: '條', units: createUnits(`${studioId}-cab-hdmi-bs`, 1, HDMI_BLACK_SHORT_LABELS[studioNum]) },
        { id: `${studioId}-cab-hdmi-gl`, name: 'HDMI（灰長）', category: '線材電池組', quantity: 2, unit: '條', units: createUnits(`${studioId}-cab-hdmi-gl`, 2, HDMI_GRAY_LONG_LABELS[studioNum]) },
    ];

    // 五號棚特殊過濾
    if (studioNum === 5) {
        // 1. 刪除腳架組中的 K腳 與 芭樂頭
        otherEquipment = otherEquipment.filter(item => item.name !== 'K腳' && item.name !== '芭樂頭');

        // 2. 收音組特殊邏輯：僅保留 DT 770 Pro 
        otherEquipment = otherEquipment.filter(item => item.category !== '收音組');
        otherEquipment.push({
            id: `${studioId}-aud-dt770`,
            name: 'DT 770 Pro',
            category: '收音組',
            quantity: 4,
            unit: '支',
            units: createUnits(`${studioId}-aud-dt770`, 4, DT_770_PRO_LABELS_S5)
        });

        // 3. 圖傳Monitor特殊邏輯
        otherEquipment = otherEquipment.filter(item => item.category !== '圖傳Monitor');
        otherEquipment.push({
            id: `${studioId}-mon-vaxis`,
            name: 'VAXIS ATOM A5',
            category: '圖傳Monitor',
            quantity: 2,
            unit: '台',
            units: createUnits(`${studioId}-mon-vaxis`, 2, VAXIS_A5_LABELS[studioNum])
        });
        otherEquipment.push({
            id: `${studioId}-mon-smallhd`,
            name: 'SmallHD INDIE',
            category: '圖傳Monitor',
            quantity: 1,
            unit: '台',
            units: createUnits(`${studioId}-mon-smallhd`, 1, SMALLHD_INDIE_LABELS[studioNum])
        });

        // 4. 燈光組特殊邏輯：僅保留指定器材
        otherEquipment = otherEquipment.filter(item => item.category !== '燈光組');
        otherEquipment.push({
            id: `${studioId}-lite-200x`,
            name: 'AMARAN 200x',
            category: '燈光組',
            quantity: 2,
            unit: '台',
            units: createUnits(`${studioId}-lite-200x`, 2, AMARAN_200X_LABELS[studioNum])
        });
        otherEquipment.push({
            id: `${studioId}-lite-300c`,
            name: 'APUTURE 300c',
            category: '燈光組',
            quantity: 2,
            unit: '台',
            units: createUnits(`${studioId}-lite-300c`, 2, APUTURE_300C_LABELS_S5)
        });
        otherEquipment.push({
            id: `${studioId}-lite-bigdome`,
            name: '大Lightdoom',
            category: '燈光組',
            quantity: 1,
            unit: '個',
            units: createUnits(`${studioId}-lite-bigdome`, 1, BIG_LIGHTDOME_LABELS[studioNum])
        });
        otherEquipment.push({
            id: `${studioId}-lite-smalldome`,
            name: '小Lightdoom',
            category: '燈光組',
            quantity: 2,
            unit: '個',
            units: createUnits(`${studioId}-lite-smalldome`, 2, SMALL_LIGHTDOME_LABELS[studioNum])
        });
        otherEquipment.push({
            id: `${studioId}-lite-ref`,
            name: '反光板',
            category: '燈光組',
            quantity: 1,
            unit: '個',
            units: createUnits(`${studioId}-lite-ref`, 1, REFLECTOR_LABELS[studioNum])
        });
        otherEquipment.push({
            id: `${studioId}-lite-almc`,
            name: 'ALMC RGB led',
            category: '燈光組',
            quantity: 4,
            unit: '個',
            units: createUnits(`${studioId}-lite-almc`, 4, ALMC_LABELS_S5)
        });

        // 5. 線材電池組特殊邏輯
        otherEquipment = otherEquipment.filter(item => {
            if (item.category === '線材電池組') {
                const keepItems = ['大提詞機 Desview T22', '動力線', '延長線', 'HDMI(黑短)', 'HDMI（灰長）'];
                return keepItems.includes(item.name);
            }
            return true;
        }).map(item => {
            if (item.name === 'HDMI（灰長）') {
                return { ...item, name: 'HDMI線(灰中長)' };
            }
            if (item.name === 'HDMI(黑短)') {
                return { ...item, name: 'HDMI線(黑短)' };
            }
            return item;
        });
    }

    if (studioNum === 1 || studioNum === 2) {
        otherEquipment.push({ id: `${studioId}-lite-pt2c`, name: 'amaran PT2c', category: '燈光組', quantity: 2, unit: '支', units: createUnits(`${studioId}-lite-pt2c`, 2, AMARAN_PT2C_LABELS[studioNum]) });
    }

    if (studioNum === 3 || studioNum === 4 || studioNum === 6) {
        otherEquipment.push({ id: `${studioId}-lite-tube-15c`, name: 'NANLITE PAVOTUBE 15C', category: '燈光組', quantity: 2, unit: '支', units: createUnits(`${studioId}-lite-tube-15c`, 2, PAVOTUBE_15C_LABELS[studioNum]) });
    }

    return [...baseEquipment, ...otherEquipment];
};

export const INITIAL_STUDIOS: Studio[] = [
    { id: 'studio-1', name: '1號棚', description: '專業攝影棚', icon: '🟢', themeColor: 'green', equipment: generateEquipmentList('s1', 1) },
    { id: 'studio-2', name: '2號棚', description: '專業攝影棚', icon: '🩷', themeColor: 'pink', equipment: generateEquipmentList('s2', 2) },
    { id: 'studio-3', name: '3號棚', description: '專業攝影棚', icon: '🟠', themeColor: 'orange', equipment: generateEquipmentList('s3', 3) },
    { id: 'studio-4', name: '4號棚', description: '專業攝影棚', icon: '🔵', themeColor: 'blue', equipment: generateEquipmentList('s4', 4) },
    { id: 'studio-5', name: '5號棚', description: '專業攝影棚', icon: '🔘', themeColor: 'gray', equipment: generateEquipmentList('s5', 5) },
    { id: 'studio-6', name: '6號棚', description: '專業攝影棚', icon: '🔴', themeColor: 'red', equipment: generateEquipmentList('s6', 6) },
    { id: 'studio-public', name: '公共區', description: '電池與相機存放區', icon: '🟣', themeColor: 'purple', equipment: generateEquipmentList('sp', 0) }
];
