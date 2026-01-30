
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, updateDoc, doc } = require('firebase/firestore');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

// Config from .env.local
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('Initializing Firebase Client SDK...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TARGET_STUDIO_ID = 'studio-4';
const TARGET_EQUIPMENT_ID = 'studio-4-tri-4';
const NEW_LABELS = ['4D-KCP-241-04', '4D-KCP-241-10'];

async function updateLabels() {
    try {
        console.log(`Searching for studio: ${TARGET_STUDIO_ID}...`);

        const studiosRef = collection(db, 'studios');
        const q = query(studiosRef, where('id', '==', TARGET_STUDIO_ID));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.error('Studio not found!');
            return;
        }

        const studioDoc = snapshot.docs[0];
        const studioData = studioDoc.data();

        console.log(`Found studio: ${studioData.name} (${studioDoc.id})`);

        const equipmentList = studioData.equipment || [];
        const equipmentIndex = equipmentList.findIndex((e) => e.id === TARGET_EQUIPMENT_ID);

        if (equipmentIndex === -1) {
            console.error('Equipment not found in studio!');
            return;
        }

        const targetEquipment = equipmentList[equipmentIndex];
        console.log(`Found equipment: ${targetEquipment.name}`);
        console.log(`Current units: ${targetEquipment.units.length}`);

        const updatedUnits = [...targetEquipment.units];

        // Update Unit 1
        if (updatedUnits[0]) {
            console.log(`Updating Unit 1: ${updatedUnits[0].unitLabel} -> ${NEW_LABELS[0]}`);
            updatedUnits[0].unitLabel = NEW_LABELS[0];
            updatedUnits[0].labelStatus = '有標籤';
        }

        // Update Unit 2
        if (updatedUnits[1]) {
            console.log(`Updating Unit 2: ${updatedUnits[1].unitLabel} -> ${NEW_LABELS[1]}`);
            updatedUnits[1].unitLabel = NEW_LABELS[1];
            updatedUnits[1].labelStatus = '有標籤';
        }

        // Save back to Firestore
        equipmentList[equipmentIndex] = {
            ...targetEquipment,
            units: updatedUnits
        };

        const docRef = doc(db, 'studios', studioDoc.id);
        await updateDoc(docRef, {
            equipment: equipmentList
        });

        console.log('✅ Successfully updated labels in Firebase via Client SDK!');

    } catch (error) {
        console.error('Error updating labels:', error);
    }
}

updateLabels();
