// components/DirectChat.tsx

import { useEffect, useState, useRef } from 'react';
import type { User } from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@/firebase';

interface DirectChatProps {
  currentUser: User;
}

export const DirectChat = ({ currentUser }: DirectChatProps) => {
  const [targetUserId, setTargetUserId] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const unsubscribeRef = useRef<() => void>();

  // Создает или возвращает id приватного чата
  const getOrCreateConversationId = async (userId1: string, userId2: string): Promise<string> => {
    const [first, second] = [userId1, userId2].sort();
    const id = `${first}_${second}`;
    const ref = doc(db, 'conversations', id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      await setDoc(ref, {
        participants: [first, second],
        createdAt: serverTimestamp(),
      });
    }
    return id;
  };

  // Получение сообщений
  const subscribeToMessages = (convId: string) => {
    const messagesQuery = query(collection(db, 'chats', convId, 'messages'), orderBy('createdAt'));

    const unsub = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
    });

    unsubscribeRef.current = unsub;
  };

  const handleStartChat = async () => {
    if (!targetUserId.trim()) return;

    const convId = await getOrCreateConversationId(currentUser.uid, targetUserId.trim());
    setConversationId(convId);
    subscribeToMessages(convId);
  };

  const handleSend = async () => {
    if (!text.trim() || !conversationId) return;

    await addDoc(collection(db, 'chats', conversationId, 'messages'), {
      userId: currentUser.uid,
      text,
      createdAt: serverTimestamp(),
    });

    setText('');
  };

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.(); // отписка при размонтировании
    };
  }, []);

  return (
    <div className="w-full max-w-md p-4 border rounded-md shadow-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter target userId"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
          className="w-full px-2 py-1 border rounded text-white"
        />
        <button
          onClick={handleStartChat}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Start Chat
        </button>
      </div>

      <div className="h-64 overflow-y-auto border p-2 mb-4 rounded bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${msg.userId === currentUser.uid ? 'text-right' : 'text-left'}`}
          >
            <span className="block bg-white p-2 rounded shadow-sm">{msg.text}</span>
          </div>
        ))}
      </div>

      {conversationId && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow px-2 py-1 border rounded text-white"
          />
          <button onClick={handleSend} className="px-4 py-2 bg-green-600 text-white rounded">
            Send
          </button>
        </div>
      )}
    </div>
  );
};
