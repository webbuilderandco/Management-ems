import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase web configuration is public by design. Protect school data with
// Firestore/Storage security rules and Firebase Authentication.
const firebaseConfig = {
  apiKey: 'AIzaSyD6qc2j0c0v1JrbDcQy8PlpfUZgLwsjjpM',
  authDomain: 'ems-f787e.firebaseapp.com',
  projectId: 'ems-f787e',
  storageBucket: 'ems-f787e.firebasestorage.app',
  messagingSenderId: '317558244850',
  appId: '1:317558244850:web:a7ccda408b4b8e6f49976b',
  measurementId: 'G-T66RMTK3LY',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
