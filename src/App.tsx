import { useCallback, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAa1J12-YAXPmaKaDQanfiCW3fbIJjp_SI',
  authDomain: 'pet-messenger.firebaseapp.com',
  projectId: 'pet-messenger',
  storageBucket: 'pet-messenger.firebasestorage.app',
  messagingSenderId: '725978302343',
  appId: '1:725978302343:web:a95808aab1c0587d247522',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
// по желанию — всегда показывать выбор аккаунта
provider.setCustomParameters({ prompt: 'select_account' });

export default function App() {
  useEffect(() => {
    // сохраняем сессию между перезагрузками
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // следим за изменением пользователя
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log('Auth state:', user ? 'SIGNED IN' : 'SIGNED OUT', user);
    });
    return unsub;
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      console.log('Signed in via popup:', { user: result.user, token });
    } catch (e: any) {
    
      console.log('Auth popup error:', e.code, e.message);

    }
  }, []);

  const handleSignOut = useCallback(() => signOut(auth), []);

  return (
    <header>
      <button onClick={handleGoogleSignIn}>Sign in with Google (popup)</button>
      <button onClick={handleSignOut}>Sign out</button>
    </header>
  );
}