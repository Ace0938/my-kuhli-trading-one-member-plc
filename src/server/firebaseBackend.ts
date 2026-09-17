import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  Firestore
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let firestoreInstance: Firestore | null = null;
let firebaseConfigData: any = null;

try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf-8');
    firebaseConfigData = JSON.parse(raw);
  }
} catch (err) {
  console.warn('[FirebaseBackend] Could not load firebase-applet-config.json:', err);
}

export function initFirebaseBackend(): Firestore | null {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  if (!firebaseConfigData || !firebaseConfigData.projectId) {
    console.warn('[FirebaseBackend] No Firebase configuration found.');
    return null;
  }

  try {
    const app = !getApps().length
      ? initializeApp(firebaseConfigData, 'mykuhli-server')
      : getApp('mykuhli-server');

    const dbId =
      firebaseConfigData.firestoreDatabaseId &&
      firebaseConfigData.firestoreDatabaseId !== '(default)'
        ? firebaseConfigData.firestoreDatabaseId
        : undefined;

    firestoreInstance = dbId ? getFirestore(app, dbId) : getFirestore(app);
    console.log(`[FirebaseBackend] Firestore connected successfully to project ${firebaseConfigData.projectId} (db: ${dbId || 'default'})`);
    return firestoreInstance;
  } catch (err) {
    console.error('[FirebaseBackend] Failed to initialize Firestore:', err);
    return null;
  }
}

export async function saveDocumentToFirestore(collectionName: string, id: string, data: any) {
  try {
    const db = initFirebaseBackend();
    if (!db) return false;
    const docRef = doc(db, collectionName, id);
    // Sanitize object (avoid undefined values which Firestore disallows)
    const sanitized = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, sanitized, { merge: true });
    return true;
  } catch (error) {
    console.warn(`[FirebaseBackend] Error saving to ${collectionName}/${id}:`, error);
    return false;
  }
}

export async function loadCollectionFromFirestore<T = any>(collectionName: string): Promise<T[]> {
  try {
    const db = initFirebaseBackend();
    if (!db) return [];
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const items: T[] = [];
    snap.forEach((d) => {
      items.push(d.data() as T);
    });
    return items;
  } catch (error) {
    console.warn(`[FirebaseBackend] Error reading collection ${collectionName}:`, error);
    return [];
  }
}

export async function checkFirestoreHealth() {
  try {
    const db = initFirebaseBackend();
    if (!db) {
      return {
        connected: false,
        message: 'Firebase configuration not initialized'
      };
    }
    // Ping by writing a test heartbeat
    const heartbeatRef = doc(db, 'system', 'heartbeat');
    await setDoc(heartbeatRef, {
      status: 'active',
      updatedAt: new Date().toISOString(),
      service: 'MY KUHLI Backend API'
    }, { merge: true });

    return {
      connected: true,
      projectId: firebaseConfigData.projectId,
      databaseId: firebaseConfigData.firestoreDatabaseId || '(default)',
      storageBucket: firebaseConfigData.storageBucket
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error?.message || 'Firestore connection ping failed'
    };
  }
}
