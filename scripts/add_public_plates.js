
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc } = require('firebase/firestore');
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

const TASKS = [
    {
        searchKeywords: ['Fotopro', 'T-74C'],
        newLabels: ['0D- FTP-PLATE-01', '0D- FTP-PLATE-02']
    },
    {
        searchKeywords: ['Manfrotto', '單腳架'],
        newLabels: ['0D- MAN-PLATE-01', '0D- MAN-PLATE-02']
    },
    {
        searchKeywords: ['DJI', 'RS4', 'PRO'],
        newLabels: ['0D- RS4-PLATE-01']
    }
];

async function updateEquipmentUnits() {
    try {
        console.log(`Starting update for ${STUDIO_ID}...`);

        const equipmentRef = collection(db, 'equipment');
        const q = query(equipmentRef, where('studioId', '==', STUDIO_ID));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.error('No equipment found in studio-public');
            return;
        }

        const allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        for (const task of TASKS) {
            // Find matching equipment
            const match = allDocs.find(item =>
                task.searchKeywords.every(keyword =>
                    item.name.toLowerCase().includes(keyword.toLowerCase())
                )
            );

            if (!match) {
                console.error(`❌ Could not find equipment matching: ${task.searchKeywords.join(', ')}`);
                continue;
            }

            console.log(`\nFound equipment: ${match.name} (ID: ${match.id})`);
            console.log(`Current Quantity: ${match.quantity}`);

            // Get current units to find the next index
            const unitsRef = collection(db, 'equipment_units');
            const unitsQuery = query(unitsRef, where('equipmentId', '==', match.id));
            const unitsSnapshot = await getDocs(unitsQuery);

            // Calculate starting index
            // If units exist, find max unitIndex. If not, start at 0.
            // Note: unitIndex might not be contiguous if deletions happened, but usually we just append.
            // Safest is to sort by unitIndex and take max + 1.
            let nextIndex = 0;
            if (!unitsSnapshot.empty) {
                const indices = unitsSnapshot.docs.map(d => d.data().unitIndex || 0);
                nextIndex = Math.max(...indices) + 1;
            }

            console.log(`Adding ${task.newLabels.length} new units starting from index ${nextIndex}...`);

            // Add new units
            for (let i = 0; i < task.newLabels.length; i++) {
                const unitIndex = nextIndex + i;
                const unitId = `${match.id}_unit_${unitIndex}`; // Construct ID logic (assuming standard)
                // WARNING: If ID already exists (e.g. from deleted unit), we overwrite. 
                // To be safe, we could use a timestamp or verify existence, but standard pattern seems to be index-based.
                // Let's check if it exists just in case.

                const unitLabel = task.newLabels[i];

                const unitData = {
                    id: unitId,
                    equipmentId: match.id,
                    unitIndex: unitIndex,
                    unitLabel: unitLabel,
                    status: 'normal',
                    labelStatus: '有標籤',
                    remark: '',
                    labelRemark: '',
                    checkedBy: '',
                    replacementPending: false
                };

                await setDoc(doc(db, 'equipment_units', unitId), unitData);
                console.log(`  ✅ Added Unit: ${unitLabel} (ID: ${unitId})`);
            }

            // Update Equipment Quantity
            const newQuantity = (match.quantity || 0) + task.newLabels.length;
            await updateDoc(doc(db, 'equipment', match.id), {
                quantity: newQuantity
            });
            console.log(`  🔄 Updated Quantity to: ${newQuantity}`);
        }

        console.log('\n🎉 All tasks completed!');
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateEquipmentUnits();
