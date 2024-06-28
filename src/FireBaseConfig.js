import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAIdp62aRBkXpvtqgH-Tcajx_1yndM8GzU",
  authDomain: "deneme1-e6102.firebaseapp.com",
  projectId: "deneme1-e6102",
  storageBucket: "deneme1-e6102.appspot.com",
  messagingSenderId: "474405238819",
  appId: "1:474405238819:web:11e8a9696f8413197dd996",
  measurementId: "G-CP2HW6NS0V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
