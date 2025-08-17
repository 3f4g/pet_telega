import type { User } from 'firebase/auth';

export function extractUserData(data: User) {
  const user = {
    uid: data.uid,
    userId: data.uid,
    name: data.displayName,
    email: data.email,
    imageUrl: data.photoURL,
    createdAt: data.metadata.creationTime as unknown as Date,
    updatedAt: data.metadata.lastSignInTime as unknown as Date,
    servers: [],
    members: [],
    channels: [],
  };
  
  return user;
}
