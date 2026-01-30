
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { EquipmentStatus, LabelStatus } from '../data/types';

dotenv.config({ path: '.env.local' });

// Verify service account
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error('Error: FIREBASE_SERVICE_ACCOUNT_KEY is missing in .env.local');
    process.exit(1);
}

// Initialize Firebase Admin
let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    // Fix private key formatting
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
} catch (error) {
    console.error('Error parsing service account key:', error);
    process.exit(1);
}

console.log('Initializing Firebase Admin...');
initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const TARGET_STUDIO_ID = 'ST-4';
const TARGET_EQUIPMENT_ID = 'ST-4-tri-4';
const NEW_LABELS = ['4D-KCP-241-04', '4D-KCP-241-10'];

async function updateLabels() {
    try {
        console.log(`Searching for studio: ${TARGET_STUDIO_ID}...`);

        // 1. Get Studio Document
        const studiosRef = db.collection('studios');
        const q = studiosRef.where('id', '==', TARGET_STUDIO_ID);
        const snapshot = await q.get();

        if (snapshot.empty) {
            console.error('Studio not found!');
            return;
        }

        const studioDoc = snapshot.docs[0];
        const studioData = studioDoc.data();

        console.log(`Found studio: ${studioData.name} (${studioDoc.id})`);

        // 2. Find Equipment in the array
        const equipmentList = studioData.equipment || [];
        const equipmentIndex = equipmentList.findIndex((e: any) => e.id === TARGET_EQUIPMENT_ID);

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
            updatedUnits[0].labelStatus = LabelStatus.LABELED;
        }

        // Update Unit 2
        if (updatedUnits[1]) {
            console.log(`Updating Unit 2: ${updatedUnits[1].unitLabel} -> ${NEW_LABELS[1]}`);
            updatedUnits[1].unitLabel = NEW_LABELS[1];
            updatedUnits[1].labelStatus = LabelStatus.LABELED;
        }

        // 4. Save back to Firestore
        equipmentList[equipmentIndex] = {
            ...targetEquipment,
            units: updatedUnits
        };

        await studioDoc.ref.update({
            equipment: equipmentList
        });

        console.log('✅ Successfully updated labels in Firebase!');

    } catch (error) {
        console.error('Error updating labels:', error);
    }
}

updateLabels();
