import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB9xcB8bY1MZR0bGr8GK0X-KDX3OtbEhP0",
  authDomain: "twitter-4b46d.firebaseapp.com",
  projectId: "twitter-4b46d",
  storageBucket: "twitter-4b46d.firebasestorage.app",
  messagingSenderId: "270618346046",
  appId: "1:270618346046:web:972534ad95a533271cc76f",
  measurementId: "G-8WH3QKPXEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);