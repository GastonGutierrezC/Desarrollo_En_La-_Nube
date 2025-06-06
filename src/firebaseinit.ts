// src/firebaseinit.tsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "./firebaseconfig";


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const analytics = getAnalytics(app);


const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, analytics };
