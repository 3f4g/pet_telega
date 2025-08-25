import { useEffect, useRef, useState } from 'react';

import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from '@/features/auth/model/selectors';
// import type { Message } from '@prisma/client';
import { db } from '@/firebase';

interface Message {
  id: string;
  userId: string;
  text: string;
  createdAt: any;
}

export function useChat() {
  const currentUser = useSelector(selectUser);

  const [conversations, setConversations] = useState<string[]>([]);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [text, setText] = useState('');

  const unsubscribeRefs = useRef<Record<string, () => void>>({});

  // Автоматическая подписка на все беседы
  useEffect(() => {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const convIds = snapshot.docs.map((doc) => doc.id);
      setConversations(convIds);

      if (!activeConversation && convIds.length > 0) {
        setActiveConversation(convIds[0]); // автооткрытие первого чата
      }
    });

    return () => unsub();
  }, [currentUser.uid]);

  // Подписка на все сообщения всех бесед
  useEffect(() => {
    Object.values(unsubscribeRefs.current).forEach((unsub) => unsub());
    unsubscribeRefs.current = {};

    conversations.forEach((convId) => {
      const q = query(collection(db, 'chats', convId, 'messages'), orderBy('createdAt'));

      const unsub = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];

        setAllMessages((prev) => ({
          ...prev,
          [convId]: messages,
        }));
      });

      unsubscribeRefs.current[convId] = unsub;
    });

    return () => {
      Object.values(unsubscribeRefs.current).forEach((unsub) => unsub());
    };
  }, [conversations]);

  const messages = activeConversation ? allMessages[activeConversation] || [] : [];

  const handleSend = async () => {
    if (!text.trim() || !activeConversation) return;

    await addDoc(collection(db, 'chats', activeConversation, 'messages'), {
      userId: currentUser.uid,
      text,
      createdAt: serverTimestamp(),
    });

    setText('');
  };

  const handleStartChat = async (targetUserId: string) => {
    const [user1, user2] = [currentUser.uid, targetUserId].sort();
    const convId = `${user1}_${user2}`;
    const ref = doc(db, 'conversations', convId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      await setDoc(ref, {
        participants: [user1, user2],
        createdAt: serverTimestamp(),
      });
    }

    setActiveConversation(convId);
  };

  return {
    messages,
    conversations,
    allMessages,
    activeConversation,
    text,
    handleSend,
    handleStartChat,
    setActiveConversation,
    setText,
  };
}
