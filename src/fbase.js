import { initializeApp } from "firebase/app";
//import firebase from "firebase/app";
import * as firebase from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";

import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

import "firebase/storage";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MASSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};
initializeApp(firebaseConfig);
export const firebaseInstance = firebase;

export const authService = getAuth();
export const dbService = getFirestore();
export const storageService = getStorage();
