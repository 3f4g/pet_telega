import { store } from '@/app/providers/store/store';
import type { RootState } from '@/app/providers/store/store';

export const selectIsAuth = (state: RootState) => state.auth.isAuth;
