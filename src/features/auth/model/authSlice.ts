import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { IAuthSlice } from './types';
import { onAuth, onLogOut } from './actons';

import { useAuthState } from 'react-firebase-hooks/auth';

const initialState: IAuthSlice = {
  firebaseAuth: null,
  isAuth: false,
  user: null,
  refreshToken: null,
  profile: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(onAuth, (state, action) => {
      const { user, refreshToken } = action.payload;

      state.user = user;
      state.refreshToken = refreshToken;
    });

    builder.addCase(onLogOut, (state) => {
      Object.assign(state, initialState);

      // console.log('afterlogout', state.user);
      
    });
  },
});

// export const { setAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
