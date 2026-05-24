import admin from 'firebase-admin';
import path from 'path';

let firebaseApp: admin.app.App | null = null;

export function initializeFirebase(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  const serviceAccountPath = path.resolve(
    __dirname,
    '../../firebase-service-account.json'
  );
  const serviceAccount: admin.ServiceAccount = require(serviceAccountPath);

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.projectId}-default-rtdb.firebaseio.com`,
  });

  return firebaseApp;
}

export function getFirestore(): admin.firestore.Firestore {
  const app = initializeFirebase();
  return app.firestore();
}

export function getRealtimeDatabase(): admin.database.Database {
  const app = initializeFirebase();
  return app.database();
}
