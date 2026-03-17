
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const STUDIO_ID = 'studio-public';

const NEW_ITEMS = [
    {
        name: 'KUPO C型夾',
        category: '腳架組',
        id: 'studio-public_kupo_c_clamp',
        unit: '個',
        labels: [
            '0D-KCP-C-01',
            '0D-KCP-C-02',
            '0D-KCP-C-03'
        ]
    },
    {
        name: 'KUPO 螢幕固定夾',
        category: '腳架組',
        id: 'studio-public_kupo_monitor_clamp',
        unit: '個',
        labels: [
            '0D-KCP-MonitorFix-01',
            '0D-KCP-MonitorFix-02',
            '0D-KCP-MonitorFix-03'
        ]
    },
    {
        name: 'KUPO 背景伸縮橫桿',
        category: '腳架組',
        id: 'studio-public_kupo_background_bar',
        unit: '支',
        labels: [
            '0D-APT-01',
            '0D-APT-02'
        ]
    }
];

async function addItems() {
    try {
        console.log(`Adding new equipment to ${STUDIO_ID}...`);

        for (const item of NEW_ITEMS) {
            console.log(`Processing ${item.name}...`);

            // 1. Create Equipment Document
            const equipmentData = {
                id: item.id,
                name: item.name,
                category: item.category,
                studioId: STUDIO_ID,
                quantity: item.labels.length,
                unit: item.unit,
                createdAt: new Date().toISOString()
            };

            const equipRef = doc(db, 'equipment', item.id);
            await setDoc(equipRef, equipmentData);
            console.log(`✅ Equipment Created: ${item.id}`);

            // 2. Create Unit Documents
            for (let i = 0; i < item.labels.length; i++) {
                const unitId = `${item.id}_unit_${i}`;
                const unitLabel = item.labels[i];

                const unitData = {
                    id: unitId,
                    equipmentId: item.id,
                    unitIndex: i,
                    unitLabel: unitLabel,
                    status: 'normal',   // EquipmentStatus.NORMAL
                    labelStatus: '有標籤', // LabelStatus.LABELED 
                    remark: '',
                    labelRemark: '',
                    checkedBy: '',
                    replacementPending: false
                };

                await setDoc(doc(db, 'equipment_units', unitId), unitData);
                console.log(`  - Unit Created: ${unitId} (Label: ${unitLabel})`);
            }
        }

        console.log('🎉 Successfully added all items!');
        process.exit(0);

    } catch (error) {
        console.error('Error adding equipment:', error);
        process.exit(1);
    }
}

addItems();
