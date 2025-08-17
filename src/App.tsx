// import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
// import { firebaseConfig } from './firebase.config';
// import { useAuth } from './features/auth/useAuth/useAuth';
// import { useSelector } from 'react-redux';
// import { selectUser } from './features/auth/model/selectors';
// import { AuthWidget } from './widgets/AuthWidget/AuthWidget';
// import { sendMessage } from './features/chat/testsend';
// import { useEffect } from 'react';

// interface IAppProps {
//   firebaseApp: FirebaseApp;
// }

// export default function App({firebaseApp}: IAppProps) {
//   // const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

//   const { handleGoogleSignIn, handleSignOut } = useAuth(firebaseApp);
//   const user = useSelector(selectUser);

//   // console.log('USER from redux:', user);

//   useEffect(() => {

//     if (!user) return;
//     // подставь реального пользователя (авторизованного в Firebase)
//     const testUser = {
//       uid: user.uid,
//       displayName: user.displayName,
//       photoURL: null,
//     };

//     sendMessage('1', "test message", testUser)
//       .then(() => console.log("Message sent"))
//       .catch((err) => console.error("Error sending message:", err));
//   }, [user]);

//   return (
//     <div className="flex flex-col items-center justify-center align-center w-full h-full">
//       {user ? (
//         <>
//           <p>Signed in as {user.email}</p>
//           <button onClick={handleSignOut}>Sign out</button>
//         </>
//       ) : (
//         <AuthWidget onLogin={handleGoogleSignIn} />
//       )}
//     </div>
//   );
// }

import type { FirebaseApp } from 'firebase/app';
import { useAuth } from './features/auth/useAuth/useAuth';
import { useSelector } from 'react-redux';
import { selectUser } from './features/auth/model/selectors';
import { AuthWidget } from './widgets/AuthWidget/AuthWidget';
import { sendMessage } from './features/chat/testsend';
import { useEffect, useState } from 'react';
import { subscribeMessages } from './features/chat/testreceive';

interface IAppProps {
  firebaseApp: FirebaseApp;
}

export default function App({ firebaseApp }: IAppProps) {
  const { handleGoogleSignIn, handleSignOut } = useAuth(firebaseApp);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user) return;

    sendMessage('1', 'новое тестовое сообщение 2', {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    })
      .then(() => console.log('Message sent 🚀'))
      .catch((err) => console.error('Error sending message:', err));
  }, [user]);

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const unsub = subscribeMessages('1', setMessages);
    return () => unsub(); // отписка при размонтировании
  }, []);

  useEffect(() => {
    console.log('messages', messages);
    
  }, [messages])

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {user ? (
        <>
          <p>Signed in as {user.email}</p>
          <button onClick={handleSignOut}>Sign out</button>
        </>
      ) : (
        <AuthWidget onLogin={handleGoogleSignIn} />
      )}
    </div>
  );
}
