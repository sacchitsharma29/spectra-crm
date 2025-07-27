import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCsSkScmkntc-TRVxuK8dO-F2mbfNwWfc",
  authDomain: "spectra-crm-33ae8.firebaseapp.com",
  projectId: "spectra-crm-33ae8",
  storageBucket: "spectra-crm-33ae8.firebasestorage.app",
  messagingSenderId: "660242944107",
  appId: "1:660242944107:web:fd90dbcecd074c044c212e",
  measurementId: "G-W5EHGK2SF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app; 