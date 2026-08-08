import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

let cachedAccessToken: string | null = null;

export const getCachedAccessToken = () => cachedAccessToken;

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return {
      user: result.user,
      accessToken: cachedAccessToken
    };
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

export const logoutFirebase = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Firestore Realtime Sync Helpers
export const saveCustomerToFirestore = async (customer: any) => {
  try {
    const docId = customer.id || customer.email.replace(/[@.]/g, '_');
    const custRef = doc(db, 'customers', docId);
    await setDoc(custRef, {
      ...customer,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore customer save warning:', err);
  }
};

export const saveUserToFirestore = async (user: any) => {
  try {
    const docId = user.id || user.email.replace(/[@.]/g, '_');
    const userRef = doc(db, 'users', docId);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore user save warning:', err);
  }
};

export const saveArtworkToFirestore = async (artwork: any) => {
  try {
    const artRef = doc(db, 'artworks', artwork.id);
    await setDoc(artRef, {
      ...artwork,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore artwork save warning:', err);
  }
};

export const deleteArtworkFromFirestore = async (artworkId: string) => {
  try {
    await deleteDoc(doc(db, 'artworks', artworkId));
  } catch (err) {
    console.warn('Firestore artwork delete warning:', err);
  }
};

