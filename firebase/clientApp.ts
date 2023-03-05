import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore/lite";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebase: FirebaseApp | undefined;

if (getApps().length < 1) {
  firebase = initializeApp(clientCredentials);
}

let firestore = getFirestore(firebase);
let storage = getStorage(firebase);
let auth = getAuth(firebase);

const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
const logOut = () => signOut(auth);

const EMULATORS_STARTED = "EMULATORS_STARTED";
function startEmulators() {
  if (!(global as any)[EMULATORS_STARTED]) {
    (global as any)[EMULATORS_STARTED] = true;
    /* Enable below line to connect to the storage emulator */
    connectStorageEmulator(storage, "localhost", 9199);
    /* Enable below line to connect to the firestore emulator */
    connectFirestoreEmulator(firestore, "localhost", 8080);
    /* Enable below line to connect to the auth emulator */
    connectAuthEmulator(getAuth(firebase), "http://localhost:9099", {
      disableWarnings: true,
    });
  }
}

if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true") {
  startEmulators();
}

export { firebase, firestore, storage, auth, signInWithGoogle, logOut };
