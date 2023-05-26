// ./app/logic/firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7Z_cGFlmiBCxvTN5LbdfXNHF2CkFP8pw",
  authDomain: "my-project-1572031495845.firebaseapp.com",
  projectId: "my-project-1572031495845",
  storageBucket: "my-project-1572031495845.appspot.com",
  messagingSenderId: "1098629179964",
  appId: "1:1098629179964:web:2a687b8d04fd6625db3139",
  measurementId: "G-WFKMR70CDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
