// // components/DirectChat.tsx

// import { useEffect, useState, useRef } from 'react';
// import type { User } from 'firebase/auth';
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   doc,
//   getDoc,
//   setDoc,
//   serverTimestamp,
// } from 'firebase/firestore';

// import { db } from '@/firebase';

// interface DirectChatProps {
//   currentUser: User;
// }

// export const DirectChat = ({ currentUser }: DirectChatProps) => {
//   const [targetUserId, setTargetUserId] = useState('');
//   const [conversationId, setConversationId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   const [text, setText] = useState('');
//   const unsubscribeRef = useRef<() => void>();

//   // Создает или возвращает id приватного чата
//   const getOrCreateConversationId = async (userId1: string, userId2: string): Promise<string> => {
//     const [first, second] = [userId1, userId2].sort();
//     const id = `${first}_${second}`;
//     const ref = doc(db, 'conversations', id);
//     const snapshot = await getDoc(ref);
//     if (!snapshot.exists()) {
//       await setDoc(ref, {
//         participants: [first, second],
//         createdAt: serverTimestamp(),
//       });
//     }
//     return id;
//   };

//   // Получение сообщений
//   const subscribeToMessages = (convId: string) => {
//     const messagesQuery = query(collection(db, 'chats', convId, 'messages'), orderBy('createdAt'));

//     const unsub = onSnapshot(messagesQuery, (snapshot) => {
//       const newMessages = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(newMessages);
//     });

//     unsubscribeRef.current = unsub;
//   };

//   const handleStartChat = async () => {
//     if (!targetUserId.trim()) return;

//     const convId = await getOrCreateConversationId(currentUser.uid, targetUserId.trim());
//     setConversationId(convId);
//     subscribeToMessages(convId);
//   };


//   console.log('conversationId', conversationId);
  
//   const handleSend = async () => {
    

//     if (!text.trim() || !conversationId) return;

//     await addDoc(collection(db, 'chats', conversationId, 'messages'), {
//       userId: currentUser.uid,
//       text,
//       createdAt: serverTimestamp(),
//     });

//     setText('');
//   };

//   useEffect(() => {
//     return () => {
//       unsubscribeRef.current?.(); // отписка при размонтировании
//     };
//   }, []);


//   return (
//     <div className="w-full max-w-md p-4 border rounded-md shadow-md">
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Enter target userId"
//           value={targetUserId}
//           onChange={(e) => setTargetUserId(e.target.value)}
//           className="w-full px-2 py-1 border rounded text-white"
//         />
//         <button
//           onClick={handleStartChat}
//           className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded"
//         >
//           Start Chat
//         </button>
//       </div>

//       <div className="h-64 overflow-y-auto border p-2 mb-4 rounded bg-gray-50">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`mb-2 ${msg.userId === currentUser.uid ? 'text-right' : 'text-left'}`}
//           >
//             <span className="block bg-white p-2 rounded shadow-sm">{msg.text}</span>
//           </div>
//         ))}
//       </div>

//       {conversationId && (
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Type your message"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             className="flex-grow px-2 py-1 border rounded text-white"
//           />
//           <button onClick={handleSend} className="px-4 py-2 bg-green-600 text-white rounded">
//             Send
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

import type { User } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { db } from '@/firebase';
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


interface Props {
  currentUser: User;
}

interface Message {
  id: string;
  userId: string;
  text: string;
  createdAt: any;
}

export const MessengerLayout = ({ currentUser }: Props) => {
  const [conversations, setConversations] = useState<string[]>([]);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [text, setText] = useState('');
  const unsubscribeRefs = useRef<Record<string, () => void>>({});

  // Автоматическая подписка на все беседы
  useEffect(() => {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid)
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
      const q = query(
        collection(db, 'chats', convId, 'messages'),
        orderBy('createdAt')
      );

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
    const [a, b] = [currentUser.uid, targetUserId].sort();
    const convId = `${a}_${b}`;
    const ref = doc(db, 'conversations', convId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      await setDoc(ref, {
        participants: [a, b],
        createdAt: serverTimestamp(),
      });
    }

    setActiveConversation(convId);
  };

  return (
    <div className="flex h-[90vh] w-full border rounded overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-gray-100 p-2 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Чаты</h2>
        {conversations.map((convId) => {
          const otherUser = convId
            .split('_')
            .find((id) => id !== currentUser.uid) || 'Unknown';

          const lastMsg = allMessages[convId]?.slice(-1)[0];

          return (
            <div
              key={convId}
              onClick={() => setActiveConversation(convId)}
              className={`p-2 rounded cursor-pointer mb-1 ${
                convId === activeConversation ? 'bg-blue-200' : 'hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">{otherUser}</div>
              <div className="text-sm text-gray-600 truncate">
                {lastMsg ? lastMsg.text : '...'}
              </div>
            </div>
          );
        })}

        {/* Новый чат */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Начать чат с userId"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleStartChat((e.target as HTMLInputElement).value.trim());
                (e.target as HTMLInputElement).value = '';
              }
            }}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${
                msg.userId === currentUser.uid ? 'text-right' : 'text-left'
              }`}
            >
              <span className="inline-block px-3 py-1 bg-white rounded shadow-sm">
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {activeConversation && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Введите сообщение"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-grow px-2 py-1 border rounded"
            />
            <button
              onClick={handleSend}
              className="px-4 py-1 bg-green-600 text-white rounded"
            >
              Отправить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};