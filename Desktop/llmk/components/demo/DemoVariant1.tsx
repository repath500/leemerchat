"use client";

import { useState } from "react";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ChatUI from "@/components/chat";

const DemoVariant1 = () => {
  const [showChat, setShowChat] = useState(false);

  const handleAccessChat = () => {
    setShowChat(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {!showChat ? (
        <>
          <AnimatedGradientBackground />

          <div className="relative z-10 flex flex-col items-center justify-start h-full px-4 pt-32 text-center">
            <div>
              <DotLottieReact
                src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json"
                loop
                autoplay
              />
            </div>

            <div className="mt-8 space-y-8">
              <h1 className="text-4xl font-extrabold text-white md:text-6xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">
                Discover OrionAI LeemerChat
              </h1>
              <p className="text-lg text-gray-200 md:text-xl max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
                Step into a world of intelligent conversations powered by 
                <span className="font-medium"> cutting-edge AI technology</span>
              </p>
              <Button
                onClick={handleAccessChat}
                className="px-10 py-6 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Begin Your Journey
              </Button>
            </div>
          </div>
        </>
      ) : (
        <ChatUI />
      )}
    </div>
  );
};

export { DemoVariant1 };