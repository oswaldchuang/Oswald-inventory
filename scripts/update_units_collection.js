
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, doc, updateDoc, orderBy } = require('firebase/firestore');
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

// From previous step output
const TARGET_EQUIPMENT_ID = 'studio-4_七號桿';
const NEW_LABELS = ['4D-KCP-241-04', '4D-KCP-241-10'];

async function updateLabels() {
    try {
        console.log(`Searching for units of equipment: '${TARGET_EQUIPMENT_ID}'...`);

        const unitsRef = collection(db, 'equipment_units');
        const q = query(unitsRef, where('equipmentId', '==', TARGET_EQUIPMENT_ID));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.error('❌ No units found for this equipment!');
            return;
        }

        console.log(`Found ${snapshot.docs.length} units.`);

        const units = snapshot.docs.sort((a, b) => {
            const dataA = a.data();
            const dataB = b.data();
            return (dataA.unitIndex || 0) - (dataB.unitIndex || 0);
        });

        // Update Unit 1
        if (units[0]) {
            console.log(`Updating Unit 1 (ID: ${units[0].id}): Label -> ${NEW_LABELS[0]}`);
            await updateDoc(doc(db, 'equipment_units', units[0].id), {
                unitLabel: NEW_LABELS[0],
                labelStatus: '有標籤' // LabelStatus.LABELED value
            });
        }

        // Update Unit 2
        if (units[1]) {
            console.log(`Updating Unit 2 (ID: ${units[1].id}): Label -> ${NEW_LABELS[1]}`);
            await updateDoc(doc(db, 'equipment_units', units[1].id), {
                unitLabel: NEW_LABELS[1],
                labelStatus: '有標籤'
            });
        }

        console.log('✅ Successfully updated labels in Firebase via Client SDK (Units Collection)!');

    } catch (error) {
        console.error('Error updating labels:', error);
    }
}

updateLabels();
