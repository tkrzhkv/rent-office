// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCjfCMm8kx0ReQNQHr5XobFAwno2mqmvk",
  authDomain: "rent-office-fd721.firebaseapp.com",
  projectId: "rent-office-fd721",
  storageBucket: "rent-office-fd721.appspot.com",
  messagingSenderId: "215153566959",
  appId: "1:215153566959:web:0f7bb97a69e82ff1f9671a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
