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
import { useChat } from './hooks/useChat';

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
  const {
    messages,
    conversations,
    allMessages,
    activeConversation,
    text,
    handleSend,
    handleStartChat,
    setActiveConversation,
    setText,
  } = useChat();

  console.log('cover', messages);
  


  return (
    <div className="flex h-[90vh] w-full border rounded overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-gray-100 p-2 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Чаты</h2>
        {conversations && conversations.map((convId) => {
          const otherUser = convId.split('_').find((id) => id !== currentUser.uid) || 'Unknown';

          

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
              <div className="text-sm text-gray-600 truncate">{lastMsg ? lastMsg.text : '...'}</div>
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
              className={`mb-2 ${msg.userId === currentUser.uid ? 'text-right' : 'text-left'}`}
            >
              <span className="inline-block px-3 py-1 bg-white rounded shadow-sm">{msg.text}</span>
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
            <button onClick={handleSend} className="px-4 py-1 bg-green-600 text-white rounded">
              Отправить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
