import { initializeApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import firebaseConfig from "../../../firebase-applet-config.json";

setLogLevel('silent'); // Suppress quota backoff logs if we exhaust the free tier
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
