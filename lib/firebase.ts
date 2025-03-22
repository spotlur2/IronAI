// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Replace this with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdL-KxRjWru5fgpQhXJC2usIJHOIfORqM",
  authDomain: "ironai-dc403.firebaseapp.com",
  projectId: "ironai-dc403",
  storageBucket: "ironai-dc403.firebasestorage.app",
  messagingSenderId: "25349983805",
  appId: "1:25349983805:web:83d4486e6edfd851b8a454",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, setDoc, getDoc };
