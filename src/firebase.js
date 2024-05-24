// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpVgL4HwJBfF5Jy9zJW31oRb_1B7-Fd5c",
  authDomain: "erza-bf3d5.firebaseapp.com",
  projectId: "erza-bf3d5",
  storageBucket: "erza-bf3d5.appspot.com",
  messagingSenderId: "336405442971",
  appId: "1:336405442971:web:e277f630316f085d07313e",
  measurementId: "G-XCGS3C1DVW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
