// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXn8ASp_j2XqXw7A9hgqnhOawvYgfHxWA",
  authDomain: "twitter-reload.firebaseapp.com",
  projectId: "twitter-reload",
  storageBucket: "twitter-reload.appspot.com",
  messagingSenderId: "966737490025",
  appId: "1:966737490025:web:8b12ace060f6af6ce8b2f8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
