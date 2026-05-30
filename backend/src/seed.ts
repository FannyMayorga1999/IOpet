import path from 'path';
import { initializeFirebase, getFirestore } from './configs/firebase';
import { logger } from './utils/logger';

interface SeedCollection {
  name: string;
  file: string;
}

const collections: SeedCollection[] = [
  { name: 'pets', file: 'pets.json' },
  { name: 'feedingSchedules', file: 'feedingSchedules.json' },
  { name: 'users', file: 'users.json' },
  { name: 'notifications', file: 'notifications.json' },
  { name: 'foodCatalog', file: 'foodCatalog.json' },
  { name: 'breedCatalog', file: 'breedCatalog.json' },
];

async function seedCollection(
  db: FirebaseFirestore.Firestore,
  collection: SeedCollection
): Promise<void> {
  const filePath = path.resolve(
    __dirname,
    '../../firebase/seed-data',
    collection.file
  );
  const data: unknown[] = require(filePath);

  if (!Array.isArray(data)) {
    logger.warn(`Skipping ${collection.file}: not an array`);
    return;
  }

  let count = 0;
  for (const doc of data) {
    const id = (doc as any).id || undefined;
    const docRef = id
      ? db.collection(collection.name).doc(id)
      : db.collection(collection.name).doc();
    const { id: _id, ...docData } = doc as any;
    await docRef.set(docData as FirebaseFirestore.DocumentData);
    count++;
  }

  logger.info(`Seeded ${count} documents into "${collection.name}"`);
}

async function seed(): Promise<void> {
  initializeFirebase();
  const db = getFirestore();

  logger.info('Starting seed...');

  for (const collection of collections) {
    await seedCollection(db, collection);
  }

  logger.info('Seed completed successfully');
  process.exit(0);
}

seed().catch((err) => {
  logger.error('Seed failed', { error: err });
  process.exit(1);
});
