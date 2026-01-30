
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');
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

async function listEquipment() {
    try {
        console.log('Listing equipment for studio-4...');
        const studiosRef = collection(db, 'studios');
        const q = query(studiosRef, where('id', '==', 'studio-4'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('Studio not found');
            return;
        }

        const data = snapshot.docs[0].data();
        console.log('Studio Data:', JSON.stringify(data, null, 2));

        if (data.equipment) {
            data.equipment.forEach(e => {
                console.log(`- [${e.id}] ${e.name}`);
            });
        } else {
            console.log('No equipment field found!');
        }

    } catch (error) {
        console.error('Error listing equipment:', error);
    }
}

listEquipment();
