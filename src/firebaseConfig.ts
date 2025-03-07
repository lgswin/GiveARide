import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAQ31ntj7Q4AohtZ9fOONc5NB2AB9iCmdY",
    authDomain: "givearide-f7525.firebaseapp.com",
    projectId: "givearide-f7525",
    storageBucket: "givearide-f7525.firebasestorage.app",
    messagingSenderId: "1033655108408",
    appId: "1:1033655108408:web:073e9b79c53dbda58af7cd",
    measurementId: "G-S588T96007"
  };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);