import { initializeApp } from '@firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCVAkZpQN3wV32ovgSVH-68RtdRNpPZDjM',
  authDomain: 'my-mobile-app-7768c.firebaseapp.com',
  projectId: 'my-mobile-app-7768c',
  storageBucket: 'my-mobile-app-7768c.appspot.com',
  messagingSenderId: '380276323134',
  appId: '1:380276323134:web:8ce966965231dfaab2326f',
  measurementId: 'G-9PBCNW2R9E',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
