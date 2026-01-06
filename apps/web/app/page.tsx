"use client";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = () => {
    setShowLoginModal(true);
    console.log('Login clicked');
  };

  const handleSignUp = () => {
    setShowLoginModal(true);
    console.log('Sign up clicked');
  };

  const handleGetStarted = () => {
    setShowLoginModal(true);
    console.log('Get started clicked');
  };

  return (
    <>
    <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col justify-center">
      <div className="h-full flex gap-x-1 items-center mb-8">
        <input
          type="text"
          placeholder="Enter Room Code"
          className="grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            console.log(e.target.value);
            setRoomId(e.target.value)}}
        />
        <button 
          className="bg-blue-500 text-white rounded-r-md px-4 py-2 hover:bg-blue-600"
          onClick={() => router.push(`/rooms/${roomId}`)}
        >
          Join
        </button>
      </div>
    </div> 
  </>
  );
}


{/* <div className=" from-gray-900 via-gray-800 to-gray-900 h-screen h-full">
      <Navbar onLoginClick={handleLogin} onSignUpClick={handleSignUp} />
      <Hero onGetStarted={handleGetStarted} />
      <button 
          className="bg-blue-500 text-white rounded-r-md px-4 py-2 hover:bg-blue-600 " 
          onClick={() => router.push(`/rooms/${roomId}`)}
        >
          Join
        </button>
    </div> */}