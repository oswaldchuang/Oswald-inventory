
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, doc, updateDoc } = require('firebase/firestore');
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

const TARGET_STUDIO_ID = 'studio-4';
const EQUIPMENT_NAME = '七號桿';
const NEW_LABELS = ['4D-KCP-241-04', '4D-KCP-241-10'];

async function updateLabels() {
    try {
        console.log(`Searching for '${EQUIPMENT_NAME}' in '${TARGET_STUDIO_ID}'...`);

        const equipmentRef = collection(db, 'equipment');
        // Query by studioId and name
        // Use 'studio-4' as studioId based on previous findings
        const q = query(equipmentRef, where('studioId', '==', TARGET_STUDIO_ID), where('name', '==', EQUIPMENT_NAME));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.error('❌ Equipment not found!');
            // Fallback verify: List all equipment in this studio to debug ID
            console.log('Listing all equipment in this studio to debug:');
            const q2 = query(equipmentRef, where('studioId', '==', TARGET_STUDIO_ID));
            const snap2 = await getDocs(q2);
            snap2.forEach(d => console.log(`- ${d.data().name} (${d.id})`));
            return;
        }

        const equipDoc = snapshot.docs[0];
        const equipData = equipDoc.data();

        console.log(`✅ Found equipment: ${equipData.name} (${equipDoc.id})`);
        console.log(`Current units: ${equipData.units.length}`);

        const updatedUnits = [...equipData.units];

        // Update Unit 1
        if (updatedUnits[0]) {
            console.log(`Updating Unit 1: ${updatedUnits[0].unitLabel} -> ${NEW_LABELS[0]}`);
            updatedUnits[0].unitLabel = NEW_LABELS[0];
            updatedUnits[0].labelStatus = '有標籤'; // Hardcoded enum
        }

        // Update Unit 2
        if (updatedUnits[1]) {
            console.log(`Updating Unit 2: ${updatedUnits[1].unitLabel} -> ${NEW_LABELS[1]}`);
            updatedUnits[1].unitLabel = NEW_LABELS[1];
            updatedUnits[1].labelStatus = '有標籤';
        }

        await updateDoc(doc(db, 'equipment', equipDoc.id), {
            units: updatedUnits
        });

        console.log('✅ Successfully updated labels in Firebase!');

    } catch (error) {
        console.error('Error updating labels:', error);
    }
}

updateLabels();
