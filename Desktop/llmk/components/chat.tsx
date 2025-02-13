"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Info, User, Bot, Pencil, Trash2, Menu as MenuIcon, Sun, Moon, ChevronDown, ImageIcon, LinkIcon, Plus, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generatePartnerResponse, partnerModels } from "@/lib/partnerservice"
import { useState, useRef, useEffect, useContext } from "react"
import { DarkModeContext } from "@/lib/dark-mode-context"
import { InfoPopup } from "@/components/ui/info-popup"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { UserProfile } from "@/components/ui/user-profile"
import { MessageActions } from "@/components/ui/message-actions"
import ReactMarkdown from "react-markdown"
import { DemoButton } from "@/components/ui/demo-button"
import { PricingDialog } from "@/components/ui/pricing-dialog"
import { Input } from "@/components/ui/input"

interface Conversation {
  id: string
  title: string
  messages: Message[]
  timestamp: number
}

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatProps {
  isInfoOpen: boolean
  setIsInfoOpen: (isInfoOpen: boolean) => void
}

export default function Chat({ isInfoOpen, setIsInfoOpen }: ChatProps) {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)
  const [input, setInput] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [selectedModel, setSelectedModel] = useState("qiwi-medium")
  const [isLoading, setIsLoading] = useState(false)
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [isPartnerModel, setIsPartnerModel] = useState(false)
  const [selectedPartnerModel, setSelectedPartnerModel] = useState(partnerModels[0].id)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [thinkTag, setThinkTag] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedChatTitle, setEditedChatTitle] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const handleDemoClick = () => {
    window.location.reload();
  }

  useEffect(() => {
    if (!chatContainerRef.current || !messagesEndRef.current) return
    
    // Always scroll to bottom when messages are loading
    if (isLoading) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      return
    }
    
    // Ensure the chat container can scroll
    const chatContainer = chatContainerRef.current
    chatContainer.style.overflowY = 'auto'
    chatContainer.style.maxHeight = '100%'
    
    // Check if the user is near the bottom (within 100 pixels)
    const { scrollTop, clientHeight, scrollHeight } = chatContainer
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    
    if (isNearBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentConversation?.messages, isLoading])

  const handleScroll = () => {
    if (!chatContainerRef.current) return
    const chatContainer = chatContainerRef.current
    chatContainer.style.overflowY = 'auto'
  }

  const handleModelSelect = (model: string) => {
    console.log("Model selected:", model)
    if (model === "partner") {
      console.log("Setting partner model to true")
      setIsPartnerModel(true)
      setSelectedModel(partnerModels[0].id)  // Default to first partner model
    } else {
      console.log("Setting partner model to false")
      setIsPartnerModel(false)
      setSelectedModel(model)
    }
  }

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    // Reset partner model if switching to a non-partner model
    if (model !== "partner") {
      setIsPartnerModel(false)
      setSelectedPartnerModel(null)
    } else {
      setIsPartnerModel(true)
    }
  }

  const handlePartnerModelChange = (modelId: string) => {
    setSelectedPartnerModel(modelId)
    setSelectedModel("partner")
    setIsPartnerModel(true)
  }

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === "user"
    return (
      <div
        key={index}
        className={cn("flex items-start gap-4", isUser ? "flex-row-reverse" : "flex-row")}
      >
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <div
          className={cn(
            "flex-1 rounded-lg px-4 py-2 text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {message.role === "assistant" ? (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="scroll-smooth">
                    {children}
                  </p>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            message.content
          )}
          {message.role === "assistant" && message.content === "" && (
            <div className="flex items-center gap-2">
              <span className="animate-pulse">Thinking</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-300">.</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessage: Message = { role: "user", content: input }
    const conversationId = currentConversation?.id || crypto.randomUUID()

    // Create new conversation if none exists
    if (!currentConversation) {
      const newConversation: Conversation = {
        id: conversationId,
        title: "New Chat",
        messages: [newMessage],
        timestamp: Date.now(),
      }
      setCurrentConversation(newConversation)
      setConversations(prev => [newConversation, ...prev])
    } else {
      // Update existing conversation
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, newMessage],
      }
      setCurrentConversation(updatedConversation)
      setConversations(prev =>
        prev.map(conv => (conv.id === conversationId ? updatedConversation : conv))
      )
    }

    setInput("")
    setIsLoading(true)

    try {
      let response
      if (isPartnerModel) {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: currentConversation
              ? [...currentConversation.messages, newMessage]
              : [newMessage],
            model: selectedPartnerModel,
          }),
        })
      } else {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: currentConversation
              ? [...currentConversation.messages, newMessage]
              : [newMessage],
            model: selectedModel,
          }),
        })
      }

      if (!response.ok) throw new Error("Failed to send message")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      // Add empty assistant message immediately to show thinking state
      const assistantMessage: Message = { role: "assistant", content: "" }
      setCurrentConversation(prev => {
        if (!prev) return prev
        return { ...prev, messages: [...prev.messages, assistantMessage] }
      })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(6))
              const content = data.choices[0]?.delta?.content || 
                              data.choices[0]?.text || 
                              data.delta?.content

              if (content) {
                setCurrentConversation(prev => {
                  if (!prev) return prev
                  const messages = [...prev.messages]
                  const lastMessage = messages[messages.length - 1]
                  messages[messages.length - 1] = {
                    ...lastMessage,
                    content: lastMessage.content + content,
                  }
                  return { ...prev, messages }
                })
              }
            } catch (e) {
              console.error("Error parsing JSON:", e)
            }
          }
        }
      }

      // Update conversations list with the current conversation
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === conversationId && currentConversation) {
            return currentConversation
          }
          return conv
        })
      )

      // Generate title for new conversations
      if (!currentConversation?.title || currentConversation.title === "New Chat") {
        try {
          const titleResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [newMessage],
              isForTitle: true,
            }),
          })

          if (titleResponse.ok) {
            const reader = titleResponse.body?.getReader()
            let title = ""

            if (reader) {
              while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = new TextDecoder().decode(value)
                const lines = chunk.split("\n")

                for (const line of lines) {
                  if (line.startsWith("data: ") && line !== "data: [DONE]") {
                    try {
                      const data = JSON.parse(line.slice(6))
                      if (data.choices[0]?.delta?.content) {
                        title += data.choices[0].delta.content
                      }
                    } catch (e) {
                      console.error("Error parsing title JSON:", e)
                    }
                  }
                }
              }

              // Update conversation title if generated
              if (title.trim()) {
                setCurrentConversation(prev => {
                  if (!prev) return prev
                  const updatedConv = { ...prev, title: title.trim() }
                  setConversations(convs => 
                    convs.map(conv => conv.id === prev.id ? updatedConv : conv)
                  )
                  return updatedConv
                })
              }
            }
          }
        } catch (error) {
          console.error("Error generating title:", error)
        }
      }
    } catch (error) {
      console.error("Chat API error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderConversationList = () => {
    return conversations.map((conversation) => (
      <div key={conversation.id}>
        <button
          onClick={() => setCurrentConversation(conversation)}
          className={cn(
            "group flex items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-accent",
            currentConversation?.id === conversation.id && "bg-accent"
          )}
        >
          {editingConversationId === conversation.id ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleEditSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleEditSave()
                if (e.key === "Escape") setEditingConversationId(null)
              }}
              className="flex-1 bg-transparent outline-none"
              autoFocus
            />
          ) : (
            <>
              <span className="flex-1 truncate">{conversation.title}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingConversationId(conversation.id)
                    setEditedTitle(conversation.title)
                  }}
                  className="p-1 hover:bg-accent-foreground/10 rounded"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteConversation(conversation.id)
                  }}
                  className="p-1 hover:bg-accent-foreground/10 rounded text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </>
          )}
        </button>
      </div>
    ))
  }

  const handleTitleEditSave = () => {
    if (editedTitle.trim() && editingConversationId) {
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === editingConversationId) {
            return { ...conv, title: editedTitle.trim() }
          }
          return conv
        })
      )
      if (currentConversation?.id === editingConversationId) {
        setCurrentConversation(prev => {
          if (!prev) return prev
          return { ...prev, title: editedTitle.trim() }
        })
      }
    }
    setEditingConversationId(null)
  }

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id))
    if (currentConversation?.id === id) {
      setCurrentConversation(null)
    }
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      timestamp: Date.now(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversation(newConversation)
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (currentConversation?.id === id) {
      setCurrentConversation(null)
    }
  }

  const clearCurrentChat = () => {
    if (currentConversation) {
      setCurrentConversation({
        ...currentConversation,
        messages: [],
      })
    }
  }

  const handleEditMessage = async (index: number, newContent: string) => {
    if (!currentConversation) return

    const updatedMessages = [...currentConversation.messages.slice(0, index), { role: "user", content: newContent }]

    setCurrentConversation({
      ...currentConversation,
      messages: updatedMessages,
    })

    // Trigger new AI response
    const event = new Event("submit")
    handleSubmit(event as React.FormEvent<HTMLFormElement>)
  }

  const parseThinkTag = (content: string) => {
    const thinkTagRegex = /<think>(.*?)<\/think>/g
    const matches = content.match(thinkTagRegex)

    if (matches) {
      const thinkTagOptions = matches.map((match) => {
        const option = match.replace(/<think>|<\/think>/g, "")
        return (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        )
      })

      return (
        <Select
          value={thinkTag}
          onValueChange={(value) => setThinkTag(value)}
          className="max-w-md"
        >
          <SelectTrigger className="flex justify-between gap-2">
            <span>Think Tag</span>
            <ChevronDown className="h-4 w-4" />
          </SelectTrigger>
          <SelectContent>
            {thinkTagOptions}
          </SelectContent>
        </Select>
      )
    }

    return null
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedChatTitle(e.target.value)
  }

  const saveTitle = () => {
    if (editedChatTitle.trim()) {
      setCurrentConversation(prev => {
        if (!prev) return prev
        const updatedConv = { ...prev, title: editedChatTitle.trim() }
        setConversations(convs => 
          convs.map(conv => conv.id === prev.id ? updatedConv : conv)
        )
        return updatedConv
      })
    }
    setIsEditingTitle(false)
  }

  const generateShortTitle = async () => {
    if (!currentConversation || currentConversation.messages.length < 2) return

    // Use the first user message as context for title generation
    const contextMessage = currentConversation.messages.find(m => m.role === "user")
    if (!contextMessage) return

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [contextMessage],
          isForTitle: true,
          model: selectedModel,
        }),
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        let title = ""

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.choices[0]?.delta?.content) {
                    title += data.choices[0].delta.content
                  }
                } catch (e) {
                  console.error("Error parsing title JSON:", e)
                }
              }
            }
          }

          // Trim and limit to 5-6 words
          const trimmedTitle = title.trim().split(/\s+/).slice(0, 6).join(" ")
          
          if (trimmedTitle) {
            setCurrentConversation(prev => {
              if (!prev) return prev
              const updatedConv = { ...prev, title: trimmedTitle }
              setConversations(convs => 
                convs.map(conv => conv.id === prev.id ? updatedConv : conv)
              )
              return updatedConv
            })
          }
        }
      }
    } catch (error) {
      console.error("Error generating title:", error)
    }
  }

  useEffect(() => {
    if (currentConversation && 
        (!currentConversation.title || currentConversation.title === "New Chat") && 
        currentConversation.messages.length > 1) {
      generateShortTitle()
    }
  }, [currentConversation?.messages])

  return (
    <div className={cn("flex min-h-screen flex-col bg-background", isDarkMode && "dark")}>
      {isInfoOpen && (
        <InfoPopup 
          isOpen={isInfoOpen} 
          onClose={() => setIsInfoOpen(false)} 
          selectedModel={selectedModel}
          onModelChange={handleModelSelect}
        />
      )}
      {isUserProfileOpen && <UserProfile onClose={() => setIsUserProfileOpen(false)} />}
      <PricingDialog open={isPricingOpen} onOpenChange={setIsPricingOpen} />

      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon className="h-4 w-4" />
          </Button>
          <DemoButton onClick={handleDemoClick} />
        </div>
        <div className="flex items-center gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {selectedModel === "qiwi-reasoning"
                  ? "Qiwi-Reasoning"
                  : selectedModel === "qiwi-medium"
                    ? "Qiwi-Medium"
                    : "Qiwi-Small"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleModelChange("qiwi-reasoning")}>
                Qiwi-Reasoning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleModelChange("qiwi-medium")}>
                Qiwi-Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleModelChange("qiwi-small")}>
                Qiwi-Small
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">Partner Model</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {partnerModels.map((model) => (
                <DropdownMenuItem key={model.id} onClick={() => handlePartnerModelChange(model.id)}>
                  {model.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={() => setIsPricingOpen(true)}>
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-[60px] items-center justify-between border-b px-4">
            <h1 className="text-xl font-semibold">LeemerChat</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <MenuIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 overflow-y-auto">
            <Button variant="secondary" className="justify-start gap-2" onClick={createNewConversation}>
              <Plus className="h-4 w-4" />
              <span>New chat</span>
            </Button>
            {currentConversation && currentConversation.messages.length > 0 && (
              <Button
                variant="ghost"
                className="justify-start gap-2 text-destructive hover:text-destructive"
                onClick={clearCurrentChat}
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear chat</span>
              </Button>
            )}
            <div className="mt-4">
              <h3 className="mb-2 px-2 text-sm font-medium">Recent chats</h3>
              <div className="space-y-1">
                {renderConversationList()}
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col transition-all duration-200 ease-in-out",
            isSidebarOpen ? "md:ml-64" : "ml-0",
          )}
        >
          <div className="flex min-h-[60px] items-center gap-4 border-b px-4">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={editedChatTitle}
                  onChange={handleTitleChange}
                  onBlur={saveTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTitle()
                    if (e.key === "Escape") setIsEditingTitle(false)
                  }}
                  className="flex-1 bg-transparent outline-none"
                  autoFocus
                />
              ) : (
                <h2
                  className="cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {currentConversation?.title || "Untitled Chat"}
                </h2>
              )}
              <span className="text-sm opacity-50">{selectedModel}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsPricingOpen(true)}>
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div 
              className="mx-auto max-w-2xl h-[calc(100vh-300px)] overflow-y-auto" 
              ref={chatContainerRef}
            >
              {!currentConversation || currentConversation.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                  <h1 className="mb-8 text-center text-3xl font-semibold">Welcome to LeemerChat</h1>
                  <AnimatedTabs className="max-w-3xl" />
                </div>
              ) : (
                <div className="space-y-6">
                  {currentConversation.messages.map((message, i) => renderMessage(message, i))}
                  {parseThinkTag(currentConversation.messages[currentConversation.messages.length - 1].content)}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Message LeemerChat..."
                className="min-h-[100px] resize-none"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" type="button">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" type="button">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
