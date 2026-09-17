import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(config) : getApp();

// Initialize Firestore with custom database ID if specified
export const firestore: Firestore =
  config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, config.firestoreDatabaseId)
    : getFirestore(app);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

export const firebaseConfig = config;

export interface FirebaseConnectionStatus {
  isConnected: boolean;
  projectId: string;
  databaseId: string;
  authDomain: string;
}

export function getFirebaseStatus(): FirebaseConnectionStatus {
  return {
    isConnected: true,
    projectId: config.projectId,
    databaseId: config.firestoreDatabaseId || '(default)',
    authDomain: config.authDomain
  };
}
