import { createAction } from '@reduxjs/toolkit';
import type { Auth, User } from 'firebase/auth';

// export { setAuth } from './authSlice';

export const onAuth = createAction<{ user: any; refreshToken: string }>('auth/userWasFecthed');

export const onLogOut = createAction('auth/logout');
