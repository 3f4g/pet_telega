// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// // import { db } from "../firebase"; // твой getFirestore(app)
// import { db } from '@/firebase';

// export async function sendMessage(
//   chatId: string,
//   text: string,
//   user: { uid: string; displayName?: string | null; photoURL?: string | null },
// ) {
//   if (!text.trim()) return;

//   const ref = collection(db, 'chats', chatId, 'messages'); // путь до коллекции сообщений в чате
//   await addDoc(ref, {
//     text: text.trim(),
//     userId: user.uid,
//     displayName: user.displayName || null,
//     photoURL: user.photoURL || null,
//     createdAt: serverTimestamp(), // обязательно serverTimestamp!
//   });
// }


import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase"; // см. firebase.ts

type UserData = {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
};

export async function sendMessage(
  chatId: string,
  text: string,
  user: UserData
) {
  if (!text.trim()) return;
  if (!user.uid) throw new Error("Missing user.uid");

  const ref = collection(db, "chats", chatId, "messages");
  await addDoc(ref, {
    text: text.trim(),
    userId: user.uid,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(), // ⚠️ это важно для твоих правил!
  });
}