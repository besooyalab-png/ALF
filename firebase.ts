// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDYH8GPqPeBGa-tNwI6GBTQ4WEuZZj2eRg",
    authDomain: "alf-rosy.firebaseapp.com",
    projectId: "alf-rosy",
    storageBucket: "alf-rosy.firebasestorage.app",
    messagingSenderId: "982361486442",
    appId: "1:982361486442:web:791300f4f9c79ce9b98613",
    measurementId: "G-6DFGKVEH8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export Firebase services for use in other parts of the application
export { app, analytics, db };
