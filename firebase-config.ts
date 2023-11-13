// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2j3M2DU2kZgsi1y-CwytTr8DvF1-4uSc",
  authDomain: "iths-crossplatform-d0af9.firebaseapp.com",
  projectId: "iths-crossplatform-d0af9",
  storageBucket: "iths-crossplatform-d0af9.appspot.com",
  messagingSenderId: "339863369508",
  appId: "1:339863369508:web:ec912c8dbd283a4a0d65b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()