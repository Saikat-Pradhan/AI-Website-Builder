import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-60f71.firebaseapp.com",
  projectId: "genwebai-60f71",
  storageBucket: "genwebai-60f71.firebasestorage.app",
  messagingSenderId: "1067462410056",
  appId: "1:1067462410056:web:e93468a4de244eb92c7d7d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider}