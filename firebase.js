// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZWpXKt7mtaQ7gxXeZVvjvGzGiGHPlFrw",
  authDomain: "twitter-clone-d3209.firebaseapp.com",
  projectId: "twitter-clone-d3209",
  storageBucket: "twitter-clone-d3209.appspot.com",
  messagingSenderId: "748795611953",
  appId: "1:748795611953:web:ae342bc4b19a9d479a3e10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app)