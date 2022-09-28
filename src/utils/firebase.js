import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjRJYpUYTVJeXaNdVpPLw81_jF48hjEts",
  authDomain: "businessbook-f34b8.firebaseapp.com",
  projectId: "businessbook-f34b8",
  storageBucket: "businessbook-f34b8.appspot.com",
  messagingSenderId: "875522714928",
  appId: "1:875522714928:web:b9b87b024776cfbe112cf5",
  measurementId: "G-HV0CQ2Q9TS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
