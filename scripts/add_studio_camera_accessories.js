
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

const DATA_MAP = [
    {
        studioId: 'studio-1',
        items: [
            {
                name: 'V掛背板',
                idSuffix: 'v_mount_plate',
                labels: ['1A-PLATE-01', '1A-PLATE-02']
            },
            {
                name: '相機假電FZ100',
                idSuffix: 'dummy_battery_fz100',
                labels: ['1A-DUM-FZ100-01', '1A-DUM-FZ100-02']
            },
            {
                name: '螢幕假電NP-F550',
                idSuffix: 'dummy_battery_npf550',
                labels: ['1A-DUM-NPF550-01', '1A-DUM-NPF550-02']
            }
        ]
    },
    {
        studioId: 'studio-2',
        items: [
            {
                name: 'V掛背板',
                idSuffix: 'v_mount_plate',
                labels: ['2A-PLATE-03', '2A-PLATE-04']
            },
            {
                name: '相機假電FZ100',
                idSuffix: 'dummy_battery_fz100',
                labels: ['2A-DUM-FZ100-03', '2A-DUM-FZ100-04']
            },
            {
                name: '螢幕假電NP-F550',
                idSuffix: 'dummy_battery_npf550',
                labels: ['2A-DUM-NPF550-03', '2A-DUM-NPF550-04']
            }
        ]
    },
    {
        studioId: 'studio-3',
        items: [
            {
                name: 'V掛背板',
                idSuffix: 'v_mount_plate',
                labels: ['3A-PLATE-05', '3A-PLATE-06']
            },
            {
                name: '相機假電FZ100',
                idSuffix: 'dummy_battery_fz100',
                labels: ['3A-DUM-FZ100-05', '3A-DUM-FZ100-06']
            },
            {
                name: '螢幕假電NP-F550',
                idSuffix: 'dummy_battery_npf550',
                labels: ['3A-DUM-NPF550-05', '3A-DUM-NPF550-06']
            }
        ]
    },
    {
        studioId: 'studio-4',
        items: [
            {
                name: 'V掛背板',
                idSuffix: 'v_mount_plate',
                labels: ['4A-PLATE-07', '4A-PLATE-08']
            },
            {
                name: '相機假電FZ100',
                idSuffix: 'dummy_battery_fz100',
                labels: ['4A-DUM-FZ100-07', '4A-DUM-FZ100-08']
            },
            {
                name: '螢幕假電NP-F550',
                idSuffix: 'dummy_battery_npf550',
                labels: ['4A-DUM-NPF550-07', '4A-DUM-NPF550-08']
            }
        ]
    },
    {
        studioId: 'studio-6',
        items: [
            {
                name: 'V掛背板',
                idSuffix: 'v_mount_plate',
                labels: ['6A-PLATE-09', '6A-PLATE-10']
            },
            {
                name: '相機假電FZ100',
                idSuffix: 'dummy_battery_fz100',
                labels: ['6A-DUM-FZ100-09', '6A-DUM-FZ100-10']
            },
            {
                name: '螢幕假電NP-F550',
                idSuffix: 'dummy_battery_npf550',
                // Adjusted typo "6A-DUM-NPF55-09" to "6A-DUM-NPF550-09" to match pattern
                labels: ['6A-DUM-NPF550-09', '6A-DUM-NPF550-10']
            }
        ]
    }
];

async function addAccessories() {
    try {
        console.log('Starting bulk add...');

        for (const studioData of DATA_MAP) {
            console.log(`\nProcessing ${studioData.studioId}...`);

            for (const item of studioData.items) {
                const equipId = `${studioData.studioId}_${item.idSuffix}`;

                // 1. Create Equipment Document
                const equipmentData = {
                    id: equipId,
                    name: item.name,
                    category: '相機組',
                    studioId: studioData.studioId,
                    quantity: item.labels.length,
                    unit: '個',
                    createdAt: new Date().toISOString()
                };

                await setDoc(doc(db, 'equipment', equipId), equipmentData);
                console.log(`  ✅ Equipment: ${item.name} (${equipId})`);

                // 2. Create Unit Documents
                for (let i = 0; i < item.labels.length; i++) {
                    const unitId = `${equipId}_unit_${i}`;
                    const unitLabel = item.labels[i];

                    const unitData = {
                        id: unitId,
                        equipmentId: equipId,
                        unitIndex: i,
                        unitLabel: unitLabel,
                        status: 'normal',
                        labelStatus: '有標籤',
                        remark: '',
                        labelRemark: '',
                        checkedBy: '',
                        replacementPending: false
                    };

                    await setDoc(doc(db, 'equipment_units', unitId), unitData);
                    console.log(`    - Unit: ${unitLabel}`);
                }
            }
        }

        console.log('\n🎉 Successfully added all accessories to all studios!');
        process.exit(0);

    } catch (error) {
        console.error('Error adding equipment:', error);
        process.exit(1);
    }
}

addAccessories();
