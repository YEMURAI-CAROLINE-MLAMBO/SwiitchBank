// frontend/src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// FirebaseConfig.js - Mobile optimized
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "your-api-key",
 authDomain: "switchbank-09410265.firebaseapp.com",
 projectId: "switchbank-09410265",
 storageBucket: "switchbank-09410265.appspot.com",
 messagingSenderId: "your-sender-id",
 appId: "your-app-id",
 measurementId: "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Firebase services
const functions = getFunctions(app);

// Optional: Connect to emulators for development
if (window.location.hostname === 'localhost') {
 connectFirestoreEmulator(db, 'localhost', 8080);
 connectAuthEmulator(auth, 'http://localhost:9099');
 connectFunctionsEmulator(functions, 'localhost', 5001);
}
export { db, auth, functions };
