import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCJG0sOcs0Wr6QslTUKmDshs9LapFyjs1w",
  authDomain: "sulukera-calendar.firebaseapp.com",
  projectId: "sulukera-calendar",
  storageBucket: "sulukera-calendar.firebasestorage.app",
  messagingSenderId: "729863935633",
  appId: "1:729863935633:web:c3069e853fa11e4d4b9130"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
