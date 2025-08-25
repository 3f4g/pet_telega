import type { Profile } from "@prisma/client";
import type { Auth, User } from "firebase/auth";


export interface IAuthSlice {
  isAuth: boolean;
  firebaseAuth: Auth | null;
  profile: Profile | null;
  refreshToken: string | null
  user: User
  
}