import { APITester } from "./APITester";

import { Card, CardContent } from "@/shared/ui/ui/card";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

import { initializeApp } from "firebase/app";

export function App() {

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAa1J12-YAXPmaKaDQanfiCW3fbIJjp_SI",
  authDomain: "pet-messenger.firebaseapp.com",
  projectId: "pet-messenger",
  storageBucket: "pet-messenger.firebasestorage.app",
  messagingSenderId: "725978302343",
  appId: "1:725978302343:web:a95808aab1c0587d247522"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);


  return (
    <div className="container mx-auto p-8 text-center relative z-10">
      <div className="flex justify-center items-center gap-8 mb-8">
        <img
          src={logo}
          alt="Bun Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] [animation:spin_20s_linear_infinite]"
        />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-muted">
        <CardContent className="pt-6">
          <h1 className="text-5xl font-bold my-4 leading-tight">Bun + React</h1>
          <p>
            Edit{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">src/App.tsx</code> and
            save to test HMR
          </p>
          <APITester />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
