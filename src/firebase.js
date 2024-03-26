// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAy3eeBA5cwXMNYCKHPacMgMgrCxu1chPI",
    authDomain: "virtual-ta-fde70.firebaseapp.com",
    projectId: "virtual-ta-fde70",
    storageBucket: "virtual-ta-fde70.appspot.com",
    messagingSenderId: "628363837730",
    appId: "1:628363837730:web:1471de5ddd8aacc63c657b",
    measurementId: "G-XM6Z38LFFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);