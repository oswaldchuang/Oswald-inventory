
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
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

async function listStudios() {
    try {
        console.log('Listing all studios...');
        const studiosRef = collection(db, 'studios');
        const snapshot = await getDocs(studiosRef);

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`- Doc ID: ${doc.id}, Field ID: ${data.id}, Name: ${data.name}`);
        });

    } catch (error) {
        console.error('Error listing studios:', error);
    }
}

listStudios();
