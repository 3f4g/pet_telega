import type { FirebaseApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/app/providers/store/store';
import { onLogOut, onAuth } from '../model/actons';
import { useCallback, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { extractUserData } from './helpers';
import { selectUser } from '../model/selectors';

export function useAuth(firebaseApp: FirebaseApp) {
  const dispatch = useDispatch<AppDispatch>();
  const storedUser = useSelector(selectUser);

  const auth = getAuth(firebaseApp);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const [data] = useAuthState(auth);

  useEffect(() => {
    if (data && !storedUser) {
      const extractedUser = extractUserData(data);
      dispatch(onAuth({ user: extractedUser, refreshToken: data.refreshToken }));
    }
  }, [data, storedUser, dispatch]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      console.log('Signed in via popup:', { user: result.user, token });
    } catch (e: any) {
      console.error('Auth popup error:', e.code, e.message);
    }
  }, [auth]);

  const handleSignOut = useCallback(async () => {
    await signOut(auth);
    dispatch(onLogOut());
  }, [auth, dispatch]);

  return {
    handleGoogleSignIn,
    handleSignOut,
  };
}
