import {
  getAuth,
  User,
  signOut,
  browserLocalPersistence,
  Auth,
} from "firebase/auth";
import "firebase/firestore";
import { Firestore, getFirestore } from "firebase/firestore";
import * as app from "firebase/app";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let FIREBASE_AUTH: Auth;
let CURRENT_LOGGED_IN_USER: User | null;
let FIREBASE_DB: Firestore;
const appInitialized = app.initializeApp(clientCredentials);
getAuth(appInitialized).setPersistence(browserLocalPersistence);
// (window as any).firebase = appInitialized;
FIREBASE_AUTH = getAuth(appInitialized);
CURRENT_LOGGED_IN_USER = FIREBASE_AUTH.currentUser;
FIREBASE_DB = getFirestore(appInitialized);
// if (typeof window !== "undefined" && app.getApps().length === 0) {
//   console.log(app.getApps());
//   try {
//     const appInitialized = app.initializeApp(clientCredentials);
//     getAuth(appInitialized).setPersistence(browserLocalPersistence);
//     (window as any).firebase = appInitialized;
//     FIREBASE_AUTH = getAuth(appInitialized);
//     CURRENT_LOGGED_IN_USER = FIREBASE_AUTH.currentUser;
//     FIREBASE_DB = getFirestore(appInitialized);
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function signOutUser() {
  await signOut(FIREBASE_AUTH);
}
export {
  app as FIREBASE_CLIENT,
  FIREBASE_AUTH,
  CURRENT_LOGGED_IN_USER,
  FIREBASE_DB,
};
