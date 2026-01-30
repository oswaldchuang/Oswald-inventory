
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error('Error: FIREBASE_SERVICE_ACCOUNT_KEY is missing');
    process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const TARGET_STUDIO_ID = 'ST-4';
const TARGET_EQUIPMENT_ID = 'ST-4-tri-4';

async function verifyLabels() {
    try {
        console.log(`Checking labels for Studio: ${TARGET_STUDIO_ID}, Equipment: ${TARGET_EQUIPMENT_ID}...`);

        const studiosRef = db.collection('studios');
        const q = studiosRef.where('id', '==', TARGET_STUDIO_ID);
        const snapshot = await q.get();

        if (snapshot.empty) {
            console.log('❌ Studio not found!');
            return;
        }

        const studioDoc = snapshot.docs[0];
        const studioData = studioDoc.data();
        const equipment = studioData.equipment.find((e: any) => e.id === TARGET_EQUIPMENT_ID);

        if (!equipment) {
            console.log('❌ Equipment not found inside studio!');
            return;
        }

        console.log(`\n📋 Current Labels for ${equipment.name}:`);
        equipment.units.forEach((u: any, index: number) => {
            console.log(`   Unit ${index + 1}: [${u.unitLabel}] - Status: ${u.labelStatus}`);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

verifyLabels();
