"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react" // Added import for React

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface AnimatedTabsProps {
  tabs?: Tab[]
  defaultTab?: string
  className?: string
}

const defaultTabs: Tab[] = [
  {
    id: "small",
    label: "Qiwi-Small",
    content: (
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-6kk6q0jjc9rme0cmys2rwhq444-ixxFPilTksFecYtWDbUoidPyMTrOcv.png"
          alt="Qiwi-Small"
          className="rounded-lg w-full h-60 object-cover mt-0 !m-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none"
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold mb-0 text-white mt-0 !m-0">Qiwi-Small</h2>
          <p className="text-sm text-gray-200 mt-0">
            Introducing the Qiwi-Small, a lightning-quick 11B parameter model designed for instantaneous insights. With a blistering 2-second response time and a generous 128k context window, this agile powerhouse is the perfect tool for users seeking immediate answers. Comparable to the renowned GPT-4o-Mini, the Qiwi-Small will have your queries solved in the blink of an eye.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "medium",
    label: "Qiwi-Medium",
    content: (
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-7aq5ytpzk1rma0cmys89h0tfc4-6iclTYSCk9cuyL6k7EOUCqCHdE9iVU.png"
          alt="Qiwi-Medium"
          className="rounded-lg w-full h-60 object-cover mt-0 !m-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none"
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold mb-0 text-white mt-0 !m-0">Qiwi-Medium</h2>
          <p className="text-sm text-gray-200 mt-0">
            Experience the perfect harmony of speed and intelligence with the Qiwi-Medium, a 32B parameter marvel. Drawing inspiration from Alibaba's cutting-edge Qwen-2.5-32b, this model delivers full, smart answers with a swift response time and an impressive 128k context window. Similar to the esteemed GPT-4o, the Qiwi-Medium is the go-to solution for users who demand both efficiency and depth in their AI interactions.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "reasoning",
    label: "Qiwi-Reasoning",
    content: (
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-mdtwdjxf1drm80cmysbrmq28xw-r4j4t73EZ55dlXXH8cZgN918iH59Cs.png"
          alt="Qiwi-Reasoning"
          className="rounded-lg w-full h-60 object-cover mt-0 !m-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none"
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold mb-0 text-white mt-0 !m-0">Qiwi-Reasoning</h2>
          <p className="text-sm text-gray-200 mt-0">
            Prepare to be awed by the Qiwi-Reasoning, a 108B parameter powerhouse engineered for advanced problem-solving. Featuring lightning-fast open reasoning capabilities and a expansive 133k context window, this titan is built to tackle the most complex challenges with ease. Comparable to the groundbreaking o1 model from Orion Ai, the Qiwi-Reasoning is the pinnacle of AI-driven insight and innovation.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "partners",
    label: "Partner Models",
    content: (
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        <img
          src="https://i.imghippo.com/files/vUC6174xo.png"
          alt="Partner Models"
          className="rounded-lg w-full h-60 object-cover mt-0 !m-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none"
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold mb-0 text-white mt-0 !m-0">Partner Models</h2>
          <p className="text-sm text-gray-200 mt-0">
            For a limited time, we are allowing free users to try the lite version of the models we offer in LeemerChat. Experience the power of industry-leading models including LeemerChat, Amazon, Alibaba, and DeepSeek in one unified platform. Take advantage of this special opportunity to explore these cutting-edge AI capabilities.
          </p>
        </div>
      </div>
    ),
  },
]

export function AnimatedTabs({ tabs = defaultTabs, defaultTab, className }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id)

  if (!tabs?.length) return null

  return (
    <div className={cn("w-full max-w-lg flex flex-col gap-y-1", className)}>
      <div className="flex gap-2 flex-wrap bg-[#11111198] bg-opacity-50 backdrop-blur-sm p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-3 py-1.5 text-sm font-medium rounded-lg text-white outline-none transition-colors",
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-[#111111d1] bg-opacity-50 shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm !rounded-lg"
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] text-white bg-opacity-50 backdrop-blur-sm rounded-xl border min-h-60 h-full">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  x: -10,
                  filter: "blur(10px)",
                }}
                animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, x: -10, filter: "blur(10px)" }}
                transition={{
                  duration: 0.5,
                  ease: "circInOut",
                  type: "spring",
                }}
              >
                {tab.content}
              </motion.div>
            ),
        )}
      </div>
    </div>
  )
}
