import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { INITIAL_STUDIOS } from '../data/constants';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoGMxp1kGeInOWcjP1dcssMCCaNiv0HDo",
    authDomain: "oswald-in.firebaseapp.com",
    projectId: "oswald-in",
    storageBucket: "oswald-in.firebasestorage.app",
    messagingSenderId: "185804567159",
    appId: "1:185804567159:web:509bcf4bb69c639755cc72",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importDataToFirebase() {
    console.log('🚀 Starting data import to Firebase Firestore...\n');

    let totalStudios = 0;
    let totalEquipment = 0;
    let totalUnits = 0;

    try {
        // Process each studio
        for (const studio of INITIAL_STUDIOS) {
            console.log(`\n📦 Processing studio: ${studio.name}`);

            // Create batch for this studio
            const batch = writeBatch(db);

            // 1. Add studio document
            const studioRef = doc(db, 'studios', studio.id);
            batch.set(studioRef, {
                id: studio.id,
                name: studio.name,
                icon: studio.icon,
                themeColor: studio.themeColor,
                description: studio.description || '',
                assignees: studio.assignees || [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            totalStudios++;

            // 2. Add equipment for this studio
            for (const equipment of studio.equipment) {
                const equipmentId = `${studio.id}_${equipment.name.toLowerCase().replace(/\s+/g, '_')}`;
                const equipmentRef = doc(db, 'equipment', equipmentId);

                batch.set(equipmentRef, {
                    id: equipmentId,
                    studioId: studio.id,
                    name: equipment.name,
                    category: equipment.category,
                    quantity: equipment.quantity,
                    unit: equipment.unit || '台',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                totalEquipment++;

                // 3. Add units for this equipment
                if (equipment.units && equipment.units.length > 0) {
                    for (let i = 0; i < equipment.units.length; i++) {
                        const unit = equipment.units[i];
                        const unitId = `${equipmentId}_unit_${i}`;
                        const unitRef = doc(db, 'equipment_units', unitId);

                        batch.set(unitRef, {
                            id: unitId,
                            equipmentId: equipmentId,
                            studioId: studio.id,
                            unitIndex: i,
                            unitLabel: unit.unitLabel || `${studio.id}-${equipment.name}-${i + 1}`,
                            status: unit.status || 'available',
                            labelStatus: unit.labelStatus || 'normal',
                            remark: unit.remark || '',
                            labelRemark: unit.labelRemark || '',
                            checkedBy: unit.checkedBy || null,
                            replacementPending: unit.replacementPending || false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        totalUnits++;
                    }
                }
            }

            // Commit the batch for this studio
            await batch.commit();
            console.log(`✅ ${studio.name}: ${studio.equipment.length} equipment items imported`);
        }

        console.log('\n' + '='.repeat(50));
        console.log('🎉 Data import completed successfully!');
        console.log('='.repeat(50));
        console.log(`📊 Summary:`);
        console.log(`   - Studios: ${totalStudios}`);
        console.log(`   - Equipment items: ${totalEquipment}`);
        console.log(`   - Equipment units: ${totalUnits}`);
        console.log('='.repeat(50) + '\n');

    } catch (error) {
        console.error('❌ Error importing data:', error);
        process.exit(1);
    }
}

// Run the import
importDataToFirebase()
    .then(() => {
        console.log('✅ Import script finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Import script failed:', error);
        process.exit(1);
    });
