import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // apiKey: "AIzaSyB2cRCpazopnKfwlxBvELK3Win_Cjuh_zg",
  // authDomain: "todo-next-15994.firebaseapp.com",
  // projectId: "todo-next-15994",
  // storageBucket: "todo-next-15994.firebasestorage.app",
  // messagingSenderId: "395212723317",
  // appId: "1:395212723317:web:1fdfddb0b618e956e8543c"
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export default firestore 